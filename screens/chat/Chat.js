import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

//firebase
import firebase from "firebase/app";
import { auth, db } from "../../firebase";

const Chat = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const scrollViewRef = useRef();

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
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  //load messages
  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, []);

  //go to profile
  const goToProfile = async () => {
    navigation.navigate("Profile", {
      id: route.params.id,
      username: route.params.chatName,
      photoURL: route.params.photoURL,
      email: route.params.email,
    });
  };

  //header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
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
          <Avatar
            rounded
            source={{
              uri:
                route.params.photoURL ||
                "https://as2.ftcdn.net/v2/jpg/02/15/84/43/1000_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
            }}
            onPress={goToProfile}
          />
          <Text
            style={{ color: "black", marginLeft: 10, fontWeight: "700" }}
            onPress={goToProfile}
          >
            {route.params.chatName}
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
  }, [navigation, messages]);

  //send message
  const sendMessage = () => {
    Keyboard.dismiss();
    if (!image && input != "") {
      db.collection("chats").doc(route.params.id).collection("messages").add({
        displayName: auth.currentUser.displayName,
        message: input,
        email: auth.currentUser.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        image: "",
      });
    }
    if (image) {
      uploadImageFirebase();
    }
    setInput("");
    setImage("");
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

  const goToCamera = () => {
    navigation.navigate("Camera", {
      id: route.params.id,
      chatName: route.params.chatName,
      photoURL: route.params.photoURL,
    });
  };

  const goToPhoto = (photoURL) => {
    navigation.navigate("ShowPhoto", {
      photoURL: photoURL,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiis}>
          <>
            <ScrollView
              key={0}
              contentContainerStyle={{ paddingTop: 15 }}
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current.scrollToEnd({ animated: true })
              }
            >
              {messages.map(({ id, data }) => [
                <View key={0} style={styles.timestamp}>
                  <Text style={styles.senderName}>
                    {data.timestamp?.toDate().getHours() +
                      ":" +
                      data.timestamp?.toDate().getMinutes()}
                  </Text>
                </View>,
                data.image === ""
                  ? data.email === auth.currentUser.email
                    ? [
                        <View key={id} style={styles.sender}>
                          <Text style={styles.senderText}>{data.message}</Text>
                        </View>,
                      ]
                    : [
                        <View key={id} style={styles.receiver}>
                          <Text style={styles.receiverText}>
                            {data.message}
                          </Text>
                        </View>,
                      ]
                  : data.email === auth.currentUser.email
                  ? [
                      <View key={id} style={styles.senderImage}>
                        {data.message === "" ? (
                          <TouchableOpacity
                            style={{ marginRight: 20 }}
                            onPress={() => goToPhoto(data.image)}
                          >
                            <Image
                              source={{ uri: data.image }}
                              style={{
                                width: 200,
                                height: 200,
                                borderRadius: 15,
                              }}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View key={id} style={styles.senderImageWithText}>
                            <Text key={id} style={styles.senderTextWithImage}>
                              {data.message}
                            </Text>
                            <TouchableOpacity
                              key={id + 1}
                              style={{ marginRight: 20 }}
                              onPress={() => goToPhoto(data.image)}
                            >
                              <Image
                                source={{ uri: data.image }}
                                style={{
                                  width: 200,
                                  height: 200,
                                  borderRadius: 15,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>,
                    ]
                  : [
                      <View key={1} style={styles.receiverImage}>
                        {data.message === "" ? (
                          <TouchableOpacity
                            style={{ marginRight: 20 }}
                            onPress={() => goToPhoto(data.image)}
                          >
                            <Image
                              source={{ uri: data.image }}
                              style={{
                                width: 200,
                                height: 200,
                                borderRadius: 15,
                              }}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.receiverImageWithText}>
                            <Text key={0} style={styles.receiverText}>
                              {data.message}
                            </Text>
                            <TouchableOpacity
                              key={1}
                              style={{ marginRight: 20 }}
                              onPress={() => goToPhoto(data.image)}
                            >
                              <Image
                                source={{ uri: data.image }}
                                style={{
                                  width: 200,
                                  height: 200,
                                  borderRadius: 15,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>,
                    ],
              ])}
            </ScrollView>
            <View key={1} style={styles.footer}>
              {!uploading ? (
                [
                  <TouchableOpacity key={0} style={{ marginRight: 20 }}>
                    <AntDesign
                      name="camerao"
                      size={24}
                      color="black"
                      onPress={goToCamera}
                    />
                  </TouchableOpacity>,
                  <TouchableOpacity
                    key={1}
                    style={{ marginRight: 20 }}
                    onPress={pickImage}
                  >
                    <SimpleLineIcons name="picture" size={24} color="black" />
                  </TouchableOpacity>,
                ]
              ) : (
                <ActivityIndicator style={{ paddingRight: 10 }} />
              )}
              <TextInput
                key={0}
                value={input}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={sendMessage}
                style={styles.textInput}
                placeholder="Signal Message"
              />
              <TouchableOpacity
                key={1}
                onPress={sendMessage}
                activeOpacity={0.5}
              >
                <Ionicons name="send" size={24} color="#2B68E6" />
              </TouchableOpacity>
            </View>

            {image === "" ? (
              []
            ) : (
              <View key={0}>
                <Image
                  key={0}
                  source={{ uri: image }}
                  style={{
                    marginLeft: 20,
                    marginBottom: 10,
                    width: 100,
                    height: 100,
                    borderRadius: 15,
                  }}
                />
                <Ionicons
                  key={1}
                  name="close"
                  size={24}
                  style={{
                    position: "absolute",
                    left: 105,
                    top: -5,
                    color: "white",
                  }}
                  onPress={() => {
                    setImage("");
                  }}
                />
                <Ionicons
                  key={2}
                  name="close-circle"
                  size={24}
                  style={{
                    position: "absolute",
                    left: 105,
                    top: -5,
                    color: "black",
                  }}
                  onPress={() => {
                    setImage("");
                  }}
                />
              </View>
            )}
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timestamp: {
    paddingBottom: 20,
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  sender: {
    padding: 15,
    backgroundColor: "#286BE6",
    alignSelf: "flex-end",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  receiverImageWithText: {
    borderRadius: 20,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
    maxWidth: "80%",
    position: "relative",
  },
  senderImageWithText: {
    borderRadius: 20,
    backgroundColor: "#286BE6",
    alignSelf: "flex-end",
    maxWidth: "80%",
    position: "relative",
    padding: 15,
  },
  senderTextWithImage: {
    paddingBottom: 10,
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
  },
  senderImage: {
    alignSelf: "flex-end",
    margin: 10,
    maxWidth: "80%",
    position: "relative",
  },
  receiverImage: {
    padding: 15,
    alignSelf: "flex-start",
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
  },
  receiverText: {
    color: "black",
    fontWeight: "500",
    margin: 10,
  },
  receiverName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "black",
  },
});
