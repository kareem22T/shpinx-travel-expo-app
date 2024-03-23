import React, {useState} from 'react';
import {View, ScrollView, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {BaseStyle, BaseColor, Images, useTheme} from './../../config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  ProfileDetail,
  ProfilePerformance,
  Tag,
  PostListItem,
  Button,
} from './../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {UserData} from './../../data';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';
import { url } from '../../apis/a-MainVariables';

export default function HotelInformation({navigation, route}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([])

  const [userData] = useState(UserData[0]);
  const [service] = useState([
    {id: '1', name: 'wifi'},
    {id: '2', name: 'coffee'},
    {id: '3', name: 'bath'},
    {id: '4', name: 'car'},
    {id: '5', name: 'paw'},
    {id: '6', name: 'futbol'},
    {id: '7', name: 'user-secret'},
    {id: '8', name: 'clock'},
    {id: '9', name: 'tv'},
    {id: '10', name: 'futbol'},
  ]);

  const onLogOut = async () => {
    await SecureStore.setItemAsync("userData", "")
    await SecureStore.setItemAsync("user_token", "")
    setLoading(true);
    dispatch(AuthActions.authentication(false, response => {}));
  };

  const getUser = async (token, notificationToken) => {
    setErrors([])
    setLoading(true)
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

  const handleNavigateToBooking = async () => {
    setLoading(true)
    let token = await SecureStore.getItemAsync("user_token")
    if (token) {
      getUser(token, null).then(() => {
        if (user) {
          navigation.navigate('PreviewBooking', {type: "hotel", hotel: route.params.hotel, selectedRoom: route.params.room})
        }
      })
    } else {
      setLoading(false)
      setErrors(["You have to sign in first"]);
      TimerMixin.setTimeout(() => {
        navigation.navigate('Walkthrough')
        setErrors([]);
      }, 1000);
    }
  
  }

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('hotel_information')}
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
      {loading && (
          <View style={{
              width: '100%',
              height: '100%',
              zIndex: 336,
              justifyContent: 'center',
              alignContent: 'center',
              marginTop: 22,
              backgroundColor: 'rgba(0, 0, 0, .5)',
              position: 'absolute',
              top: 10,
              left: 0,
          }}>
              <ActivityIndicator size="200px" color={colors.primary} />
          </View>
      )}
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <ScrollView>
          {/* Image Gallery */}
          <TouchableOpacity
            style={styles.contentGallery}
            onPress={() => {
              navigation.navigate('PreviewImage');
            }}
            activeOpacity={0.9}>
            <View style={styles.galleryLineTop}>
              {
                route.params.room.gallery[0] && (
                <View style={{flex: 1, paddingRight: 5}}>
                  <Image
                    source={{uri: url + route.params.room.gallery[0].path}}
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
                )
              }
              {
                route.params.room.gallery[1] && (
                  <View style={{flex: 1}}>
                  <Image
                    source={{uri: url + route.params.room.gallery[1].path}}
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
                )
              }
            </View>
            <View style={styles.galleryLineBottom}>
            {
                route.params.room.gallery[2] && (
                <View style={{flex: 1, paddingRight: 5}}>
                  <Image
                    source={{uri: url + route.params.room.gallery[2].path}}
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
                )
              }
              {
                route.params.room.gallery[3] && (
                <View style={{flex: 1, paddingRight: 5}}>
                  <Image
                    source={{uri: url + route.params.room.gallery[3].path}}
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
                )
              }
              {
                route.params.room.gallery[4] && (
                <View style={{flex: 1}}>
                  <Image
                    source={{uri: url + route.params.room.gallery[4].path}}
                    style={{width: '100%', height: '100%'}}
                  />
                  <Text
                    headline
                    whiteColor
                    style={{
                      position: 'absolute',
                      right: 10,
                      bottom: 10,
                    }}>
                    {route.params.room.gallery.length}+</Text>
                </View>
                )
              }
            </View>
          </TouchableOpacity>
          {/* Information */}
          <View style={{paddingHorizontal: 20}}>
            <Text title2 semibold style={{marginTop: 10}}>
              {route.params.room.names[0].name}
            </Text>
            <View
              style={{
                width: 66,
                marginTop: 10,
                marginBottom: 20,
              }}>
              <StarRating
                disabled={true}
                starSize={14}
                maxStars={5}
                rating={4.7}
                selectedStar={rating => {}}
                fullStarColor={BaseColor.yellowColor}
              />
            </View>
            {/* Facilities & Icon */}
            <Text headline style={{marginBottom: 10}} semibold>
              {t('facilities_of_hotel')}
            </Text>
            <FlatList
              numColumns={4}
              data={route.params.room.features}
              keyExtractor={(item, index) => item.id}
              renderItem={({item}) => (
                <View
                  style={{
                    padding: 10,
                    alignItems: 'center',
                  }}>
                  <Image source={{uri: url + item.icon_path}} style={{width: 35, height: 35, resizeMode: "contain"}} /> 
                  <Text overline grayColor>
                    {item.names[0].name}
                  </Text>
                </View>
              )}
            />
            {/* Information */}
            <Text headline semibold style={{marginTop: 10}}>
              {t('hotel_description')}
            </Text>
            <Text footnote grayColor style={{marginBottom: 8, marginTop: 3}}>
              {route.params.room.descriptions[0].description}
            </Text>
          </View>
          {/* Todo Things */}
          {/* <View style={styles.contentTodo}>
            <Text headline semibold>
              {t('todo_things')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Post')}>
              <Text caption1 grayColor>
                {t('show_more')}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            contentContainerStyle={{
              paddingLeft: 5,
              paddingRight: 20,
              paddingBottom: 20,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={[
              {id: '1', image: Images.trip1},
              {id: '2', image: Images.trip2},
              {id: '3', image: Images.trip3},
              {id: '4', image: Images.trip4},
              {id: '5', image: Images.trip5},
            ]}
            keyExtractor={(item, index) => item.id}
            renderItem={({item}) => (
              <PostListItem
                image={item.image}
                style={{marginLeft: 15}}
                title="South Travon"
                description="Andaz Tokyo Toranomon Hills is one of the newest luxury hotels in Tokyo. Located in one of the uprising areas of Tokyo"
                date="6 Deals Left"
                onPress={() => navigation.navigate('PostDetail')}
              />
            )}
          /> */}
        </ScrollView>
        {/* Pricing & Booking Process */}
        <View
          style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
          <View>
            <Text caption1 semibold>
              {t('price')}
            </Text>
            <Text title3 primaryColor semibold>
              {route.params.room.prices[0].price} USD
            </Text>
            <Text caption1 semibold style={{marginTop: 5}}>
              {t('avg_night')}
            </Text>
          </View>
          <Button onPress={() => handleNavigateToBooking()}>
            {t('book_now')}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
