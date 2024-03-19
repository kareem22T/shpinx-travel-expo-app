import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AuthActions } from './../../actions';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform, Image 
} from 'react-native';
import { BaseStyle, useTheme } from './../../config';
import { Header, SafeAreaView, Icon, Text, Button, TextInput} from './../../components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { url } from '../../apis/a-MainVariables';
import TimerMixin from 'react-timer-mixin';
import * as SecureStore from 'expo-secure-store';

export default function SignIn({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({ id: true, password: true });
  const [errors, setErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  /**
   * call when action login
   *
   */

  const onLogin = async () => {
    setLoading(true);
    setErrors([])
    try {
      const response = await axios.post(`${url}/login`, {
        emailorphone: id,
        password: password,
      });

      if (response.data.status === true) {
        await SecureStore.setItemAsync('user_token', response.data.data.token)
        setSuccessMsg(response.data.message)
        setTimeout(() => {
          dispatch(AuthActions.authentication(true, response => { }));
          navigation.navigate('Home');
        }, 500);
      } else {
        setLoading(false);
        setErrors(response.data.errors);
        TimerMixin.setTimeout(() => {
          setErrors([]);
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      setErrors(["Server error, try again later."]);
      console.error(error);
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <Text style={{
          position: 'absolute', top:  50, right: 20, color: "#fff",
          padding: 1 * 16,
          marginLeft: 10,
          fontSize: 1 * 16,
          backgroundColor: '#e41749',
          fontFamily: 'Outfit_600SemiBold',
          borderRadius: 1.25 * 16,
          zIndex: 9999999999,
          display: errors.length ? 'flex' : 'none'
      }}>{errors.length ? errors[0] : ''}</Text>
      <Text style={{
          position: 'absolute', top:  50, right: 20, color: "#fff",
          padding: 1 * 16,
          marginLeft: 10,
          fontSize: 1 * 16,
          backgroundColor: '#12c99b',
          fontFamily: 'Outfit_600SemiBold',
          borderRadius: 1.25 * 16,
          zIndex: 9999999999,
          display: successMsg == '' ? 'none' : 'flex'
      }}>{successMsg}</Text>
      <Header
        title={t('sign_in')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{ flex: 1 }}>
          <View style={styles.contain}>
            <Image source={require("./../../assets/images/Sphinx.png")} style={{width: 220, height: 60, resizeMode: "contain", marginBottom: 30}} />
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={{flexDirection: "row", marginBottom: 15, gap: 5}}>
              <Text>{t("dont_have_account")}</Text>
              <Text style={{fontWeight: 700, color: colors.primary}}>{t("sign_up")}</Text>
            </TouchableOpacity>
            <TextInput
              onChangeText={text => setId(text)}
              onFocus={() => {
                setSuccess({
                  ...success,
                  id: true,
                });
              }}
              placeholder={t('email_or_phone')}
              success={success.id}
              value={id}
            />
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={text => setPassword(text)}
              onFocus={() => {
                setSuccess({
                  ...success,
                  password: true,
                });
              }}
              placeholder={t('password')}
              secureTextEntry={true}
              success={success.password}
              value={password}
            />
            <Button
              style={{ marginTop: 20 }}
              full
              loading={loading}
              onPress={() => {
                onLogin();
              }}>
              {t('sign_in')}
            </Button>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}>
              <Text body1 grayColor style={{ marginTop: 25 }}>
                {t('forgot_your_password')}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
