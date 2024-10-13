import React, { useEffect, useState } from "react";
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageSourcePropType,
} from 'react-native';
import { ChevronRight } from 'react-native-feather';
import * as Progress from 'react-native-progress';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

interface ObjectiveCardProps {
    id: string;
    title: string;
    progress: number;
    trophyImage: string | ImageSourcePropType;
    onRemove: () => void;
    navigation: any;
    id_campanha: string;
}

export const Objective = (props: ObjectiveCardProps) => {
    const titleObjective = props.title.length > 20 ? props.title.substring(0, 20) + '...' : props.title;
    const imageSource = typeof props.trophyImage === 'string' ? { uri: props.trophyImage } : props.trophyImage;
    const isCompleted = props.progress >= 1;

    const animatedProgress = useSharedValue(0);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(-20);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateY: translateY.value }],
        };
    });

    const getProgressBarColor = (progress: number) => {
        if (progress >= 1) {
            return '#1CCABD'; // 100%
        } else if (progress >= 0.71) {
            return '#C76CEE'; // 71% - 99%
        } else if (progress >= 0.36) {
            return '#9A27CB'; // 36% - 70%
        } else {
            return '#FF5891'; // 0% - 35%
        }
    };

    const navigateToCampaign = () => {
        props.navigation.navigate('Campaign', {campaignId: props.id_campanha});
    }

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 1000 });
        translateY.value = withTiming(0, { duration: 1000 });
        animatedProgress.value = withTiming(props.progress, { duration: 1000, easing: Easing.ease });
    }, []);
    
    useEffect(() => {
        if (isCompleted) {
            setTimeout(() => {
                opacity.value = withTiming(0, { duration: 1000 });
                translateY.value = withTiming(-20, { duration: 1000 });
                setTimeout(props.onRemove, 3000);
            }, 7000);
        }
    }, [animatedProgress.value]);

    return (
        <Animated.View style={[styles.objectiveContainer, animatedStyle]}>
            <Image
                source={imageSource}
                style={{ width: 40, height: 40 }}
            />
            <View>
                <Text style={styles.objectiveTitle}>{titleObjective}</Text>
                <Progress.Bar
                    progress={animatedProgress.value}
                    width={159}
                    height={14}
                    borderWidth={0}
                    unfilledColor='#E8EDED'
                    borderRadius={8}
                    color={isCompleted ? '#1CCABD' : getProgressBarColor(animatedProgress.value)}
                />
            </View>
            <View style={styles.containerPercentage}>
                <Text style={[styles.textPercentageBold, { color: getProgressBarColor(animatedProgress.value) }]}>{`${Math.round(props.progress * 100)}%`}</Text>
                <Text style={[styles.textPercentage, { color: getProgressBarColor(animatedProgress.value) }]}>concluído</Text>
            </View>
            <TouchableOpacity onPress={navigateToCampaign}>
                <ChevronRight stroke="#8F9494" width={24} height={24} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    objectiveContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    objectiveTitle: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 14,
        color: '#1F2121',
        marginBottom: 2,
    },
    containerPercentage: {
        alignItems: 'center',
        gap: -2,
        justifyContent: 'center',
    },
    textPercentageBold: {
        fontFamily: 'Inter-Bold',
        fontSize: 14,
        color: '#9A27CB',
    },
    textPercentage: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 12,
    },
});

export default Objective;