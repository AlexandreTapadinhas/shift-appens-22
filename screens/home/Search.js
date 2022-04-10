import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Input } from "react-native-elements";

import { db, auth } from "../../firebase";

//components
import CustomListItemUsers from "../../components/CustomListItemUsers";

const Search = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  //get events
  useEffect(() => {
    const unsubscribe = db
      .collection("events")
      .orderBy("title")
      .startAt(input)
      .endAt(input + "\uf8ff")
      .limit(8)
      .onSnapshot((snapshot) =>
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, [input]);

  const enterProfile = (id, username, photoURL, email) => {
    navigation.navigate("Profile", {
      id: id,
      username: username,
      photoURL: photoURL,
      email: email,
    });
  };

  return (
    <SafeAreaView>
      <View>
        <Input
          placeholder="search users"
          onChangeText={(text) => setInput(text)}
        />
      </View>
      {input === "" ? (
        []
      ) : (
        <ScrollView style={styles.container}>
          {users.map(({ id, data: { title, photoURL, email } }) => (
            <CustomListItemUsers
              key={id}
              id={id}
              photoURL={photoURL}
              username={title}
              email={email}
              enterProfile={enterProfile}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  logo: {
    marginRight: 20,
  },
  container: {
    height: "100%",
  },
});
