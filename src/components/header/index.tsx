import React from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Users, Info } from "lucide-react";

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    window.open("https://www.instagram.com/cielcursos/", "_blank");
  };

  return (
    <header className="fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto h-[80px] flex items-center justify-between px-4 md:px-10">
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => navigate("/")}
        >
          <img src="/Logo.svg" width="80px" alt="Logo" />
        </div>

        <nav className="flex items-center bg-white/10 rounded-2xl p-1 gap-1">
          <button
            onClick={() => navigate("/sobre/ciel")}
            className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/20 rounded-xl transition-all text-xs font-bold uppercase tracking-wider"
          >
            <Info size={16} />
            <span className="hidden sm:inline">Sobre</span>
          </button>

          <button
            onClick={() => navigate("/sobre/devs")}
            className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/20 rounded-xl transition-all text-xs font-bold uppercase tracking-wider"
          >
            <Users size={16} />
            <span className="hidden sm:inline">Devs</span>
          </button>

          <div className="w-[1px] h-4 bg-white/20 mx-1" />

          <button
            onClick={handleContactClick}
            className="flex items-center gap-2 px-3 py-2 text-white hover:bg-[#E1306C] rounded-xl transition-all text-xs font-bold uppercase tracking-wider"
          >
            <Instagram size={16} />
            <span>Instagram</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
