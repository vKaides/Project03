/**
 * Generates a compact pagination range array with ellipsis markers.
 *
 * Example: totalPages=10, currentPage=6 → [1, 'ellipsis', 4, 5, 6, 7, 8, 'ellipsis', 10]
 *
 * @param currentPage - The currently active page number (1-based).
 * @param totalPages  - The total number of pages available.
 * @returns An ordered array of page numbers and `'ellipsis'` strings for rendering.
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] {
  if (totalPages <= 1) return [];

  const pages: (number | 'ellipsis')[] = [];
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startPage = Math.max(1, safeCurrentPage - 2);
  const endPage = Math.min(totalPages, safeCurrentPage + 2);

  if (startPage > 1) {
    pages.push(1, 'ellipsis');
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages) {
    pages.push('ellipsis', totalPages);
  }

  // Remove consecutive ellipsis (shouldn't happen with current logic, but safe guard)
  return pages.filter((page, index, arr) => page !== 'ellipsis' || arr[index - 1] !== 'ellipsis');
}