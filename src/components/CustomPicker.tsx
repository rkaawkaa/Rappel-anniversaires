import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Platform } from 'react-native';

interface CustomPickerOption {
  value: string;
  label: string;
}

interface CustomPickerProps {
  label: string;
  items: CustomPickerOption[];
  onSelect: (item: any) => void;
  placeholder?: string;
  initialValue?: string;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  label,
  items,
  onSelect,
  placeholder,
  initialValue,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    initialValue ?? (placeholder ? undefined : items[0].value),
  );

  const handleValueChange = (itemValue: string | undefined) => {
    if (itemValue !== undefined) {
      setSelectedValue(itemValue);
      onSelect(itemValue);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={handleValueChange}
          >
            {placeholder && (
              <Picker.Item
                label={placeholder}
                value={undefined}
                color='grey'
                style={styles.pickerPlaceholder}
              />
            )}
            {items.map((item, index) => (
              <Picker.Item
                key={index}
                label={item.label}
                value={item.value}
                color='black'
                style={styles.pickerItem}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: '33%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginBottom: 15,
    marginTop: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 13,
    color: 'black',
    marginRight: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    width: 140,
    height: 25,
    backgroundColor: '#F1EFEFCC',
  },
  pickerItem: {
    fontSize: 13,
  },
  pickerPlaceholder: {
    fontSize: 11,
  },
});

export default CustomPicker;
