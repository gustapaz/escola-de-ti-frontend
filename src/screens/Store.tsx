/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {PRODUCTS_URL} from '../config/constants';
import Header from '../components/Header';
import LoadingIndicator from '../components/LoadingIndicator';

export const Store = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState([]);

  const fetchProductsData = async () => {
    try {
      const response = await fetch(`${PRODUCTS_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const productsData = data.map(
          (product: {
            imagem: {url: string};
            id: string;
            nome: string;
            valor: number;
          }) => ({
            url: product.imagem.url,
            id: product.id,
            name: product.nome,
            price: product.valor,
          }),
        );

        setProducts(productsData);
        setLoading(false);
      } else {
        const error: Error = new Error('Listar produtos falhou.');
        setError(error.message);
        setLoading(false);
      }
    } catch (error) {
      const errorObj: Error = new Error(
        'Erro ao listar produtos: ' + (error as Error).message,
      );
      setError(errorObj.message);
      setLoading(false);
    }
  };

  const renderProductItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={async () => {
        navigation.navigate('ProductDetail', {productId: item.id});
      }}>
      <Image source={{uri: item.url}} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Image
          source={require('../assets/images/aiqcoin-campaign.png')}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );

  const renderProductsData = () => {
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
      <FlatList
        showsVerticalScrollIndicator={false}
        data={products}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={renderProductItem}
      />
    );
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      {renderProductsData()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  productContainer: {
    margin: 10,
    padding: 16,
    borderColor: '#D4D9D9',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    height: 105,
    width: 129,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#050505',
    marginVertical: 16,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7B1FA2',
    marginRight: 4,
  },
});

export default Store;
