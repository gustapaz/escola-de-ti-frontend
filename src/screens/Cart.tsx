/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ArrowLeftButton from '../components/ArrowLeftButton';
import { CART_URL } from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import LoadingIndicator from '../components/LoadingIndicator';
import { ShoppingCart } from 'react-native-feather';

interface CartData {
  itens: [
    {
      nome: string;
      valor: number;
    },
  ];
  valor_total: number;
}

type CartParamList = {
  Cart: { cartId: string; productId: string };
};

export const Cart = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<CartParamList, 'Cart'>>();
  const cartId = route.params.cartId;
  const productId = route.params.productId;
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>('');

  const getToken = async () => {
    setToken(await AsyncStorage.getItem('access_token'));
  };

  const handleProductDetailNavigation = () => {
    navigation.navigate('ProductDetail', { productId: productId });
  };

  const handleHomeNavigation = () => {
    navigation.navigate('HomeScreen' as never);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${CART_URL}/finish/${cartId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        handleHomeNavigation();
        //colocar popup antes falando que foi sucesso
      } else {
        const error: Error = new Error('Finalizar compra falhou.');
        setError(error.message);
        setLoading(false);
      }
    } catch (error) {
      const errorObj: Error = new Error(
        'Erro ao finalizar compra: ' + (error as Error).message,
      );
      setError(errorObj.message);
      setLoading(false);
    }
  };

  const handleRemoveItem = async () => {
    try {
      const response = await fetch(`${CART_URL}/finish/${cartId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // atualizar carrinho depois que fazer o evento
      } else {
        const error: Error = new Error('Remover item falhou.');
        setError(error.message);
        setLoading(false);
      }
    } catch (error) {
      const errorObj: Error = new Error(
        'Erro ao remover item: ' + (error as Error).message,
      );
      setError(errorObj.message);
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await fetch(`${CART_URL}/finish/${cartId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // atualizar carrinho depois que fazer o evento
      } else {
        const error: Error = new Error('Esvaziar carrinho falhou.');
        setError(error.message);
        setLoading(false);
      }
    } catch (error) {
      const errorObj: Error = new Error(
        'Erro ao esvaziar carrinho: ' + (error as Error).message,
      );
      setError(errorObj.message);
      setLoading(false);
    }
  };

  const fetchCartData = async () => {
    try {
      const response = await fetch(`${CART_URL}/itens`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCartData(data);
        setLoading(false);
      } else {
        const error: Error = new Error('Listar carrinho falhou.');
        setError(error.message);
        setLoading(false);
      }
    } catch (error) {
      const errorObj: Error = new Error(
        'Erro ao listar carrinho: ' + (error as Error).message,
      );
      setError(errorObj.message);
      setLoading(false);
    }
  };

  function limitText(description: string, maxLength: number) {
    if (description.length <= maxLength) {
      return description;
    } else {
      return description.substring(0, maxLength) + '...';
    }
  }

  const renderCartData = () => {
    if (loading) {
      return <LoadingIndicator />;
    }

    if (error) {
      return (
        <Text
          style={{ flex: 1, textAlign: 'center', textAlignVertical: 'center' }}>
          Erro: {error}
        </Text>
      );
    }

    return (
      <ScrollView>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          {cartData?.itens.map((item: any, index: number) => (
            <View key={index} style={styles.itemContainer}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image source={{ uri: item.url }} style={styles.productImage} />
                <View
                  style={{
                    marginLeft: 12,
                    justifyContent: 'space-between',
                    alignSelf: 'stretch',
                  }}>
                  <Text style={styles.thirdTitle}>
                    {limitText(item.nome, 20)}
                  </Text>
                  <Text style={styles.fourthTitle}>
                    Quantidade: {item.quantidade}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginLeft: 12,
                  justifyContent: 'space-between',
                  alignSelf: 'stretch',
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.valueText, { marginRight: 4 }]}>
                    {item.valor}
                  </Text>
                  <Image
                    source={require('../assets/images/aiqcoin-campaign.png')}
                    resizeMode="contain"
                  />
                </View>
                <TouchableOpacity onPress={handleRemoveItem}>
                  <Text style={styles.fourthTitle}>
                    Remover item
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.fourthTitle}>
              Esvaziar carrinho
            </Text>
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 24,
            }}>
            <Text style={[styles.secondTitle, { marginRight: 4 }]}>Total:</Text>
            <Text style={[styles.valueText, { marginRight: 4 }]}>
              {cartData?.valor_total}
            </Text>
            <Image
              source={require('../assets/images/aiqcoin-campaign.png')}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <ShoppingCart stroke="#F5FAFA" width={16} height={16} />
            <Text style={styles.textButton}>Finalizar compra</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  useEffect(() => {
    getToken();

    if (cartId && token) {
      fetchCartData();
    }
  }, [cartId, token]);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Header />
        <ArrowLeftButton onPress={handleProductDetailNavigation} />
      </View>
      {renderCartData()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
  },
  firstTitle: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondTitle: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'left',
  },
  thirdTitle: {
    color: '#050505',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'left',
  },
  fourthTitle: {
    color: '#050505',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'left',
  },
  subTitle: {
    color: '#626666',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  valueText: {
    color: '#7B1FA2',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D4D9D9',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#00A296',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexDirection: 'row',
    marginTop: 24,
  },
  textButton: {
    color: '#F5FAFA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productImage: {
    height: 86,
    width: 106,
    borderRadius: 8,
  },
  textForgotPassword: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#626666',
    marginTop: 8,
  },
});

export default Cart;
