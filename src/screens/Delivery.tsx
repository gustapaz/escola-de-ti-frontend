/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import Header from '../components/Header';
import { RotateCw } from 'react-native-feather';
import DeliveryCard from '../components/DeliveryCard';
import Loading from '../components/Loading';
import { BASE_URL } from '../config/constants';


type DeliveryData = {
  _id: string;
  nameRestaurant: string;
  deliveryType: string;
  address: string;
  imageSource: string;
};

export const Delivery = () => {
  const [deliveries, setDeliveries] = useState<DeliveryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data: DeliveryData[] = [
      {
        _id: '1',
        nameRestaurant: 'Restaurante A',
        deliveryType: 'Entrega rápida',
        address: 'Rua dos Jacarandás, 123',
        imageSource: 'https://images.unsplash.com/photo-1542039778-22c80bfeaa48?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        _id: '2',
        nameRestaurant: 'Restaurante B',
        deliveryType: 'Entrega padrão',
        address: 'Avenida das Flores, 456',
        imageSource: 'https://images.unsplash.com/photo-1612020187640-c1d6bb844ab4?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        _id: '3',
        nameRestaurant: 'Restaurante C',
        deliveryType: 'Entrega rápida',
        address: 'Rua dos Jacarandás, 123',
        imageSource: 'https://images.unsplash.com/photo-1542039778-22c80bfeaa48?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        _id: '4',
        nameRestaurant: 'Restaurante D',
        deliveryType: 'Entrega padrão',
        address: 'Avenida das Flores, 456',
        imageSource: 'https://images.unsplash.com/photo-1612020187640-c1d6bb844ab4?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    ];
    setDeliveries(data);
    setIsLoading(false);
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.containerTitle}>
        <RotateCw stroke="#00A296" width={20} height={20} />
        <Text style={styles.title}>Histórico de entregas</Text>
      </View>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={deliveries}
          keyExtractor={item => item._id}
          renderItem={({ item, index }) => (
            <DeliveryCard
              isLoading={isLoading}
              imageSource={item.imageSource}
              nameRestaurant={item.nameRestaurant}
              deliveryType={item.deliveryType}
              address={item.address}
              index={index}
            />
          )}
        />
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
  containerTitle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    color: '#050505',
  },
});

export default Delivery;
