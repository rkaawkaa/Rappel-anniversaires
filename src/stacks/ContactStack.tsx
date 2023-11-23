import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ContactScreen from '../screens/ContactScreen';
import ContactForm from '../screens/ContactForm';
import { Contact } from '../models/contact';

export type ContactStackParamList = {
  Contact: undefined;
  ContactForm: { contact?: Contact } | undefined;
};

const Stack = createStackNavigator<ContactStackParamList>();

const ContactStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='Contact' component={ContactScreen} />
      <Stack.Screen name='ContactForm' component={ContactForm} />
    </Stack.Navigator>
  );
};

export default ContactStack;
