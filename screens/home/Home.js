import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Avatar } from "react-native-elements";
import { auth } from "../../firebase";
import { SimpleLineIcons } from "@expo/vector-icons";

import Feed from "./Feed";
import Messages from "./Messages";
import Search from "./Search";

const Tab = createMaterialTopTabNavigator();

const Home = ({ navigation }) => {
  const goToSettings = () => {
    navigation.navigate("Settings");
  };

  //header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTitleColor: "black",
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            paddingLeft: 5,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={goToSettings}
            style={{ marginRight: 20 }}
          >
            <Avatar
              rounded
              source={{
                uri: auth?.currentUser?.photoURL,
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => navigation.navigate("Search")}
            activeOpacity={0.5}
          >
            <SimpleLineIcons name="magnifier" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => navigation.navigate("Messages")}
            activeOpacity={0.5}
          >
            <SimpleLineIcons name="cursor" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        tabBarItemStyle: { width: 100 },
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Feed" component={Feed} options={{ title: "Feed" }} />
      <Tab.Screen name="Messages" component={Messages} />
    </Tab.Navigator>
  );
};

export default Home;

const styles = StyleSheet.create({});
