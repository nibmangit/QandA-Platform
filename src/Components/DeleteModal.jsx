

const DeleteModal = ({ isOpen, onClose, onConfirm, title = "Delete Question?" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#1A2A3A] rounded-xl shadow-xl p-6 w-80 md:w-96 text-center">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {title}
        </h2>
        <p className="text-sm mb-6 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this question? This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
