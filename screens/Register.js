import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";

import { Image, Button, Input } from "react-native-elements";
import "firebase/storage";
import firebase from "firebase/app";
import { auth, db } from "../firebase";

import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

//components
import DismissKeyboard from "../components/DismissKeyboard";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Register = ({ navigation }) => {
  //notifications
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  //notifications
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  //back to login
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Login",
      headerTintColor: "black",
      headerBackTitleStyle: {
        color: "black",
      },
    });
  }, [navigation]);

  //logo
  useLayoutEffect(() => {
    <StatusBar barStyle="dark-content" />;
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTitleColor: "black",
      headerRight: () => (
        <View style={styles.logo}>
          <TouchableOpacity activeOpacity={0.5}>
            <Text style={{ fontSize: 28 }}>TALKS</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  //ask for gallery/camera permision
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  //pick image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.2,
      mediaType: "photo",
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  //upload image
  const uploadImageFirebaseAndRegister = async () => {
    if (image != "") {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
      });

      const ref = firebase
        .storage()
        .ref()
        .child(email + "/profilePic/" + new Date().toISOString());
      const snapshot = ref.put(blob);

      snapshot.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {
          setUploading(true);
        },
        (error) => {
          setUploading(false);
          console.log(error);
        },
        () => {
          snapshot.snapshot.ref.getDownloadURL().then((url) => {
            auth
              .createUserWithEmailAndPassword(email, password)
              .then((authUser) => {
                authUser.user.updateProfile({
                  displayName: name,
                  photoURL:
                    url ||
                    "https://as2.ftcdn.net/v2/jpg/02/15/84/43/1000_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
                });
                //register user in db
                db.collection("users")
                  .doc(email)
                  .set({
                    displayName: name,
                    email: email,
                    photoURL: url,
                    expoPushToken: expoPushToken,
                    bio: "",
                  })
                  .catch((error) => alert(error.message));

                setImage("");
                setName("");
                setEmail("");
                setPassword("");
                navigation.navigate("Login");
              })
              .catch((error) => alert(error.message));
            setUploading(false);
          });
        }
      );
    } else {
      auth.createUserWithEmailAndPassword(email, password).then((authUser) => {
        authUser.user.updateProfile({
          displayName: name,
          photoURL:
            "https://as2.ftcdn.net/v2/jpg/02/15/84/43/1000_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
        });
        //register user in db
        db.collection("users")
          .doc(email)
          .set({
            displayName: name,
            email: email,
          })
          .catch((error) => alert(error.message));
        setImage("");
        setName("");
        setEmail("");
        setPassword("");
        setUploading(false);
        navigation.navigate("Login");
      });
    }
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  return (
    <DismissKeyboard>
      <KeyboardAvoidingView
        behavior={Platform.select({ android: "height", ios: "padding" })}
        style={styles.container}
      >
        <StatusBar style="light" />
        <Text h3 style={{ marginBottom: 50 }}>
          Start Talking today
        </Text>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Full Name"
            autoFocus
            type="text"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            placeholder="Password"
            type="password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          {uploading === false ? (
            <TouchableOpacity
              style={{ marginRight: 20, flexDirection: "row" }}
              onPress={pickImage}
            >
              <Text style={{ marginTop: 3, marginLeft: 10, fontSize: 15 }}>
                Profile Picture
              </Text>
              <AntDesign
                name="camerao"
                size={24}
                color="black"
                style={{ paddingLeft: 20 }}
              />
            </TouchableOpacity>
          ) : (
            <ActivityIndicator />
          )}
        </View>
        <Button
          title="Register"
          onPress={uploadImageFirebaseAndRegister}
          containerStyle={styles.button}
          buttonStyle={{
            backgroundColor: "black",
          }}
        />
        <View style={{ height: 150 }} />
      </KeyboardAvoidingView>
    </DismissKeyboard>
  );
};

//get permissions notifications
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default Register;

const styles = StyleSheet.create({
  logo: {
    marginRight: 20,
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
