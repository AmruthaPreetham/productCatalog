interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showPrevious = currentPage > 1;
  const showNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!showPrevious}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          !showPrevious ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'text-white hover:opacity-90'
        }`}
        style={{ backgroundColor: showPrevious ? '#1e3a8a' : undefined }}
      >
        Previous
      </button>

      <div className="flex gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
              currentPage !== page ? 'border border-gray-300 hover:bg-gray-50' : ''
            }`}
            style={{
              backgroundColor: currentPage === page ? '#1e3a8a' : '#ffffff',
              color: currentPage === page ? '#ffffff' : '#1e3a8a'
            }}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!showNext}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          !showNext ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'text-white hover:opacity-90'
        }`}
        style={{ backgroundColor: showNext ? '#1e3a8a' : undefined }}
      >
        Next
      </button>
    </div>
  );
}
