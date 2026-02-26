import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'success';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const buttonStyles = variant === 'danger' 
    ? 'bg-red-500 hover:bg-red-600' 
    : 'bg-[#00D9B5] hover:bg-[#00C9A5]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border-4 border-[#605BEF]">
        <h2 className="text-2xl font-bold text-[#605BEF] mb-3">
          {title}
        </h2>
        
        <p className="text-gray-700 mb-6">
          {description}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
          >
            {cancelText}
          </button>
          
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-2 text-white rounded-lg font-semibold transition duration-200 ${buttonStyles}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
