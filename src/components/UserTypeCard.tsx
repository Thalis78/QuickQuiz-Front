import React from 'react';

interface UserTypeCardProps {
  type: 'student' | 'teacher';
  title: string;
  iconSrc: string;
  iconAlt: string;
  onClick?: () => void;
}

export const UserTypeCard: React.FC<UserTypeCardProps> = ({
  type,
  title,
  iconSrc,
  iconAlt,
  onClick
}) => {
  const isStudent = type === 'student';
  const bgColor = isStudent ? 'bg-[#FFC000]' : 'bg-white';
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior
      console.log(`${title} selected`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center relative cursor-pointer w-[262px] h-[198px] px-12 py-2 max-md:w-[220px] max-md:h-40 max-md:px-[30px] max-md:py-[5px] max-sm:w-[180px] max-sm:h-[140px] max-sm:px-5 max-sm:py-[5px] hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Selecionar ${title}`}
    >
      <div className={`w-[262px] h-[198px] absolute left-0 top-0 max-md:w-[220px] max-md:h-40 max-sm:w-[180px] max-sm:h-[140px] ${isStudent ? 'w-[262px]' : 'w-[273px]'}`}>
        <div className={`absolute w-[182px] h-[175px] ${bgColor} rounded-[200px] ${isStudent ? 'left-10' : 'left-[46px]'} top-0 max-md:w-[150px] max-md:h-[140px] max-md:left-[35px] max-sm:w-[120px] max-sm:h-[110px] max-sm:left-[30px]`} />
        <div className={`absolute ${isStudent ? 'w-[262px]' : 'w-[273px]'} h-16 ${bgColor} rounded-[200px] left-0 top-[134px] max-md:w-[220px] max-md:left-0 max-md:top-[110px] max-sm:w-[180px] max-sm:h-[50px] max-sm:left-0 max-sm:top-[90px]`} />
      </div>
      <img
        src={iconSrc}
        alt={iconAlt}
        className={`${isStudent ? 'w-[142px] h-[142px]' : 'w-[145px] h-[145px]'} relative z-[2] max-md:w-[120px] max-md:h-[120px] max-sm:w-[100px] max-sm:h-[100px]`}
      />
      <span className="text-[#33307E] text-[32px] font-bold relative z-[2] text-center max-md:text-[28px] max-sm:text-2xl">
        {title}
      </span>
    </div>
  );
};
