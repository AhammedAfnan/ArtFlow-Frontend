function MyButton({ text, ...props }) {
    return (
      <button
        {...props}
        className="bg-yellow-500 mt-2 text-gray-900 h-10 w-32 rounded-full hover:bg-yellow-400 focus:outline-none focus:ring focus:border-blue-300"
      >
        <b>{text}</b>
      </button>
    );
  }
  
  export default MyButton;
  