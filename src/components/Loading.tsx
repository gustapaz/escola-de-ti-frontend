import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const typingText = "Carregando...";

const Loading: React.FC = () => {
    const [visibleChars, setVisibleChars] = useState(0);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleChars((prevChars) => {
                if (prevChars === typingText.length && direction === 1) {
                    setDirection(-1);
                    return prevChars - 1;
                }
                if (prevChars === 0 && direction === -1) {
                    setDirection(1);
                    return prevChars + 1;
                }
                return prevChars + direction;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [direction]);

    return (
        <View style={styles.containerLoading}>
            <LottieView
            source={require('../assets/animations/loading.json')}
            autoPlay
            loop={true}
            style={styles.iconLoading}
            resizeMode='cover'
          />
            <Text style={styles.textLoading}>
                {typingText.substring(0, visibleChars)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    containerLoading: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 20,
        marginTop: 40,
    },
    textLoading: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#050505',
    },
    iconLoading: {
        width: 40,
        height: 40,
        marginTop: -4,
        marginLeft: -4,
    },
});

export default Loading;
