import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
  primary: "#062D27",
  emerald: "#064E44",
  bgTop: "#F4FAF7",
  bgBottom: "#E6F2EE",
  textPrimary: "#0F172A",
  textSecondary: "#6B7280",
};

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const name = await AsyncStorage.getItem("userName");
      const role = await AsyncStorage.getItem("userRole");
      const userId = await AsyncStorage.getItem("userId");

      setProfile({ name, role, userId });
      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <LinearGradient colors={[COLORS.bgTop, COLORS.bgBottom]} style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={{ height: 180 }}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={COLORS.emerald} />
              <Stop offset="100%" stopColor={COLORS.primary} />
            </SvgGradient>
          </Defs>
          <Path d="M0,0 L100,0 L100,65 Q50,95 0,65 Z" fill="url(#grad)" />
        </Svg>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
      </View>

      {/* PROFILE CARD */}
      <Pressable
        style={styles.card}
        onPress={() => router.push("/drawer/profile-details")}
      >
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.meta}>Role: {profile.role}</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerText: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 22,
    elevation: 6,
  },

  name: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },

  meta: {
    marginTop: 6,
    color: COLORS.textSecondary,
  },
});