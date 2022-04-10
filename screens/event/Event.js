import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useLayoutEffect } from "react";
import { AntDesign } from "@expo/vector-icons";

const Event = ({ navigation, route }) => {
  const goToShop = () => {
    navigation.navigate("Stands", { email: route.params.email });
  };

  //header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Event",
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
            Eventos
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
      <Text
        style={{
          color: "black",
          textAlign: "center",
          marginTop: 30,
          fontWeight: "700",
          fontSize: 30,
        }}
      >
        {route.params.title}
      </Text>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={{
            uri: route.params.photoURL,
          }}
        />
      </View>
      <Text
        style={{
          color: "black",
          textAlign: "center",
          marginTop: 30,
          fontWeight: "500",
          fontSize: 20,
        }}
      >
        {route.params.description}
      </Text>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={goToShop}
        style={{
          marginRight: 20,
          marginTop: 20,
          borderWidth: 2,
          borderRadius: 10,
          width: "70%",
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            color: "black",
            textAlign: "center",
            marginTop: 10,
            marginBottom: 10,
            fontWeight: "400",
            fontSize: 15,
          }}
        >
          Podes Efetuar as tuas compras aqui
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Event;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    marginTop: 20,
    width: 100,
    height: 85,
  },
});
