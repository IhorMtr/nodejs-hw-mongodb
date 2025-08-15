import { ContactsCollection } from '../db/models/contacts.js';

export async function getAllContacts() {
  const contacts = await ContactsCollection.find();
  return contacts;
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
