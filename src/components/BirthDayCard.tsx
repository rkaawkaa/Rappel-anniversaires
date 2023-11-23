import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../constants/Colors';
import { Contact } from '../models/contact';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BirthDayCardProps {
  contact: Contact;
  style?: { marginBottom: number } | null;
}

const BirthDayCard: React.FC<BirthDayCardProps> = ({ contact, style }) => {
  const { firstName, lastName, gender, categorie, dateOfBirth, id } = contact;

  const [selectedImageUri, setSelectedImageUri] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const getProfileImage = async () => {
      let imageUri;
      try {
        imageUri = await AsyncStorage.getItem(`contactImages/${id}`);
      } catch (error) {
        console.log(error);
      }
      setSelectedImageUri(imageUri ?? undefined);
    };

    getProfileImage();
  }, [id]);

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

  const formattedDateOfBirth = () => {
    const date = new Date(dateOfBirth);
    const day = date.getDate();
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const daysBetween = (date1: Date, date2: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / oneDay);
    return diffDays;
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const nextBirthday = (dateOfBirth: string): Date => {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();

    birthDate.setFullYear(currentDate.getFullYear());

    if (birthDate < currentDate) {
      birthDate.setFullYear(currentDate.getFullYear() + 1);
    }

    return birthDate;
  };

  const daysToText = (days: number): string => {
    if (days === 0 || days === 366) {
      return " aujourd'hui";
    } else if (days === 1) {
      return ' demain';
    } else if (days === 2) {
      return ' après-demain';
    } else {
      return ` dans \n ${days} jours`;
    }
  };

  const ageAtNextBirthday: number = calculateAge(dateOfBirth) + 1;

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

  const nextBday = nextBirthday(dateOfBirth);
  const daysToNextBirthday = daysBetween(new Date(), nextBday);
  const daysText = daysToText(daysToNextBirthday);
  const birthLabel = gender === 'Masculin' ? 'Né le' : 'Née le';

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
        <View style={styles.birthdaySoonContainer}>
          <Image
            source={
              daysToNextBirthday === 0 || daysToNextBirthday === 366
                ? require('../../assets/happyBirthday.png')
                : require('../../assets/flameBirthday.png')
            }
            style={[
              styles.flameIcon,
              daysToNextBirthday === 0 || daysToNextBirthday === 366
                ? { width: 28, height: 28, marginRight: 5 }
                : null,
            ]}
          />

          <Text
            style={[
              styles.birthdayText,
              daysToNextBirthday < 8 || daysToNextBirthday === 0
                ? styles.boldText
                : null,
              daysToNextBirthday === 0 || daysToNextBirthday === 366
                ? styles.redText
                : null,
            ]}
          >
            {ageAtNextBirthday} ans
            {daysText}
          </Text>
        </View>
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
    marginRight: 10,
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
    fontSize: 15,
    fontWeight: 'bold',
  },
  categoryBox: {
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
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
  dateOfBirthText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  birthdaySoonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    flexWrap: 'wrap',
  },
  flameIcon: {
    width: 22,
    height: 22,
    marginRight: 3,
  },
  birthdayText: {
    fontSize: 14,
  },
  boldText: {
    fontWeight: 'bold',
  },
  redText: {
    color: 'rgb(255, 34,34)',
    fontWeight: 'bold',
  },
});

export default BirthDayCard;
