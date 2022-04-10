import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";

import { Button, Avatar, Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";

//firebase
import { auth, db } from "../../firebase";
import "firebase/storage";
import firebase from "firebase/app";

//components
import DismissKeyboard from "../../components/DismissKeyboard";

const Settings = ({ navigation }) => {
  //back to home
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "home",
      headerTintColor: "black",
      headerBackTitleStyle: {
        color: "black",
      },
    });
  }, [navigation]);

  //logo
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "settings",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTitleColor: "black",
    });
  }, [navigation]);

  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };

  const changeProfileName = async () => {
    auth.currentUser.updateProfile({
      displayName: name,
    });
    db.collection("users")
      .doc(auth?.currentUser?.email)
      .update({ displayName: name });
  };

  const saveChanges = async () => {
    if (image != "") {
      uploadImageFirebaseAndUpdate();
    }
    if (name != auth?.currentUser?.displayName) {
      changeProfileName();
    }
  };

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
      quality: 0.1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  //upload image
  const uploadImageFirebaseAndUpdate = async () => {
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
      .child(
        auth?.currentUser?.email + "/profilePic/" + new Date().toISOString()
      );
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
          auth.currentUser
            .updateProfile({
              photoURL: url,
            })
            .catch((error) => alert(error.message));
          db.collection("users")
            .doc(auth?.currentUser?.email)
            .update({ photoURL: url });
          setUploading(false);
        });
      }
    );
  };

  const [image, setImage] = useState("");
  const [name, setName] = useState(auth?.currentUser?.displayName);
  const [uploading, setUploading] = useState(false);
  return [
    <DismissKeyboard key="0">
      <View key="1" style={styles.containerTop}>
        <Avatar
          titleStyle={{ fontSize: 35 }}
          title="profile picture"
          size={150}
          rounded
          showAccessory
          source={{
            uri: image || auth?.currentUser?.photoURL,
          }}
        >
          <Avatar.Accessory
            size={40}
            onPress={pickImage}
            style={{ backgroundColor: "gray" }}
          />
        </Avatar>
        <Input
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.nameInput}
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
      </View>
    </DismissKeyboard>,
    <View key="2" style={styles.containerBottom}>
      {uploading === false ? (
        <TouchableOpacity style={{ flexDirection: "row" }} onPress={pickImage}>
          <Button
            title="Save Changes"
            onPress={saveChanges}
            containerStyle={styles.button}
            buttonStyle={{
              backgroundColor: "#25cf52",
            }}
          />
        </TouchableOpacity>
      ) : (
        <ActivityIndicator />
      )}
      <Button
        title="SignOut"
        onPress={signOutUser}
        containerStyle={styles.button}
        titleStyle={{ color: "red" }}
        buttonStyle={{
          backgroundColor: "white",
        }}
      />
    </View>,
  ];
};

export default Settings;

const styles = StyleSheet.create({
  logo: {
    marginRight: 20,
  },
  containerTop: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  containerBottom: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 10,
    backgroundColor: "white",
  },
  button: {
    width: 150,
    marginTop: 10,
    borderRadius: 30,
  },
  nameInput: {
    textAlign: "center",
    fontSize: 20,
  },
});
