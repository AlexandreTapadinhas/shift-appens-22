import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { db } from "../../../firebase";
import CustomListItemShop from "../../../components/CustomListItemShop";
import OptionsMenu from "react-native-option-menu";

const Shop = ({ navigation, route }) => {
  const [inventory, setInventory] = useState([]);
  const [card, setCard] = useState([]);

  const [numItems, setNumItems] = useState(0);

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
            Loja - {route.params.title}
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
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 20, flexDirection: "row" }}
          onPress={() =>
            navigation.navigate("Card", {
              card: card,
              inventory: inventory,
            })
          }
        >
          <AntDesign name="shoppingcart" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    setNumItems(card.length);
    navigation.navigate("Shop", {
      id: route.params.id,
      email: route.params.email,
      title: route.params.title,
    });
  }, [card]);

  //get inventory
  useEffect(() => {
    const unsubscribe = db
      .collection("events")
      .doc(route.params.email)
      .collection("stands")
      .doc(route.params.id)
      .collection("inventory")
      .onSnapshot((snapshot) =>
        setInventory(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, []);

  const iconItem = (id, title, photo, price) => (
    <CustomListItemShop
      key={id}
      id={id}
      title={title}
      photo={photo}
      price={price}
    />
  );

  return (
    <View>
      {inventory.map(({ id, data: { title, photo, price } }) => (
        <OptionsMenu
          key={id}
          customButton={iconItem(id, title, photo, price)}
          options={["Adicionar ao Carrinho", "Cancel"]}
          actions={[() => card.push({ id, data: { title, photo, price } })]}
        />
      ))}
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({});
