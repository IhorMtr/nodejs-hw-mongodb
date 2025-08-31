import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export async function getAllContacts({
  page = 1,
  perPage = 10,
  sortOrder = 'asc',
  sortBy = '_id',
  isFavourite,
  type,
  userId,
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
  filter.userId = userId;

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

export async function getContactById(contactId, userId) {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  return contact;
}

export async function createContact(req) {
  const { body, user, file: photo } = req;

  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  const contact = await ContactsCollection.create({
    ...body,
    userId: user._id,
    photo: photoUrl,
  });
  return contact;
}

export async function updateContact(contactId, payload, userId, photo) {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });

  if (!contact) {
    return null;
  }

  let photoUrl;
  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    {
      ...payload,
      photo: photoUrl,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return { contact: updatedContact };
}

export async function deleteContact(contactId, userId) {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
}
