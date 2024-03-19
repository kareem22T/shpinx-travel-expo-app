import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AuthActions } from './../../actions';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, Text, Button, Image } from './../../components';
import styles from './styles';
import Swiper from 'react-native-swiper';
import { BaseColor, BaseStyle, Images, useTheme } from './../../config';
import * as Utils from './../../utils';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';
import * as SecureStore from 'expo-secure-store';
import { url } from '../../apis/a-MainVariables';
import { AntDesign } from '@expo/vector-icons';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

export default function Walkthrough({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [errors, setErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const [slide] = useState([
    { key: 1, image: Images.trip2 },
    { key: 2, image: Images.trip1 },
    { key: 3, image: Images.trip3 },
    { key: 4, image: Images.trip4 },
  ]);
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  /**
   * @description Simple authentication without call any APIs
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const authentication = () => {
    setLoading(true);
    dispatch(AuthActions.authentication(true, response => { }));
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
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };
  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'left', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.contain}
        scrollEnabled={scrollEnabled}
        onContentSizeChange={(contentWidth, contentHeight) =>
          setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
        }>
        <Text style={{
          position: 'absolute', top: 50, right: 20, color: "#fff",
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
          position: 'absolute', top: 50, right: 20, color: "#fff",
          padding: 1 * 16,
          marginLeft: 10,
          fontSize: 1 * 16,
          backgroundColor: '#12c99b',
          fontFamily: 'Outfit_600SemiBold',
          borderRadius: 1.25 * 16,
          zIndex: 9999999999,
          display: successMsg == '' ? 'none' : 'flex'
        }}>{successMsg}</Text>

        <View style={styles.wrapper}>
          {/* Images Swiper */}
          <Swiper
            dotStyle={{
              backgroundColor: BaseColor.dividerColor,
            }}
            activeDotColor={colors.primary}
            paginationStyle={styles.contentPage}
            removeClippedSubviews={false}>
            {slide.map((item, index) => {
              return (
                <View style={styles.slide} key={item.key}>
                  <Image source={item.image} style={styles.img} />
                  <Text body1 style={styles.textSlide}>
                    {t('pick_your_destication')}
                  </Text>
                </View>
              );
            })}
          </Swiper>
        </View>
        <View style={{ width: '100%' }}>
          <Button
            full
            style={{ marginTop: 15, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, color: "white", backgroundColor: "#8cc646" }}
            // loading={loading}
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}>
            <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', gap: 10 }}>
              <AntDesign name="google" size={24} color="white" />
              <Text style={{ fontSize: 18, fontWeight: 600, color: 'white' }}>
                {t('google_btn')}
              </Text>
            </View>
          </Button>
          <Button
            full
            style={{ marginTop: 20 }}
            loading={loading}
            onPress={() => navigation.navigate('SignIn')}>
            {t('sign_in')}
          </Button>
          <View style={styles.contentActionBottom}>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text body1 grayColor>
                {t('not_have_account')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text body1 primaryColor>
                {t('join_now')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
