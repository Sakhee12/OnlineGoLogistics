import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#062D27",
  emerald: "#064E44",
  bgTop: "#F4FAF7",
  bgBottom: "#E6F2EE",
  cardTop: "#FFFFFF",
  cardBottom: "#F7FCFA",
  textPrimary: "#0F172A",
  textSecondary: "#6B7280",
};

export default function ProfileDetails() {
  // Later you will replace this with backend data
  const profile = {
    name: "Raju",
    role: "Customer",
    userId: "6995a0c62eef33c905e170f6",
    country: "India",
  };

  return (
    <LinearGradient colors={[COLORS.bgTop, COLORS.bgBottom]} style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={{ height: 200 }}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <Defs>
            <SvgGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={COLORS.emerald} />
              <Stop offset="100%" stopColor={COLORS.primary} />
            </SvgGradient>
          </Defs>
          <Path
            d="M0,0 L100,0 L100,65 Q50,95 0,65 Z"
            fill="url(#grad)"
          />
        </Svg>

        <View style={styles.headerContent}>
          
          <Text style={styles.name}>Details</Text>
          
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <LinearGradient
          colors={[COLORS.cardTop, COLORS.cardBottom]}
          style={styles.card}
        >
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{profile.name}</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{profile.role}</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>User ID</Text>
          <Text style={styles.valueSmall}>{profile.userId}</Text>
        </LinearGradient>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  subText: {
    fontSize: 14,
    color: "#E5E7EB",
    marginTop: 2,
  },

  card: {
    borderRadius: 22,
    padding: 20,
    shadowColor: "#064E44",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 4,
  },

  valueSmall: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
  },
});