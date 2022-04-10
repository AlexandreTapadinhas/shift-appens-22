import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StatusBar,
} from "react-native";
import { Camera } from "expo-camera";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";

//firebase
import firebase from "firebase/app";
import { auth, db } from "../../firebase";

const WINDOW_HEIGHT = Dimensions.get("window").height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

const CameraComponent = ({ navigation, route }) => {
  const cameraRef = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");
  const [input, setInput] = useState("");

  //header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitleStyle: { color: "white", alignSelf: "center" },
      headerBackTitleVisible: false,
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  //permissions
  useEffect(() => {
    onHandlePermission();
  }, []);

  //permissions
  const onHandlePermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  //check permissions
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
      </View>
    );
  }

  //camera ready
  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  //switch camera
  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  //take photo
  const onSnap = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.2, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.base64;

      setImage(data.uri);

      if (source) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);
      }
    }
  };

  //cancel preview
  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
  };

  //send message
  const sendMessage = () => {
    Keyboard.dismiss();
    if (!image) {
      db.collection("chats").doc(route.params.id).collection("messages").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        email: auth.currentUser.email,
        image: "",
      });
    } else {
      uploadImageFirebase();
    }
    setImage("");
    navigation.goBack();
  };

  //upload image
  const uploadImageFirebase = async () => {
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
        auth?.currentUser?.email + "/photoMessages/" + new Date().toISOString()
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
          db.collection("chats")
            .doc(route.params.id)
            .collection("messages")
            .add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              image: url,
              message: input,
              displayName: auth.currentUser.displayName,
              email: auth.currentUser.email,
              photoURL: auth.currentUser.photoURL,
            });

          setUploading(false);
          return url;
        });
      }
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Camera
        ref={cameraRef}
        style={styles.container}
        type={cameraType}
        onCameraReady={onCameraReady}
      />
      <View style={styles.container}>
        {isPreview && [
          <TouchableOpacity
            key={0}
            onPress={cancelPreview}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <AntDesign name="close" size={32} color="white" />
          </TouchableOpacity>,
          <View key={1} style={styles.bottomSendContainer}>
            <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
              <Ionicons name="send" size={32} color="white" />
            </TouchableOpacity>
          </View>,
        ]}
        {!isPreview && (
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
              <MaterialIcons name="flip-camera-ios" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={!isCameraReady}
              onPress={onSnap}
              style={styles.capture}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    color: "#fff",
  },
  bottomButtonsContainer: {
    position: "absolute",
    flexDirection: "row",
    bottom: 28,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSendContainer: {
    position: "absolute",
    flexDirection: "row",
    bottom: 28,
    right: 20,
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  capture: {
    backgroundColor: "white",
    borderRadius: 5,
    height: CAPTURE_SIZE,
    width: CAPTURE_SIZE,
    borderRadius: Math.floor(CAPTURE_SIZE / 2),
    marginBottom: 28,
    marginHorizontal: 30,
  },
  closeButton: {
    position: "absolute",
    top: 35,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
});
