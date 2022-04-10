import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";

import { Image, Button, Input } from "react-native-elements";
import { auth } from "../firebase";

//components
import DismissKeyboard from "../components/DismissKeyboard";

const Login = ({ navigation }) => {
  //logo
  useLayoutEffect(() => {
    <StatusBar barStyle="dark-content" />;
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTitleColor: "black",
      headerLeft: () => (
        <View style={styles.logo}>
          <TouchableOpacity activeOpacity={0.5}>
            <Text style={{ fontSize: 28 }}>TALKS</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //login
  const signIn = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
  };

  //change to home
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <DismissKeyboard>
      <KeyboardAvoidingView
        behavior={Platform.select({ android: "height", ios: "padding" })}
        style={styles.container}
      >
        <View style={styles.inputContainer}>
          <Input
            placeholder="Email"
            autoFocus
            type="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            placeholder="Password"
            secureTextEntry
            type="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            onSubmitEditing={signIn}
          />
        </View>
        <Button
          title="Login"
          onPress={signIn}
          containerStyle={styles.button}
          buttonStyle={{
            backgroundColor: "black",
          }}
        />
        <Button
          backgroundColor={"black"}
          title="Register"
          onPress={() => navigation.navigate("Register")}
          containerStyle={styles.button}
          buttonStyle={{
            backgroundColor: "black",
          }}
        />
      </KeyboardAvoidingView>
    </DismissKeyboard>
  );
};

export default Login;

const styles = StyleSheet.create({
  logo: {
    marginLeft: 5,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
