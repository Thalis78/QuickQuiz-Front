import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen relative bg-[#605BEF]">
      <div className="fixed inset-0 w-full h-full z-0">
        <img
          src="/bg.svg"
          alt="Background pattern"
          className="w-full h-full object-cover"
          onError={(e) => console.error("Erro ao carregar imagem:", e)}
        />
      </div>

      <div className="relative z-20">
        <Header />
      </div>

      <main className="relative z-10">{children || <Outlet />}</main>
    </div>
  );
};
