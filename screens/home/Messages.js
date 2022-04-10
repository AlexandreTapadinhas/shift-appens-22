import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button } from "react-native-elements";

import { auth, db } from "../../firebase";

import CustomListItemChats from "../../components/CustomListItemChats";

const Messages = ({ navigation }) => {
  const [chats, setChats] = useState([]);

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

  //get chats
  useEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .where("email", "array-contains", auth?.currentUser?.email)
      .onSnapshot((snapshot) =>
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, []);

  //enter chat
  const enterChat = (id, chatName, photoURL, email) => {
    navigation.navigate("Chat", {
      id: id,
      chatName: chatName,
      photoURL: photoURL,
      email: email,
    });
  };

  //go to search
  const goToSearch = () => {
    navigation.navigate("Search");
  };

  return (
    <View style={styles.container}>
      {chats.length === 0 ? (
        <View style={styles.containerText}>
          <Text style={styles.title1}>Messages</Text>
          <Text style={styles.subtitle}>Pretty quiet in here</Text>
          <Button
            title="find new people"
            onPress={goToSearch}
            containerStyle={styles.button}
            titleStyle={{ color: "black", fontSize: 12 }}
            buttonStyle={{
              backgroundColor: "white",
            }}
          />
        </View>
      ) : (
        [
          <Text key={0} style={styles.title2}>
            Messages
          </Text>,
          <ScrollView key={1} style={styles.container}>
            {chats.map(({ id, data: { email } }) => (
              <CustomListItemChats
                key={id}
                id={id}
                email={email}
                enterChat={enterChat}
              />
            ))}
          </ScrollView>,
        ]
      )}
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 150,
  },
  title1: {
    fontSize: 30,
    padding: 5,
  },
  title2: {
    fontSize: 30,
    padding: 5,
    backgroundColor: "white",
  },
  subtitle: {
    fontSize: 15,
    paddingLeft: 5,
  },
  button: {
    width: 110,
    marginTop: 10,
    borderRadius: 30,
  },
});
