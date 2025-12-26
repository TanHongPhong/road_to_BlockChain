import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  Grid3X3,
  Camera,
} from "lucide-react";

export function CameraCard({ className = "", cameraId = "A01" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState("environment"); // "user" | "environment"
  const [fit, setFit] = useState("cover"); // "cover" (Fill khung) | "contain" (Fit khung, không cắt)
  const [mirror, setMirror] = useState(false); // tự bật khi dùng camera trước
  const [showGrid, setShowGrid] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [resolution, setResolution] = useState({ w: 0, h: 0, fps: 0 });

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isStreaming) startCamera(); // đổi front/back => mở lại
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  async function startCamera() {
    try {
      stopCamera();
      setErrMsg("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30, max: 60 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const track = stream.getVideoTracks()[0];
        const settings = track?.getSettings?.() || {};
        setResolution({
          w: settings.width || videoRef.current.videoWidth || 0,
          h: settings.height || videoRef.current.videoHeight || 0,
          fps: settings.frameRate || 0,
        });

        // auto mirror khi camera trước
        setMirror(facingMode === "user");
      }

      setIsStreaming(true);
    } catch (e) {
      setErrMsg(e?.message || "Không thể mở camera.");
      setIsStreaming(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }

  function toggleStream() {
    if (isStreaming) stopCamera();
    else startCamera();
  }

  function switchFacing() {
    setFacingMode((m) => (m === "user" ? "environment" : "user"));
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");

    if (mirror) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);
    const url = canvas.toDataURL("image/png");

    // tải xuống luôn
    const a = document.createElement("a");
    a.href = url;
    a.download = `snapshot_${cameraId}_${Date.now()}.png`;
    a.click();
  }

  return (
    <div
      className={[
        "relative rounded-xl overflow-hidden bg-slate-950 ring-1 ring-white/10 shadow-xl",
        // GỢI Ý: thay đổi chiều cao tại đây để “fit khung” theo page của bạn
        // ví dụ h-[420px] hoặc aspect-video. Mặc định dùng aspect-video để responsive đẹp.
        "aspect-video",
        className,
      ].join(" ")}
    >
      {/* Video */}
      <video
        ref={videoRef}
        className={[
          "absolute inset-0 w-full h-full bg-black",
          fit === "cover" ? "object-cover" : "object-contain",
          mirror ? "scale-x-[-1]" : "",
        ].join(" ")}
        autoPlay
        muted
        playsInline
      />

      {/* Grid overlay (tùy chọn) */}
      {showGrid && (
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,.35) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,.35) 1px, transparent 1px)
            `,
            backgroundSize: "33.333% 100%, 100% 33.333%",
          }}
        />
      )}

      {/* Overlay khi chưa có stream / lỗi */}
      {!isStreaming && (
        <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(to_top,rgba(2,6,23,.7),transparent)]">
          <div className="text-center px-6 py-5 rounded-lg bg-white/10 backdrop-blur border border-white/10">
            <Camera className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-200 font-medium">
              {errMsg ? `Lỗi: ${errMsg}` : "Đang chờ cấp quyền camera..."}
            </p>
          </div>
        </div>
      )}

      {/* Top info */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-white/10 text-white/90 text-xs font-semibold border border-white/10">
            Camera #{cameraId}
          </span>
          <span className="inline-flex items-center gap-2 text-white/90 text-xs">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isStreaming ? "bg-emerald-400" : "bg-slate-400"
              }`}
            />
            {isStreaming ? "Online" : "Offline"}
          </span>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-white/10 text-white text-xs border border-white/10">
          {resolution.w}×{resolution.h} • {resolution.fps || 0}fps
        </div>
      </div>

      {/* Bottom dock (tối giản) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 bg-white/12 backdrop-blur px-3 py-2 rounded-xl border border-white/10 shadow-lg">
          {/* Mở/Tắt */}
          <button
            onClick={toggleStream}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white ${
              isStreaming
                ? "bg-slate-800/90 hover:bg-slate-900"
                : "bg-sky-600 hover:bg-sky-700"
            }`}
            title={isStreaming ? "Tắt camera" : "Mở camera"}
          >
            {isStreaming ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isStreaming ? "Tắt" : "Mở"}
          </button>

          {/* Chụp ảnh */}
          <button
            onClick={capturePhoto}
            disabled={!isStreaming}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60"
            title="Chụp ảnh"
          >
            <ImageIcon className="w-4 h-4" />
            Chụp
          </button>

          {/* Đổi camera trước/sau */}
          <button
            onClick={switchFacing}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-white/90 hover:bg-white text-slate-900"
            title="Đổi camera"
          >
            <RotateCcw className="w-4 h-4" />
            Đổi
          </button>

          {/* Fit (Fill/Fit) */}
          <button
            onClick={() => setFit((f) => (f === "cover" ? "contain" : "cover"))}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-white/90 hover:bg-white text-slate-900"
            title="Chế độ hiển thị"
          >
            {fit === "cover" ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
            {fit === "cover" ? "Fit" : "Fill"}
          </button>

          {/* Lưới (tuỳ chọn) */}
          <button
            onClick={() => setShowGrid((v) => !v)}
            className="inline-flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-semibold bg-white/90 hover:bg-white text-slate-900"
            title="Bật/tắt lưới 1/3"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
