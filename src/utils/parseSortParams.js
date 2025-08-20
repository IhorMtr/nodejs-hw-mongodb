import { SORT_ORDER } from '../constants/index.js';

function parseSortOrder(sortOrder) {
  const inputOrder = Object.values(SORT_ORDER).includes(sortOrder);

  if (!inputOrder) return SORT_ORDER.ASC;

  return sortOrder;
}

function parseSortBy(sortBy) {
  const keys = [
    '_id',
    'name',
    'isFavourite',
    'createdAt',
    'updatedAt',
    'contactType',
  ];

  if (keys.includes(sortBy)) return sortBy;

  return '_id';
}

export function parseSortParams(query) {
  const parsedSortOrder = parseSortOrder(query.sortOrder);
  const parsedSortBy = parseSortBy(query.sortBy);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
