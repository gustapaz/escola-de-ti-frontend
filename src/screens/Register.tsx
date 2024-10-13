/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import ArrowLeftButton from '../components/ArrowLeftButton';
import {TextInputMask} from 'react-native-masked-text';
import GreenButton from '../components/GreenButton';
import {Eye, EyeOff} from 'react-native-feather';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import GrayTextInput from '../components/GrayTextInput';
import {useNavigation} from '@react-navigation/native';
import {cpf, cnpj} from 'cpf-cnpj-validator';
import {isValid as isValidDate, parse} from 'date-fns';

export const Register = () => {
  const navigation = useNavigation();
  const [currentView, setCurrentView] = useState(1);
  const [checkboxStateBag, setCheckboxStateBag] = useState(false);
  const [checkboxStateTerm, setCheckboxStateTerm] = useState(false);
  const [formData, setFormData] = useState({
    CNPJ: '',
    CPF: '',
    nome: '',
    sobrenome: '',
    email: '',
    data_de_nascimento: '',
    senha: '',
    cidade: '',
    telefone: '',
    mochila: checkboxStateBag,
  });

  const handleNext: () => void = () => {
    setCurrentView(currentView + 1);
  };

  const handlePrevious: () => void = () => {
    setCurrentView(currentView - 1);
  };

  const handleLoginNavigation = () => {
    navigation.navigate({name: 'Login'} as never);
  };

  // FirstStep
  const [compareCode, setCompareCode] = useState('');

  const handleTelefoneValidation = () => {
    if (!formData.telefone.trim()) {
      Alert.alert('O celular é obrigatório');
      return false;
    }

    const telefoneLimpo = formData.telefone.replace(/[^0-9]/g, '');

    if (telefoneLimpo.length !== 11) {
      Alert.alert('O número de telefone deve ter 11 dígitos');
      return false;
    }

    return true;
  };

  const handleSubmitFirstStep = async () => {
    if (!handleTelefoneValidation()) {
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/sendNumber',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({telefone: formData.telefone}),
        },
      );
      if (response.ok) {
        const data = await response.json();

        console.log(data);
        setCompareCode(data);

        handleNext();
      } else {
        Alert.alert('Envio falhou. Verifique os dados');
      }
    } catch (error) {
      console.error('Erro ao fazer envio: ', error);
    }
  };

  // SecondStep
  const [code, setCode] = useState(['', '', '', '']);
  const refs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleCodeChange = (text: string, index: number) => {
    if (/^[0-9]$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (index < 3 && text !== '') {
        refs[index + 1]!.current!.focus();
      } else if (index > 0 && text === '') {
        refs[index - 1]!.current!.focus();
      }
    } else if (text === '') {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
    }
  };

  const handleCodeKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (
      event.nativeEvent.key === 'Backspace' &&
      code[index] === '' &&
      index > 0
    ) {
      refs[index - 1]!.current!.focus();
    }
  };

  const handleCodeValidation = () => {
    if (
      !code.join('').match(/^\d{4}$/) ||
      code.join('') !== compareCode.toString()
    ) {
      Alert.alert('Código de validação inválido');
      return false;
    }

    return true;
  };

  const handleSubmitSecondStep = async () => {
    if (!handleCodeValidation()) {
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/validateCode',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            telefone: formData.telefone,
            codigo: parseInt(code.join(''), 10),
          }),
        },
      );
      if (response.ok) {
        const data = await response.json();

        console.log(data);

        handleNext();
      } else {
        Alert.alert('Validação falhou. Verifique os dados');
      }
    } catch (error) {
      console.error('Erro ao fazer validação: ', error);
    }
  };

  // ThirdStep
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [areFieldsValid, setAreFieldsValid] = useState(false);

  const handleEmailValidation = () => {
    const email = formData.email;
    if (email && !validateEmail(email)) {
      setFormData({...formData, email: ''});
      Alert.alert('E-mail inválido');
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return regex.test(email);
  };

  const handlePasswordValidation = () => {
    const senha = formData.senha;

    if (!isStrongPassword(senha)) {
      Alert.alert(
        'A senha deve conter pelo menos 8 caracteres, 1 caractere especial, 1 número, 1 letra maiúscula e 1 letra minúscula',
      );
      return;
    }
  };

  const isStrongPassword = (password: string) => {
    const regex = /^(?=.*[!@#$%^&*])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };

  const handleTermValidation = () => {
    if (!checkboxStateTerm) {
      Alert.alert('Você deve concordar com os termos de uso');
      return false;
    }

    return true;
  };

  const handleCnpjValidation = () => {
    if (!cnpj.isValid(formData.CNPJ)) {
      setFormData({...formData, CNPJ: ''});
      Alert.alert('CNPJ inválido');
      return;
    }
  };

  const handleCpfValidation = () => {
    if (!cpf.isValid(formData.CPF)) {
      setFormData({...formData, CPF: ''});
      Alert.alert('CPF inválido');
      return;
    }
  };

  const handleNomeValidation = () => {
    const nome = formData.nome;

    if (!nome.trim()) {
      Alert.alert('Nome é obrigatório');
      return;
    }
  };

  const handleSobrenomeValidation = () => {
    const sobrenome = formData.sobrenome;

    if (!sobrenome.trim()) {
      Alert.alert('Sobrenome é obrigatório');
      return;
    }
  };

  const handleDataValidation = () => {
    const dataNascimento = formData.data_de_nascimento;

    if (!dataNascimento.trim()) {
      Alert.alert('Data de nascimento é obrigatória');
      return;
    }

    const parsedDate = parse(dataNascimento, 'dd/MM/yyyy', new Date());

    if (!isValidDate(parsedDate)) {
      setFormData({...formData, data_de_nascimento: ''});
      Alert.alert('Data de nascimento inválida');
      return;
    }
  };

  const handleCidadeValidation = () => {
    const cidade = formData.cidade;

    if (!cidade.trim()) {
      Alert.alert('Cidade é obrigatória');
      return;
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const acceptTerms = () => {
    setCheckboxStateTerm(true);
    handlePrevious();
  };

  const handleSubmitThirdStep = async () => {
    if (!handleTermValidation()) {
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      );
      if (response.ok) {
        const data = await response.json();

        console.log(data);

        handleLoginNavigation();
      } else {
        Alert.alert('Cadastro falhou. Verifique os dados');
      }
    } catch (error) {
      console.error('Erro ao fazer cadastro: ', error);
    }
  };

  useEffect(() => {
    const checkFieldsValidity = () => {
      const {
        CNPJ,
        CPF,
        nome,
        sobrenome,
        email,
        data_de_nascimento,
        senha,
        cidade,
      } = formData;

      if (
        CNPJ.trim() &&
        CPF.trim() &&
        nome.trim() &&
        sobrenome.trim() &&
        email.trim() &&
        data_de_nascimento.trim() &&
        senha.trim() &&
        cidade.trim() &&
        checkboxStateTerm
      ) {
        setAreFieldsValid(true);
      } else {
        setAreFieldsValid(false);
      }
    };

    checkFieldsValidity();
  }, [formData, checkboxStateTerm]);

  const renderView = () => {
    switch (currentView) {
      case 1:
        return (
          <View style={[styles.container, {alignItems: 'center'}]}>
            <ArrowLeftButton onPress={handlePrevious} />
            <Image
              source={require('../assets/images/logo-register-1.png')}
              resizeMode="contain"
              style={{marginBottom: 20, marginTop: 42}}
            />
            <Text style={styles.firstTitle}>
              Primeiro, vamos validar seu celular
            </Text>
            <Text style={[styles.subTitle, {marginTop: 12, marginBottom: 40}]}>
              Ele vai ser usado pra você entrar no app, blz?
            </Text>
            <TextInputMask
              style={styles.input}
              placeholder="DDD e celular"
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) ',
              }}
              value={formData.telefone}
              onChangeText={text => setFormData({...formData, telefone: text})}
            />
            <GreenButton
              onPress={handleSubmitFirstStep}
              extraStyles={{marginTop: 24}}
              text="Avançar"
            />
          </View>
        );
      case 2:
        return (
          <View style={[styles.container, {alignItems: 'center'}]}>
            <ArrowLeftButton onPress={handlePrevious} />
            <Image
              source={require('../assets/images/logo-register-2.png')}
              resizeMode="contain"
              style={{marginBottom: 20, marginTop: 42}}
            />
            <Text style={styles.secondTitle}>
              Digite aqui o código de validação
            </Text>
            <Text style={[styles.subTitle, {marginTop: 12, marginBottom: 24}]}>
              São 4 dígitos mandados por sms pra você.
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={refs[index]}
                  style={styles.code}
                  value={digit}
                  onChangeText={text => handleCodeChange(text, index)}
                  onKeyPress={event => handleCodeKeyPress(event, index)}
                  maxLength={1}
                  keyboardType="numeric"
                />
              ))}
            </View>
            <Text style={[styles.subTitle, {marginTop: 24}]}>
              Reenviar código (00:15)
            </Text>
            <GreenButton
              onPress={handleSubmitSecondStep}
              extraStyles={{marginTop: 24}}
              text="Validar"
            />
          </View>
        );
      case 3:
        return (
          <View style={[styles.container, {alignItems: 'flex-start'}]}>
            <ArrowLeftButton onPress={handlePrevious} />
            <Text style={[styles.thirdTitle, {marginTop: 12}]}>
              Tem mochila/bag?
            </Text>
            <BouncyCheckbox
              textStyle={styles.checkboxTextStyle}
              innerIconStyle={styles.checkboxInnerIconStyle}
              iconStyle={styles.checkboxIconStyle}
              fillColor="#00A296"
              style={styles.checkbox}
              isChecked={checkboxStateBag}
              text="Sim, já tenho bag."
              disableBuiltInState
              onPress={() => setCheckboxStateBag(!checkboxStateBag)}
            />
            <View style={styles.line} />
            <Text style={styles.thirdTitle}>Preencha seus dados</Text>
            <TextInputMask
              style={[styles.input, {marginTop: 12}]}
              placeholder="Seu MEI/CNPJ"
              type={'cnpj'}
              value={formData.CNPJ}
              onChangeText={text => setFormData({...formData, CNPJ: text})}
              onBlur={handleCnpjValidation}
            />
            <TextInputMask
              style={[styles.input, {marginTop: 12}]}
              placeholder="Seu CPF"
              type={'cpf'}
              value={formData.CPF}
              onChangeText={text => setFormData({...formData, CPF: text})}
              onBlur={handleCpfValidation}
            />
            <GrayTextInput
              placeholder="Nome"
              extraStyles={{marginTop: 12}}
              value={formData.nome}
              onChangeText={(text: string) =>
                setFormData({...formData, nome: text})
              }
              onBlur={handleNomeValidation}
            />
            <GrayTextInput
              placeholder="Sobrenome"
              extraStyles={{marginTop: 12}}
              value={formData.sobrenome}
              onChangeText={(text: string) =>
                setFormData({...formData, sobrenome: text})
              }
              onBlur={handleSobrenomeValidation}
            />
            <TextInput
              placeholder="E-mail"
              style={[styles.input, {marginTop: 12}]}
              onChangeText={text => setFormData({...formData, email: text})}
              onBlur={handleEmailValidation}
              value={formData.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <TextInputMask
              style={[styles.input, {marginTop: 12}]}
              placeholder="Data de nascimento"
              type={'datetime'}
              options={{
                format: 'DD/MM/YYYY',
              }}
              value={formData.data_de_nascimento}
              onChangeText={text =>
                setFormData({...formData, data_de_nascimento: text})
              }
              onBlur={handleDataValidation}
            />
            <View style={{width: '100%'}}>
              <TextInput
                style={[styles.input, {marginTop: 12}]}
                placeholder="Escolha uma senha"
                onChangeText={text => setFormData({...formData, senha: text})}
                onBlur={handlePasswordValidation}
                value={formData.senha}
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
            <GrayTextInput
              placeholder="Cidade"
              extraStyles={{marginTop: 12}}
              value={formData.cidade}
              onChangeText={(text: string) =>
                setFormData({...formData, cidade: text})
              }
              onBlur={handleCidadeValidation}
            />
            <View style={[styles.grayContainer, {marginTop: 12}]}>
              <BouncyCheckbox
                textStyle={styles.checkboxTextStyle}
                innerIconStyle={styles.checkboxInnerIconStyle}
                iconStyle={styles.checkboxIconStyle}
                fillColor="#00A296"
                style={styles.checkbox}
                isChecked={checkboxStateTerm}
                text="Eu li, entendi e estou de acordo com os termos de uso."
                disableBuiltInState
                onPress={
                  checkboxStateTerm
                    ? () => setCheckboxStateTerm(false)
                    : () => handleNext()
                }
              />
            </View>
            <GreenButton
              onPress={handleSubmitThirdStep}
              extraStyles={{
                marginTop: 24,
                marginBottom: 40,
                opacity: areFieldsValid ? 1 : 0.5,
              }}
              text="Finalizar"
              disabled={!areFieldsValid}
            />
          </View>
        );
      case 4:
        return (
          <View style={[styles.container, {alignItems: 'flex-start'}]}>
            <ArrowLeftButton onPress={handlePrevious} />
            <View
              style={[
                styles.grayContainer,
                {marginTop: 40, paddingVertical: 24},
              ]}>
              <Text style={styles.firstTitle}>
                Contrato de prestação de serviços de intermediação digital
              </Text>
              <Text style={[styles.text, {marginTop: 16}]}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                hendrerit pharetra felis finibus porttitor. Phasellus ut ex at
                erat maximus ullamcorper et eu libero. Sed id orci in erat
                lobortis dapibus. Nam facilisis egestas ex ut porta. Ut
                imperdiet placerat dolor eget porta. Maecenas nec pharetra nunc.
                Suspendisse enim quam, finibus vitae risus vitae, malesuada
                interdum eros. Sed ultrices elit fermentum turpis sodales, in
                tincidunt mauris consequat.
              </Text>
              <Text style={[styles.text, {marginTop: 16}]}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                hendrerit pharetra felis finibus porttitor. Phasellus ut ex at
                erat maximus ullamcorper et eu libero. Sed id orci in erat
                lobortis dapibus. Nam facilisis egestas ex ut porta. Ut
                imperdiet placerat dolor eget porta. Maecenas nec pharetra nunc.
                Suspendisse enim quam, finibus vitae risus vitae, malesuada
                interdum eros. Sed ultrices elit fermentum turpis sodales, in
                tincidunt mauris consequat.
              </Text>
            </View>
            <GreenButton
              onPress={acceptTerms}
              extraStyles={{marginTop: 24}}
              text="Aceitar"
            />
          </View>
        );
      default:
        return;
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      {renderView()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
  },
  firstTitle: {
    color: '#050505',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondTitle: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  thirdTitle: {
    color: '#050505',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
  },
  subTitle: {
    color: '#626666',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  input: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#E8EDED',
    color: '#0E0F0F',
    width: '100%',
    borderRadius: 6,
    fontSize: 14,
  },
  code: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    width: 52,
    height: 52,
    backgroundColor: '#E8EDED',
    color: '#0E0F0F',
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 32,
    fontWeight: '700',
    marginHorizontal: 6,
    borderRadius: 6,
  },
  checkbox: {
    alignSelf: 'flex-start',
    marginVertical: 16,
    borderRadius: 4,
  },
  checkboxTextStyle: {
    textDecorationLine: 'none',
    fontSize: 12,
    fontWeight: '700',
    color: '#0E0F0F',
    marginRight: 16,
  },
  checkboxInnerIconStyle: {
    borderRadius: 4,
    borderColor: '#0E0F0F',
  },
  checkboxIconStyle: {
    borderRadius: 4,
  },
  line: {
    width: '100%',
    borderBottomColor: '#BABFBF',
    borderBottomWidth: 0.5,
    marginVertical: 16,
  },
  passwordIcon: {
    position: 'absolute',
    right: 25,
    top: 27,
  },
  grayContainer: {
    width: '100%',
    backgroundColor: '#E8EDED',
    borderRadius: 6,
    paddingHorizontal: 24,
  },
  text: {
    color: '#8F9494',
    fontSize: 12,
    fontWeight: '400',
  },
});

export default Register;
