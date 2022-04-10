import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { db } from "../firebase";

const CustomListItemUsers = ({
  id,
  username,
  enterProfile,
  photoURL,
  email,
}) => {
  return (
    <ListItem
      onPress={() => enterProfile(id, username, photoURL, email)}
      key={id}
      buttonDivider
    >
      <Avatar
        rounded
        source={{
          uri:
            photoURL ||
            "https://as2.ftcdn.net/v2/jpg/02/15/84/43/1000_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {username}
        </ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItemUsers;

const styles = StyleSheet.create({});
