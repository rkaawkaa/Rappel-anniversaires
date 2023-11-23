import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import Constants from 'expo-constants';

const firebaseConfig = Constants.manifest?.extra?.firebase;

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
