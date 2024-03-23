import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Image,
  Animated,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import {BaseColor, Images, useTheme} from './../../config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  PostListItem,
  HelpBlock,
  Button,
  RoomType,
} from './../../components';
import * as SecureStore from 'expo-secure-store';
import * as Utils from './../../utils';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';
import {InteractionManager} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import styles from './styles';
import {HelpBlockData} from './../../data';
import {useTranslation} from 'react-i18next';
import { url } from '../../apis/a-MainVariables';
import { getTour } from '../../apis/tour';
import { getHotelRestaurante } from '../../apis/hotel';
import Slider from '../../components/Slider/component/Slider';

export default function HotelDetail({navigation, route}) {
  const {colors} = useTheme();
  const {t, i18n} = useTranslation();

  const [languageSelected, setLanguageSelected] = useState(i18n.language);
  const [errors, setErrors] = useState([]);

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [renderMapView, setRenderMapView] = useState(false);
  const [restaurants, setResturants] = useState([])
  const [user, setUser] = useState([])
  const [loading, setLoading] = useState(false);

  const [region] = useState({
    latitude: parseFloat(route.params.hotel.lat),
    longitude: parseFloat(route.params.hotel.lng),
    latitudeDelta: 0.05,
    longitudeDelta: 0.004,
  });
  const [roomType] = useState([
    {
      id: '1',
      image: Images.room8,
      name: 'Standard Twin Room',
      price: '$399,99',
      available: 'Hurry Up! This is your last room!',
      services: [
        {icon: 'wifi', name: 'Free Wifi'},
        {icon: 'shower', name: 'Shower'},
        {icon: 'users', name: 'Max 3 aduts'},
        {icon: 'subway', name: 'Nearby Subway'},
      ],
    },
    {
      id: '2',
      image: Images.room5,
      name: 'Delux Room',
      price: '$399,99',
      available: 'Hurry Up! This is your last room!',
      services: [
        {icon: 'wifi', name: 'Free Wifi'},
        {icon: 'shower', name: 'Shower'},
        {icon: 'users', name: 'Max 3 aduts'},
        {icon: 'subway', name: 'Nearby Subway'},
      ],
    },
  ]);
  const [todo] = useState([
    {
      id: '1',
      title: 'South Travon',
      image: Images.trip1,
    },
    {
      id: '2',
      title: 'South Travon',
      image: Images.trip2,
    },
    {
      id: '3',
      title: 'South Travon',
      image: Images.trip3,
    },
    {
      id: '4',
      title: 'South Travon',
      image: Images.trip4,
    },
    {
      id: '5',
      title: 'South Travon',
      image: Images.trip5,
    },
  ]);
  const [helpBlock] = useState(HelpBlockData);
  const deltaY = new Animated.Value(0);

  const handleGoToTour = (id) => {
    getTour(id, languageSelected).then(res => {
      navigation.navigate('TourDetail', {tour: res.data});
    })
  
  }
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
          navigation.navigate('PreviewBooking', {type: "hotel", hotel: route.params.hotel})
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

  useEffect(() => {
    getHotelRestaurante(route.params.hotel.id, languageSelected).then(res => {
      setResturants(res.data);
    })  
    console.log(route.params.hotel.reasons);
    InteractionManager.runAfterInteractions(() => {
      setRenderMapView(true);
    });
  }, []);
  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  return (
    <View style={{flex: 1}}>
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
      {
      route.params.hotel && (
        <Animated.Image
          source={{uri: url + route.params.hotel['gallery'][0]['path']}}
          style={[
            styles.imgBanner,
            {
              height: deltaY.interpolate({
                inputRange: [
                  0,
                  Utils.scaleWithPixel(200),
                  Utils.scaleWithPixel(200),
                ],
                outputRange: [heightImageBanner, heightHeader, heightHeader],
              }),
            },
          ]}
        />
      )
      }
      {/* Header */}
      <Header
        title=""
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={BaseColor.whiteColor}
              enableRTL={true}
            />
          );
        }}
        renderRight={() => {
          return <Icon name="images" size={20} color={BaseColor.whiteColor} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          navigation.navigate('PreviewImage');
        }}
      />
      <SafeAreaView style={{flex: 1}} edges={['right', 'left', 'bottom']}>
        <ScrollView
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
          scrollEventThrottle={8}>
          {/* Main Container */}
          <View style={{paddingHorizontal: 20}}>
            {/* Information */}
            <View
              style={[
                styles.contentBoxTop,
                {
                  marginTop: marginTopBanner,
                  backgroundColor: colors.card,
                  shadowColor: colors.border,
                  borderColor: colors.border,
                },
              ]}>
              <Text title2 semibold style={{marginBottom: 5, textAlign: 'center'}}>
                {route.params.hotel.names[0].name}
              </Text>
              <StarRating
                disabled={true}
                starSize={14}
                maxStars={5}
                rating={4.5}
                selectedStar={rating => {}}
                fullStarColor={BaseColor.yellowColor}
              />
              <Text
                body2
                style={{
                  marginTop: 5,
                  textAlign: 'center',
                }}>
                  {route.params.hotel.slogans[0].slogan}
              </Text>
            </View>
            {/* Rating Review */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={[
                    styles.circlePoint,
                    {backgroundColor: colors.primary},
                  ]}>
                  <Text title3 whiteColor>
                    9.5
                  </Text>
                </View>
                <View>
                  <Text title3 primaryColor style={{marginBottom: 3}}>
                    {t('excellent')}
                  </Text>
                  <Text body2>See 801 reviews</Text>
                </View>
              </View>
              <View style={styles.contentRateDetail}>
                <View style={[styles.contentLineRate, {marginRight: 10}]}>
                  <View style={{flex: 1}}>
                    <Text caption2 grayColor style={{marginBottom: 5}}>
                      Interio Design
                    </Text>
                    <View style={styles.lineBaseRate} />
                    <View
                      style={[
                        styles.linePercent,
                        {backgroundColor: colors.accent},
                        {width: '40%'},
                      ]}
                    />
                  </View>
                  <Text caption2 style={{marginLeft: 15}}>
                    4
                  </Text>
                </View>
                <View style={styles.contentLineRate}>
                  <View style={{flex: 1}}>
                    <Text caption2 grayColor style={{marginBottom: 5}}>
                      Server Quality
                    </Text>
                    <View style={styles.lineBaseRate} />
                    <View
                      style={[
                        styles.linePercent,
                        {backgroundColor: colors.accent},
                        {width: '70%'},
                      ]}
                    />
                  </View>
                  <Text caption2 style={{marginLeft: 15}}>
                    7
                  </Text>
                </View>
              </View>
              <View style={styles.contentRateDetail}>
                <View style={[styles.contentLineRate, {marginRight: 10}]}>
                  <View style={{flex: 1}}>
                    <Text caption2 grayColor style={{marginBottom: 5}}>
                      Interio Design
                    </Text>
                    <View style={styles.lineBaseRate} />
                    <View
                      style={[
                        styles.linePercent,
                        {backgroundColor: colors.accent},
                        {width: '50%'},
                      ]}
                    />
                  </View>
                  <Text caption2 style={{marginLeft: 15}}>
                    5
                  </Text>
                </View>
                <View style={styles.contentLineRate}>
                  <View style={{flex: 1}}>
                    <Text caption2 grayColor style={{marginBottom: 5}}>
                      Server Quality
                    </Text>
                    <View style={styles.lineBaseRate} />
                    <View
                      style={[
                        styles.linePercent,
                        {backgroundColor: colors.accent},
                        {width: '60%'},
                      ]}
                    />
                  </View>
                  <Text caption2 style={{marginLeft: 15}}>
                    6
                  </Text>
                </View>
              </View>
            </View>
            {/* Description */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold>
                {t('hotel_description')}
              </Text>
              <Text body2 style={{marginTop: 5}}>
                {route.params.hotel.descriptions[0].description}
              </Text>
            </View>
            {/* Facilities Icon */}
            <View
              style={[
                styles.contentService,
                {borderBottomColor: colors.border, gap:7},
              ]}>
              {route.params.hotel.features.map((item, index) => (
                <View style={{alignItems: 'center'}} key={'service' + index}>
                  <Image source={{uri: url + item.icon_path}} style={{width: 30, height: 30, resizeMode: "contain"}} />
                  <Text overline grayColor style={{marginTop: 4}}>
                    {item.names[0].name}
                  </Text>
                </View>
              ))}
            </View>
            {/* Map location */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline style={{marginBottom: 5}} semibold>
                {t('location')}
              </Text>
              <Text body2 numberOfLines={2}>
                {route.params.hotel.addresses[0].address}
              </Text>
              <View
                style={{
                  height: 180,
                  width: '100%',
                  marginTop: 10,
                }}>
                {renderMapView && (
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    key="AIzaSyBzXxR0ge7r2dT4BIVCl9uSLHKT9em6wzQ"
                    region={region}
                    onRegionChange={() => {}}>
                    <Marker
                      coordinate={{
                        latitude: parseFloat(route.params.hotel.lat),
                        longitude: parseFloat(route.params.hotel.lng),
                      }}
                    />
                  </MapView>
                )}
              </View>
            </View>
            {/* Open Time */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold>
                {t('good_to_know')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Text body2 grayColor>
                    {t('check_in_from')}
                  </Text>
                  <Text body2 accentColor semibold>
                  {route.params.hotel.check_in}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Text body2 grayColor>
                    {t('check_out_from')}
                  </Text>
                  <Text body2 accentColor semibold>
                  {route.params.hotel.check_out}
                  </Text>
                </View>
              </View>
            </View>
            {/* Rooms */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}, !route.params.hotel.rooms.length && {display: "none"}]}>
              <Text headline semibold>
                {t('room_type')}
              </Text>
              <FlatList
                data={route.params.hotel.rooms}
                keyExtractor={(item, index) => item.id}
                renderItem={({item}) => (
                  <RoomType
                    image={{uri: url + item.gallery[0].path}}
                    name={item.names[0].name}
                    description={item.descriptions[0].description}
                    price={item.prices[0].price + " USD"}
                    services={item.features}
                    style={{marginTop: 10}}
                    onPress={() => {
                      navigation.navigate('HotelInformation', {room: item, hotel: route.params.hotel});
                    }}
                  />
                )}
              />
            </View>
            {/* Todo Things */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}, !route.params.hotel.tours.length && {display: "none"}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  alignItems: 'flex-end',
                }}>
                <Text headline semibold>
                  {t('todo_things')}
                </Text>
              </View>
              {
                route.params.hotel.tours.map(tour => (
                  <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={todo}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({item}) => (
                      <PostListItem
                        style={{marginRight: 15}}
                        title={tour.titles[0].title}
                        // date=""
                        description={tour.intros[0].intro}
                        image={ url + tour.gallery[0].path}
                        onPress={() => {
                          handleGoToTour(tour.id)
                        }}
                      />
                    )}
                  />
                ))
              }
            </View>
            {/* Nearby Restaurants */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border, paddingBottom: 0, justifyContent: "flex-start", alignItems: "flex-start"}, !restaurants.length && {display: "none"}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  width: "100%",
                  alignItems: 'flex-end',
                }}>
                <Text headline semibold>
                  {t('Nearest_restaurants')}
                </Text>
              </View>
              {
                restaurants && (
                  <View style={{width: "100%", zIndex: 11}}>
                    <Slider slides={restaurants} />
                  </View>
                )
              }
            </View>
            {/* Help Block Information */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border, paddingTop: 0}]}>
              <HelpBlock
                title={helpBlock.title}
                description={helpBlock.description}
                phone={route.params.hotel.phone}
                style={{marginRight: 10, marginLeft: 10, marginTop: 10}}
                onPress={() => {
                  navigation.navigate('ContactUs');
                }}
              />
            </View>
            {/* Other Information */}
            <View style={{paddingVertical: 10}}>
              <Text headline semibold>
                Reasons To Choose Us
              </Text>
                {
                    route.params.hotel.reasons.map((reason, index) => (
                      <View style={styles.itemReason}  key={'reason' + index}>
                          <Image source={{uri: url + reason.icon_path}} style={{width: 30, height: 30, resizeMode: "contain"}} />
                              <View style={{marginLeft: 10, width: "90%"}}>
                                <Text subhead semibold>
                                  {reason.names[0].name}
                                </Text> 
                                <Text body2>
                                  {reason.descriptions[0].description}
                                </Text>
                              </View>
                      </View>
                    ))
                }
            </View>
          </View>
        </ScrollView>
        {/* Pricing & Booking Process */}
        <View
          style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
          <View>
            <Text caption1 semibold>
              {t('price')}
            </Text>
            <Text title3 primaryColor semibold>
              {route.params.hotel.rooms.length && (route.params.hotel.rooms[0].prices[0].price + " USD")}
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
