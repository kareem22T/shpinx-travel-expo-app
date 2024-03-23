import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image, Text, Icon, Tag} from './../../components';
import {BaseColor, useTheme} from './../../config';
import PropTypes from 'prop-types';
import styles from './styles';
import { url } from '../../apis/a-MainVariables';

export default function RoomType(props) {
  const {colors} = useTheme();
  const {style, image, name,description, available, services, price, onPress} = props;
  return (
    <View style={[styles.listContent, style]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Image source={image} style={styles.listImage} />
      </TouchableOpacity>
      <View style={styles.listContentRight}>
        <Text headline semibold numberOfLines={1}>
          {name}
        </Text>
        <Text numberOfLines={3}>
          {description}
        </Text>
        <View style={styles.listContentService}>
          {services.slice(0, 4).map((item, index) => (
            <View
              key={'service' + index}
              chip
              style={{
                marginTop: 5,
                marginRight: 5,
                padding: 5,
                borderWidth: 1,
                borderRadius: 25,
                borderColor: colors.primaryLight
              }}>
                <Image source={{uri: url + item.icon_path}} style={{width: 25, height: 25, resizeMode: "contain"}} />
            </View>
          ))}
        </View>
        <Text
          title3
          primaryColor
          semibold
          style={{paddingTop: 10, paddingBottom: 5}}>
          {price}
        </Text>
      </View>
    </View>
  );
}

RoomType.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  name: PropTypes.string,
  price: PropTypes.string,
  available: PropTypes.string,
  services: PropTypes.array,
  onPress: PropTypes.func,
};

RoomType.defaultProps = {
  style: {},
  image: '',
  name: '',
  price: '',
  available: '',
  services: [],
  onPress: () => {},
};
