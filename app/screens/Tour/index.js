import React, {useState} from 'react';
import {FlatList, RefreshControl, View, Animated, Text, ActivityIndicator} from 'react-native';
import {BaseStyle, useTheme} from './../../config';
import {Header, SafeAreaView, Icon, TourItem, FilterSort} from './../../components';
import styles from './styles';
import * as Utils from './../../utils';
import {TourData} from './../../data';
import {getTours} from '../../apis/tour'
import {useTranslation} from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import { url } from '../../apis/a-MainVariables';
import TimerMixin from 'react-timer-mixin';
import axios from 'axios';

export default function Tour({navigation}) {
  const {t, i18n} = useTranslation();

  const [languageSelected, setLanguageSelected] = useState(i18n.language);
  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
      }),
      offsetAnim,
    ),
    0,
    40,
  );
  const {colors} = useTheme();

  const [refreshing] = useState(false);
  const [modeView, setModeView] = useState('block');
  const [tours, setTours] = useState(null);

  getTours(languageSelected.toUpperCase()).then(res => {
    setTours(res.data);
  })

  const onChangeSort = () => {};

  /**
   * @description Open modal when filterring mode is applied
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onFilter = () => {
    navigation.navigate('Filter');
  };

  /**
   * @description Open modal when view mode is pressed
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'block':
        setModeView('grid');

        break;
      case 'grid':
        setModeView('list');
        break;
      case 'list':
        setModeView('block');
        break;
      default:
        setModeView('block');
        break;
    }
  };
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([])


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

  const handleNavigateToBooking = async (item) => {
    setLoading(true)
    let token = await SecureStore.getItemAsync("user_token")
    if (token) {
      getUser(token, null).then(() => {
        if (user) {
          navigation.navigate('PreviewBooking', {type: "tour", tour: item})
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

  /**
   * @description Render container view
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */
  const renderContent = () => {
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, 40],
      outputRange: [0, -40],
      extrapolate: 'clamp',
    });
    switch (modeView) {
      case 'block':
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
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={tours}
              key={'block'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TourItem
                  block
                  image={{uri: url + item.gallery[0].path}}
                  title={item.titles[0].title}
                  price={item.packages[0].prices[0].price + "$"}
                  rate={4}
                  rateCount={"100 of 120"}
                  intro={item.intros[0].intro}
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail', {tour: item})
                  }}
                  onPressBookNow={() => {
                    handleNavigateToBooking(item);
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );
      case 'grid':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              columnWrapperStyle={{
                paddingLeft: 5,
                paddingRight: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={tours}
              key={'gird'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TourItem
                  grid
                  image={item.image}
                  name={item.name}
                  location={item.location}
                  travelTime={item.travelTime}
                  startTime={item.startTime}
                  price={item.price}
                  rate={item.rate}
                  rateCount={item.rateCount}
                  numReviews={item.numReviews}
                  author={item.author}
                  services={item.services}
                  style={{
                    marginBottom: 15,
                    marginLeft: 15,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail', {tourDetials: item})
                  }}
                  onPressBookNow={() => {
                    navigation.navigate('PreviewBooking');
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );

      case 'list':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
                paddingHorizontal: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={tours}
              key={'list'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TourItem
                  list
                  image={item.image}
                  name={item.name}
                  location={item.location}
                  travelTime={item.travelTime}
                  startTime={item.startTime}
                  price={item.price}
                  rate={item.rate}
                  rateCount={item.rateCount}
                  numReviews={item.numReviews}
                  author={item.author}
                  services={item.services}
                  style={{
                    marginBottom: 20,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail');
                  }}
                  onPressBookNow={() => {
                    navigation.navigate('PreviewBooking');
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );
      default:
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={tours}
              key={'block'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TourItem
                  block
                  image={item.image}
                  name={item.name}
                  location={item.location}
                  travelTime={item.travelTime}
                  startTime={item.startTime}
                  price={item.price}
                  rate={item.rate}
                  rateCount={item.rateCount}
                  numReviews={item.numReviews}
                  author={item.author}
                  services={item.services}
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail');
                  }}
                  onPressBookNow={() => {
                    navigation.navigate('PreviewBooking');
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('tours')}
        subTitle="24 Dec 2018, 2 Nights, 1 Room"
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
        renderRight={() => {
          return <Icon name="search" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          navigation.navigate('SearchHistory');
        }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
