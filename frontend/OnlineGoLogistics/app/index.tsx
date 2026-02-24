import { useEffect } from "react";
import { router } from "expo-router";
import { getToken } from "../utils/token";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      console.log("TOKEN:", token);

      if (token) {
        router.replace("/drawer/tabs/dashboard");
      } else {
        router.replace("/login");
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
