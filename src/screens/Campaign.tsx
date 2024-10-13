/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import GreenButton from '../components/GreenButton';
import ArrowLeftButton from '../components/ArrowLeftButton';
import { BASE_URL, CAMPAIGN_URL, REGISTERED_URL } from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import LoadingIndicator from '../components/LoadingIndicator';
import ModalConfirm from '../components/ModalConfirm';

interface Objective {
  descricao: string;
  id: string;
  id_campanha: string;
  imagem: string; // URL da imagem
  meta: number;
  premio_associado: number;
  titulo: string;
}

interface CampaignData {
  tipo: string;
  objetivos: Objective[];
  inscrito: boolean;
  imagem: { url: string };
}

type CampaignParamList = {
  Campaign: { campaignId: string };
};

export const Campaign = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CampaignParamList, 'Campaign'>>();
  const campaignId = route.params.campaignId;
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showParticipateButton, setShowParticipateButton] = useState(true);

  const getToken = async () => {
    setToken(await AsyncStorage.getItem('access_token'));
  };

  const handleHomeNavigation = () => {
    navigation.navigate('HomeScreen' as never);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_campanha: campaignId,
          id_entregador: '75a6de96-bed4-4266-97b1-99a5f79a829d',
        }),
      });
      if (response.ok) {
        fetchCampaignData();
        setIsModalVisible(true);
      } else {
        const error = await response.text();
        setError(`Falha ao participar da campanha: ${error}`);
      }
    } catch (error) {
      const errorObj: Error = new Error(
        'Erro ao participar da campanha: ' + (error as Error).message,
      );
      setError(errorObj.message);
      setLoading(false);
    }
  };

  const fetchCampaignData = async () => {
    try {
      const response = await fetch(`${CAMPAIGN_URL}/${campaignId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCampaignData(data);
        setLoading(false);
      } else {
        const error: Error = new Error('Listar campanha falhou.');
        setError(error.message);
        setLoading(false);
      }
    } catch (error) {
      const errorObj: Error = new Error(
        'Erro ao listar campanha: ' + (error as Error).message,
      );
      setError(errorObj.message);
      setLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setIsModalVisible(false);
    setShowParticipateButton(false);
  };

  const renderModal = () => {
    return (
      <ModalConfirm
        isVisible={isModalVisible}
        onConfirm={handleModalConfirm}
        text="Você está participando da campanha"
        confirmButtonText="Ok!"
      />
    );
  };

  function limitText(description: string, maxLength: number) {
    if (description.length <= maxLength) {
      return description;
    } else {
      return description.substring(0, maxLength) + '...';
    }
  }

  useEffect(() => {
    getToken();

    if (campaignId && token) {
      fetchCampaignData();
    }
  }, [campaignId, token]);

  const renderCampaignData = () => {
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../assets/images/icon-campaign.png')}
            resizeMode="contain"
            style={{ marginBottom: 10, marginTop: 8 }}
          />
          <Text style={styles.firstTitle}>{campaignData?.tipo}</Text>
          <Image
            source={{ uri: campaignData?.imagem.url }}
            style={{ marginBottom: 24, marginTop: 24, borderRadius: 16, height: 150, width: 342, }}
          />
        </View>
        <View>
          <Text style={[styles.secondTitle, { marginBottom: 16 }]}>
            Objetivos
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          {campaignData?.objetivos.map((objective: any, index: number) => (
            <View key={index} style={styles.objectiveContainer}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={{ uri: objective.imagem }}
                  resizeMode="contain"
                  style={{ width: 32, height: 32, }}
                />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.thirdTitle}>
                    {limitText(objective.titulo, 20)}
                  </Text>
                  <Text style={styles.subTitle}>
                    {limitText(objective.descricao, 20)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={[styles.valueText, { marginRight: 4 }]}>
                  {objective.premio_associado}
                </Text>
                <Image
                  source={require('../assets/images/aiqcoin-campaign.png')}
                  resizeMode="contain"
                />
              </View>
            </View>
          ))}
          {showParticipateButton && (
            <GreenButton
              onPress={handleSubmit}
              extraStyles={{ marginTop: 24 }}
              text="Participar da campanha"
            />
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Header />
        <ArrowLeftButton onPress={handleHomeNavigation} />
      </View>
      {renderCampaignData()}
      {renderModal()}
    </ScrollView>
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
  objectiveContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D4D9D9',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
});

export default Campaign;
