import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainTitle from '../components/MainTitle';
import ContactCard from '../components/ContactCard';
import { colors } from '../constants/Colors';
import { Contact } from '../models/contact';
import { ContactStackParamList } from '../stacks/ContactStack';
import Toast from 'react-native-toast-message';
import {
  deleteContact as deleteFirebaseContact,
  getContacts as getFirebaseContacts,
} from './../firebase/firebaseActions';

type ContactScreenNavigationProp = StackNavigationProp<
  ContactStackParamList,
  'Contact'
>;

const ContactScreen = () => {
  const navigation = useNavigation<ContactScreenNavigationProp>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchContacts = async () => {
        try {
          let allContacts;
          const storedContacts = await AsyncStorage.getItem('contacts');

          if (storedContacts && JSON.parse(storedContacts).length > 0) {
            allContacts = JSON.parse(storedContacts);
          } else {
            try {
              const firebaseContacts = await getFirebaseContacts();
              allContacts = Object.values(firebaseContacts);
              await AsyncStorage.setItem(
                'contacts',
                JSON.stringify(allContacts),
              );
            } catch (error) {
              console.error(
                'Error while fetching contacts from Firebase:',
                error,
              );
            }
          }

          if (allContacts.length > 0) {
            allContacts.sort((a: Contact, b: Contact) =>
              a.lastName.localeCompare(b.lastName),
            );
            setContacts(allContacts);
          } else {
            setContacts([]);
          }

          setIsLoading(false);
        } catch (error) {
          console.error('Error while fetching contacts:', error);
        }
      };

      setIsLoading(true);
      fetchContacts();
    }, []),
  );

  const handleDeleteContact = (contact: Contact) => {
    Alert.alert(
      'Supprimer le contact',
      `Etes vous sur de vouloir supprimer ${contact.lastName} ${contact.firstName} ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(`contactImages/${contact.id}`);
              const contacts = await AsyncStorage.getItem('contacts');
              let parsedContacts = [];
              if (contacts) {
                parsedContacts = JSON.parse(contacts);
                const newContacts = parsedContacts.filter(
                  (c: Contact) => c.id !== contact.id,
                );
                await AsyncStorage.setItem(
                  'contacts',
                  JSON.stringify(newContacts),
                );
                await deleteFirebaseContact(contact.id);
                Toast.show({
                  text1: 'Contact supprimé',
                  text2: `${contact.lastName} ${contact.firstName} a été supprimé de vos contacts`,
                  type: 'success',
                });
                setContacts(newContacts);
              }
            } catch (error) {
              console.log(error);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const renderItem = ({ item, index }: { item: Contact; index: number }) => {
    return (
      <ContactCard
        contact={item}
        style={index === contacts.length - 1 ? { marginBottom: 65 } : null}
        onDelete={handleDeleteContact}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <MainTitle
          icon={
            <Image
              source={require('../../assets/BaseProfile.png')}
              style={{ width: 25, height: 25 }}
            />
          }
          text='Contacts'
          size='big'
        />
      </View>
      {isLoading ? (
        <View style={styles.noContactContainer}>
          <Text style={styles.loadingText}>Chargement des données...</Text>
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.noContactContainer}>
          <Text style={styles.emptyMessage}>
            Vous n'avez encore aucun contact. Cliquez sur le + ci-dessous pour
            ajouter un contact.
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
        />
      )}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('ContactForm')}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  titleContainer: {
    paddingHorizontal: 15,
    marginBottom: 30,
    alignItems: 'center',
  },
  noContactContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 100,
    paddingHorizontal: 30,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(0,0,0,0.7)',
  },
  flatListContent: {
    flexGrow: 1,
  },
  floatingButtonContainer: {
    paddingRight: 15,
    paddingBottom: 15,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  floatingButton: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 50,
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 36,
    marginBottom: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ContactScreen;
