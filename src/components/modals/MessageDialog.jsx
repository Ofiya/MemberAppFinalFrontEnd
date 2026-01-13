
const MessageDialog = ({ isOpen, onClose, children}) => {
    
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/10 backdrop-blur-sm h-24">

      <button onClick={onClose} className="absolute top-10 right-10 text-white hover:text-gray-700">
        <i className="fas fa-times text-xl"></i>
      </button>

      {/* Body */}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default MessageDialog;
