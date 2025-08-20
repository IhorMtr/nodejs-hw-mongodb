import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortOrder = 'asc',
  sortBy = '_id',
  isFavourite,
  type,
}) {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const filter = {};
  if (typeof isFavourite === 'boolean') {
    filter.isFavourite = isFavourite;
  }
  if (type) {
    filter.contactType = type;
  }

  const query = ContactsCollection.find(filter);
  const contactsCount = await ContactsCollection.countDocuments(filter);

  const contacts = await query
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const paginationData = calculatePaginationData(page, perPage, contactsCount);

  return {
    data: contacts,
    ...paginationData,
  };
}

export async function getContactById(contactId) {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
}

export async function createContact(payload) {
  const contact = await ContactsCollection.create(payload);
  return contact;
}

export async function updateContact(contactId, payload) {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedContact) {
    return null;
  }

  return { contact: updatedContact };
}

export async function deleteContact(contactId) {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId });

  return contact;
}
