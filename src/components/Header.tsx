import React from 'react';
import { toast } from 'sonner';

export const Header: React.FC = () => {
  
  const handleContactClick = () => {
    toast.info('Funcionalidade de contato será implementada em breve!');
  };

  return (
    <header className="flex w-full justify-between items-center absolute h-[107px] box-border pl-[132px] pr-[199px] py-[30px] left-0 top-0 max-md:px-10 max-md:py-5 max-sm:px-5 max-sm:py-[15px] z-50">
      <div className="flex justify-center items-center gap-2.5">
        <img src="/Logo.svg" width='60px' alt="Logo" className="mt-0.5" />
        <h1 className="text-white text-center text-[35px] font-bold max-md:text-[38px] max-sm:text-2xl">
          CIEL CURSOS
        </h1>
      </div>
      <button
        onClick={handleContactClick}
        className="flex w-[164px] justify-center items-center gap-2.5 cursor-pointer bg-white p-2.5 rounded-[10px] max-md:w-[140px] max-md:p-2 max-sm:w-[120px] max-sm:p-1.5 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        aria-label="Entre em contato conosco"
      >
        <span className="text-[#605BEF] text-center text-2xl font-bold max-md:text-xl max-sm:text-lg">
          Contato
        </span>
      </button>
    </header>
  );
};
