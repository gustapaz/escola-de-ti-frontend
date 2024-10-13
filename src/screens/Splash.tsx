/* eslint-disable prettier/prettier */
import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

export const Splash = () => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
                source={require('../assets/animations/splash-screen-robner-aiqpontos.json')}
                autoPlay
                loop={false}
                resizeMode='cover'
                onAnimationFinish={() => navigation.navigate({ name: 'Login' } as never)}
            />
        </View>
    );

};
export default Splash;