import React, {useState, useEffect} from 'react';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import {BaseStyle, useTheme} from './../../config';
import {Header, SafeAreaView, Icon, Button, TextInput, Text, Image} from './../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';
import * as SecureStore from 'expo-secure-store';
import { url } from '../../apis/a-MainVariables';
import { AntDesign } from '@expo/vector-icons';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {useDispatch} from 'react-redux';
import {AuthActions} from './../../actions';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

WebBrowser.maybeCompleteAuthSession();

export default function SignUp({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');
  const [errors, setErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    name: true,
    email: true,
    phone: true,
    password: true,
    password_confirmation: true,
  });

  /**
   * call when action signup
   *
   */
  const onSignUp = async() => {
    setLoading(true);
    setErrors([])
        try {
            const response = await axios.post(`${url}/register`, {
                name: name,
                email: email,
                phone: phone,
                password: password,
                password_confirmation: password_confirmation,
            });

            if (response.data.status === true) {
                await SecureStore.setItemAsync('user_token', response.data.data.token)
                setSuccessMsg(response.data.message)
                setTimeout(() => {
                  dispatch(AuthActions.authentication(true, response => {}));                  
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

  // Handle sign in with Google
  const [gToken, setgToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "575698886219-oemoa4m3hogke1qlhim2oc6pdl0i8bh8.apps.googleusercontent.com",
    iosClientId: "575698886219-vs95k04b7p8vj84vr7f2oo09jf6fkg31.apps.googleusercontent.com"
  });

  useEffect(() => {
    handleEffect();
  }, [response, gToken]);

  async function handleEffect() {
    const user = await getLocalUser();
    if (!user) {
      if (response?.type === "success") {
        // setToken(response.authentication.accessToken);
        getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(user);
      console.log("loaded locally");
    }
  }

  const getLocalUser = async () => {
    const data = await SecureStore.getItemAsync("userData");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async (gToken) => {
    if (!gToken) return;
    try {
      setLoading(true);
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${gToken}` },
        }
      );

      const user = await response.json();
      setErrors([])
          try {
              const response = await axios.post(`${url}/register`, {
                  name: user.name,
                  email: user.email,
                  picture: user.picture,
                  sign_up_type: "Google",
              });
  
              if (response.data.status === true) {
                  await SecureStore.setItemAsync('user_token', response.data.data.token)
                  await SecureStore.setItemAsync("userData", JSON.stringify(user));
                  setSuccessMsg(response.data.message)
                  setTimeout(() => {
                    setLoading(false);
                    setLoading(true);
                    dispatch(AuthActions.authentication(true, response => {}));                  
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
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

  return (
    <View style={{flex: 1}}>
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
        title={t('sign_up')}
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
      <ScrollView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']} contentContainerStyle={{flexGrow: 1}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}} >
          <View style={[styles.contain, {height: "100%"}]}>
            <Image source={require("./../../assets/images/Sphinx.png")} style={{width: 220, height: 60, resizeMode: "contain", marginBottom: 30}} />
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")} style={{flexDirection: "row", marginBottom: 15, gap: 5}}>
              <Text>{t("already_have_account")}</Text>
              <Text style={{fontWeight: 700, color: colors.primary}}>{t("sign_in")}</Text>
            </TouchableOpacity>
            <TextInput
              onChangeText={text => setName(text)}
              placeholder={t('your_name')}
              success={success.name}
              value={name}
            />
            <TextInput
              style={{marginTop: 10}}
              onChangeText={text => setEmail(text)}
              placeholder={t('your_email')}
              keyboardType="email-address"
              success={success.email}
              value={email}
            />
            <TextInput
              style={{marginTop: 10}}
              onChangeText={text => setPhone(text)}
              placeholder={t('your_phone')}
              keyboardType="phone-number"
              success={success.phone}
              value={phone}
            />
            <TextInput
              style={{marginTop: 10}}
              onChangeText={text => setPassword(text)}
              placeholder={t('password')}
              keyboardType="password"
              success={success.password}
              value={password}
            />
            <TextInput
              style={{marginTop: 10}}
              onChangeText={text => setPassword_confirmation(text)}
              placeholder={t('password_confirmation')}
              keyboardType="password-confirmation"
              success={success.password_confirmation}
              value={password_confirmation}
            />
            <Button
              full
              style={{marginTop: 20}}
              loading={loading}
              onPress={() => onSignUp()}>
              {t('sign_up')}
            </Button>
            <Text style={{marginTop: 10, fontSize: 22, fontWeight: 600}}>
              {t('or')}
            </Text>
            <Button
              full
              style={{marginTop: 10,marginBottom: 20, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, color: "white", backgroundColor: "#8cc646"}}
              // loading={loading}
              disabled={!request}
              onPress={() => {
                promptAsync();
              }}>
                <View style={{flexDirection: "row", justifyContent: 'center', alignItems: 'center', gap: 10}}>
                <AntDesign name="google" size={24} color="white"/>
                <Text style={{fontSize: 18, fontWeight: 600, color: 'white'}}>
                   {t('google_btn')}
                </Text>
                </View>
            </Button>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}
