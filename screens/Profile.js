import React, { useLayoutEffect, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Button, Avatar, Input } from "react-native-elements";
import { SimpleLineIcons } from "@expo/vector-icons";
import { auth, db } from "../firebase";

const Profile = ({ navigation, route }) => {
  const [chats, setChats] = useState([]);
  const [navigateToChat, setnavigateToChat] = useState("");
  const [otherUser, setOtherUser] = useState([]);
  const [subscriptions, setsubscriptions] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const [docIsFriend, setDocIsFriend] = useState("");

  //get users subscriptions
  useEffect(() => {
    if (otherUser.length != 0) {
      db.collection("subscriptions")
        .where("users", "array-contains", auth?.currentUser?.email)
        .onSnapshot((snapshot) =>
          setsubscriptions(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    }
  }, [otherUser]);

  //is friend?
  useEffect(() => {
    if (subscriptions.length != 0) {
      subscriptions.forEach((friend) => {
        if (friend.data.users.includes(otherUser.email)) {
          setIsFriend(true);
          setDocIsFriend(friend.id);
        }
      });
    }
  }, [subscriptions]);

  //get other user data
  useEffect(() => {
    db.collection("events")
      .doc(route.params.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setOtherUser(doc.data());
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [navigateToChat]);

  //check if a conversation is already going on
  useEffect(() => {
    chats.forEach((chat) => {
      if (
        (chat.data.email[0] == auth?.currentUser?.email ||
          chat.data.email[1] == auth?.currentUser?.email) &&
        (chat.data.email[0] == otherUser.email ||
          chat.data.email[1] == otherUser.email)
      ) {
        setnavigateToChat(chat.id);
      }
    });
  }, [chats, otherUser]);

  //get chat
  useEffect(() => {
    db.collection("chats")
      .where("email", "array-contains", auth?.currentUser?.email)
      .onSnapshot((snapshot) =>
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);

  //back to search
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "search",
      headerTintColor: "black",
      headerBackTitleStyle: {
        color: "black",
      },
    });
  }, [navigation]);

  //header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTitleColor: "black",
    });
  }, [navigation]);

  //create chat / move to chat
  const createChat = async () => {
    if (navigateToChat == "") {
      await db
        .collection("chats")
        .add({
          email: [auth?.currentUser?.email, route.params.email],
        })
        .then(function (docRef) {
          navigation.replace("Chat", {
            id: docRef.id,
            chatName: otherUser.title,
            photoURL: otherUser.photoURL,
            email: otherUser.email,
          });
        })
        .catch((error) => alert(error.message));
    } else {
      navigation.replace("Chat", {
        id: navigateToChat,
        chatName: otherUser.title,
        photoURL: otherUser.photoURL,
        email: otherUser.email,
      });
    }
  };

  const addFriend = async () => {
    await db.collection("subscriptions").add({
      users: [auth?.currentUser?.email, otherUser.email],
    });
  };

  const removeFriend = async () => {
    await db.collection("subscriptions").doc(docIsFriend).delete();
    setIsFriend(false);
  };

  return (
    <View style={styles.containerTop}>
      <View style={styles.containerAvatar}>
        <Avatar
          titleStyle={{ fontSize: 35 }}
          title="profile picture"
          size={75}
          rounded
          source={{
            uri:
              route.params.photoURL ||
              "https://as2.ftcdn.net/v2/jpg/02/15/84/43/1000_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
          }}
        ></Avatar>
        <Text style={styles.name}>{route.params.username}</Text>
      </View>
      {otherUser.bio?.length === 0 ? (
        []
      ) : (
        <View style={styles.containerBio}>
          <Text style={styles.textBio}>{otherUser.bio}</Text>
        </View>
      )}
      {isFriend === true ? (
        <View style={styles.containerButtons}>
          <Button
            key={0}
            title="send message"
            onPress={createChat}
            containerStyle={styles.button}
            buttonStyle={{
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "black",
              fontSize: 12,
            }}
          />
          <Button
            key={1}
            title="remove event"
            onPress={removeFriend}
            containerStyle={styles.button}
            buttonStyle={{
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "black",
              fontSize: 12,
            }}
          />
        </View>
      ) : (
        <View style={styles.containerButtons}>
          <Button
            title="add event"
            onPress={addFriend}
            containerStyle={styles.button}
            buttonStyle={{
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 5,
            }}
            titleStyle={{
              color: "black",
              fontSize: 12,
            }}
          />
        </View>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  containerTop: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  containerAvatar: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  name: {
    padding: 10,
    paddingTop: 50,
    fontSize: 20,
  },
  containerBio: {
    borderRadius: 5,
    borderBottomWidth: 1,
    borderColor: "rgba(204, 204, 204, 0.5)",
    alignSelf: "flex-start",
  },
  textBio: {
    color: "black",
    padding: 10,
  },
  containerButtons: {
    marginTop: 10,
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  button: {
    width: 90,
    marginTop: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});
