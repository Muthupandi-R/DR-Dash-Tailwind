import React from "react";

function Pagination({ onNext, onPrev, currentPage, totalPages }) {
  return (
       <div className="flex">
      <button
        disabled={currentPage === 0}
        onClick={onPrev}
        className={`flex items-center justify-center px-4 h-9 me-3 text-sm font-medium ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'text-primary bg-white border border-primary'} rounded-lg`}
      >
        Previous
      </button>
      <button
        disabled={currentPage + 1 >= totalPages}
        onClick={onNext}
        className={`flex items-center justify-center px-4 h-9 text-sm font-medium ${currentPage + 1 >= totalPages ? 'opacity-50 cursor-not-allowed' : 'text-primary bg-white border border-primary'} rounded-lg`}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
