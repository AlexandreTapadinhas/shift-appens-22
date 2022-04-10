import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { auth, db } from "../firebase";

const CustomListItemChats = ({ id, enterChat, email }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [otherUserEmail, setOtherUserEmail] = useState("");
  const [otherUser, setOtherUser] = useState([]);
  const [lastMessageIsPhoto, setLastMessageIsPhoto] = useState("blank");

  //get other user data
  useEffect(() => {
    email.forEach((email) => {
      if (auth?.currentUser?.email != email) {
        setOtherUserEmail(email);
      }
    });

    if (otherUserEmail != "") {
      db.collection("events")
        .doc(otherUserEmail)
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
    }
  }, [otherUserEmail]);

  //is last message an image
  useEffect(() => {
    if (chatMessages?.length <= 0) {
      setLastMessageIsPhoto("blank");
    } else {
      if (chatMessages?.[0]?.message == "") {
        setLastMessageIsPhoto("true");
      } else {
        setLastMessageIsPhoto("false");
      }
    }
  }, [chatMessages]);

  useEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setChatMessages(snapshot.docs.map((doc) => doc.data()))
      );
    return unsubscribe;
  }, []);

  return (
    <ListItem
      onPress={() =>
        enterChat(id, otherUser.title, otherUser.photoURL, otherUser.email)
      }
      key={id}
      buttonDivider
    >
      <Avatar
        rounded
        source={{
          uri:
            otherUser.photoURL ||
            "https://as2.ftcdn.net/v2/jpg/02/15/84/43/1000_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {otherUser.title}
        </ListItem.Title>
        {lastMessageIsPhoto === "blank" ? (
          <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
            new conversation with: {otherUser.title}
          </ListItem.Subtitle>
        ) : (
          <View>
            {lastMessageIsPhoto === "false" ? (
              <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                {chatMessages?.[0]?.displayName +
                  ": " +
                  chatMessages?.[0]?.message}
              </ListItem.Subtitle>
            ) : (
              <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                {chatMessages?.[0]?.displayName + ": " + "sent a photo"}
              </ListItem.Subtitle>
            )}
          </View>
        )}
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItemChats;

const styles = StyleSheet.create({});
