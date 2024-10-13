/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {PRODUCTS_URL} from '../config/constants';
import Header from '../components/Header';
import ArrowLeftButton from '../components/ArrowLeftButton';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {Bookmark, Plus, Minus} from 'react-native-feather';
import LoadingIndicator from '../components/LoadingIndicator';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CART_URL} from '../config/constants';

interface ProductData {
  imagem: {
    url: string;
  };
  id: string;
  nome: string;
  descricao: string;
  valor: number;
  stock: {
    quantidade: number;
  };
}

type ProductParamList = {
  ProductDetail: {productId: string};
};

const ProductDetail = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ProductParamList, 'ProductDetail'>>();
  const productId = route.params.productId;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [token, setToken] = useState<string | null>('');
  const [quantity, setQuantity] = useState<number>(1);

  const getToken = async () => {
    setToken(await AsyncStorage.getItem('access_token'));
  };

  const fetchProductData = async () => {
    try {
      const response = await fetch(`${PRODUCTS_URL}/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } else {
        const error: Error = new Error('Listar produto falhou.');
        setError(error.message);
        setLoading(false);
      }
    } catch (error) {
      const errorObj: Error = new Error(
        'Erro ao listar produto: ' + (error as Error).message,
      );
      setError(errorObj.message);
      setLoading(false);
    }
  };

  const handleStoreNavigation = () => {
    navigation.navigate('StoreScreen' as never);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < product?.stock.quantidade!) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${CART_URL}/add/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantidade: quantity,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        navigation.navigate('Cart', {productId: productId, cartId: data.id});
      } else {
        const error: Error = new Error('Adicionar produto ao carrinho falhou.');
        setError(error.message);
        setLoading(false);
      }
    } catch (error) {
      const errorObj: Error = new Error(
        'Erro ao adicionar produto no carrinho: ' + (error as Error).message,
      );
      setError(errorObj.message);
      setLoading(false);
    }
  };

  const renderProductData = () => {
    if (loading) {
      return <LoadingIndicator />;
    }

    if (error) {
      return (
        <Text
          style={{flex: 1, textAlign: 'center', textAlignVertical: 'center'}}>
          Erro: {error}
        </Text>
      );
    }

    return (
      <>
        <Image
          source={{uri: product?.imagem.url}}
          style={styles.productImage}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            marginTop: 24,
          }}>
          <Text style={styles.productPrice}>{product?.valor}</Text>
          <Image
            source={require('../assets/images/aiqcoin-campaign.png')}
            resizeMode="contain"
          />
          <Text style={styles.text}>/ un.</Text>
        </View>
        <Text style={styles.productName}>{product?.nome}</Text>
        <Text style={styles.productDescription}>{product?.descricao}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={handleDecreaseQuantity}>
            <Minus width={20} height={20} stroke="#BABFBF" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={handleIncreaseQuantity}>
            <Plus width={20} height={20} stroke="#BABFBF" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            {opacity: product?.stock.quantidade! > 0 ? 1 : 0.5},
          ]}
          onPress={handleSubmit}
          disabled={product?.stock.quantidade! <= 0}>
          <Bookmark stroke="#F5FAFA" width={16} height={16} />
          <Text style={styles.textButton}>Resgatar produto</Text>
        </TouchableOpacity>
      </>
    );
  };

  useEffect(() => {
    getToken();

    if (productId && token) {
      fetchProductData();
    }
  }, [productId, token]);

  return (
    <View style={styles.container}>
      <Header />
      <ArrowLeftButton onPress={handleStoreNavigation} />
      {renderProductData()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  productImage: {
    height: 278,
    width: '100%',
    marginTop: 12,
    borderRadius: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#050505',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: '#626666',
    marginLeft: 4,
  },
  productDescription: {
    fontSize: 14,
    fontWeight: '700',
    color: '#626666',
    marginTop: 12,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7B1FA2',
    marginRight: 4,
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderColor: '#D4D9D9',
    borderWidth: 1,
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 12,
  },
});

export default ProductDetail;
