import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  getParcelRequestsApi,
  getParcelRequestByIdApi,
  ParcelRequestResponse,
} from "../../../api/booking";
import { Linking, Alert } from "react-native";
//////////////// COLORS //////////////////

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

//////////////// DATE HELPERS //////////////////


const isToday = (date: Date) =>
  date.toDateString() === new Date().toDateString();

const isYesterday = (date: Date) => {
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return date.toDateString() === y.toDateString();
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const openReceipt = async (id: string) => {
  const url = `https://onlinegologistics.in/customer/print/${id}`;

  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    Alert.alert("Error", "Cannot open receipt");
    return;
  }

  await Linking.openURL(url);
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

////////////////////////////////////////////////

export default function RequestsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [requests, setRequests] = useState<ParcelRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      if (id) {
        // Opened by clicking a card → fetch single booking
        const booking = await getParcelRequestByIdApi(id);
        setRequests([booking]);
      } else {
        // Normal Requests screen
        const data = await getParcelRequestsApi();
        setRequests(data);
      }
    } catch (e) {
      console.log("Failed to fetch requests", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [id])
  );

  const groupedRequests = useMemo(() => {
    return requests.reduce((acc: any, item) => {
      const date = new Date(item.createdAt);

      let section = formatDate(date);
      if (isToday(date)) section = "Today";
      else if (isYesterday(date)) section = "Yesterday";

      if (!acc[section]) acc[section] = [];
      acc[section].push(item);

      return acc;
    }, {});
  }, [requests]);

  return (
    <LinearGradient colors={[COLORS.bgTop, COLORS.bgBottom]} style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={{ height: 180 }}>
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

          <Path d="M0,0 L100,0 L100,65 Q50,95 0,65 Z" fill="url(#grad)" />
        </Svg>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Requests</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {requests.length === 0 && (
            <Text style={styles.empty}>No requests yet</Text>
          )}

          {Object.keys(groupedRequests).map((section) => (
            <View key={section} style={{ marginTop: 24 }}>
              <Text style={styles.sectionTitle}>{section}</Text>

              {groupedRequests[section].map(
                (req: ParcelRequestResponse) => (
                  <Pressable
                    key={req._id}
                    onPress={() =>
                      router.push({
                        pathname: "/drawer/booking-details",
                        params: { id: req._id },
                      })
                    }
                  >
                    <LinearGradient
                      colors={[COLORS.cardTop, COLORS.cardBottom]}
                      style={styles.card}
                    >
                      <View style={styles.row}>
                        <Text style={styles.destination}>
                          {req.deliveryAddress}
                        </Text>
                        <Text
                          style={[
                            styles.status,
                            { color: getStatusColor(req.status) },
                          ]}
                        >
                          {req.status.toUpperCase()}
                        </Text>
                      </View>

                      <Text style={styles.meta}>
                        Article: {req.packageDescription || "N/A"}
                      </Text>

                      <Text style={styles.meta}>
                        Weight: {req.weight || 0} kg • Qty:{" "}
                        {req.quantity || 1}
                      </Text>

                      {/* ✅ PRINT BUTTON */}
                        <Pressable onPress={() => openReceipt(req._id)}>
                          <Text style={styles.printBtn}>Print / View Receipt</Text>
                        </Pressable>

                      <Text style={styles.time}>
                        {formatTime(new Date(req.createdAt))}
                      </Text>
                    </LinearGradient>
                  </Pressable>
                )
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

////////////////////////////////////////////////
//////////////// STYLES /////////////////////////
////////////////////////////////////////////////

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

  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
    borderRadius: 22,
    shadowColor: "#064E44",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
}
});