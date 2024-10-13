/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { User, UserCheck, Award, ChevronRight, RotateCcw, Tool } from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';

export const Profile = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ScrollView>
        <Header />
        <View style={styles.containerTitle}>
          <User stroke="#00A296" width={20} height={20} />
          <Text style={styles.title}>Minhas infos</Text>
        </View>
        <View style={styles.containerList}>
          <TouchableOpacity
            style={styles.containerItem}
            onPress={() => navigation.navigate({name: 'Edit'} as never)}
          >
            <View style={styles.item}>
              <UserCheck stroke="#8F9494" width={20} height={20} />
              <Text style={styles.textItem}>Meus dados</Text>
            </View>
            <ChevronRight stroke="#8F9494" width={20} height={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.containerItem}
            onPress={() => navigation.navigate({name: 'Achievement'} as never)}
          >
            <View style={styles.item}>
              <Award stroke="#8F9494" width={20} height={20} />
              <Text style={styles.textItem}>Minhas conquistas</Text>
            </View>
            <ChevronRight stroke="#8F9494" width={20} height={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.containerItem}
            onPress={() => navigation.navigate({name: 'ShoppingHistory'} as never)}
          >
            <View style={styles.item}>
              <RotateCcw stroke="#8F9494" width={20} height={20} />
              <Text style={styles.textItem}>Histórico de compra</Text>
            </View>
            <ChevronRight stroke="#8F9494" width={20} height={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.containerItem}
            onPress={() => navigation.navigate({name: 'About'} as never)}
          >
            <View style={styles.item}>
              <Tool stroke="#8F9494" width={20} height={20} />
              <Text style={styles.textItem}>Sobre</Text>
            </View>
            <ChevronRight stroke="#8F9494" width={20} height={20} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 48,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    backgroundColor: '#F5FAFA',
  },
  containerTitle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    color: '#050505',
  },
  containerList: {
    width: '100%',
    marginTop: 32,
  },
  containerItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D4D9D9',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textItem: {
    fontFamily: 'Inter-SemiBold',
    color: '#1F2121',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Profile;

