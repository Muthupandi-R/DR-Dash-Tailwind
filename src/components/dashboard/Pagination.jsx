import React from "react";

function Pagination() {
  return (
      <div className="flex">
        {/* Previous Button */}
        <a
          href="#"
          className="flex items-center justify-center px-4 h-9 me-3 text-sm font-medium text-primary bg-white border border-primary rounded-lg shadow-sm hover:bg-primary hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
        >
          <svg
            className="w-3.5 h-3.5 me-2 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 5H1m0 0 4 4M1 5l4-4"
            />
          </svg>
          Previous
        </a>

        {/* Next Button */}
        <a
          href="#"
          className="flex items-center justify-center px-4 h-9 me-3 text-sm font-medium  no-underline text-primary bg-white border border-primary rounded-lg shadow-sm hover:bg-primary hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
        >
          Next
          <svg
            className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </a>
      </div>
  );
}

export default Pagination;
