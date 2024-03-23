import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {BaseStyle, useTheme} from './../../config';
import {Header, SafeAreaView, BookingHistory} from './../../components';
import {BookingHistoryData} from './../../data';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import * as SecureStore from 'expo-secure-store';
import {useSelector} from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { url } from '../../apis/a-MainVariables';
import TimerMixin from 'react-timer-mixin';

export default function Booking({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const [errors, setErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [refreshing] = useState(false);
  const [bookingHistory] = useState(BookingHistoryData);

  const [bookings, setBookings] = useState()
  const [isSigned, setIsSigned] = useState(false)

  const navigation2 = useNavigation();
  const [refreshCount, setRefreshCount] = useState(0);

  const auth = useSelector(state => state.auth);
  const login = auth.login.success;

  const getBookings = async (token) => {
    setErrors([])
    setLoading(true)
    try {
        const response = await axios.get(`${url}/get-bookings`,
            {
                headers: {
                    'AUTHORIZATION': `Bearer ${token}`
                }
            },);

        setBookings(response.data);
    } catch (error) {
        setLoading(false);
        setErrors([]);
        console.error(error);
    }
}

  const handleGetBooking = async () => {
    let token = await SecureStore.getItemAsync("user_token")
    if (token && login) {
      getBookings(token)
      setIsSigned(true)
    } else {
      setIsSigned(false)
    }
    console.log(bookings);
  }

  /**
   * render Item
   *
   * @param {*} item
   * @returns
   */
  useEffect(() => {
    // Your effect code that you want to execute on navigation
    handleGetBooking()
  }, [refreshCount]);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Update the refreshCount state variable to trigger the effect
      setRefreshCount(prevCount => prevCount + 1);
    });
  
    return unsubscribe;
  }, [navigation2]);
  
  
  const renderItem = item => {
    const itemData = JSON.parse(item.booking_details)
    return (
      <BookingHistory
        data={itemData}
        status={item.status}
        style={{paddingVertical: 10, marginHorizontal: 20}}
        onPress={() => {
          navigation.navigate('BookingDetail');
        }}
      />
    );
  };

  /**
   * @description Loading booking item history one by one
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */
  return (
    <View style={{flex: 1}}>
      <Header title={t('booking_history')} />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <FlatList
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {}}
            />
          }
          data={bookings}
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => renderItem(item)}
        />
      </SafeAreaView>
    </View>
  );
}
