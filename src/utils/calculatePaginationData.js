export function calculatePaginationData(page, perPage, count) {
  const totalPages = Math.ceil(count / perPage);
  const hasPreviousPage = page !== 1;
  const hasNextPage = Boolean(totalPages - page);

  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
}
