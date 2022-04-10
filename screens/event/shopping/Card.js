import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import OptionsMenu from "react-native-option-menu";
import CustomListItemShop from "../../../components/CustomListItemShop";

const Card = ({ navigation, route }) => {
  const [card, setCard] = useState(route.params.card);

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
            Carrinho
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

  const removeItem = (id_current) => {
    var temp_card = card;
    for (var i = 0; i < card.length; i++) {
      if (temp_card[i].id == id_current) {
        temp_card.splice(i, 1);
        setCard(temp_card);
      }
    }
    navigation.navigate("Card", {
      card: card,
      inventory: route.params.inventory,
    });
  };

  const iconItem = (id, title, photo, price) => (
    <CustomListItemShop
      key={id}
      id={id}
      title={title}
      photo={photo}
      price={price}
    />
  );

  const goPay = () => {
    var totalMoney = 0;
    for (var i = 0; i < card.length; i++) {
      totalMoney += Number(card[i].data.price);
    }
    navigation.navigate("FinalCard", {
      totalMoney: totalMoney,
    });
  };

  return (
    <View>
      {card.map(({ id, data: { title, photo, price } }) => (
        <OptionsMenu
          key={id}
          customButton={iconItem(id, title, photo, price)}
          options={["Remover", "Cancel"]}
          actions={[() => removeItem(id)]}
        />
      ))}
      <TouchableOpacity
        style={{ paddingTop: 20, alignItems: "center" }}
        onPress={() => goPay()}
      >
        <Text
          style={{
            fontSize: 30,
            textAlign: "center",
            borderWidth: 2,
            width: "70%",
          }}
        >
          Pay
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#E1FFF7",
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
});
