import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import robnerDefault from '../assets/images/robner-default.png';

interface ModalConfirmProps {
    isVisible: boolean;
    onClose?: () => void;
    onConfirm: () => void;
    text: string;
    imageUri?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    showCancelButton?: boolean;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
    isVisible,
    onClose,
    onConfirm,
    text,
    imageUri,
    confirmButtonText = 'Confirmar',
    cancelButtonText = 'Cancelar',
    showCancelButton = false,
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Image source={imageUri ? { uri: imageUri } : robnerDefault} style={styles.modalImage} />
                    <Text style={styles.modalText}>{text}</Text>
                    <View style={styles.buttonContainer}>
                        {showCancelButton ? (
                            <>
                                <TouchableOpacity onPress={onClose} style={styles.doubleButton}>
                                    <Text>{cancelButtonText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onConfirm} style={styles.doubleButton}>
                                    <Text>{confirmButtonText}</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity onPress={onConfirm} style={styles.singleButton}>
                                <Text>{confirmButtonText}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        width: 300,
        padding: 32,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 12,
        textAlign: 'center',
        color: '#050505',
        fontSize: 14,
        lineHeight: 20,
    },
    modalImage: {
        width: 44,
        height: 44,
        marginBottom: 12
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    singleButton: {
        width: '100%',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#00A296',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },

    doubleButton: {
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#00A296',
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        margin: 5,
    },
});

export default ModalConfirm;
