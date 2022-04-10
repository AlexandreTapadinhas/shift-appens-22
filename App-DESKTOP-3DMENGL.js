import React from "react";
import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import LoginScreen from "./screens/Login";
import RegisterScreen from "./screens/Register";
import Chat from "./screens/chat/Chat";
import CameraScreen from "./screens/chat/CameraScreen";
import Profile from "./screens/Profile";
import Home from "./screens/home/Home";
import Settings from "./screens/home/Settings";
import ShowPhoto from "./screens/chat/ShowPhoto";

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
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ShowPhoto" component={ShowPhoto} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
