import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { UserCheck, Edit2, Save, Lock, AlertCircle } from 'react-native-feather';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import ArrowLeftButton from '../components/ArrowLeftButton';
import GrayTextInput from '../components/GrayTextInput';
import { MOTOBOY_URL } from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalConfirm from '../components/ModalConfirm';


export const Edit = () => {
    const navigation = useNavigation();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [cpf, setCpf] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [originalName, setOriginalName] = useState(name);
    const [originalLastName, setOriginalLastName] = useState(lastName);
    const [originalPhoneNumber, setOriginalPhoneNumber] = useState('');
    const [originalCity, setOriginalCity] = useState(city);
    const [token, setToken] = useState<string | null>('');
    const [isModalVisible, setModalVisible] = useState(false);

    const fetchUserData = useCallback(async () => {
        try {
            const response = await fetch(`${MOTOBOY_URL}/findOne`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const userData = await response.json();
                setName(userData.nome);
                setOriginalName(userData.nome);
                setLastName(userData.sobrenome);
                setOriginalLastName(userData.sobrenome);
                setCpf(userData.cpf);
                setCnpj(userData.cnpj);
                setPhoneNumber(userData.telefone);
                setOriginalPhoneNumber(userData.telefone);
                setCity(userData.cidade);
                setOriginalCity(userData.cidade);
            } else {
                const errorData = await response.text();
                console.error('Erro de busca:', errorData);
            }
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
        }
    }, [token]);

    const handleModalConfirmClick = async () => {
        const form = city === '' ?
            {
                nome: name,
                sobrenome: lastName,
                telefone: phoneNumber,
            }
            :
            {
                nome: name,
                sobrenome: lastName,
                telefone: phoneNumber,
                cidade: city,
            };
        try {
            const response = await fetch(`${MOTOBOY_URL}/update`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form)
            });
            if (response.status === 200) {
                setEditing(false);
            } else {
                console.error('Erro ao editar os dados:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao editar os dados:', error);
        }
        setModalVisible(false);
    };

    // Para buscar o token e definir
    useEffect(() => {
        const getToken = async () => {
            const storedToken = await AsyncStorage.getItem('access_token');
            if (storedToken) {
                setToken(storedToken);
            }
        };
        getToken();
    }, []);

    // Para buscar os dados do usuário
    useEffect(() => {
        if (token) {
            fetchUserData();
        }
    }, [token, fetchUserData]);

    const handleSaveClick = () => {
        setModalVisible(true);
    }

    const handleProfileNavigation = () => {
        navigation.navigate('ProfileScreen' as never);
    };

    const handleEditClick = () => {
        setEditing(!editing);
    }

    const handleNameValidation = () => {
        if (!name.trim()) {
            setName(originalName);
            Alert.alert('Nome é obrigatório.');
            return;
        }
    };

    const handleLastNameValidation = () => {
        if (!lastName.trim()) {
            setLastName(originalLastName);
            Alert.alert('Sobrenome é obrigatório.');
            return;
        }
    };

    const handlePhoneNumberValidation = () => {
        if (!phoneNumber.trim()) {
            setPhoneNumber(originalPhoneNumber);
            Alert.alert('O número do seu celular é obrigatório.');
            return;
        }

        if (phoneNumber.length !== 11) {
            setPhoneNumber(originalPhoneNumber);
            Alert.alert('O número deve conter 11 caracteres. Digite novamente.');
        }
    }

    const formatPhoneNumber = (phoneNumber: any) => {
        if (phoneNumber.length === 11) {
            return `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 7)}-${phoneNumber.substring(7, 11)}`;
        }
        return phoneNumber;
    };


    const formatCpfNumber = (cpf: any) => {
        if (cpf.length === 11) {
            return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
        }
        return cpf;
    }

    const formatCnpjNumber = (cnpj: any) => {
        if (cnpj.length === 14) {
            return `${cnpj.substring(0, 2)}.${cnpj.substring(2, 5)}.${cnpj.substring(5, 8)}/${cnpj.substring(8, 12)}-${cnpj.substring(12, 14)}`;
        }
        return cnpj;
    }

    return (
        <>
            <ModalConfirm
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={handleModalConfirmClick}
                text="Tem certeza de que deseja alterar seus dados?"
                showCancelButton={true}
                cancelButtonText='Não'
                confirmButtonText="Sim"
            />
            <ScrollView>
                <View style={styles.container}>
                    <Header />
                    {editing ? (
                        <ArrowLeftButton onPress={() => {
                            setName(originalName);
                            setLastName(originalLastName);
                            setPhoneNumber(originalPhoneNumber);
                            setCity(originalCity);
                            setEditing(!editing);
                        }} />
                    ) : (
                        <ArrowLeftButton onPress={handleProfileNavigation} />
                    )}
                    <View style={styles.row}>
                        <UserCheck stroke="#00A296" width={22} height={22} />
                        <Text style={styles.firstTitle}>Alterar dados</Text>
                    </View>
                    {editing ? (
                        <View style={styles.listInputs}>
                            <View>
                                <Text style={styles.textPlaceholder}>Nome</Text>
                                <GrayTextInput
                                    value={name}
                                    onChangeText={(value) => setName(value)}
                                    onBlur={handleNameValidation}
                                    editable={editing}
                                />
                            </View>
                            <View>
                                <Text style={styles.textPlaceholder}>Sobrenome</Text>
                                <GrayTextInput
                                    value={lastName}
                                    onChangeText={(value) => setLastName(value)}
                                    onBlur={handleLastNameValidation}
                                    editable={editing}
                                />
                            </View>
                            <View>
                                <View style={styles.containerAlert}>
                                    <AlertCircle stroke="#FC3E39" width={16} height={16} />
                                    <Text style={styles.textAlert}>Não é possível alterar o CPF</Text>
                                </View>
                                <View style={styles.inputLock}>
                                    <View>
                                        <Text style={styles.textPlaceholderLock}>CPF</Text>
                                        <Text style={styles.textValue}>{formatCpfNumber(cpf)}</Text>
                                    </View>
                                    <Lock stroke="#FC3E39" width={16} height={16} />
                                </View>
                            </View>
                            <View>
                                <View style={styles.containerAlert}>
                                    <AlertCircle stroke="#FC3E39" width={16} height={16} />
                                    <Text style={styles.textAlert}>Não é possível alterar o CNPJ</Text>
                                </View>
                                <View style={styles.inputLock}>
                                    <View>
                                        <Text style={styles.textPlaceholderLock}>CNPJ</Text>
                                        <Text style={styles.textValue}>{formatCnpjNumber(cnpj)}</Text>
                                    </View>
                                    <Lock stroke="#FC3E39" width={16} height={16} />
                                </View>
                            </View>
                            <View>
                                <Text style={styles.textPlaceholder}>Número de celular</Text>
                                <GrayTextInput
                                    value={phoneNumber}
                                    onChangeText={(value) => {
                                        if (value.length <= 11) {
                                            setPhoneNumber(value);
                                        }
                                    }}
                                    onBlur={handlePhoneNumberValidation}
                                    maxLength={11}
                                    editable={editing}
                                    keyboardType='numeric'
                                />
                            </View>
                            <View>
                                <Text style={styles.textPlaceholder}>Cidade local</Text>
                                <GrayTextInput
                                    value={city}
                                    onChangeText={(value) => setCity(value)}
                                    onBlur={() => {}}
                                    editable={editing}
                                    placeholder='Aguardando cidade...'
                                />
                            </View>
                            <TouchableOpacity style={styles.button} onPress={handleSaveClick}>
                                <Save stroke="#F5FAFA" width={16} height={16} />
                                <Text style={styles.textButton}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.listInputs}>
                            <View style={styles.inputLock}>
                                <View>
                                    <Text style={styles.textPlaceholderLock}>Nome</Text>
                                    <Text style={styles.textValue}>{name}</Text>
                                </View>
                                <Lock stroke="#FC3E39" width={16} height={16} />
                            </View>
                            <View style={styles.inputLock}>
                                <View>
                                    <Text style={styles.textPlaceholderLock}>Sobrenome</Text>
                                    <Text style={styles.textValue}>{lastName}</Text>
                                </View>
                                <Lock stroke="#FC3E39" width={16} height={16} />
                            </View>
                            <View style={styles.inputLock}>
                                <View>
                                    <Text style={styles.textPlaceholderLock}>CPF</Text>
                                    <Text style={styles.textValue}>{formatCpfNumber(cpf)}</Text>
                                </View>
                                <Lock stroke="#FC3E39" width={16} height={16} />
                            </View>
                            <View style={styles.inputLock}>
                                <View>
                                    <Text style={styles.textPlaceholderLock}>CNPJ</Text>
                                    <Text style={styles.textValue}>{formatCnpjNumber(cnpj)}</Text>
                                </View>
                                <Lock stroke="#FC3E39" width={16} height={16} />
                            </View>
                            <View style={styles.inputLock}>
                                <View>
                                    <Text style={styles.textPlaceholderLock}>Número de celular</Text>
                                    <Text style={styles.textValue}>{formatPhoneNumber(phoneNumber)}</Text>
                                </View>
                                <Lock stroke="#FC3E39" width={16} height={16} />
                            </View>
                            <View style={styles.inputLock}>
                                <View>
                                    <Text style={styles.textPlaceholderLock}>Cidade local</Text>
                                    <Text style={styles.textValue}>{city}</Text>
                                </View>
                                <Lock stroke="#FC3E39" width={16} height={16} />
                            </View>
                            <TouchableOpacity style={styles.button} onPress={handleEditClick}>
                                <Edit2 stroke="#F5FAFA" width={16} height={16} />
                                <Text style={styles.textButton}>Editar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </>
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
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    firstTitle: {
        color: '#050505',
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginLeft: 12,
    },
    listInputs: {
        marginTop: 16,
        gap: 16,
    },
    button: {
        width: '100%',
        paddingVertical: 16,
        backgroundColor: '#00A296',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        flexDirection: 'row',
    },
    textButton: {
        color: '#F5FAFA',
        fontSize: 14,
        fontWeight: 'bold',
    },
    inputLock: {
        width: '100%',
        backgroundColor: '#E8EDED',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textPlaceholderLock: {
        fontSize: 10,
        color: '#626666',
    },
    textValue: {
        fontSize: 14,
        color: '#626666',
    },
    textPlaceholder: {
        fontSize: 16,
        color: '#1F2121',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    containerAlert: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        marginBottom: 8,
    },
    textAlert: {
        color: '#FC3E39',
        fontSize: 12,
    }
});

export default Edit;