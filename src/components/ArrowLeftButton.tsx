/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ArrowLeft} from 'react-native-feather';

type ArrowLeftButtonProps = {
  onPress: any;
};

export const ArrowLeftButton = ({onPress}: ArrowLeftButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <ArrowLeft
        stroke="#BABFBF"
        fill="#fff"
        width={32}
        height={32}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
  },
  icon: {
    marginTop: 12,
  },
});

export default ArrowLeftButton;
