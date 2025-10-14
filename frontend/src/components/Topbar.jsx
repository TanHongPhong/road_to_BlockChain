import React, { useEffect, useRef, useState } from "react";
import feather from "feather-icons";

const Topbar = React.forwardRef(function Topbar(_, ref) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // render feather lần đầu & mỗi khi open đổi (để icon trong menu hiện đúng)
  useEffect(() => {
    feather.replace();
  }, [open]);

  // Click ngoài + Esc để đóng
  useEffect(() => {
    const onDown = (e) => {
      if (!open) return;
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const handleLogout = () => {
    // TODO: thay bằng logic thật (xóa token, gọi API, điều hướng...)
    alert("Đã đăng xuất!");
    setOpen(false);
  };

  return (
    <header
      ref={ref}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b md:py-1 bg-gradient-to-l from-blue-900 via-sky-200 to-white"
    >
      <div className="flex items-center justify-between px-3 md:px-5 py-2.5">
        {/* Search */}
        <div className="flex-1 max-w-2xl mr-3 md:mr-6">
          <div className="relative">
            <i
              data-feather="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            />
            <input
              className="w-full h-10 pl-9 pr-24 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-200"
              placeholder="Tìm giao dịch, mã đơn, số tiền…"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"
              title="Filter"
            >
              <i data-feather="filter" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Actions + User */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            className="h-9 w-9 rounded-lg grid place-items-center ring-1 ring-blue-200 text-blue-600 bg-white hover:bg-blue-50"
            title="New"
          >
            <i data-feather="plus" className="w-4 h-4" />
          </button>
          <button
            className="h-9 w-9 rounded-lg grid bg-blue-50 place-items-center border border-slate-200 hover:bg-slate-50"
            title="Notifications"
          >
            <i data-feather="bell" className="w-4 h-4" />
          </button>
          <button
            className="h-9 w-9 rounded-lg grid bg-blue-50 place-items-center border border-slate-200 hover:bg-slate-50"
            title="Archive"
          >
            <i data-feather="archive" className="w-4 h-4" />
          </button>

          {/* User button + Dropdown */}
          <div className="relative">
            <button
              ref={btnRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative z-20 group inline-flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-full bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 transition"
            >
              <img
                src="https://i.pravatar.cc/40?img=8"
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-[13px] font-semibold">Harsh Vani</div>
                <div className="text-[11px] text-slate-500 -mt-0.5">
                  Deportation Manager
                </div>
              </div>
              <i
                data-feather="chevron-down"
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Panel dính sát topbar (không mt, không viền trên) */}
            {/* Dropdown ở dưới và nằm sau nút */}
            <div
              ref={menuRef}
              role="menu"
              aria-label="User menu"
              className={`
              absolute right-0 top-full -mt-5 pt-5 z-0 w-[182px] 
              overflow-hidden bg-white border border-slate-200 border-t-0 rounded-b-xl
              shadow-md ring-1 ring-black/5
              origin-top transition-all duration-200 ease-out
              ${
                open
                  ? "opacity-100 scale-y-100"
                  : "opacity-0 scale-y-95 pointer-events-none"
              }
            `}
              style={{ transformOrigin: "top" }}
              onKeyDown={(e) => e.key === "Tab" && setOpen(false)}
            >
              <button
                role="menuitem"
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                <i data-feather="user" className="w-4 h-4" />
                Trang cá nhân
              </button>
              <div className="h-px bg-slate-100" />
              <button
                role="menuitem"
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <i data-feather="log-out" className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </div>
          {/* /User */}
        </div>
      </div>
    </header>
  );
});

export default Topbar;
