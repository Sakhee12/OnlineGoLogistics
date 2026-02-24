import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import { useFocusEffect, router } from "expo-router";
import { getParcelRequestsApi, ParcelRequestResponse } from "../../api/booking";

const COLORS = {
  primary: "#062D27",
  emerald: "#064E44",
  bgTop: "#F4FAF7",
  bgBottom: "#E6F2EE",
  cardTop: "#FFFFFF",
  cardBottom: "#F7FCFA",
  textPrimary: "#0F172A",
  textSecondary: "#6B7280",
  success: "#16A34A",
  danger: "#DC2626",
  warning: "#F59E0B",
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
    case "Delivered":
      return COLORS.success;
    case "Cancelled":
      return COLORS.danger;
    case "Pending":
      return COLORS.warning;
    default:
      return COLORS.emerald;
  }
};

export default function MyBooking() {
  const [requests, setRequests] = useState<ParcelRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await getParcelRequestsApi();
          setRequests(data);
        } catch (e) {
          console.log("Failed to fetch bookings", e);
        } finally {
          setLoading(false);
        }
      };

      fetchData();

      const onBackPress = () => {
        router.replace("/drawer/tabs/dashboard");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

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
          <Text style={styles.headerTitle}>My Bookings</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {requests.length === 0 && (
            <Text style={styles.empty}>No bookings yet</Text>
          )}

          {requests.map((req) => (
            <LinearGradient
              key={req._id}
              colors={[COLORS.cardTop, COLORS.cardBottom]}
              style={styles.card}
            >
              <View style={styles.row}>
                <Text style={styles.destination}>{req.deliveryAddress}</Text>
                <Text style={[styles.status, { color: getStatusColor(req.status) }]}>
                  {req.status.toUpperCase()}
                </Text>
              </View>

              <Text style={styles.meta}>From: {req.pickupAddress}</Text>
              <Text style={styles.meta}>
                Article: {req.packageDescription || "N/A"}
              </Text>
              <Text style={styles.meta}>
                Weight: {req.weight || 0} kg • Qty: {req.quantity || 1}
              </Text>

              {/* ✅ PRINT BUTTON */}
              {req.status === "Approved" && (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/drawer/ReceiptWebView",
                      params: { id: req._id },
                    })
                  }
                >
                  <Text style={styles.printBtn}>Print / View Receipt</Text>
                </Pressable>
              )}

              <Text style={styles.time}>
                {new Date(req.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </LinearGradient>
          ))}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: COLORS.textSecondary,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
    borderRadius: 22,
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  destination: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  status: {
    fontSize: 13,
    fontWeight: "700",
  },
  meta: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  time: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "right",
  },
  printBtn: {
    marginTop: 10,
    color: "#064E44",
    fontWeight: "700",
  },
});