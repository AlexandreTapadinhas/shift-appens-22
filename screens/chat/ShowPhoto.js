import React from "react";
import { StyleSheet, Image, View, Dimensions } from "react-native";

const showPhoto = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: route.params.photoURL }}
        style={{
          width: 400,
          height: 500,
        }}
      ></Image>
    </View>
  );
};

export default showPhoto;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
