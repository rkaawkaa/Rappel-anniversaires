import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface CustomInputTextProps {
  label: string;
  placeholder: string;
  errorMessage: string;
  onValueChange?: (text: string) => void;
  initialValue?: string;
}

const CustomInputText: React.FC<CustomInputTextProps> = ({
  label,
  placeholder,
  errorMessage,
  onValueChange,
  initialValue,
}) => {
  const [value, setValue] = useState(initialValue ?? '');
  const [error, setError] = useState(false);

  const onChangeText = (text: string) => {
    if (text.length > 0 && (text.match(/[0-9]/) || text.length < 2)) {
      setError(true);
    } else {
      setError(false);
      onValueChange && onValueChange(text);
    }
    setValue(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor='#A8A5A5'
        />
      </View>
      {error && (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage} numberOfLines={2}>
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: '33%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 13,
    color: 'black',
    marginRight: 10,
  },
  input: {
    backgroundColor: '#F1EFEFCC',
    borderRadius: 5,
    minWidth: 140,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 11,
    color: '#333333',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  errorMessageContainer: {
    paddingTop: 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  errorMessage: {
    color: 'red',
    fontStyle: 'italic',
    fontSize: 9,
  },
});

export default CustomInputText;
