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
  Video,
  Download,
  X,
  QrCode,
  CheckCircle2,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export function CameraCard({ className = "", cameraId = "A01", showControls = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const qrCodeScannerRef = useRef(null);

  // States
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [fit, setFit] = useState("cover");
  const [mirror, setMirror] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [resolution, setResolution] = useState({ w: 0, h: 0, fps: 0 });

  // Mode: "view" (camera thường) | "qr" (quét mã)
  const [mode, setMode] = useState("view");
  const [qrResult, setQrResult] = useState(null);

  // Recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);

  // Preview (Ảnh/Video sau khi chụp/quay)
  const [previewMedia, setPreviewMedia] = useState(null); // { type: 'image'|'video', url: string }

  // Timer cho recording
  const timerRef = useRef(null);

  useEffect(() => {
    if (mode === "view") {
      startCamera();
    } else {
      stopCamera(); // Dừng stream cũ để nhường cho QR
    }
    return () => {
      stopCamera();
      stopQrScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, facingMode]);

  useEffect(() => {
    // Auto start QR when switching to QR mode
    if (mode === "qr") {
      startQrScanner();
    }
  }, [mode]);

  // --- CAMERA HELPERS ---

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
        audio: false, // Tùy nhu cầu, ở đây tắt mic
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
        setMirror(facingMode === "user");
      }
      setIsStreaming(true);
    } catch (e) {
      console.error(e);
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
    // Nếu đang record dở thì stop luôn
    if (isRecording) {
      stopRecording();
    }
  }

  function toggleStream() {
    if (isStreaming) stopCamera();
    else startCamera();
  }

  function switchFacing() {
    setFacingMode((m) => (m === "user" ? "environment" : "user"));
  }

  // Gallery State
  const [gallery, setGallery] = useState([]); // { id, type, url, timestamp }

  // --- PHOTO CAPTURE ---

  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (mirror) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);
    const url = canvas.toDataURL("image/png");

    // Add to gallery
    addToGallery("image", url);
  }

  // --- VIDEO RECORDING ---

  function startRecording() {
    if (!streamRef.current) return;
    setRecordedChunks([]);
    const options = { mimeType: "video/webm;codecs=vp9" };
    // Fallback mimeTypes nếu cần
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = "video/webm";
    }

    try {
      const recorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        // Trigger useEffect logic via recording state change
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (e) {
      console.error("Recording error:", e);
      alert("Trình duyệt không hỗ trợ ghi hình định dạng này.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  }

  // Effect to save video when recording stops
  useEffect(() => {
    if (!isRecording && recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      addToGallery("video", url);
      setRecordedChunks([]);
    }
  }, [isRecording, recordedChunks]);

  const addToGallery = (type, url) => {
    setGallery(prev => [
      { id: Date.now(), type, url, timestamp: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  const removeFromGallery = (id) => {
    setGallery(prev => {
      const item = prev.find(i => i.id === id);
      if (item && item.url) URL.revokeObjectURL(item.url);
      return prev.filter(i => i.id !== id);
    });
  };

  const downloadItem = (item) => {
    const a = document.createElement("a");
    a.href = item.url;
    a.download = item.type === "image" ? `img_${item.id}.png` : `vid_${item.id}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // --- QR SCANNING ---
  async function startQrScanner() {
    setErrMsg("");
    setQrResult(null);
    const elemId = `reader-${cameraId}`;

    // Đợi DOM render
    setTimeout(async () => {
      if (!document.getElementById(elemId)) return;

      try {
        const html5QrCode = new Html5Qrcode(elemId);
        qrCodeScannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            // qrbox: { width: 250, height: 250 }, // Bỏ qrbox để scan toàn màn hình
            videoConstraints: {
              facingMode: "environment",
            },
            aspectRatio: 1.777,
          },
          (decodedText) => {
            setQrResult(decodedText);
          },
          (errorMessage) => {
            // Error scanning
          }
        );
      } catch (err) {
        console.error(err);
        setErrMsg("Không thể khởi động QR Scanner.");
      }
    }, 100);
  }

  async function stopQrScanner() {
    if (qrCodeScannerRef.current) {
      try {
        if (qrCodeScannerRef.current.isScanning) {
          await qrCodeScannerRef.current.stop();
        }
        qrCodeScannerRef.current.clear();
      } catch (e) {
        console.warn("QR stop error", e);
      }
      qrCodeScannerRef.current = null;
    }
  }

  // --- DOWNLOAD ---
  const downloadAll = () => {
    gallery.forEach((item, index) => {
      setTimeout(() => downloadItem(item), index * 500); // Delay để tránh browser block
    });
  };

  const closePreview = () => {
    if (previewMedia?.url) URL.revokeObjectURL(previewMedia.url);
    setPreviewMedia(null);
  };

  // --- RENDER ---
  return (
    <div className={`flex flex-col gap-4 ${className}`}>

      {/* 1. CAMERA FEED SECTION */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 ring-1 ring-white/10 shadow-xl aspect-video group">

        {/* VIEW MODE */}
        {mode === "view" && (
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
        )}

        {/* QR MODE */}
        {mode === "qr" && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
            <div id={`reader-${cameraId}`} className="w-full h-full [&>video]:object-cover" />
            {qrResult && (
              <div className="absolute top-4 left-4 right-4 bg-emerald-500/90 text-white p-3 rounded-lg backdrop-blur shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 z-20">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <div className="min-w-0 break-all">
                  <div className="text-xs font-bold uppercase opacity-80">QR Code Detected</div>
                  <div className="font-mono text-sm">{qrResult}</div>
                </div>
                <button onClick={() => setQrResult(null)} className="ml-auto p-1 hover:bg-white/20 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recording Overlay */}
        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/80 backdrop-blur text-white text-xs font-bold shadow-lg animate-pulse z-20">
            <div className="w-2 h-2 bg-white rounded-full" />
            REC {formatTime(recordingTime)}
          </div>
        )}

        {/* Grid */}
        {showGrid && mode === "view" && (
          <div
            className="pointer-events-none absolute inset-0 opacity-70 z-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,.35) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,.35) 1px, transparent 1px)
              `,
              backgroundSize: "33.333% 100%, 100% 33.333%",
            }}
          />
        )}

        {/* Info when offline */}
        {!isStreaming && mode === "view" && !errMsg && (
          <div className="absolute inset-0 grid place-items-center z-10">
            <div className="text-slate-400 text-sm">Camera Offline</div>
          </div>
        )}
        {errMsg && (
          <div className="absolute inset-0 grid place-items-center bg-black/80 p-4 text-center z-30">
            <p className="text-red-400">{errMsg}</p>
          </div>
        )}

        {/* --- CONTROLS --- */}
        {showControls && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
            <div className="flex items-center justify-center gap-2 bg-black/60 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl">

              {/* Toggle Mode */}
              <button
                onClick={() => setMode(mode === 'view' ? 'qr' : 'view')}
                className={`p-2.5 rounded-xl transition-all ${mode === 'qr' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'hover:bg-white/10 text-white'}`}
                title="Chế độ QR"
              >
                <QrCode className="w-5 h-5" />
              </button>

              <div className="w-[1px] h-8 bg-white/20 mx-1" />

              {mode === "view" ? (
                <>
                  {/* Play/Stop */}
                  <button
                    onClick={toggleStream}
                    className="p-2.5 rounded-xl hover:bg-white/10 text-white transition-colors"
                  >
                    {isStreaming ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>

                  {/* Flip */}
                  <button onClick={switchFacing} className="p-2.5 rounded-xl hover:bg-white/10 text-white">
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  {/* Screenshot */}
                  <button
                    onClick={capturePhoto}
                    disabled={!isStreaming}
                    className="p-2.5 rounded-xl hover:bg-white/10 text-white disabled:opacity-50 active:scale-90 transition-transform"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>

                  {/* Video Record */}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!isStreaming}
                    className={`p-2.5 rounded-xl transition-all ${isRecording
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/40 scale-110"
                      : "hover:bg-white/10 text-white disabled:opacity-50"
                      }`}
                  >
                    {isRecording ? <div className="w-5 h-5 grid place-items-center"><div className="w-3 h-3 bg-white rounded-sm" /></div> : <Video className="w-5 h-5" />}
                  </button>

                  {/* Grid */}
                  <button onClick={() => setShowGrid(!showGrid)} className={`p-2.5 rounded-xl hover:bg-white/10 text-white ${showGrid ? 'bg-white/20' : ''}`}>
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="text-white text-sm font-medium px-4">Đang quét mã QR...</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. GALLERY SECTION (Refactored below camera) */}
      {gallery.length > 0 && (
        <div className="bg-white/5 rounded-xl border border-white/10 p-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              Thư viện ({gallery.length})
            </h3>
            <button
              onClick={downloadAll}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Tải tất cả
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {gallery.map((item) => (
              <div key={item.id} className="group relative aspect-video rounded-lg bg-black/50 border border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-all hover:ring-2 hover:ring-indigo-500/50">
                {/* Media Thumbnail */}
                {item.type === 'image' ? (
                  <img src={item.url} className="w-full h-full object-cover" alt="Thumb" />
                ) : (
                  <video src={item.url} className="w-full h-full object-cover" />
                )}

                {/* Type Badge */}
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-medium text-white/90 backdrop-blur-sm flex items-center gap-1">
                  {item.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                  {item.type === 'video' ? 'Video' : 'Ảnh'}
                </div>

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                  <button
                    onClick={() => downloadItem(item)}
                    className="p-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white transition-colors"
                    title="Tải xuống"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFromGallery(item.id)}
                    className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-colors"
                    title="Xóa"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
