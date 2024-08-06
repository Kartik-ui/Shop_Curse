const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="absolute right-[40%] top-[40%] z-10 rounded-lg bg-white p-4 text-right">
            <button
              className="mr-2 font-semibold text-black hover:text-gray-700 focus:outline-none"
              onClick={onClose}
            >
              X
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
