import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ContactStack from '../stacks/ContactStack';
import { CommonActions, useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const BottomNavigationBar = () => {
  const navigation = useNavigation();
  const handleContactPress = () => {
    // Réinitialiser la pile de navigation avant de naviguer vers 'ContactScreen'
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Contacts' }],
      }),
    );
  };
  return (
    <Tab.Navigator
      initialRouteName='Anniversaires'
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: () => {
          let iconSource;

          if (route.name === 'Anniversaires') {
            iconSource = require('../../assets/cake.png');
          } else if (route.name === 'Contacts') {
            iconSource = require('../../assets/contact.png');
          } else if (route.name === 'Paramètres') {
            iconSource = require('../../assets/settings.png');
          }

          return (
            <Image source={iconSource} style={{ width: 25, height: 25 }} />
          );
        },
        tabBarLabel: ({ focused, color }) => {
          const labelText = route.name;
          return (
            <Text
              style={{
                color,
                fontWeight: focused ? 'bold' : 'normal',
                fontSize: 11,
                marginBottom: 4,
              }}
            >
              {labelText}
            </Text>
          );
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#FEFEFE',
        tabBarLabelStyle: { marginBottom: 4, marginTop: -5 },
        tabBarStyle: { backgroundColor: colors.secondaryColor, height: 60 },
      })}
    >
      <Tab.Screen name='Anniversaires' component={HomeScreen} />
      <Tab.Screen
        name='Contacts'
        component={ContactStack}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={handleContactPress} />
          ),
        }}
      />
      <Tab.Screen name='Paramètres' component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigationBar;
