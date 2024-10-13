/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, TextInput, KeyboardTypeOptions} from 'react-native';

export const GrayTextInput = ({
  placeholder = '',
  extraStyles = {},
  value = '',
  onChangeText,
  onBlur,
  editable,
  maxLength,
  keyboardType,
}: {
  placeholder?: string;
  extraStyles?: object;
  value?: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  editable?: boolean;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      style={[styles.input, extraStyles]}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      editable={editable}
      maxLength={maxLength}
      keyboardType={keyboardType}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#E8EDED',
    color: '#0E0F0F',
    width: '100%',
    borderRadius: 6,
    fontSize: 14,
  },
});

export default GrayTextInput;
