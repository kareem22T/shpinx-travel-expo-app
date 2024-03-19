import React, {useEffect, useState} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {AuthActions} from './../../actions';
import {BaseStyle, useTheme} from './../../config';
import * as SecureStore from 'expo-secure-store';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail,
  ProfilePerformance,
} from './../../components';
import styles from './styles';
import {UserData} from './../../data';
import {useTranslation} from 'react-i18next';
import * as Utils from './../../utils';
import { url } from '../../apis/a-MainVariables';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';

export default function Profile({navigation}) {
  const {colors} = useTheme();
  const {t, i18n} = useTranslation();
  const navigation2 = useNavigation();
  const [refreshCount, setRefreshCount] = useState(0);

  const [languageSelected, setLanguageSelected] = useState(i18n.language);
  const [errors, setErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const [loading, setLoading] = useState(false);
  const [userData] = useState(UserData[0]);
  const [user, setUser] = useState(null)
  const dispatch = useDispatch();
  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onLogOut = async () => {
    await SecureStore.setItemAsync("userData", "")
    await SecureStore.setItemAsync("user_token", "")
    setLoading(true);
    dispatch(AuthActions.authentication(false, response => {}));
  };

  let currentLangeName = async () => {
    return language.filter(item => Utils.languageFromCode(item).includes(text))
  }

  const getUser = async (token, notificationToken) => {
    setErrors([])
    try {
        const response = await axios.post(`${url}/get-user`, {
            notification_token: notificationToken,
        },
            {
                headers: {
                    'AUTHORIZATION': `Bearer ${token}`
                }
            },);

        if (response.data.status === true) {
            setLoading(false);
            setErrors([]);
            setUser(response.data.data.user);
        } else {
            setLoading(false);
            setErrors(response.data.errors);
            onLogOut()
            TimerMixin.setTimeout(() => {
                setErrors([]);
            }, 2000);
        }
    } catch (error) {
        onLogOut()
        setLoading(false);
        setErrors(["Server error, try again later."]);
        console.error(error);
    }
}

useEffect(() => {
  // Your effect code that you want to execute on navigation
    let token = SecureStore.getItem("user_token")
  getUser(token, null)
  
  // You can use the refreshCount variable as a dependency if needed
}, [refreshCount]);

useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    // Update the refreshCount state variable to trigger the effect
    setRefreshCount(prevCount => prevCount + 1);
  });

  return unsubscribe;
}, [navigation2]);


  useEffect(() => {
    currentLangeName(res => {
      if(res)
        setLanguage(res)
    })
  }, [])

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('profile')}
        renderRight={() => {
          return <Icon name="bell" size={24} color={colors.primary} />;
        }}
        onPressRight={() => {
          navigation.navigate('Notification');
        }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <ScrollView>
          <View style={styles.contain}>
            {
              user && (
                <ProfileDetail
                  image={user.picture ? {uri: user.join_type == "Google" ? user.picture : user.picture } : require("./../../assets/images/default_user.jpg")}
                  textFirst={user.name}
                  point={""}
                  textSecond={user.email}
                  textThird={""}
                  onPress={() => navigation.navigate('ProfileExanple')}
                />
              )
            }
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
                ,{marginTop: 15}
              ]}
              onPress={() => {
                navigation.navigate('ProfileEdit');
              }}>
              <Text body1>{t('edit_profile')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('ChangePassword');
              }}>
              <Text body1>{t('change_password')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('Currency');
              }}>
              <Text body1>{t('currency')}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text body1 grayColor>
                  USD
                </Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => navigation.navigate('MyPaymentMethod')}>
              <Text body1>{t('my_cards')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.profileItem}
              onPress={() => {
                navigation.navigate('ChangeLanguage');
              }}>
                <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: "95%"
                }}>
                <Text body1>{t('language')}</Text>
                <Text body1 grayColor>
                    {languageSelected == "ar" ? "العربية" : "English"}
                </Text>
                </View>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <Button full loading={loading} onPress={() => onLogOut()}>
            {t('sign_out')}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
