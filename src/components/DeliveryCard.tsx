/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Check, MapPin } from 'react-native-feather';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSpring, withTiming } from 'react-native-reanimated';

interface DeliveryCardProps {
    imageSource: string | { uri: string };
    nameRestaurant?: string;
    deliveryType?: string;
    address?: string;
    index?: number;
    isLoading?: boolean;
}

export const DeliveryCard: React.FC<DeliveryCardProps> = ({
    imageSource,
    nameRestaurant = "Nome do restaurante",
    deliveryType = "Entrega concluída",
    address = "Rua exemplo, 123",
    index = 0,
    isLoading = false,
}) => {
    const translateY = useSharedValue(-20);
    const opacity = useSharedValue(0);

    translateY.value = withDelay(
        300 * index,
        withSpring(0, { 
            damping: 20,
            stiffness: 80
        })
    );

    opacity.value = withDelay(
        300 * index,
        withTiming(1)
    );

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [
                {
                    translateY: translateY.value,
                },
            ],
        };
    });
    return (
        <Animated.View style={[styles.containerCard, animatedStyle]}>
            <View style={styles.containerTitle}>
                <Image style={styles.imageRestaurant} source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource} />
                <Text style={styles.titleCard}>{nameRestaurant}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.containerDescription}>
                <View style={styles.check}>
                    <Check stroke="#F5FAFA" width={12} height={12} />
                </View>
                <Text style={styles.descriptionCard}>{deliveryType}</Text>
            </View>
            <View style={styles.containerDescription}>
                <MapPin stroke="#00A296" width={20} height={20} />
                <Text style={styles.descriptionCard}>{address}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    containerCard: {
        marginBottom: 24,
        gap: 12,
        padding: 24,
        backgroundColor: '#F5FAFA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D4D9D9',

    },
    containerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    imageRestaurant: {
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: 'cover',
    },
    titleCard: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#050505',
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#D4D9D9',
    },
    containerDescription: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    descriptionCard: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#8F9494',
    },
    check: {
        backgroundColor: '#00A296',
        padding: 4,
        borderRadius: 12,
    },
});

export default DeliveryCard;