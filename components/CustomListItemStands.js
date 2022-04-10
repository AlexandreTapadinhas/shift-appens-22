import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";

const CustomListItemStands = ({
  id,
  title,
  photo,
  enterShop,
  email,
  description,
}) => {
  return (
    <ListItem
      onPress={() => enterShop(id, email, title)}
      key={id}
      buttonDivider
    >
      <Avatar
        rounded
        source={{
          uri: photo,
        }}
        size={50}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>{title}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {description}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItemStands;

const styles = StyleSheet.create({});
