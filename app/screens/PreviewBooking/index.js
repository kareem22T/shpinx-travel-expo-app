import React, { useState } from 'react';
import {View, ScrollView, TextInput, ActivityIndicator} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from './../../config';
import {Header, SafeAreaView, Icon, Text, Button} from './../../components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {Picker} from '@react-native-picker/picker';
import TimerMixin from 'react-timer-mixin';
import { Entypo } from "@expo/vector-icons";
import DatePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { url } from '../../apis/a-MainVariables';

export default function PreviewBooking({navigation, route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const [errors, setErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState();
  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [start, setStart] = useState()
  const [numberOfAdults, setNumberOfAdults] = useState()
  const [numberOfChildrens, setNumberOfChildrens] = useState()
  const [additional_info, setAdditional_info] = useState()
  const [selectedRoom, setSelectedRoom] = useState(route.params.type === "hotel" && (route.params.selectedRoom ? route.params.selectedRoom : route.params.hotel.rooms[0]));

  const [selectedPackage, setSelectedPackage] = useState(route.params.type === "tour" && (route.params.selectedPackage ? route.params.selectedPackage : route.params.tour.packages[0]));
  
  const [showFromDatePicker, setShowFromDatePicker] = useState(false)
  const [showToDatePicker, setShowToDatePicker] = useState(false)
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)

  const [success] = useState({
    phone: true,
    from: true,
    to: true,
    numberOfAdults: true,
    numberOfChildrens: true, 
    additional_info: true,
    selectedRoom: true
  });


  const handleBookHotel = async () => {
    const token = SecureStore.getItem("user_token");

    console.log(token);

    if (!phone) {
      setErrors([t("enter_phone")])
      TimerMixin.setTimeout(() => {
        setErrors([]);
      }, 2000);
    }
    else if (!from || !to) {
      setErrors([t("choose_booking_interval")])
      TimerMixin.setTimeout(() => {
        setErrors([]);
      }, 2000);
    }
    else if (!numberOfAdults || !numberOfChildrens) {
      setErrors([t("enter_persons_num")])
      TimerMixin.setTimeout(() => {
        setErrors([]);
      }, 2000);
    }

    if (phone && from && to && selectedRoom && numberOfAdults && numberOfChildrens) {
      const bookingData = {
        hotel: route.params.hotel.names[0].name,
        room: selectedRoom.names[0].name,
        phone: phone,
        from: String(from.getDate()).padStart(2, '0') + " " + from.toLocaleDateString("en-US", { month: 'long' }) + ", " + String(from.getFullYear()),
        to: String(to.getDate()).padStart(2, '0') + " " + to.toLocaleDateString("en-US", { month: 'long' }) + ", " + String(to.getFullYear()),
        persons: numberOfAdults + " Adults " + "/ " + numberOfChildrens + " Childrens",
        price: selectedRoom.prices[0].price + " USD",
        type: "hotel",
        more: additional_info ? additional_info : "----"
      }
      setErrors([])
      setLoading(true)
      try {
          const response = await axios.post(`${url}/book`, {
            booking_details: JSON.stringify(bookingData),
          },
              {
                  headers: {
                      'AUTHORIZATION': `Bearer ${token}`
                  }
              },);
  
          if (response.data.status === true) {
              setLoading(false);
              setErrors([]);
              setSuccessMsg(response.data.message);
              TimerMixin.setTimeout(() => {
                  navigation.navigate("Booking")
                }, 2000);
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
    }
  }
  
  const handleBookTour = async () => {
    const token = SecureStore.getItem("user_token");

    console.log(token);

    if (!phone) {
      setErrors([t("enter_phone")])
      TimerMixin.setTimeout(() => {
        setErrors([]);
      }, 2000);
    }
    else if (!start) {
      setErrors([t("choose_starting_time")])
      TimerMixin.setTimeout(() => {
        setErrors([]);
      }, 2000);
    }
    else if (!numberOfAdults || !numberOfChildrens) {
      setErrors([t("enter_persons_num")])
      TimerMixin.setTimeout(() => {
        setErrors([]);
      }, 2000);
    }

    if (phone && start && selectedPackage && numberOfAdults && numberOfChildrens) {
      const bookingData = {
        tour: route.params.tour.titles[0].title,
        package: selectedPackage.titles[0].title,
        phone: phone,
        start: String(start.getDate()).padStart(2, '0') + " " + start.toLocaleDateString("en-US", { month: 'long' }) + ", " + String(start.getFullYear()),
        persons: numberOfAdults + " Adults " + "/ " + numberOfChildrens + " Childrens",
        price: selectedPackage.prices[0].price + " USD",
        type: "tour",
        more: additional_info ? additional_info : "----"
      }
      setErrors([])
      setLoading(true)
      try {
          const response = await axios.post(`${url}/book`, {
            booking_details: JSON.stringify(bookingData),
          },
              {
                  headers: {
                      'AUTHORIZATION': `Bearer ${token}`
                  }
              },);
  
          if (response.data.status === true) {
              setLoading(false);
              setErrors([]);
              setSuccessMsg(response.data.message);
              TimerMixin.setTimeout(() => {
                  navigation.navigate("Booking")
                }, 2000);
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
    }
  }
  
  const handelChangeFromValue =  (date) => {
    setFrom(date)
    setShowFromDatePicker(false)
  }

  const handelChangeToValue =  (date) => {
    setTo(date)
    setShowToDatePicker(false)
  }

  const handelChangeTourStartValue =  (date) => {
    setStart(date)
    setShowStartDatePicker(false)
  }

  
  if (route.params.type === "hotel" && route.params.hotel)
    return (
      <View style={{flex: 1}}>
        {
          showFromDatePicker && (
            <DatePicker
              date={new Date().toString()}
              value={from ? from : new Date()}
              onChange={(date) => handelChangeFromValue(new Date(date['nativeEvent']['timestamp']))}
              icon={<Entypo name="chevron-right" size={40} color="#689CA3" />}
            />
          )
        }
        {
          showToDatePicker && (
            <DatePicker
              date={new Date().toString()}
              value={to ? to : new Date()}
              onChange={(date) => handelChangeToValue(new Date(date['nativeEvent']['timestamp']))}
              icon={<Entypo name="chevron-right" size={40} color="#689CA3" />}
            />
          )
        }
        <View 
        style={{
          position: 'absolute', top: 50, right: 0,
          padding: 10,
          width: "100%"
        }}>
          <Text style={{
            color: "#fff",
            padding: 1 * 16,
            fontSize: 1 * 16,
            backgroundColor: '#e41749',
            width: "100%",
            fontFamily: 'Outfit_600SemiBold',
            borderRadius: 1.25 * 16,
            zIndex: 9999999999,
            display: errors.length ? 'flex' : 'none'
          }}>{errors.length ? errors[0] : ''}</Text>
          <Text style={{
            color: "#fff",
            padding: 1 * 16,
            width: "100%",
            fontSize: 1 * 16,
            backgroundColor: '#12c99b',
            fontFamily: 'Outfit_600SemiBold',
            borderRadius: 1.25 * 16,
            zIndex: 9999999999,
            display: successMsg == '' ? 'none' : 'flex'
          }}>{successMsg}</Text>
        </View>
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
          title={t('preview_booking')}
          subTitle="Booking Number GAX02"
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
          <ScrollView>
            <View style={{paddingHorizontal: 20}}>
              <View
                style={[styles.blockView, {borderBottomColor: colors.border}]}>
                <Text body2 style={{marginBottom: 10}}>
                  {t('hotels')}
                </Text>
                <Text body1 semibold>
                  {route.params.hotel.names[0].name}
                </Text>
              </View>
              <View style={{
                  flex: 6.5,
                  paddingLeft: 10,
                  backgroundColor: "#21212124",
                  marginTop: 10,
                  borderRadius: 10
                }}> 
                <TextInput
                  style={{margin: 10}}
                  onChangeText={text => setPhone(text)}
                  keyboardType='numeric'
                  placeholder={t('your_phone')}
                  success={success.phone}
                  value={phone}
                  />
              </View>
              <Text body2 semibold style={{marginTop: 10}}>
                {t("Booking_period")}
              </Text>
              <TouchableOpacity style={{
                  flex: 6.5,
                  paddingLeft: 10,
                  backgroundColor: "#21212124",
                  marginTop: 10,
                  borderRadius: 10,
                  height: 50,
                  justifyContent: 'center',
                  // alignItems: 'center'
                }}
                onPress={() => setShowFromDatePicker(true)}
                > 
                  <Text style={{
                    marginLeft: 10,
                    marginRight: 10
                  }}>
                    {t('from')} { from ?  String(from.getDate()).padStart(2, '0') + " " + from.toLocaleDateString("en-US", { month: 'long' }) + ", " + String(from.getFullYear()) : "----"}
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                  flex: 6.5,
                  paddingLeft: 10,
                  backgroundColor: "#21212124",
                  marginTop: 10,
                  borderRadius: 10,
                  height: 50,
                  justifyContent: 'center',
                  // alignItems: 'center'
                }}
                onPress={() => setShowToDatePicker(true)}> 
                  <Text style={{
                    marginLeft: 10,
                    marginRight: 10
                  }}>
                    {t('to')} { to ?  String(to.getDate()).padStart(2, '0') + " " + to.toLocaleDateString("en-US", { month: 'long' }) + ", " + String(to.getFullYear()) : "----"}
                  </Text>
              </TouchableOpacity>

              <Text body2 semibold style={{marginTop: 10}}>
                {t("room")}
              </Text>

              <View style={
                {
                  borderRadius: 10,
                  overflow: 'hidden',
                  padding: 0,
                  marginTop: 10,
                }
              }>
                <Picker
                  selectedValue={selectedRoom}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedRoom(itemValue)
                  }
                  style={{
                    backgroundColor: "#21212124",
                    height: 50,
                  }}>
                    {
                      route.params.hotel.rooms.map(item => (
                        <Picker.Item label={item.names[0].name} value={item} key={item.id}/>
                      ))
                    }
                </Picker>
              </View>
              
              <Text body2 semibold style={{marginTop: 10}}>
                {t("num_persons")}
              </Text>

              <View style={{
                flexDirection: "row",
                gap: 10
              }}>
                <View style={{
                    flex: 6.5,
                    paddingLeft: 10,
                    backgroundColor: "#21212124",
                    marginTop: 10,
                    borderRadius: 10
                  }}> 
                  <TextInput
                    style={{margin: 10}}
                    keyboardType='numeric'
                    onChangeText={text => setNumberOfAdults(text)}
                    placeholder={t('adults')}
                    success={success.numberOfAdults}
                    value={numberOfAdults}
                    />
                </View>

                <View style={{
                    flex: 6.5,
                    paddingLeft: 10,
                    backgroundColor: "#21212124",
                    marginTop: 10,
                    borderRadius: 10
                  }}> 
                  <TextInput
                    style={{margin: 10}}
                    keyboardType='numeric'
                    onChangeText={text => setNumberOfChildrens(text)}
                    placeholder={t('children')}
                    success={success.numberOfChildrens}
                    value={numberOfChildrens}
                    />
                </View>
              </View>

              <Text body2 semibold style={{marginTop: 10}}>
                {t("you_have_any_information")}
              </Text>

              <View style={{
                  flex: 6.5,
                  paddingLeft: 10,
                  backgroundColor: "#21212124",
                  marginTop: 10,
                  marginBottom: 10,
                  borderRadius: 10
                }}> 
                <TextInput
                  style={{marginVertical: 10, textAlignVertical: 'top'}}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={text => setAdditional_info(text)}
                  placeholder={t('additional_info')}
                  success={success.additional_info}
                  value={additional_info}
                  />
              </View>
              
            </View>
          </ScrollView>
          <View
            style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
            <View>
              <Text title3 primaryColor semibold>
                {selectedRoom.prices[0].price + " USD"} <Text primaryColor style={{fontSize: 13}}>{t("per_night")}</Text>
              </Text>
              
              <Text caption1 semibold grayColor style={{marginTop: 5}}>
                {numberOfAdults && numberOfAdults + " " + t('adults')} {numberOfChildrens && "/ " +  numberOfChildrens + " " + t('children')}
              </Text>
            </View>
            <Button onPress={() => handleBookHotel()}>
              {t('submit')}
            </Button>
          </View>
        </SafeAreaView>
      </View>
    );

  else if (route.params.type === "tour" && route.params.tour)
    return (
      <View style={{flex: 1}}>
        {
          showStartDatePicker && (
            <DatePicker
              date={new Date().toString()}
              value={start ? start : new Date()}
              onChange={(date) => handelChangeTourStartValue(new Date(date['nativeEvent']['timestamp']))}
              icon={<Entypo name="chevron-right" size={40} color="#689CA3" />}
            />
          )
        }
        <View 
        style={{
          position: 'absolute', top: 50, right: 0,
          padding: 10,
          width: "100%"
        }}>
          <Text style={{
            color: "#fff",
            padding: 1 * 16,
            fontSize: 1 * 16,
            backgroundColor: '#e41749',
            width: "100%",
            fontFamily: 'Outfit_600SemiBold',
            borderRadius: 1.25 * 16,
            zIndex: 9999999999,
            display: errors.length ? 'flex' : 'none'
          }}>{errors.length ? errors[0] : ''}</Text>
          <Text style={{
            color: "#fff",
            padding: 1 * 16,
            width: "100%",
            fontSize: 1 * 16,
            backgroundColor: '#12c99b',
            fontFamily: 'Outfit_600SemiBold',
            borderRadius: 1.25 * 16,
            zIndex: 9999999999,
            display: successMsg == '' ? 'none' : 'flex'
          }}>{successMsg}</Text>
        </View>
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
          title={t('preview_booking')}
          subTitle="Booking Number GAX02"
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
          <ScrollView>
            <View style={{paddingHorizontal: 20}}>
                <View
                  style={[styles.blockView, {borderBottomColor: colors.border}]}>
                  <Text body2 style={{marginBottom: 10}}>
                    {t('tours')}
                  </Text>
                  <Text body1 semibold>
                    {route.params.tour.titles[0].title}
                  </Text>
                </View>
                <View style={{
                    flex: 6.5,
                    paddingLeft: 10,
                    backgroundColor: "#21212124",
                    marginTop: 10,
                    borderRadius: 10
                  }}> 
                  <TextInput
                    style={{margin: 10}}
                    onChangeText={text => setPhone(text)}
                    keyboardType='numeric'
                    placeholder={t('your_phone')}
                    success={success.phone}
                    value={phone}
                    />
                </View>
              <Text body2 semibold style={{marginTop: 10}}>
                {t("package")}
              </Text>

              <View style={
                {
                  borderRadius: 10,
                  overflow: 'hidden',
                  padding: 0,
                  marginTop: 10,
                }
              }>
                <Picker
                  selectedValue={selectedPackage}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedPackage(itemValue)
                  }
                  style={{
                    backgroundColor: "#21212124",
                    height: 50,
                  }}>
                    {
                      route.params.tour.packages.map(item => (
                        <Picker.Item label={item.titles[0].title} value={item} key={item.id}/>
                      ))
                    }
                </Picker>
              </View>
                <Text body2 semibold style={{marginTop: 10}}>
                  {t("num_persons")}
                </Text>

                <View style={{
                  flexDirection: "row",
                  gap: 10
                }}>
                  <View style={{
                    flex: 6.5,
                    paddingLeft: 10,
                    backgroundColor: "#21212124",
                    marginTop: 10,
                    borderRadius: 10
                    }}> 
                    <TextInput
                      style={{margin: 10}}
                      keyboardType='numeric'
                      onChangeText={text => setNumberOfAdults(text)}
                      placeholder={t('adults')}
                      success={success.numberOfAdults}
                      value={numberOfAdults}
                      />
                  </View>

                  <View style={{
                      flex: 6.5,
                      paddingLeft: 10,
                      backgroundColor: "#21212124",
                      marginTop: 10,
                      borderRadius: 10
                    }}> 
                    <TextInput
                      style={{margin: 10}}
                      keyboardType='numeric'
                      onChangeText={text => setNumberOfChildrens(text)}
                      placeholder={t('children')}
                      success={success.numberOfChildrens}
                      value={numberOfChildrens}
                      />
                  </View>
                </View>
                <Text body2 semibold style={{marginTop: 10}}>
                    {t("WhenPrefer")}
                  </Text>

                <TouchableOpacity style={{
                  flex: 6.5,
                  paddingLeft: 10,
                  backgroundColor: "#21212124",
                  marginTop: 10,
                  borderRadius: 10,
                  height: 50,
                  justifyContent: 'center',
                  // alignItems: 'center'
                }}
                onPress={() => setShowStartDatePicker(true)}
                > 
                  <Text style={{
                    marginLeft: 10,
                    marginRight: 10
                  }}>
                    {t('starts')} { start ?  String(start.getDate()).padStart(2, '0') + " " + start.toLocaleDateString("en-US", { month: 'long' }) + ", " + String(start.getFullYear()) : "----"}
                  </Text>
              </TouchableOpacity>

                <Text body2 semibold style={{marginTop: 10}}>
                  {t("you_have_any_information")}
                </Text>

                <View style={{
                    flex: 6.5,
                    paddingLeft: 10,
                    backgroundColor: "#21212124",
                    marginTop: 10,
                    marginBottom: 10,
                    borderRadius: 10
                  }}> 
                  <TextInput
                    style={{marginVertical: 10, textAlignVertical: 'top'}}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={text => setAdditional_info(text)}
                    placeholder={t('additional_info')}
                    success={success.additional_info}
                    value={additional_info}
                    />
                </View>
              </View>
          </ScrollView>
          <View
            style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
            <View>
              {
                selectedPackage && (
                <Text title3 primaryColor semibold>
                  {selectedPackage.prices[0].price + " USD"} <Text primaryColor style={{fontSize: 13}}>{t("price_per_person")}</Text>
                </Text>
                  
                )
              }

              <Text caption1 semibold grayColor style={{marginTop: 5}}>
                {numberOfAdults && numberOfAdults + " " + t('adults')} {numberOfChildrens && "/ " +  numberOfChildrens + " " + t('children')}
              </Text>
            </View>
            <Button onPress={() => handleBookTour()}>
              {t('submit')}
            </Button>
          </View>
        </SafeAreaView>
      </View>
    );
}
