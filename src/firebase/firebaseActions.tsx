import { ref, set, update, remove, get } from 'firebase/database';
import { db } from './firebaseConfig';
import { Contact } from '../models/contact';

export const addContact = async (contact: Contact) => {
  try {
    const newContactRef = ref(db, `contacts/${contact.id}`);
    await set(newContactRef, contact);
    return true;
  } catch (error) {
    console.error('Error adding contact:', error);
    return false;
  }
};

export const updateContact = async (contact: Contact) => {
  try {
    const contactRef = ref(db, `contacts/${contact.id}`);
    await update(contactRef, contact);
    return true;
  } catch (error) {
    console.error('Error updating contact:', error);
    return false;
  }
};

export const deleteContact = async (contactId: string) => {
  try {
    const contactRef = ref(db, `contacts/${contactId}`);
    await remove(contactRef);
    return true;
  } catch (error) {
    console.error('Error deleting contact:', error);
    return false;
  }
};

export const getContacts = async () => {
  try {
    const contactsRef = ref(db, 'contacts');
    const snapshot = await get(contactsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error getting contacts:', error);
    return {};
  }
};

export const setAllContacts = async (contacts: Contact[]) => {
  try {
    const updates: { [key: string]: Contact } = {};
    contacts.forEach((contact) => {
      updates[`contacts/${contact.id}`] = contact;
    });
    await update(ref(db), updates);
    return true;
  } catch (error) {
    console.error('Error setting all contacts:', error);
    return false;
  }
};
