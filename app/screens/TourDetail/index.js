import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import {BaseStyle, BaseColor, Images, useTheme} from './../../config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  ProfileDescription,
  ProfilePerformance,
  Tag,
  Text,
  Card,
  TourDay,
  TourItem,
  Button,
  PackageItem,
  RateDetail,
  CommentItem,
} from './../../components';
import * as SecureStore from 'expo-secure-store';
import {TabView, TabBar} from 'react-native-tab-view';
import styles from './styles';
import {UserData, ReviewData, TourData, PackageData} from './../../data';
import {useTranslation} from 'react-i18next';
import { url } from '../../apis/a-MainVariables';
import axios from 'axios';
import TimerMixin from 'react-timer-mixin';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function TourDetail({navigation, route}) {
  const {colors} = useTheme();
  const {t, i18n} = useTranslation();

  const [languageSelected, setLanguageSelected] = useState(i18n.language);

  const Tour = route.params.tour

  const [index, setIndex] = useState(0);
  const [routes, stRoutes] = useState([
    {key: 'information', title: t('information')},
    {key: 'tour', title: t('tours')},
    {key: 'package', title: t('packages')},
    {key: 'review', title: t('reviews')},
  ]);
  if (languageSelected == 'ar')
  {
    () =>stRoutes([
      {key: 'review', title: t('reviews')},
      {key: 'package', title: t('packages')},
      {key: 'tour', title: t('tours')},
      {key: 'information', title: t('information')},
    ])
  }
  const [userData] = useState(UserData[0]);

  // When tab is activated, set what's index value
  const handleIndexChange = index => setIndex(index);

  // Customize UI tab bar
  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={[styles.indicator, {backgroundColor: colors.primary}]}
      style={[styles.tabbar, {backgroundColor: colors.background}]}
      tabStyle={styles.tab}
      inactiveColor={BaseColor.grayColor}
      activeColor={colors.text}
      renderLabel={({route, focused, color}) => (
        <View style={{flex: 1, width: 130, alignItems: 'center'}}>
          <Text headline semibold={focused} style={{color}}>
            {route.title}
          </Text>
        </View>
      )}
    />
  );
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([])

  const tour = Tour;
  // Render correct screen container when tab is activated
  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'information':
        return <InformationTab jumpTo={jumpTo} navigation={navigation} tour={Tour}/>;
      case 'tour':
        return <TourTab jumpTo={jumpTo} navigation={navigation} tour={Tour}/>;
      case 'package':
        return <PackageTab jumpTo={jumpTo} navigation={navigation}  tour={Tour}/>;
      case 'review':
        return <ReviewTab jumpTo={jumpTo} navigation={navigation} />;
    }
  };

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

  const handleNavigateToBooking = async (pack = null) => {
    setLoading(true)
    let token = await SecureStore.getItemAsync("user_token")
    if (token) {
      getUser(token, null).then(() => {
        if (user) {
          navigation.navigate('PreviewBooking', {type: "tour", tour: tour, selectedPackage: pack})
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
      <Header
        title={t('travel_agency')}
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
        <View style={[styles.contentImageGird, {width: '100%', paddingLeft: 16, paddingRight: 16}]}>
          {
            tour.gallery[0] && (
            <View style={{flex: 4, marginRight: 10}}>
              <Card image={{uri: url + tour.gallery[0].path}}>
              </Card>
            </View>
            )
          }
          <View style={{flex: 6}}>
            {
              tour.gallery[1] && (
              <View style={{flex: 1}}>
                <Card image={{uri: url + tour.gallery[1].path}}>
                </Card>
              </View>
              )
            }
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: 10,
              }}>
                {
                  tour.gallery[2] && (
                    <View style={{flex: 6, marginRight: 10}}>
                      <Card image={{uri: url + tour.gallery[2].path}}>
                      </Card>
                    </View>
                  )
                }
                {
                  tour.gallery[3] && (
                    <View style={{flex: 6}}>
                      <Card image={{uri: url + tour.gallery[3].path}}>
                      <Text headline semibold whiteColor>
                        {tour.gallery.length > 4 ? (tour.gallery.length - 4) + " +" : ''}
                      </Text>
                      </Card>
                    </View>
                  )
                }
            </View>
          </View>
        </View>
        <View style={{flex: 1}}>
          <TabView
            lazy
            navigationState={{index, routes}}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={handleIndexChange}
          />
          <View
            style={[
              styles.contentButtonBottom,
              {borderTopColor: colors.border},
            ]}>
            <View>
              <Text caption1 semibold>
                {route.params.tour.duration} {t('days')}
              </Text>
              <Text title3 primaryColor semibold>
                ${route.params.tour.packages[0].prices[0].price}
              </Text>
            </View>
            <Button onPress={() => handleNavigateToBooking()}>
              {t('book_now')}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

/**
 * @description Show when tab Information activated
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @class PreviewTab
 * @extends {Component}
 */
function InformationTab({navigation, tour}) {
  const {t} = useTranslation();
  const [tours] = useState(TourData);
  const [dayTour] = useState([
    {
      id: '1',
      image: Images.trip1,
      day: 'Day 1',
      title: 'London - Somme - Paris',
      description:
        'Other hygienic practices that the new hotel — which handles, among other guests, patients seeking medical treatment at the Texas Medical Center — include removing nonessential items like decorative pillows and magazines',
    },
    {
      id: '2',
      image: Images.trip2,
      day: 'Day 2',
      title: 'Paris - Burgundy - Swiss Alps',
      description:
        'Other hygienic practices that the new hotel — which handles, among other guests, patients seeking medical treatment at the Texas Medical Center — include removing nonessential items like decorative pillows and magazines',
    },
    {
      id: '3',
      image: Images.trip3,
      day: 'Day 3',
      title: 'Swiss Alps - Strasbourg',
      description:
        'Other hygienic practices that the new hotel — which handles, among other guests, patients seeking medical treatment at the Texas Medical Center — include removing nonessential items like decorative pillows and magazines',
    },
    {
      id: '4',
      image: Images.trip4,
      day: 'Day 4',
      title: 'Grand Ducal Palace',
      description:
        'Other hygienic practices that the new hotel — which handles, among other guests, patients seeking medical treatment at the Texas Medical Center — include removing nonessential items like decorative pillows and magazines',
    },
  ]);
  
  const [information, setInformation] = useState([
    {title: t("Location"), detail: tour.locations[0].location},
    {title: t('Duration'), detail: tour.duration + " " + t("days")},
    {title: t("expired_at"), detail: tour.expired_date},
    {title: t("price_per_person"), detail: tour.packages[0].prices[0].price + " USD"},
    {title: t('Transportation'), detail: tour.transportations[0].transportation},
  ]);
  if (tour.max_participant)
    setInformation((prev => [
      ...prev, 
      {title: t("group_size"), detail: tour.min_participant + ' - ' + tour.max_participant + ' people'}
    ]))
  const {colors} = useTheme();
  return (
    <ScrollView>
      <View style={{padding: 20}}>
        <Text style={{fontSize: 18, fontWeight: 600, marginBottom: 10}}>
          {tour.titles[0].title}
          </Text>
        <Text>{tour.intros[0].intro}</Text>
      </View>

      <View style={{paddingHorizontal: 20}}>
        {information.map((item, index) => {
          return (
            <View
              style={[
                styles.lineInformation,
                {borderBottomColor: colors.border},
              ]}
              key={'information' + index}>
              <Text body2 grayColor>
                {item.title}
              </Text>
              <Text body2 semibold accentColor>
                {item.detail}
              </Text>
            </View>
          );
        })}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
        </View>
      </View>
      <View>
        <Text
          headline
          semibold
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            marginBottom: 10,
          }}>
          {t("tour_info")}
        </Text>
        <FlatList
          contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={tour.days}
          keyExtractor={(item, index) => item.id}
          renderItem={({item, index}) => (
            <TourDay
              image={{uri: url + '/' + item.thumbnail}}
              day={t("day") + " " + (index + 1)}
              title={item.titles[0].title}
              description={item.descriptions[0].description}
              style={{marginLeft: 15}}
              onPress={() => {}}
            />
          )}
        />
      </View>
      <View style={{paddingHorizontal: 20, marginTop: 20}}>
        <Text headline semibold style={{marginBottom: 10}}>
          {t("tour_includes")}
        </Text>
        <Text body2>
          {tour.includes[0].include}
        </Text>
      </View>
      <View style={{paddingHorizontal: 20, marginTop: 20}}>
        <Text headline semibold style={{marginBottom: 10}}>
          {t('tour_excludes')}
        </Text>
        <Text body2>
          {tour.excludes[0].exclude}
      {'\n'}
        </Text>
      </View>
      <View>
        {/* <Text
          headline
          semibold
          style={{
            marginLeft: 20,
            marginTop: 20,
          }}>
          Openning Tours
        </Text>
        <Text body2 style={{marginBottom: 10, marginLeft: 20}}>
          Let find out what most interesting things
        </Text> */}
        {/* <FlatList
          contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={tours}
          keyExtractor={(item, index) => item.id}
          renderItem={({item, index}) => (
            <TourItem
              grid
              style={[styles.tourItem, {marginLeft: 15}]}
              onPress={() => {
                navigation.navigate('TourDetail');
              }}
              image={item.image}
              name={item.name}
              location={item.location}
              travelTime={item.location}
              startTime={item.startTime}
              price={item.price}
              rate={item.rate}
              rateCount={item.rateCount}
              numReviews={item.numReviews}
              author={item.author}
              services={item.services}
            />
          )}
        /> */}
      </View>
    </ScrollView>
  );
}

/**
 * @description Show when tab Tour activated
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @class PreviewTab
 * @extends {Component}
 */
function TourTab({navigation, tour}) {
  const {t} = useTranslation();

  return (
    <ScrollView>
      <View style={{paddingHorizontal: 20, marginTop: 10, paddingBottom: 10}}>
        {
          tour.days.map((day, index) => (  
            <>
            
              <Text headline semibold style={{marginTop: 20}}>
                {t("day")} {index + 1}: {day.titles[0].title}
              </Text>
              <Image
                source={{uri: url + '/' + day.thumbnail}}
                style={{height: 120, width: '100%', marginTop: 10}}
              />
              <Text body2 style={{marginTop: 10}}>
                {day.descriptions[0].description}
              </Text>

              </>
            ))
            
        }
      </View>
    </ScrollView>
  );
}

/**
 * @description Show when tab Package activated
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @class PreviewTab
 * @extends {Component}
 */
function PackageTab({navigation, tour}) {
  const [packageItem] = useState(PackageData[0]);
  const [packageItem2] = useState(PackageData[2]);
  console.log(tour.packages);
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

  const handleNavigateToBooking = async (pack = null) => {
    setLoading(true)
    let token = await SecureStore.getItemAsync("user_token")
    if (token) {
      getUser(token, null).then(() => {
        if (user) {
          navigation.navigate('PreviewBooking', {type: "tour", tour: tour, selectedPackage: pack})
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
    <ScrollView>

      <View style={{paddingHorizontal: 20}}>
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
              // backgroundColor: 'rgba(0, 0, 0, .5)',
              position: 'absolute',
              top: 10,
              left: 0,
          }}>
              <ActivityIndicator size="200px" color={Colors.primary} />
          </View>
      )}
        <Text body2 style={{marginTop: 20}}>
          {tour.intros[0].intro}
        </Text>
        {
          tour && (

            tour.packages.map((pack => (
              <PackageItem style={{marginTop: 16}}
              detail
              packageName={pack.titles[0].title}
              price={"$" + pack.prices[0].price}
              type={packageItem2.type}
              description={pack.descriptions[0].description}
              services={pack.points}
              onPress={() => handleNavigateToBooking(pack)}
              />
            )))
          )
        }
      </View>
    </ScrollView>
  );
}

/**
 * @description Show when tab Review activated
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @class PreviewTab
 * @extends {Component}
 */
function ReviewTab({navigation}) {
  const [refreshing] = useState(false);
  const [rateDetail] = useState({
    point: 4.7,
    maxPoint: 5,
    totalRating: 25,
    data: ['80%', '10%', '10%', '0%', '0%'],
  });
  const [reviewList] = useState(ReviewData);
  const {colors} = useTheme();

  return (
    <FlatList
      contentContainerStyle={{padding: 20}}
      refreshControl={
        <RefreshControl
          colors={[colors.primary]}
          tintColor={colors.primary}
          refreshing={refreshing}
          onRefresh={() => {}}
        />
      }
      data={reviewList}
      keyExtractor={(item, index) => item.id}
      ListHeaderComponent={() => (
        <RateDetail
          point={rateDetail.point}
          maxPoint={rateDetail.maxPoint}
          totalRating={rateDetail.totalRating}
          data={rateDetail.data}
        />
      )}
      renderItem={({item}) => (
        <CommentItem
          style={{marginTop: 10}}
          image={item.source}
          name={item.name}
          rate={item.rate}
          date={item.date}
          title={item.title}
          comment={item.comment}
        />
      )}
    />
  );
}
