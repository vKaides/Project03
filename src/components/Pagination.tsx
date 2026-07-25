interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  paginationRange: (number | 'ellipsis')[];
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, hasNextPage, paginationRange, onPageChange }: PaginationProps) {
  if (paginationRange.length === 0) return null;

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹ Prev
      </button>

      {paginationRange.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={item}
            className={`pagination-btn pagination-number ${currentPage === item ? 'active' : ''}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        )
      )}

      <button
        className="pagination-btn"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next ›
      </button>
    </div>
  );
}