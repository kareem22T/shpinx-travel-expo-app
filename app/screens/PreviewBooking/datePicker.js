import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import DatePicker from '@react-native-community/datetimepicker';
import { Entypo } from "@expo/vector-icons";
export default function DatePickerC() {
  const [date, setDate] = useState(new Date().toString());
  const [dates, setDates] = useState(new Date());


  return (
    <View style={styles.container}>
      <DatePicker
        date={date}
        value={dates}
        onChange={(date) => setDate(new Date(date['nativeEvent']['timestamp']))}
        icon={<Entypo name="chevron-right" size={40} color="#689CA3" />}
      />

      <Text>
        {date.toString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});