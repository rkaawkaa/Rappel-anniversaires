// src/screens/ContactForm.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import MainTitle from '../components/MainTitle';
import CustomInputText from '../components/CustomInputText';
import CustomPicker from '../components/CustomPicker';
import CustomDatePicker from '../components/CustomDatePicker';
import CustomButton from '../components/CustomButton';
import { genderOptions } from '../constants/GenderOptions';
import { categories } from '../constants/Categories';
import ImagePicker from '../components/ImagePicker';
import { colors } from '../constants/Colors';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Contact } from '../models/contact';
import { ContactStackParamList } from '../stacks/ContactStack';
import {
  addContact as addContactToFirebase,
  updateContact as updateContactInFirebase,
} from '../firebase/firebaseActions';

type ContactFormRouteProp = RouteProp<ContactStackParamList, 'ContactForm'>;

const ContactForm: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<ContactFormRouteProp>();
  const contact = route.params?.contact;

  const [name, setName] = useState<string | null>(contact?.lastName ?? null);
  const [firstName, setFirstName] = useState<string | null>(
    contact?.firstName ?? null,
  );
  const [gender, setGender] = useState<string | null>(contact?.gender ?? null);
  const [categorie, setCategorie] = useState<string | null>(
    contact?.categorie ?? null,
  );
  const [date, setDate] = useState<Date | null>(
    contact ? new Date(contact.dateOfBirth) : null,
  );
  const [selectedImageUri, setSelectedImageUri] = useState<string | undefined>(
    undefined,
  );

  const storeContact = async (contact: Contact) => {
    try {
      const storedContacts = await AsyncStorage.getItem('contacts');
      let contacts: any[] = [];

      if (storedContacts) {
        contacts = JSON.parse(storedContacts);
      }

      contacts.push(contact);
      await AsyncStorage.setItem('contacts', JSON.stringify(contacts));
      const isFirebaseSuccess = await addContactToFirebase(contact);
      if (!isFirebaseSuccess) {
        throw new Error("Erreur lors de l'ajout du contact dans Firebase");
      }
    } catch (error) {
      console.error('Error while storing contact:', error);
    }
  };

  const handleNameChange = (text: string) => {
    setName((prevName) => {
      const updatedName = text.toUpperCase();
      return updatedName;
    });
  };

  const handleFirstNameChange = (text: string) => {
    setFirstName((prevFirstName) => {
      const updatedFirstName =
        text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      return updatedFirstName;
    });
  };

  const handleGenderSelect = (item: string) => {
    setGender((prevGender) => {
      const updatedGender = item;
      return updatedGender;
    });
  };

  const handleCategorieSelect = (item: string) => {
    setCategorie((prevCat) => {
      const updatedCat = item;
      return updatedCat;
    });
  };

  const handleDateSelect = (date: Date) => {
    setDate((prevDate) => {
      const updatedDate = date;
      return updatedDate;
    });
  };

  const handleImageSelected = (uri: string) => {
    setSelectedImageUri(uri);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleConfirm = async () => {
    if (!name || !firstName || !gender || !categorie || !date) {
      Toast.show({
        type: 'error',
        text1: 'Attention',
        text2: 'Tous les champs doivent être remplis pour créer le contact.',
      });
    } else {
      const id = contact ? contact.id : uuidv4();
      const currentDate = new Date();
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate());
      const updatedContact = {
        id: id,
        firstName,
        lastName: name,
        gender,
        categorie,
        dateOfBirth: date.toISOString(),
        dateOfCreation: contact
          ? contact.dateOfCreation
          : newDate.toISOString(),
      };

      if (contact) {
        await AsyncStorage.setItem(
          `contactImages/${updatedContact.id}`,
          selectedImageUri ?? '',
        );
        await updateContact(updatedContact);
        Toast.show({
          type: 'success',
          text1: 'Votre contact a bien été mis à jour !',
        });
      } else {
        await AsyncStorage.setItem(
          `contactImages/${updatedContact.id}`,
          selectedImageUri ?? '',
        );
        await storeContact(updatedContact);
        Toast.show({
          type: 'success',
          text1: 'Votre contact a bien été créé !',
        });
      }
      navigation.navigate('Contact');
    }
  };

  const updateContact = async (updatedContact: Contact) => {
    try {
      const storedContacts = await AsyncStorage.getItem('contacts');
      let contacts: Contact[] = [];
      if (storedContacts) {
        contacts = JSON.parse(storedContacts);
      }

      const contactIndex = contacts.findIndex(
        (contact) => contact.id === updatedContact.id,
      );

      if (contactIndex !== -1) {
        contacts[contactIndex] = updatedContact;
        await AsyncStorage.setItem('contacts', JSON.stringify(contacts));

        const isFirebaseSuccess = await updateContactInFirebase(updatedContact);
        if (!isFirebaseSuccess) {
          throw new Error(
            'Erreur lors de la modification du contact dans Firebase',
          );
        }
      } else {
        console.error('Error: Contact not found');
      }
    } catch (error) {
      console.error('Error while updating contact:', error);
    }
  };

  return (
    <ScrollView
      style={{ flexGrow: 1, backgroundColor: colors.backgroundPrimary }}
    >
      <View style={styles.titleContainer}>
        <MainTitle
          icon={
            <Image
              source={require('../../assets/contactForm.png')}
              style={{ width: 30, height: 30 }}
            />
          }
          text={
            contact
              ? `Modification de contact: ${contact.firstName} ${contact.lastName}`
              : 'Création de contact'
          }
          size='medium'
        />
      </View>
      <View style={styles.inputsContainer}>
        <CustomInputText
          label='Nom'
          placeholder='Ex: DUPONT'
          errorMessage='Le nom doit contenir minimum 2 caractères et aucun chiffre.'
          onValueChange={handleNameChange}
          initialValue={contact?.lastName}
        />
        <CustomInputText
          label='Prénom'
          placeholder='Ex: Jean'
          errorMessage='Le prénom doit contenir minimum 2 caractères et aucun chiffre.'
          onValueChange={handleFirstNameChange}
          initialValue={contact?.firstName}
        />
        <CustomPicker
          label='Genre'
          items={genderOptions.map(({ label, value }) => ({
            label,
            value,
          }))}
          onSelect={handleGenderSelect}
          placeholder='Ex.: Masculin'
          initialValue={contact?.gender}
        />

        <CustomPicker
          label='Catégorie'
          items={categories.map(({ label, value }) => ({
            label,
            value,
          }))}
          onSelect={handleCategorieSelect}
          placeholder='Ex.: Famille'
          initialValue={contact?.categorie}
        />
        <CustomDatePicker
          label='Date de naissance'
          onDateChange={handleDateSelect}
          placeholder='Sélectionner une date'
          initialValue={contact?.dateOfBirth}
        />
        <ImagePicker
          onImageSelected={handleImageSelected}
          contactId={contact?.id}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          text='Annuler'
          onPress={handleCancel}
          backgroundColor={colors.buttonCancel}
        />
        <CustomButton
          text={contact ? 'Modifier' : 'Créer'}
          onPress={handleConfirm}
          backgroundColor={colors.buttonPrimary}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  inputsContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
    alignItems: 'flex-end',
    marginBottom: 10,
  },
});

export default ContactForm;
