import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

let DismissKeyboard = ({ children }) => <View>{children}</View>;

if (Platform.OS !== "web") {
  DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
}

export default DismissKeyboard;
const styles = StyleSheet.create({});
