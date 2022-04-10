import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";

const CustomListItemShop = ({ id, title, photo, price }) => {
  return (
    <View>
      <ListItem key={id} buttonDivider>
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
            {price}€
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </View>
  );
};

export default CustomListItemShop;

const styles = StyleSheet.create({});
