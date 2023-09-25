import fs from 'fs/promises';
import path from 'path';
const contactPath = path.resolve('models', 'contacts.json');

export const listContacts = async () => {
  const data = await fs.readFile(contactPath);
  return JSON.parse(data);
};

export const getContactById = async contactId => {};

export const removeContact = async contactId => {};

export const addContact = async body => {};

export const updateContact = async (contactId, body) => {};

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// };
