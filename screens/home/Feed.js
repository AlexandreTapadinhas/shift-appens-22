import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { auth, db } from "../../firebase";

import CustomListItemPosts from "../../components/CustomListItemPosts";

const Feed = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [subscriptions, setsubscriptions] = useState([]);
  const [subscriptionsListMess, setsubscriptionsListMess] = useState([]);

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

  //get posts
  useEffect(() => {
    if (subscriptions.length != 0) {
      const unsubscribe = db
        .collection("posts")
        .where("user", "in", subscriptions)
        .onSnapshot((snapshot) =>
          setPosts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
      return unsubscribe;
    }
  }, [subscriptions]);

  //get subscriptions
  useEffect(() => {
    const unsubscribe = db
      .collection("subscriptions")
      .where("users", "array-contains", auth?.currentUser?.email)
      .onSnapshot((snapshot) =>
        setsubscriptionsListMess(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, []);

  //get subscriptions
  useEffect(() => {
    let subscriptionsList = [];
    let index = 0;
    if (subscriptionsListMess.length != 0) {
      subscriptionsListMess.forEach((friend) => {
        if (friend.data.users[0] == auth?.currentUser?.email) {
          subscriptionsList[index] = friend.data.users[1];
        } else {
          subscriptionsList[index] = friend.data.users[0];
        }
        index++;
      });
      setsubscriptions(subscriptionsList);
    }
  }, [subscriptionsListMess]);

  //go to search
  const goToSearch = () => {
    navigation.navigate("Search");
  };

  //enter event
  const enterEvent = (id, title, photoURL, email, description) => {
    navigation.navigate("Event", {
      id: id,
      title: title,
      photoURL: photoURL,
      email: email,
      description: description,
    });
  };

  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
        <View style={styles.containerText}>
          <Text style={styles.title1}>Feed</Text>
          <Text style={styles.subtitle}>Pretty quiet in here</Text>
          <Button
            title="find new events"
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
          <ScrollView key={1} style={styles.container}>
            {posts.map(({ id, data: { user, description, imgURL } }) => (
              <CustomListItemPosts
                key={id}
                id={id}
                email={user}
                description={description}
                imgURL={imgURL}
                enterEvent={enterEvent}
              />
            ))}
          </ScrollView>,
        ]
      )}
    </View>
  );
};

export default Feed;

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
