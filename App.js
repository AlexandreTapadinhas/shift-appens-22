import React from "react";
import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./screens/Login";
import RegisterScreen from "./screens/Register";
import Chat from "./screens/chat/Chat";
import CameraScreen from "./screens/chat/CameraScreen";
import Profile from "./screens/Profile";
import Home from "./screens/home/Home";
import Settings from "./screens/home/Settings";
import ShowPhoto from "./screens/chat/ShowPhoto";
import Search from "./screens/home/Search";
import Event from "./screens/event/Event";
import Stands from "./screens/event/shopping/Stands";
import Shop from "./screens/event/shopping/Shop";
import Card from "./screens/event/shopping/Card";
import FinalCard from "./screens/event/shopping/FinalCard";

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "black" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={globalScreenOptions}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Event" component={Event} />
        <Stack.Screen name="Stands" component={Stands} />
        <Stack.Screen name="Shop" component={Shop} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ShowPhoto" component={ShowPhoto} />
        <Stack.Screen name="Card" component={Card} />
        <Stack.Screen name="FinalCard" component={FinalCard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
