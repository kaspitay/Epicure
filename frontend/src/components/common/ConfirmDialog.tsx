import React from 'react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1C1A] rounded-lg p-6 w-80 border border-[#BE6F50]/20 shadow-lg animate-fadeIn">
        <h3 className="text-white text-lg font-medium mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            className="px-4 py-2 bg-[#2A2826] text-white rounded-md hover:bg-[#3D3A36] transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-[#BE6F50] text-white rounded-md hover:bg-[#9E5B43] transition-colors"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 