/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { CheckCircle } from 'react-native-feather';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface AchievementItemProps {
    title: string;
    conquest: number;
    trophyImage: string | ImageSourcePropType;
    id_campaign: string;
    navigation: any;
}

export const AchievementItem = (props: AchievementItemProps) => {
    const imageSource = typeof props.trophyImage === 'string' ? { uri: props.trophyImage } : props.trophyImage;
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(-20);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 1000 });
        translateY.value = withTiming(0, { duration: 1000 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateY: translateY.value }],
        };
    });

    const navigateToCampaign = () => {
        props.navigation.navigate('Campaign', { campaignId: props.id_campaign });
    }

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity style={styles.containerItem} onPress={navigateToCampaign}>
                <View style={styles.containerTitleItem}>
                    <Image source={imageSource} style={styles.imageAchievement} />
                    <Text style={styles.titleItem}>{props.title}</Text>
                </View>
                <View style={styles.containerFinish}>
                    <CheckCircle stroke="#00A296" width={20} height={20} strokeWidth={1.5} />
                    <Text style={styles.textData}>Objetivo concluído</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
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
    containerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#D4D9D9',
    },
    containerTitleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    titleItem: {
        fontFamily: 'Inter-SemiBold',
        color: '#1F2121',
        fontSize: 14,
        maxWidth: 135,
    },
    containerFinish: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    textData: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#8F9494',
    },
    imageAchievement: {
        width: 32,
        height: 32,
    },
});

export default AchievementItem;