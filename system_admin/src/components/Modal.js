import React from "react";

const Modal = ({ 
  isOpen, 
  title, 
  children, 
  onClose, 
  onSubmit, 
  submitText = "Submit", 
  cancelText = "Cancel" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <div className="mb-6">{children}</div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            {cancelText}
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
