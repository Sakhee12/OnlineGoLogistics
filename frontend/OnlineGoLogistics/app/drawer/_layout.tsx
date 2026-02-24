import "react-native-reanimated";
import { Drawer } from "expo-router/drawer";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { removeToken } from "../../utils/token";
import {
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

const COLORS = {
  textPrimary: "#0F172A",
  textSecondary: "#6B7280",
  card: "#FFFFFF",
  border: "#ffffff",
  danger: "#DC2626",
};

function DrawerItemRow({ icon, label, onPress, danger = false }: any) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <Ionicons
        name={icon}
        size={20}
        color={danger ? COLORS.danger : COLORS.textPrimary}
      />
      <Text
        style={[
          styles.itemText,
          danger && { color: COLORS.danger },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function CustomDrawerContent(props: any) {
  const [name, setName] = useState("Customer");
  const [address, setAddress] = useState("India");

  useEffect(() => {
    AsyncStorage.getItem("userName").then((n) =>
      setName(n || "Customer")
    );
  }, []);

  const logout = async () => {
    await removeToken();
    await AsyncStorage.clear();
    router.replace("/login");
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 20 }}
    >
      {/* 👤 PROFILE CARD (WHITE, LIKE OTHER SCREENS) */}
      <Pressable
      style={styles.profileCard}
      onPress={() => router.push("/drawer/profile-details")}
    >
      <View style={styles.avatar}>
        <Ionicons name="person" size={28} color="#6B7280" />
      </View>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.address}>{address}</Text>
    </Pressable>

      {/* 📋 MENU */}
      <View style={styles.menu}>
        <DrawerItemRow
          icon="time-outline"
          label="Current Booking"
          onPress={() => router.push("/drawer/current-booking")}
        />
        <DrawerItemRow
          icon="list-outline"
          label="Requested Booking"
          onPress={() => router.push("/drawer/requested-booking")}
        />
        <DrawerItemRow
          icon="cube-outline"
          label="My Booking"
          onPress={() => router.push("/drawer/my-booking")}
        />
        <DrawerItemRow
          icon="information-circle-outline"
          label="About"
          onPress={() => router.push("/drawer/about")}
        />
        <DrawerItemRow
          icon="call-outline"
          label="Contact Us"
          onPress={() => router.push("/drawer/contact")}
        />

        <View style={styles.divider} />

        <DrawerItemRow
          icon="log-out-outline"
          label="Logout"
          danger
          onPress={logout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="tabs"
        options={{ drawerItemStyle: { display: "none" } }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    paddingVertical: 22,
    borderRadius: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 52,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  address: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  menu: {
    paddingTop: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  itemText: {
    marginLeft: 14,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
    marginHorizontal: 20,
  },
});