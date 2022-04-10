import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { db } from "../../../firebase";
import CustomListItemStands from "../../../components/CustomListItemStands";

const Stands = ({ navigation, route }) => {
  const [stands, setStands] = useState([]);

  //enter shop
  const enterShop = (id, email, title) => {
    navigation.navigate("Shop", {
      id: id,
      email: email,
      title: title,
    });
  };
  //header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Shop",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTitleColor: "black",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            onPress={navigation.goBack}
            style={{ color: "black", fontWeight: "700", fontSize: 18 }}
          >
            Lojas
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  //get stands
  useEffect(() => {
    const unsubscribe = db
      .collection("events")
      .doc(route.params.email)
      .collection("stands")
      .onSnapshot((snapshot) =>
        setStands(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, []);

  return (
    <View>
      {stands.map(({ id, data: { title, photo, description } }) => (
        <CustomListItemStands
          key={id}
          id={id}
          title={title}
          photo={photo}
          description={description}
          enterShop={enterShop}
          email={route.params.email}
        />
      ))}
    </View>
  );
};

export default Stands;

const styles = StyleSheet.create({});
