import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  backgroundColor: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress,
  backgroundColor,
}) => {
  const buttonStyles = [styles.button, { backgroundColor }];

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CustomButton;
