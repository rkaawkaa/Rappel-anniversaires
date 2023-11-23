import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ImagePickerProps {
  onImageSelected: (uri: string) => void;
  contactId?: string;
}

const ImagePickerComponent: React.FC<ImagePickerProps> = ({
  onImageSelected,
  contactId,
}) => {
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getContactImageUri = async () => {
      if (contactId) {
        try {
          const imageUri = await AsyncStorage.getItem(
            `contactImages/${contactId}`,
          );
          if (imageUri) {
            setImageUri(imageUri);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    getContactImageUri();
  }, []);

  const openImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.6,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Photo (optionnel)</Text>
        <TouchableOpacity onPress={openImagePicker}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Image
              source={require('../../assets/uploadImage.png')}
              style={styles.icon}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: '33%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginBottom: 30,
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
  icon: {
    width: 45,
    height: 45,
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
});

export default ImagePickerComponent;
