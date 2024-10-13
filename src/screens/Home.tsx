/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Eye } from 'react-native-feather';
import CarouselComponent from '../components/CarouselComponent';
import Objective from '../components/Objective';
import { NavigationProp } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import Header from '../components/Header';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import {BASE_URL} from '../config/constants';


interface ObjectiveType {
  id: string;
  title: string;
  progress: number;
  trophyImage: string;
  id_campanha: string;
}

export const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [objectives, setObjectives] = useState<ObjectiveType[]>([]);
  const [displayCount, setDisplayCount] = useState(1);
  const [showCompletedAnimation, setShowCompletedAnimation] = useState(false);
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(0);

  const fetchObjectives = async () => {
    try {
      const response = await fetch(`${BASE_URL}/objective`);
      const data = await response.json();
      const mappedObjectives = data.map((obj: { id: string; titulo: string; meta: number; image: { url: string; }, id_campanha: string; }) => ({
        id: obj.id,
        title: obj.titulo,
        progress: obj.meta,
        trophyImage: obj.image.url,
        id_campanha: obj.id_campanha,
      }));
      setObjectives(mappedObjectives);
      // console.log(mappedObjectives);
    } catch (error) {
      console.error('Erro ao buscar objetivos:', error);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const showAnimation = () => {
    opacity.value = withTiming(1, { duration: 1000 });
    translateY.value = withTiming(0, { duration: 1000 });
  };

  const hideAnimation = () => {
    opacity.value = withTiming(0, { duration: 1000 });
    translateY.value = withTiming(-20, { duration: 1000 });
  };

  const filteredObjectives = objectives
    .sort((a, b) => b.progress - a.progress)
    .slice(0, Math.min(displayCount, 3));

  const removeObjective = (id: string) => {
    setObjectives(prevObjectives => prevObjectives.filter(obj => obj.id !== id));
    setShowCompletedAnimation(true);
    setTimeout(() => {
      setShowCompletedAnimation(false);
    }, 7000);
  };

  useEffect(() => {
    fetchObjectives();
  }, []);

  useEffect(() => {
    if (showCompletedAnimation) {
      setTimeout(() => {
        showAnimation();
        setTimeout(() => {
          hideAnimation();
        }, 4000);
      }, 3000); 
    }
  }, [showCompletedAnimation]);

  useEffect(() => {
    const completedObjective = objectives.some(obj => obj.progress === 1);

    if (completedObjective) {
      setShowCompletedAnimation(true);
      setTimeout(() => {
        setShowCompletedAnimation(false);
      }, 15000);
    }
  }, [objectives]);

  useEffect(() => {
    if (displayCount < 3) {
      const interval = setInterval(() => {
        setDisplayCount(current => current + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [displayCount]);

  useEffect(() => {
    objectives.forEach((obj) => {
      if (obj.progress >= 1) {
        setTimeout(() => removeObjective(obj.id), 7000);
      }
    });
  }, [objectives]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Header />

        {showCompletedAnimation ? (
          <View style={styles.objectiveContainer}>
            <View style={styles.completedAnimationContainer}>
              <Image
                source={require('../assets/images/objective.png')}
                style={{ width: 32, height: 32 }}
              />
              <Text style={styles.categoryTitle}>Objetivos</Text>
            </View>
            <Animated.View style={[styles.completedAnimationContainer, animatedStyle]}>
              <LottieView
                source={require('../assets/animations/trophy.json')}
                autoPlay
                loop
                style={styles.successAnimation}
              />
              <Text style={styles.successTitle}>Objetivo concluído</Text>
            </Animated.View>
          </View>
        ) : (
          <View style={styles.categoryContainer}>
            <Image
              source={require('../assets/images/objective.png')}
              style={{ width: 32, height: 32 }}
            />
            <Text style={styles.categoryTitle}>Objetivos</Text>
          </View>
        )}



        <View style={styles.objectivesContainer}>
          {filteredObjectives.map(obj => (
            <Objective
              key={obj.id}
              id={obj.id}
              title={obj.title}
              trophyImage={obj.trophyImage}
              progress={obj.progress}
              onRemove={() => removeObjective(obj.id)}
              navigation={navigation}
              id_campanha={obj.id_campanha}
            />
          ))}
        </View>

        <View style={styles.campaignContainer}>
          <View style={styles.campaignTitle}>
            <Image
              source={require('../assets/images/campaign-icon.png')}
              style={{ width: 36, height: 36 }}
            />
            <Text style={styles.categoryTitle}>Campanhas</Text>
          </View>
          <TouchableOpacity style={styles.campaignsConsult}>
            <Eye stroke="#9A27CB" width={16} height={16} strokeWidth={1.25} />
            <Text style={styles.objectivesViewText}>Ver as campanhas</Text>
          </TouchableOpacity>

        </View>
        <View>
          <CarouselComponent />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F5FAFA',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 0,
    width: '100%',
    justifyContent: 'flex-start',
  },
  objectiveContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  completedAnimationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  successAnimation: {
    width: 24,
    height: 24,
  },
  successTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 12,
    color: '#00A296',
  },
  categoryTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    color: '#050505',
  },
  objectivesContainer: {
    borderWidth: 1,
    borderColor: '#D4D9D9',
    width: '100%',
    padding: 24,
    gap: 24,
    marginTop: 20,
    borderRadius: 16,
  },
  objectivesViewText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9A27CB',
  },
  campaignContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
  },
  campaignTitle: {
    flexDirection: 'row',
    gap: 12,
  },
  campaignsConsult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
})

export default Home;
