import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Contact } from '../models/contact';
import { colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ContactCardProps {
  contact: Contact;
  style?: { marginBottom: number } | null;
  onDelete: (contact: Contact) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  style,
  onDelete,
}) => {
  const { firstName, lastName, gender, categorie, dateOfBirth, id } = contact;

  const [selectedImageUri, setSelectedImageUri] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const getContactImageUri = async () => {
      try {
        const imageUri = await AsyncStorage.getItem(`contactImages/${id}`);
        if (imageUri) {
          setSelectedImageUri(imageUri);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getContactImageUri();
  }, [id]);

  const formattedDateOfBirth = () => {
    const date = new Date(dateOfBirth);
    const day = date.getDate();
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formattedCreationDate = () => {
    const date = new Date(contact.dateOfCreation);
    const day = date.getDate();
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getCategoryBoxColor = () => {
    switch (categorie) {
      case 'Famille':
        return colors.categoryBox.Famille;
      case 'Ami':
        return colors.categoryBox.Ami;
      case 'Collègue':
        return colors.categoryBox.Collègue;
      case 'Autre':
        return colors.categoryBox.Autre;
      default:
        return colors.categoryBox.Autre;
    }
  };

  const setProfileImage = () => {
    if (selectedImageUri) {
      return (
        <Image source={{ uri: selectedImageUri }} style={styles.profileIcon} />
      );
    } else {
      return (
        <Image
          source={
            gender === 'Masculin'
              ? require('../../assets/mascProfile.png')
              : require('../../assets/femProfile.png')
          }
          style={styles.profileIcon}
        />
      );
    }
  };

  const birthLabel = gender === 'Masculin' ? 'Né le' : 'Née le';

  const navigation = useNavigation<any>();

  const handleEditContact = () => {
    navigation.navigate('ContactForm', { contact });
  };

  const handleDeleteContact = () => {
    onDelete(contact);
  };

  return (
    <View style={[styles.card, style]}>
      <View style={styles.leftSection}>
        {setProfileImage()}
        <View style={styles.nameCategory}>
          <Text style={styles.name}>
            {lastName} {firstName}
          </Text>
          <View
            style={[
              styles.categoryBox,
              { backgroundColor: getCategoryBoxColor() },
            ]}
          >
            <Text style={styles.category}>{categorie}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.dateOfBirthText}>
          {birthLabel} {formattedDateOfBirth()}
        </Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleEditContact}>
            <Image
              source={require('../../assets/edit.png')}
              style={[styles.icon, { marginRight: 30 }]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteContact}>
            <Image
              source={require('../../assets/delete.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.creationDateText}>
          Créé le {formattedCreationDate()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 7,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileIcon: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 50,
  },
  nameCategory: {
    flexDirection: 'column',
    flex: 1,
  },
  name: {
    fontSize: 14.5,
    fontWeight: 'bold',
  },
  categoryBox: {
    borderRadius: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  category: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#FEFEFE',
  },
  rightSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginVertical: 5,
  },
  dateOfBirthText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  creationDateText: {
    fontSize: 9,
    color: 'rgba(0, 0, 0, 0.7)',
  },
});

export default ContactCard;
