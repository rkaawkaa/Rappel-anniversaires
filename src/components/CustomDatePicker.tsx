import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface CustomDatePickerProps {
  label: string;
  onDateChange: (date: Date) => void;
  placeholder: string;
  initialValue?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  onDateChange,
  placeholder,
  initialValue,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    placeholder ? undefined : new Date(),
  );
  const [showPicker, setShowPicker] = React.useState(false);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date);
    setShowPicker(false);
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity onPress={showDatepicker}>
          <Text style={selectedDate ? undefined : styles.placeholder}>
            {selectedDate
              ? selectedDate.toLocaleDateString()
              : initialValue
              ? new Date(initialValue).toLocaleDateString()
              : placeholder}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePickerModal
            isVisible={showPicker}
            mode='date'
            onConfirm={handleDateChange}
            onCancel={() => setShowPicker(false)}
            maximumDate={new Date()}
            locale='fr-FR'
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: '33%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginBottom: 25,
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
  placeholder: {
    color: '#484848',
    fontSize: 11,
  },
});

export default CustomDatePicker;
