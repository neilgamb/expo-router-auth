import { View, ActivityIndicator, StyleSheet } from "react-native";

export default Loader = () => (
  <View
    style={{
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <ActivityIndicator size="large" />
  </View>
);
