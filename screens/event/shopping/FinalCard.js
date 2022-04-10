import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { CardField } from "@stripe/stripe-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

const FinalCard = ({ navigation, route }) => {
  const [cardDetails, setCardDetails] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Payment",
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
            style={{ color: "black", fontWeight: "700" }}
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

  return (
    <View>
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
      />
      <Text style={{ fontSize: 30, textAlign: "center", paddingTop: 10 }}>
        Total: {route.params.totalMoney}€
      </Text>
      <TouchableOpacity>
        <Text style={{ fontSize: 30, textAlign: "center", paddingTop: 10 }}>
          Pay (not implemented)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FinalCard;

const styles = StyleSheet.create({});
