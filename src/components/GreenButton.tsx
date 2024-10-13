/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

type GreenButtonProps = {
  onPress: () => void;
  extraStyles: {};
  text: string;
  disabled?: boolean;
};

export const GreenButton = ({
  onPress,
  extraStyles,
  text,
  disabled,
}: GreenButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, extraStyles]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.textButton}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#00A296',
    alignItems: 'center',
    borderRadius: 6,
  },
  textButton: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#F5FAFA',
  },
});

export default GreenButton;
