/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Eye, EyeOff} from 'react-native-feather';
import {useNavigation} from '@react-navigation/native';
import { AUTH_URL } from '../config/constants';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleEmailChange = (text: React.SetStateAction<string>) => {
    setEmail(text);
  };

  const handleEmailValidation = () => {
    if (!validateEmail(email)) {
      setEmail('');
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return regex.test(email);
  };

  const handlePasswordChange = (text: React.SetStateAction<string>) => {
    setPassword(text);
  };

  const handlePasswordValidation = () => {
    console.log('Senha:', password);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email, senha: password}),
      });
      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('access_token', data.access_token);
        await AsyncStorage.setItem('refresh_token', data.refresh_token);

        navigation.navigate({name: 'Main'} as never);
      } else {
        Alert.alert('Login falhou. Verifique seu email e senha');
      }
    } catch (error) {
      console.error('Erro ao fazer login: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/motoboy-login.png')}
        resizeMode="stretch"
        style={{marginTop: 120, width: '100%'}}
      />
      <View style={styles.contentForm}>
        <Text style={styles.title}>Faça seu login</Text>
        <TextInput
          placeholder="E-mail"
          style={[styles.input, {marginTop: 12}]}
          onChangeText={handleEmailChange}
          onBlur={handleEmailValidation}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <View style={{width: '100%'}}>
          <TextInput
            style={[styles.input, {marginTop: 12}]}
            placeholder="Digite sua senha"
            onChangeText={handlePasswordChange}
            onBlur={handlePasswordValidation}
            value={password}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.passwordIcon}
            onPress={togglePasswordVisibility}>
            {isPasswordVisible ? (
              <Eye stroke="#8F9494" fill="#fff" width={22} height={22} />
            ) : (
              <EyeOff stroke="#8F9494" fill="#fff" width={22} height={22} />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.buttonSignIn} onPress={handleLogin}>
          <Text style={styles.textButtonSignIn}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate({name: 'ForgotPassword'} as never)
          }>
          <Text style={styles.textForgotPassword}>
            puts, esqueci minha senha!
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.buttonSignUp}
        onPress={() => navigation.navigate({name: 'Register'} as never)}>
        <Text>Não tem uma conta?</Text>
        <Text style={styles.textButtonSignUp}>Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 48,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F5FAFA',
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    color: '#050505',
    marginBottom: 28,
  },
  contentForm: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 100,
    marginBottom: 100,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#E8EDED',
    width: '100%',
    borderRadius: 6,
  },
  buttonSignIn: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#00A296',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 24,
  },
  textButtonSignIn: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#F5FAFA',
  },
  textForgotPassword: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#626666',
    marginTop: 8,
  },
  buttonSignUp: {
    flexDirection: 'row',
    gap: 4,
    fontSize: 12,
    color: '#626666',
    fontFamily: 'Inter-Regular',
  },
  textButtonSignUp: {
    fontFamily: 'Inter-Bold',
    textDecorationLine: 'underline',
  },
  passwordIcon: {
    position: 'absolute',
    right: 25,
    top: 27,
  },
});

export default Login;
