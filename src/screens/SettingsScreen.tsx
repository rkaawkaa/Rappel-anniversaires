import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/Colors';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Paramètres</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundPrimary,
  },
  text: {
    fontSize: 24,
  },
});

export default SettingsScreen;
