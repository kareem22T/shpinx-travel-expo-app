import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text} from './../../components';
import PropTypes from 'prop-types';
import styles from './styles';
import {useTheme} from './../../config';
import {useTranslation} from 'react-i18next';

export default function BookingHistory(props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {data, onPress, status, style} = props;
  return (
    <>
      {data.type === "hotel" && (
        <>
          <TouchableOpacity
            style={[styles.contain, {shadowColor: colors.border}, style]}
            onPress={onPress}
            activeOpacity={0.9}>
            <View
              style={[
                styles.nameContent,
                {
                  borderBottomColor: colors.card,
                  backgroundColor: "#1976bc",
                },
              ]}>
              <Text body2 whiteColor semibold>
                {t('Hotel') + ": " + data.hotel + ' - ' + data.room}
              </Text>
            </View>
            <View
              style={[
                {
                  borderBottomColor: colors.card,
                  backgroundColor: "#1976bc",
                  padding: 10
                },
              ]}>
              <Text body2 whiteColor semibold>
                {t('booking_status') + ": " + (parseInt(status) === 1 ? t("under_rev") : (parseInt(status) === 2 ? "booking confirmed" : (parseInt(status) === 3 ? "reservation Completed" : (parseInt(status) === 4 ? "Booking not Completed" : "Undifined"))))}
              </Text>
            </View>
            <View
              style={[styles.mainContent, {backgroundColor: "#1976bc", paddingTop: 0}]}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text caption2 whiteColor>
                  {t('from')}
                </Text>
                <Text body1 whiteColor semibold>
                  {data.from}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text caption2 whiteColor>
                  {t('to')}
                </Text>
                <Text body1 whiteColor semibold>
                  {data.to}
                </Text>
              </View>

            </View>
            <View style={[styles.validContent, {backgroundColor: colors.card}]}>
              <Text overline semibold>
                {data.persons}
              </Text>
              <Text overline semibold>
                {data.price}
              </Text>
            </View>
          </TouchableOpacity>
        </>
      )}
      {data.type === "tour" && (
        <>
          <TouchableOpacity
            style={[styles.contain, {shadowColor: colors.border}, style]}
            onPress={onPress}
            activeOpacity={0.9}>
            <View
              style={[
                styles.nameContent,
                {
                  borderBottomColor: colors.card,
                  backgroundColor: "#1976bc",
                },
              ]}>
              <Text body2 whiteColor semibold>
                {t('Tour') + ": " + data.tour + ' - ' + data.package}
              </Text>
            </View>
            <View
              style={[
                {
                  borderBottomColor: colors.card,
                  backgroundColor: "#1976bc",
                  padding: 10
                },
              ]}>
              <Text body2 whiteColor semibold>
                {t('booking_status') + ": " + (parseInt(status) === 1 ? t("under_rev") : (parseInt(status) === 2 ? t("bookingConfirmed") : (parseInt(status) === 3 ? "Reservation Completed" : (parseInt(status) === 4 ? "Booking not Completed" : "Undifined"))))}
              </Text>
            </View>
            <View
              style={[styles.mainContent, {backgroundColor: "#1976bc", paddingTop: 0}]}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text caption2 whiteColor>
                  {t('starts')}
                </Text>
                <Text body1 whiteColor semibold>
                  {data.start}
                </Text>
              </View>
            </View>
            <View style={[styles.validContent, {backgroundColor: colors.card}]}>
              <Text overline semibold>
                {data.persons}
              </Text>
              <Text overline semibold>
                {data.price}
              </Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </>
  );
}

BookingHistory.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  name: PropTypes.string,
  checkIn: PropTypes.string,
  checkOut: PropTypes.string,
  total: PropTypes.string,
  price: PropTypes.string,
  onPress: PropTypes.func,
};

BookingHistory.defaultProps = {
  style: {},
  name: '',
  checkIn: '',
  checkOut: '',
  total: '',
  price: '',
  onPress: () => {},
};
