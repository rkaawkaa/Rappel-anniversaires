import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MainTitleProps {
  icon?: JSX.Element;
  text: string;
  size: string;
}

const MainTitle = ({ icon, text, size }: MainTitleProps) => {
  let fontSize = 21;
  let color = '#333333';
  if (size === 'big') {
    fontSize = 26;
    color = 'black';
  }

  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.title, { fontSize, color }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginRight: 5,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default MainTitle;
