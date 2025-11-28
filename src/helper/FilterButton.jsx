  const FilterButton = ({ label, filter, setFilter }) => {
    const isActive = filter === label;

    return (
      <button
        onClick={() => setFilter(label)}
        className={`
          px-4 py-2 text-sm font-semibold rounded-xl transition-colors
          ${isActive
            ? "text-white bg-blue-600 dark:bg-blue-500 shadow-sm"
            : "text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"}
        `}
      >
        {label}
      </button>
    );
  };

    export default FilterButton;