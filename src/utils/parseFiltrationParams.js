import { CONTACTS_TYPE } from '../constants/index.js';

function parseContactType(type) {
  if (!type) return undefined;
  const normalized = type.toLowerCase();
  const inputType = Object.values(CONTACTS_TYPE).includes(normalized);

  if (inputType) return normalized;

  return undefined;
}

function parseIsFavourite(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

export function parseFiltrationParams(query) {
  const parsedType = parseContactType(query.type);
  const parsedIsFavourite = parseIsFavourite(query.isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
}
