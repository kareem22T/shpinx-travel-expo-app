import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity, 
  Linking
} from 'react-native';
import React from 'react';
import { url } from '../../../apis/a-MainVariables';

const {width, height} = Dimensions.get('screen');

const SlideItem = ({item}) => {
  const navigateToDestenation = (lat, lng) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      Linking.openURL(url);
  };

  const translateYImage = new Animated.Value(40);

  Animated.timing(translateYImage, {
    toValue: 0,
    duration: 1000,
    useNativeDriver: true,
    easing: Easing.bounce,
  }).start();

  return (
    <View style={[styles.container, { padding: 15, justifyContent: "flex-end"}]}>
      <Animated.Image
        source={item.img}
        resizeMode="contain"
        style={[
          styles.image,
          {
            transform: [
              {
                translateY: translateYImage,
              },
            ],
          },
        ]}
      />
      <View style={{
          maxWidth: '97%',
          minHeight: 160,
          borderRadius: 10,
          backgroundColor: '#fff',
          marginBottom: 50,
          elevation: 5,
          shadowColor: '#000',
          padding: 8,
          shadowOffset: {
              width: 1.5,
              height: 1.5,
          },
          shadowOpacity: 1,
          shadowRadius: 4,            
          shadowColor: "#c7c7cc",
          borderColor: "#c7c7cc63",
          borderWidth: 1,
          flexDirection: 'row',
          gap: 16
      }}>
          <Image source={{uri: url + item.thumbnail}} style={{width:"50%", height: "100%", resizeMode: "cover", borderRadius: 5}} />
          <View style={{width: "48%", justifyContent: 'space-between'}}>
              <View>
                  <Text style={{fontSize: 25, fontWeight: 600, marginBottom: 5}}>{item.titles[0].title}</Text>
                  <Text style={{fontSize: 14, fontWeight: 500, width: "100%", paddingRight: 5}}>{item.descriptions[0].description}</Text>
                  <Text style={{fontSize: 13, fontWeight: 500, color: "#00397f", paddingRight: 5}}>{item.address_name}</Text>
              </View>
              <View style={{width: "90%"}}>
                  <TouchableOpacity onPress={() => navigateToDestenation(item.lat, item.lng)} style={{marginTop: 5, marginBottom: 5,width: "100%", padding: 8, borderRadius: 5, backgroundColor: "#1976bc"}}><Text style={{color: "#fff", textAlign: 'center'}}>Navigate</Text></TouchableOpacity>
              </View>
          </View>
      </View>

      {/* <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View> */}
    </View>
  );
};

export default SlideItem;

const styles = StyleSheet.create({
  container: {
    width,
    height: "auto",
    alignItems: 'center',
  },
  image: {
    // flex: 0.6,
    width: '100%',
  },
  content: {
    flex: 0.4,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 18,
    marginVertical: 12,
    color: '#333',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
