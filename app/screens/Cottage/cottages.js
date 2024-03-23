import React, {useState} from 'react';
import {FlatList, RefreshControl, View, Animated} from 'react-native';
import {BaseStyle, useTheme} from './../../config';
import {Header, SafeAreaView, Icon, HotelItem, FilterSort} from './../../components';
import styles from '../Hotel/styles';
import * as Utils from './../../utils';
import {useTranslation} from 'react-i18next';
import {getCottages} from '../../apis/hotel'
import {url} from '../../apis/a-MainVariables'
import {HotelData} from './../../data';

export default function Cottage({navigation}) {
  const {colors} = useTheme();
  const {t, i18n} = useTranslation();

  const [languageSelected, setLanguageSelected] = useState(i18n.language);

  const [modeView, setModeView] = useState('block');
  const [hotels, setHotels] = useState([]);
  const [refreshing] = useState(false);
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

  getCottages(languageSelected.toUpperCase()).then(res => {
    setHotels(res.data);
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
              data={hotels}
              key={'block'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <HotelItem
                  block
                  image={url + item.gallery[0].path}
                  name={item.names[0].name}
                  location={item.addresses[0].address}
                  price={item.rooms.length ? item.rooms[0].prices[0].price + " USD" : ''}
                  available={item.slogans[0].slogan}
                  rate={5}
                  rateStatus={"Exelant"}
                  numReviews={200}
                  services={item.features}
                  style={{
                    paddingBottom: 10,
                  }}
                  onPress={() => navigation.navigate('HotelDetail', {hotel: item})}
                  onPressTag={() => navigation.navigate('Review')}
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
              numColumns={2}
              data={hotels}
              key={'grid'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <HotelItem
                  grid
                  image={url + item.gallery[0].path}
                  name={item.names[0].name}
                  location={item.addresses[0].address}
                  price={item.rooms.length ? item.rooms[0].prices[0].price + " USD" : ''}
                  available={item.slogans[0].slogan}
                  rate={5}
                  rateStatus={"Exelant"}
                  numReviews={200}
                  services={item.features}
                  onPress={() => navigation.navigate('HotelDetail')}
                  style={{
                    marginBottom: 15,
                    marginLeft: 15,
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
              data={hotels}
              key={'list'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <HotelItem
                  list
                  image={item.image}
                  name={item.name}
                  location={item.location}
                  price={item.price}
                  available={item.available}
                  rate={item.rate}
                  rateStatus={item.rateStatus}
                  numReviews={item.numReviews}
                  services={item.services}
                  rateCount={item.rateCount}
                  style={{
                    marginHorizontal: 20,
                    marginBottom: 15,
                  }}
                  onPress={() => {
                    navigation.navigate('HotelDetail');
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
              data={hotels}
              key={'block'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <HotelItem
                  block
                  image={item.image}
                  name={item.name}
                  location={item.location}
                  price={item.price}
                  available={item.available}
                  rate={item.rate}
                  rateStatus={item.rateStatus}
                  numReviews={item.numReviews}
                  services={item.services}
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() => navigation.navigate('HotelDetail')}
                  onPressTag={() => navigation.navigate('Preview')}
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
        title={t('Cottage')}
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
