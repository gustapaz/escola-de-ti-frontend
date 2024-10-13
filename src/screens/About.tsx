/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import Header from '../components/Header';
import ArrowLeftButton from '../components/ArrowLeftButton';
import {useNavigation} from '@react-navigation/native';

export const About = () => {
  const navigation = useNavigation();
  const [showViewer, setShowViewer] = useState(false);

  const handleProfileNavigation = () => {
    navigation.navigate('ProfileScreen' as never);
  };

  const handleOpen = () => {
    setShowViewer(true);
  };

  const handleClose = () => {
    setShowViewer(false);
  };

  return (
    <View style={styles.container}>
      <Header />
      {showViewer ? (
        <>
          <ArrowLeftButton onPress={handleClose} />
          <View style={{marginTop: 40, paddingVertical: 24}}>
            <Text style={styles.firstTitle}>Lorem Ipsum</Text>
            <Text style={[styles.text, {marginTop: 16}]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              hendrerit pharetra felis finibus porttitor. Phasellus ut ex at
              erat maximus ullamcorper et eu libero. Sed id orci in erat
              lobortis dapibus. Nam facilisis egestas ex ut porta. Ut imperdiet
              placerat dolor eget porta. Maecenas nec pharetra nunc. Suspendisse
              enim quam, finibus vitae risus vitae, malesuada interdum eros. Sed
              ultrices elit fermentum turpis sodales, in tincidunt mauris
              consequat.
            </Text>
            <Text style={[styles.text, {marginTop: 16}]}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              hendrerit pharetra felis finibus porttitor. Phasellus ut ex at
              erat maximus ullamcorper et eu libero. Sed id orci in erat
              lobortis dapibus. Nam facilisis egestas ex ut porta. Ut imperdiet
              placerat dolor eget porta. Maecenas nec pharetra nunc. Suspendisse
              enim quam, finibus vitae risus vitae, malesuada interdum eros. Sed
              ultrices elit fermentum turpis sodales, in tincidunt mauris
              consequat.
            </Text>
          </View>
        </>
      ) : (
        <>
          <ArrowLeftButton onPress={handleProfileNavigation} />
          <View
            style={[styles.row, {justifyContent: 'center', marginBottom: 20}]}>
            <Image
              source={require('../assets/images/icon-about.png')}
              resizeMode="contain"
            />
            <Text style={styles.firstTitle}>Sobre</Text>
          </View>
          <TouchableOpacity onPress={handleOpen}>
            <View style={[styles.row, styles.list]}>
              <View style={styles.row}>
                <Image
                  source={require('../assets/images/icon-term.png')}
                  resizeMode="contain"
                />
                <Text style={styles.secondTitle}>Termos de uso</Text>
              </View>
              <Image
                source={require('../assets/images/icon-arrow-right.png')}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpen}>
            <View style={[styles.row, styles.list]}>
              <View style={styles.row}>
                <Image
                  source={require('../assets/images/icon-privacy.png')}
                  resizeMode="contain"
                />
                <Text style={styles.secondTitle}>Políticas de privacidade</Text>
              </View>
              <Image
                source={require('../assets/images/icon-arrow-right.png')}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </>
      )}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  firstTitle: {
    color: '#050505',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginLeft: 12,
  },
  secondTitle: {
    color: '#050505',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 12,
  },
  list: {
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#D4D9D9',
    paddingVertical: 16,
  },
  text: {
    color: '#8F9494',
    fontSize: 12,
    fontWeight: '400',
  },
});

export default About;
