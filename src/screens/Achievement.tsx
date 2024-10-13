/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import ArrowLeftButton from '../components/ArrowLeftButton';
import { useNavigation } from '@react-navigation/native';
import { Award } from 'react-native-feather';
import AchievementItem from '../components/AchievementItem';
import { BASE_URL } from '../config/constants';

interface ObjectiveType {
  id: string;
  title: string;
  meta: number;
  trophyImage: string;
  id_campanha: string;
}

const Achievement = () => {
  const navigation = useNavigation();
  const [objectives, setObjectives] = useState<ObjectiveType[]>([]);

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const response = await fetch(`${BASE_URL}/objective/`);
        const data = await response.json();
        const completedObjectives = data.filter((obj: ObjectiveType) => obj.meta === 1)
          .map((obj: { id: string; titulo: string; meta: number; image: { url: string; }; id_campanha: string; }) => ({
            id: obj.id,
            title: obj.titulo,
            conquest: obj.meta,
            trophyImage: obj.image.url, 
            id_campaign: obj.id_campanha,
          }));
        setObjectives(completedObjectives);
      } catch (error) {
        console.error('Erro ao buscar objetivos:', error);
      }
    };

    fetchObjectives();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <ArrowLeftButton onPress={() => navigation.navigate({ name: 'ProfileScreen' } as never)} />
      <View style={styles.containerTitle}>
        <Award stroke="#00A296" width={20} height={20} />
        <Text style={styles.title}>Minhas conquistas</Text>
      </View>

      <ScrollView style={styles.containerList}>
        {objectives.map(obj => (
          <AchievementItem
            key={obj.id}
            title={obj.title} // ou qualquer outra propriedade que você precise passar
            trophyImage={obj.trophyImage}
            id_campaign={obj.id_campanha}
            conquest={obj.meta}
            navigation={navigation}
          />
        ))}
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
  containerList: {
    marginTop: 24,
    paddingBottom: 180,
  },
  containerTitle: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    color: '#050505',
  },
});

export default Achievement;