import React from 'react';
import { Instagram } from 'lucide-react';

export const Header: React.FC = () => {
  
  const handleContactClick = () => {
    window.open('https://www.instagram.com/cielcursos/', '_blank');
  };

  return (
    <header className="flex w-full justify-between items-center absolute h-[80px] box-border pl-[132px] pr-[199px] py-[20px] left-0 top-0 max-md:px-10 max-md:py-4 max-sm:px-5 max-sm:py-3 z-50">
      <div className="flex justify-center items-center gap-2.5">
        <img src="/Logo.svg" width='60px' alt="Logo" className="mt-0.5" />
        <h1 className="text-white text-center text-[35px] font-bold max-md:text-[38px] max-sm:text-2xl">
          CIEL CURSOS
        </h1>
      </div>
      <button
        onClick={handleContactClick}
        className="flex w-[120px] justify-center items-center gap-2.5 cursor-pointer bg-white p-1.5 rounded-[10px] max-md:w-[100px] max-md:p-1 max-sm:w-[90px] max-sm:p-1 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        aria-label="Entre em contato conosco"
      >
        <Instagram size={20} className="text-[#605BEF]" />
        <span className="text-[#605BEF] text-center text-lg font-bold max-md:text-base max-sm:text-sm">
          Contato
        </span>
      </button>
    </header>
  );
};
