const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  handleDelete,
  buttonText = 'Submit',
}) => {
  console.log('value', value);
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex justify-between">
          <button
            type="submit"
            className="rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
          >
            {buttonText}
          </button>
          {handleDelete && (
            <button
              onClick={handleDelete}
              type="button"
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
