import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Text, ActivityIndicator, Modal, Image, TouchableOpacity, Linking } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios'
import TimerMixin from 'react-timer-mixin';
import { PROVIDER_GOOGLE } from 'react-native-maps'
import Icon from 'react-native-vector-icons/Entypo';
import { Ionicons } from '@expo/vector-icons';
import { url } from '../../apis/a-MainVariables';
import * as Utils from './../../utils';
import {useTranslation} from 'react-i18next';
import Slider from '../../components/Slider/component/Slider';
export default function Map({ navigation, route }) {
    const [location, setLocation] = useState(null);
    const {t, i18n} = useTranslation();

    const [languageSelected, setLanguageSelected] = useState(i18n.language);
  
    const [resturants, setResturants] = useState([])
    const [nearestResturant, setNearestResturant] = useState([])
    const [nearestResturantMsg, setNearestResturantMsg] = useState("")
    const [showNearestResturantPopUp, setShowNearestResturantPopUp] = useState(false)

    const [showResturantDetails, setShowResturantDetails] = useState(false)
    const [readyToNavigate, setReadyToNavigate] = useState({})

    const [showQrScanner, setShowQrScanner] = useState(false)

    const [region, setRegion] = React.useState({
        latitude: 30.0480392,
        longitude: 31.2363747,
        latitudeDelta: 0.02,
        longitudeDelta: 0.06
    })

    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [successMsg, setSuccessMsg] = useState('');

    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentImage, setCurrentImage] = useState(null)
    const [currentTitle, setCurrentTitle] = useState(null)
    const [currentDescription, setCurrentDescription] = useState(null)
    const [currentAddress, setCurrentAddress] = useState(null)
    const [currentLat, setCurrentLat] = useState(null)
    const [currentLng, setCurrentLng] = useState(null)

    const cetnerLocation = async () => {

        // Get the user's current location permission status.
        let { status } = await Location.getForegroundPermissionsAsync();

        // If the user has denied location permission, prompt them again.
        if (status !== 'granted') {
            let { status } = await Location.requestForegroundPermissionsAsync();

            // If the user still denies location permission, return.
            if (status !== 'granted') {
                return;
            }
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        if (location) {
            setRegion({
                latitude: 30.0480392,
                longitude: 31.2363747,
                latitudeDelta: 0.06,
                longitudeDelta: 0.06
            })
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.06,
                longitudeDelta: 0.06
            })
        }
    }

    const fetchResturants = async () => {
        setLoading(true)
        setErrors([])
        try {
            const response = await axios.get(url + `/get-resturante?lat=${location.coords.latitude}&lng=${location.coords.longitude}&lang=${languageSelected}`);
            // console.log(response);
            setErrors([]);
            // setSuccessMsg(response.data.message);
            setResturants(response.data)
            setCurrentImage(response.data[0].thumbnail)
            setCurrentTitle(response.data[0].titles[0].title)
            setCurrentDescription(response.data[0].descriptions[0].description)
            setCurrentAddress(response.data[0].address_name)
            setCurrentLat(response.data[0].lat)
            setCurrentLng(response.data[0].lng)
            
            console.log(response.data[0])
            setLoading(false)
        } catch (error) {
        }
    }

    const navigateToDestenation = (lat, lng) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

        Linking.openURL(url);

        setShowNearestResturantPopUp(false)
        setShowResturantDetails(false)
    };

    const handleMarkerPress = (restaurant, index) => {
        setCurrentImage(restaurant.thumbnail)
        setCurrentTitle(restaurant.titles[0].title)
        setCurrentDescription(restaurant.descriptions[0].description)
        setCurrentAddress(restaurant.address_name)
        setCurrentIndex(index)
    }

    const handleCenterMap = (lat, lng) => {
        setRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02
        })
    }

    const handleNext = () => {
        if (resturants.length > currentIndex + 1) {

            let restaurant = resturants[currentIndex + 1]
            setCurrentImage(restaurant.thumbnail)
            setCurrentTitle(restaurant.titles[0].title)
            setCurrentDescription(restaurant.descriptions[0].description)
            setCurrentAddress(restaurant.address_name)
            setCurrentIndex(currentIndex + 1)
            setCurrentLat(restaurant.lat)
            setCurrentLng(restaurant.lng)
        }else {
            let restaurant = resturants[0]
            setCurrentImage(restaurant.thumbnail)
            setCurrentTitle(restaurant.titles[0].title)
            setCurrentDescription(restaurant.descriptions[0].description)
            setCurrentAddress(restaurant.address_name)
            setCurrentLat(restaurant.lat)
            setCurrentLng(restaurant.lng)
            setCurrentIndex(0)
        }
    }


    const handlePrev = () => {
        if (currentIndex > 0) {

            let restaurant = resturants[currentIndex - 1]
            setCurrentImage(restaurant.thumbnail)
            setCurrentTitle(restaurant.titles[0].title)
            setCurrentDescription(restaurant.descriptions[0].description)
            setCurrentAddress(restaurant.address_name)
            setCurrentIndex(currentIndex - 1)
            setCurrentLat(restaurant.lat)
            setCurrentLng(restaurant.lng)
        }else {
            let restaurant = resturants[resturants.length - 1]
            setCurrentLat(restaurant.lat)
            setCurrentLng(restaurant.lng)
            setCurrentImage(restaurant.thumbnail)
            setCurrentTitle(restaurant.titles[0].title)
            setCurrentDescription(restaurant.descriptions[0].description)
            setCurrentAddress(restaurant.address_name)
            setCurrentIndex(resturants.length - 1)
        }
    }


    useEffect(() => {
        (async () => {

            // Get the user's current location permission status.
            let { status } = await Location.getForegroundPermissionsAsync();

            // If the user has denied location permission, prompt them again.
            if (status !== 'granted') {
                let { status } = await Location.requestForegroundPermissionsAsync();

                // If the user still denies location permission, return.
                if (status !== 'granted') {
                    return;
                }
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            if (location) {
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.06,
                    longitudeDelta: 0.06
                })
            }
        })();
    }, []);

    useEffect(() => {
        () => cetnerLocation;
        fetchResturants();
    }, [location])

    return (
        <View style={{ flex: 1 }}>

            {loading && (
                <View style={{
                    width: '100%',
                    height: '100%',
                    zIndex: 3399996,
                    justifyContent: 'center',
                    alignContent: 'center',
                    marginTop: 22,
                    backgroundColor: 'rgba(0, 0, 0, .5)',
                    position: 'absolute',
                    top: 10,
                    left: 0,
                }}>
                    <ActivityIndicator size="200px" color="#ff7300" />
                </View>
            )}
                <Text style={{
                    position: 'absolute', top: 70, right: 20, color: "#fff",
                    padding: 1 * 16,
                    marginLeft: 10,
                    fontSize: 1 * 16,
                    backgroundColor: '#e41749',
                    fontFamily: 'Outfit_600SemiBold',
                    // fontWeight: 600,
                    borderRadius: 1.25 * 16,
                    zIndex: 9999999999,
                    display: errors.length ? 'flex' : 'none'
                }}>{errors.length ? errors[0] : ''}</Text>
            <Text style={{
                position: 'absolute', top: 70, right: 20, color: "#fff",
                padding: 1 * 16,
                marginLeft: 10,
                fontSize: 1 * 16,
                backgroundColor: '#12c99b',
                fontFamily: 'Outfit_600SemiBold',
                // fontWeight: 600,
                borderRadius: 1.25 * 16,
                zIndex: 9999999999,
                display: successMsg == '' ? 'none' : 'flex'
            }}>{successMsg}</Text>

            <Modal
                animationType='fade'
                transparent={true}
                visible={showNearestResturantPopUp}
            >

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{ fontSize: 18, marginBottom: 15, fontFamily: "Outfit_500Medium", textAlign: 'center' }}>{nearestResturantMsg}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'end', gap: 20, }}>
                            <TouchableOpacity onPress={() => setShowNearestResturantPopUp(false)} style={{ backgroundColor: '#c2c2c2', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 80, alignItems: 'center' }}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigateToDestenation(nearestResturant.resturant.latitude, nearestResturant.resturant.longitude)} style={{ backgroundColor: '#ff7300', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 5, width: 80, alignItems: 'center', color: '#fff' }}>
                                <Text style={{ color: '#fff' }}>Navigate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>

            <View style={[styles.head, {justifyContent: "flex-start", alignItems: "flex-start"}]}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")} style={{backgroundColor: "#8dc645", padding: 10, borderRadius: 10}}>
                    <Ionicons name="arrow-back-outline" size={30} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <MapView
                style={styles.map}
                initialRegion={region}
                region={region}
                mapType='terrain'
                provider={PROVIDER_GOOGLE}
            >
                {location && (
                    <Marker
                        coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
                        icon={<Icon name="location-pin" size={24} color="black" />}
                        style={[{ width: 24, height: 24 }]} // Adjust size as needed
                        />
                )}
                {resturants.length > 0 && (
                    // Iterate through the resturants array
                    resturants.map((restaurant, index) => (

                        <Marker
            
                          key={index}
            
                          coordinate={{
            
                            latitude: parseFloat(restaurant.lat),
            
                            longitude: parseFloat(restaurant.lng),
            
                          }}
                          image={require("./../../assets/images/res_location.png")}
            
                          title={restaurant.titles[0].title}
            
                          description={restaurant.descriptions[0].description}
                          onPress={() => handleMarkerPress(restaurant, index)
                          }
                        />
            
                      ))
                )}

            </MapView>

            {
                currentImage && (
                    <View style={{
                        width: "100%",
                        // padding: 20,
                        position: 'absolute',
                        bottom: 0,
                        left: 0
                    }}>
                        <Slider slides={resturants} setMapCenter={handleCenterMap}/>
                    </View>
                )
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    head: {
        position: 'absolute',
        top: 30,
        padding: 20,
        left: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'start',
        zIndex: 555,
        gap: 10
    },
    input: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 1.25 * 16,
        lineHeight: 1.5 * 16,
        textAlign: 'left',
        padding: 5,
        borderRadius: 1.25 * 16,
        backgroundColor: "#fff",
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: "100%",
    },
    shadow: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    map: {
        width: '100%',
        height: '105%',
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '90%',
        padding: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
});
