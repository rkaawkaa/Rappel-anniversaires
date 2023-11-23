import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, FlatList, Text } from 'react-native';
import { colors } from '../constants/Colors';
import MainTitle from '../components/MainTitle';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BirthDayCard from '../components/BirthDayCard';
import { Contact } from '../models/contact';
import moment from 'moment';
import { getContacts as getFirebaseContacts } from '../firebase/firebaseActions';

const HomeScreen = () => {
  const [contacts, setContacts] = useState<Contact[][]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const nextBirthday = (dateOfBirth: string): Date => {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();

    birthDate.setFullYear(currentDate.getFullYear());

    if (birthDate < currentDate) {
      birthDate.setFullYear(currentDate.getFullYear() + 1);
    }

    return birthDate;
  };

  const daysBetween = (date1: Date, date2: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / oneDay);
    return diffDays;
  };

  useEffect(() => {
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
            await AsyncStorage.setItem('contacts', JSON.stringify(allContacts));
          } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
          }
        }

        if (allContacts.length > 0) {
          setIsEmpty(false);
          const monthsContacts: Contact[][] = Array.from(
            { length: 12 },
            () => [],
          );
          allContacts.forEach((contact: Contact) => {
            const contactMonth: number = moment(contact.dateOfBirth).month();
            monthsContacts[contactMonth].push(contact);
          });
          const sortedMonthsContacts: Contact[][] = monthsContacts.map(
            (monthContacts) =>
              monthContacts.sort((a, b) => {
                const nextBirthdayA: Date = nextBirthday(a.dateOfBirth);
                const nextBirthdayB: Date = nextBirthday(b.dateOfBirth);

                const daysToNextBirthdayA = daysBetween(
                  new Date(),
                  nextBirthdayA,
                );
                const daysToNextBirthdayB = daysBetween(
                  new Date(),
                  nextBirthdayB,
                );

                if (daysToNextBirthdayA === 366) {
                  return -1;
                }
                if (daysToNextBirthdayB === 366) {
                  return 1;
                }

                return nextBirthdayA.getTime() - nextBirthdayB.getTime();
              }),
          );

          const currentMonthIndex = moment().month();

          const reorderedMonthsContacts = [
            ...sortedMonthsContacts.slice(currentMonthIndex),
            ...sortedMonthsContacts.slice(0, currentMonthIndex),
          ];

          setContacts(reorderedMonthsContacts);
          setIsLoading(false);
        } else {
          setIsEmpty(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error while fetching contacts:', error);
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const renderMonthContacts = ({
    item,
    index,
  }: {
    item: Contact[];
    index: number;
  }) => {
    if (item.length > 0) {
      const firstContact = item[0];
      let monthName = moment(firstContact.dateOfBirth).format('MMMM');
      if (monthName === 'January') {
        monthName = 'Janvier';
      } else if (monthName === 'February') {
        monthName = 'Février';
      } else if (monthName === 'March') {
        monthName = 'Mars';
      } else if (monthName === 'April') {
        monthName = 'Avril';
      } else if (monthName === 'May') {
        monthName = 'Mai';
      } else if (monthName === 'June') {
        monthName = 'Juin';
      } else if (monthName === 'July') {
        monthName = 'Juillet';
      } else if (monthName === 'August') {
        monthName = 'Août';
      } else if (monthName === 'September') {
        monthName = 'Septembre';
      } else if (monthName === 'October') {
        monthName = 'Octobre';
      } else if (monthName === 'November') {
        monthName = 'Novembre';
      } else if (monthName === 'December') {
        monthName = 'Décembre';
      }

      const currentMonthIndex = moment().month();
      const contactsToDisplay =
        index === 0 ? filterCurrentMonthContacts(item) : item;

      if (contactsToDisplay.length === 0) {
        return null;
      }

      return (
        <View>
          <View style={styles.monthTitleContainer}>
            <Text style={styles.monthTitle}>{monthName}</Text>
          </View>
          <FlatList
            data={item}
            renderItem={({ item }) => <BirthDayCard contact={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      );
    }
    return null;
  };

  const filterCurrentMonthContacts = (contacts: Contact[]) => {
    const today = new Date();
    const currentDay = today.getDate();
    contacts.forEach((contact) => {
      const birthDate = new Date(contact.dateOfBirth);
      const dayOfBirth = birthDate.getDate();
      if (currentDay > dayOfBirth) {
        const index = contacts.indexOf(contact);
        contacts.splice(index, 1);
      }
    });
    return contacts;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <MainTitle
            icon={
              <Image
                source={require('../../assets/cake.png')}
                style={{ width: 30, height: 30 }}
              />
            }
            text='Anniversaires'
            size='big'
          />
        </View>
        <View style={styles.noContactContainer}>
          <Text style={styles.loadingText}>Chargement des données...</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <MainTitle
          icon={
            <Image
              source={require('../../assets/cake.png')}
              style={{ width: 30, height: 30 }}
            />
          }
          text='Anniversaires'
          size='big'
        />
      </View>
      {isEmpty ? (
        <View style={styles.noContactContainer}>
          <Text style={styles.emptyMessage}>
            Vous n'avez aucun contact. Vous pouvez en créer en allant dans
            l'onglet "Mes contacts".
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderMonthContacts}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  flatListContent: {
    flexGrow: 1,
  },
  titleContainer: {
    paddingHorizontal: 15,
    marginBottom: 30,
    alignItems: 'center',
  },
  monthTitleContainer: {
    marginTop: 15,
  },
  monthTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.85)',
    textShadowColor: 'rgba(0, 0, 0, 0.20)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 2,
  },

  noContactContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 100,
    paddingHorizontal: 30,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(0,0,0,0.7)',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default HomeScreen;
