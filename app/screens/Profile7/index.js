import React, {useState} from 'react';
import {View, Image, ScrollView, Animated} from 'react-native';
import {BaseColor, Images, useTheme} from './../../config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfilePerformance,
  StarRating,
} from './../../components';
import * as Utils from './../../utils';
import styles from './styles';
import {UserData} from './../../data';
import {useTranslation} from 'react-i18next';

export default function Profile7({navigation}) {
  const {colors} = useTheme();
  const deltaY = new Animated.Value(0);
  const {t} = useTranslation();

  const [userData] = useState(UserData[0]);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const heightImageBanner = Utils.scaleWithPixel(240, 1);
  const marginTopBanner = heightImageBanner - heightHeader + 10;

  return (
    <View style={{flex: 1}}>
      <Animated.Image
        source={Images.profile2}
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(180),
                Utils.scaleWithPixel(180),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}
      />
      <Header
        title=""
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
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: marginTopBanner,
            }}>
            <Text title1 semibold>
              {userData.name}
            </Text>
            <Text subhead grayColor style={{marginBottom: 9}}>
              {userData.address}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <StarRating
                disabled={true}
                starSize={10}
                maxStars={5}
                rating={4}
                selectedStar={rating => {}}
                fullStarColor={colors.accent}
              />
            </View>
            <Text headline semibold style={{marginTop: 10}}>
              {t('about_me')}
            </Text>
            <Text body2 numberOfLines={5} style={{marginTop: 10}}>
              {userData.about}
            </Text>
          </View>
          <ProfilePerformance
            type="small"
            style={{margin: 20}}
            data={userData.performance}
          />
          <View style={{paddingHorizontal: 20, paddingBottom: 20}}>
            <Button full>{t('follow')}</Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
