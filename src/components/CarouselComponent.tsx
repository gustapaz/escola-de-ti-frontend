import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {CAMPAIGN_URL} from '../config/constants';

const {width} = Dimensions.get('window');

interface CampaignItem {
  id: string;
  imagem: { 
    id: string;
    id_origem: string;
    url: string;
  };
}

interface ImageItem {
  source: {
    uri: string;
  };
  id: string;
}

const CarouselComponent = () => {
  const navigation = useNavigation<any>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState<ImageItem[]>([]);

  const renderItem = ({item, index}: {item: any; index: any}) => {
    let imageSource = item.source;

    return (
      <View style={styles.viewCarrossel}>
        <TouchableOpacity
          onPress={async () => {
            navigation.navigate('Campaign', {campaignId: item.id});
          }}>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>
      </View>
    );
  };

  const fetchCampaignData = async () => {
    try {
      const response = await fetch(`${CAMPAIGN_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data: CampaignItem[] = await response.json();
        const campaignData: ImageItem[] = data.map((campaign) => ({
            source: {uri: campaign.imagem.url},
            id: campaign.id,
          }),
        );

        setImages(campaignData);
      } else {
        const error: Error = new Error('Listar campanha falhou.');
        console.log(error.message);
      }
    } catch (error) {
      const errorObj: Error = new Error(
        'Erro ao listar campanha: ' + (error as Error).message,
      );
      console.log(errorObj.message);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, []);

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Carousel
        data={images}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        layout="default"
        loop
        autoplay
        onSnapToItem={index => setActiveIndex(index)}
      />
      <Pagination
        dotsLength={images.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotStyle={styles.paginationInactiveDot}
        inactiveDotScale={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewCarrossel: {
    width: width,
    paddingHorizontal: 24,
    marginTop: 20,
    justifyContent: 'center',
  },
  image: {
    borderRadius: 20,
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    top: 160,
  },
  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00A296',
  },
  paginationInactiveDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D4D9D9',
  },
});

export default CarouselComponent;
