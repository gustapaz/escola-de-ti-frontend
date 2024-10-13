/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {MOTOBOY_URL} from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  nome: string;
  sobrenome: string;
  aiqcoins: number;
}

export const Store = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>('');

  const getToken = async () => {
    setToken(await AsyncStorage.getItem('access_token'));
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${MOTOBOY_URL}/findOne`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        const errorData = await response.text();
        console.error('Erro de busca:', errorData);
      }
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  };

  useEffect(() => {
    getToken();

    if (token) {
      fetchUserData();
    }
  }, [token]);

  return (
    <View style={styles.userContainer}>
      <View style={styles.userInfo}>
        <Image
          source={require('../assets/images/user-default.png')}
          style={{width: 40, height: 40, borderRadius: 20}}
        />
        <Text style={styles.userText}>
          {userData?.nome} {userData?.sobrenome}
        </Text>
      </View>
      <View style={styles.aiqcoinsContainer}>
        <Text style={styles.aiqcoinsAmount}>{userData?.aiqcoins}</Text>
        <Image
          source={require('../assets/images/aiqcoins.png')}
          style={{width: 36, height: 36}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    paddingVertical: 32,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#D4D9D9',
    borderRadius: 2,
    marginBottom: 26,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#1F2121',
  },
  aiqcoinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiqcoinsAmount: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    textAlign: 'right',
    color: '#7B1FA2',
  },
});

export default Store;
