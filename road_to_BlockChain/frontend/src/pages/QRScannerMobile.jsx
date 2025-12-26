import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  RefreshCw,
  Image as ImageIcon,
  Camera,
  RotateCcw,
  Smartphone,
} from "lucide-react";

/** tiny helpers */
const beep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.value = 880;
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, 150);
  } catch {}
  if (navigator.vibrate) navigator.vibrate(60);
};

export default function QRScannerMobile() {
  const nav = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const [supported, setSupported] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  const [torchCapable, setTorchCapable] = useState(false);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState(null);
  const [error, setError] = useState("");

  /** start camera stream */
  const start = useCallback(async (nextDeviceId = null) => {
    stop();
    setError("");
    setTorchOn(false);
    try {
      const constraints = {
        audio: false,
        video: nextDeviceId
          ? { deviceId: { exact: nextDeviceId } }
          : { facingMode: { ideal: "environment" } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      // list devices after permission
      const list = await navigator.mediaDevices.enumerateDevices();
      const cams = list.filter((d) => d.kind === "videoinput");
      setDevices(cams);
      if (!nextDeviceId && cams.length) {
        // try to pick a back camera if any
        const back = cams.find((c) => /back|rear|environment/i.test(c.label));
        setDeviceId(back?.deviceId || cams[0].deviceId);
      } else {
        setDeviceId(nextDeviceId);
      }

      // torch capability
      const track = stream.getVideoTracks()[0];
      const caps = track.getCapabilities?.();
      setTorchCapable(Boolean(caps && "torch" in caps));

      // check BarcodeDetector
      const ok =
        "BarcodeDetector" in window &&
        (await window.BarcodeDetector.getSupportedFormats?.())?.includes(
          "qr_code"
        );
      setSupported(Boolean(ok));

      // kick off scan loop if supported
      if (ok) loop();
    } catch (e) {
      setError(e?.message || "Không thể mở camera");
    }
  }, []);

  /** stop everything */
  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current || 0);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  /** scan loop with BarcodeDetector */
  const loop = useCallback(async () => {
    if (!videoRef.current) return;
    const BarcodeDetector = window.BarcodeDetector;
    const detector = new BarcodeDetector({ formats: ["qr_code"] });

    const tick = async () => {
      try {
        if (!videoRef.current) return;
        const result = await detector.detect(videoRef.current);
        if (result?.length) {
          const raw = result[0].rawValue?.trim();
          if (raw) {
            beep();
            stop();
            // điều hướng sang trang info (bạn đã có)
            nav(`/info?qr=${encodeURIComponent(raw)}`, { replace: true });
            return;
          }
        }
      } catch (e) {
        // swallow intermittent errors
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, [nav, stop]);

  /** mount */
  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  /** toggle torch if supported */
  const toggleTorch = async () => {
    try {
      const track = streamRef.current?.getVideoTracks?.()[0];
      if (!track) return;
      const caps = track.getCapabilities?.();
      if (!caps || !("torch" in caps)) return;
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn((s) => !s);
    } catch {}
  };

  /** switch camera */
  const switchCamera = async () => {
    if (!devices.length) return;
    const idx = devices.findIndex((d) => d.deviceId === deviceId);
    const next = devices[(idx + 1) % devices.length];
    if (next) await start(next.deviceId);
  };

  /** pick image and detect (works even if no live BarcodeDetector support) */
  const onPickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // Prefer native BarcodeDetector on still image
      const imgBitmap = await createImageBitmap(file);
      if ("BarcodeDetector" in window) {
        const okFormats = await window.BarcodeDetector.getSupportedFormats?.();
        if (okFormats?.includes("qr_code")) {
          const det = new window.BarcodeDetector({ formats: ["qr_code"] });
          const res = await det.detect(imgBitmap);
          if (res?.length && res[0].rawValue) {
            beep();
            nav(`/info?qr=${encodeURIComponent(res[0].rawValue.trim())}`, {
              replace: true,
            });
            return;
          }
        }
      }
      // fallback: very lightweight manual crop/draw (no decode) -> notify
      setError(
        "Thiết bị không hỗ trợ quét QR trực tiếp. Hãy thử trên Chrome Android/iOS mới, hoặc cài thư viện quét."
      );
    } catch (err) {
      setError("Không đọc được ảnh đã chọn.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white relative overflow-hidden">
      {/* top bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3">
        <button
          type="button"
          onClick={() => nav(-1)}
          className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm grid place-items-center border border-white/15"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs">
          Quét QR để mở Info
        </div>
        <div className="w-10" />
      </div>

      {/* video */}
      <div className="absolute inset-0 grid place-items-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* overlay mask */}
      <div className="pointer-events-none absolute inset-0">
        {/* dim background */}
        <div className="absolute inset-0 bg-black/45" />
        {/* cutout */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[78vw] max-w-[560px] aspect-square rounded-2xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
        {/* helper text */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-28 text-center text-white/90 text-sm px-4">
          Căn QR vào khung vuông để quét
        </div>
      </div>

      {/* bottom controls */}
      <div className="absolute bottom-0 inset-x-0 p-4 pb-[max(1rem,calc(env(safe-area-inset-bottom)))] z-20">
        {error ? (
          <div className="mb-3 text-[13px] text-red-200 bg-red-900/30 border border-red-800/50 rounded-lg px-3 py-2">
            {error}
          </div>
        ) : null}

        {!supported && (
          <div className="mb-3 text-[13px] text-amber-200 bg-amber-900/30 border border-amber-800/50 rounded-lg px-3 py-2">
            Thiết bị không hỗ trợ quét trực tiếp. Bạn vẫn có thể{" "}
            <span className="font-semibold">“Chọn ảnh”</span> chứa mã QR để đọc,
            hoặc dùng Chrome/Android/iOS mới hơn.
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={switchCamera}
            className="h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center gap-2"
            title="Đổi camera"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="text-sm">Đổi cam</span>
          </button>

          <button
            type="button"
            onClick={() => start(deviceId)}
            className="h-12 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2"
            title="Khởi động lại"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Restart</span>
          </button>

          <button
            type="button"
            onClick={toggleTorch}
            disabled={!torchCapable}
            className={`h-12 rounded-xl backdrop-blur-sm border border-white/15 flex items-center justify-center gap-2 ${
              torchCapable ? "bg-white/10" : "bg-white/5 opacity-60"
            }`}
            title="Đèn pin"
          >
            <Zap className={`w-5 h-5 ${torchOn ? "text-yellow-300" : ""}`} />
            <span className="text-sm">{torchOn ? "Tắt đèn" : "Đèn pin"}</span>
          </button>
        </div>

        <label
          className="mt-2 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
          title="Chọn ảnh có QR"
        >
          <ImageIcon className="w-5 h-5" />
          <span className="text-sm">Chọn ảnh từ thư viện</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickImage}
          />
        </label>

        <div className="mt-3 text-center text-xs text-white/70 flex items-center justify-center gap-2">
          <Smartphone className="w-4 h-4" />
          <span>Mẹo: kéo QR lại gần, đủ sáng để nhận tốt hơn.</span>
        </div>
      </div>
    </div>
  );
}
