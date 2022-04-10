import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { db } from "../firebase";

import { Dimensions } from "react-native";

const CustomListItemPosts = ({
  id,
  email,
  description,
  imgURL,
  enterEvent,
}) => {
  const [event, setEvent] = useState([]);

  const windowWidth = Dimensions.get("window").width;

  //get other user data
  useEffect(() => {
    if (email != "") {
      db.collection("events")
        .doc(email)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setEvent(doc.data());
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  }, []);

  return (
    <ListItem
      key={id}
      buttonDivider
      onPress={() =>
        enterEvent(
          id,
          event.title,
          event.photoURL,
          event.email,
          event.description
        )
      }
    >
      <ListItem.Content>
        <View
          right={15}
          style={{
            flex: 1,
            flexDirection: "row",
            paddingBottom: 10,
            borderWidth: 2,
            borderColor: "rgba(222, 222, 222, 0.5)",
            width: windowWidth,
          }}
        >
          <Avatar
            top={5}
            rounded
            source={{
              uri:
                event.photoURL ||
                "https://as2.ftcdn.net/v2/jpg/02/15/84/43/1000_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
            }}
          />
          <ListItem.Title
            style={{ fontWeight: "600", paddingLeft: 10, paddingTop: 10 }}
          >
            {event.title}
          </ListItem.Title>
        </View>
        <Image
          right={15}
          style={{ width: windowWidth, height: windowWidth }}
          source={{
            uri: imgURL,
          }}
        ></Image>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <ListItem.Subtitle
            style={{ fontWeight: "600", right: 10, paddingTop: 10 }}
          >
            {event.title + ": "}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={{ right: 10, paddingTop: 10 }}>
            {description}
          </ListItem.Subtitle>
        </View>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItemPosts;

const styles = StyleSheet.create({});
