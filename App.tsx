// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigationBar from './src/components/BottomNavigationBar';
import Toast from 'react-native-toast-message';
import { getContacts, setAllContacts } from './src/firebase/firebaseActions';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from './src/models/contact';

function App() {
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const storedContacts = await AsyncStorage.getItem('contacts');

        if (storedContacts && JSON.parse(storedContacts).length > 0) {
          const firebaseContacts = await getContacts();

          if (Object.keys(firebaseContacts).length === 0) {
            await setAllContacts(JSON.parse(storedContacts));
          } else {
            await AsyncStorage.removeItem('contacts');
            const contactsArray = Object.values(firebaseContacts);
            await AsyncStorage.setItem(
              'contacts',
              JSON.stringify(contactsArray),
            );
          }
        } else {
          const firebaseContacts = await getContacts();
          const contactsArray = Object.values(firebaseContacts);
          await AsyncStorage.setItem('contacts', JSON.stringify(contactsArray));
        }
      } catch (error) {
        console.error('Error while fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <>
      <NavigationContainer>
        <BottomNavigationBar />
      </NavigationContainer>
      <Toast />
    </>
  );
}

export default App;
