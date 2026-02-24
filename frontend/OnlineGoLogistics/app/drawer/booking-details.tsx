import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  getParcelRequestByIdApi,
  ParcelRequestResponse,
} from "../../api/booking";

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

export default function BookingDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<ParcelRequestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const status = booking?.status;
  const isPending = status === "Pending";
  const isFullView = status === "Approved" || status === "In Transit" || status === "Delivered";

  useFocusEffect(
    useCallback(() => {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          if (id) {
            const data = await getParcelRequestByIdApi(id);
            setBooking(data);
          }
        } catch (err) {
          console.log("Failed to load booking details", err);
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }, [id])
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
          <Text style={styles.headerTitle}>Booking Details</Text>
        </View>
      </View>

      {loading || !booking ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
         
            <View style={styles.card}>
            {/* STATUS */}
            <Detail
              label="Status"
              value={booking.status}
              color={getStatusColor(booking.status)}
            />

            {/* ADDRESSES */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Addresses</Text>
              <Detail label="Pickup Address" value={booking.pickupAddress} />
              <Detail label="Delivery Address" value={booking.deliveryAddress} />
            </View>

            {/* PACKAGE DETAILS */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Package Details</Text>
              <Detail label="Description" value={booking.packageDescription || "N/A"} />
              <Detail label="Weight" value={`${booking.weight || 0} kg`} />
              <Detail label="Quantity" value={`${booking.quantity || 1}`} />
            </View>

            {/* REMARKS */}
            {booking.remarks && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Remarks</Text>
                <Text style={styles.value}>{booking.remarks}</Text>
              </View>
            )}

            {/* DATES */}
            <Detail
              label="Created On"
              value={new Date(booking.createdAt).toLocaleString("en-IN")}
            />

            {booking.status !== "Pending" && (
              <Detail
                label="Last Updated"
                value={new Date(booking.updatedAt).toLocaleString("en-IN")}
              />
            )}
          </View>

            
        </ScrollView>
      )}
    </LinearGradient>
  );
}

/* SMALL REUSABLE COMPONENT */
function Detail({
  label,
  value,
  color,
}: {
  label: string;
  value?: string;
  color?: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, color && { color }]}>{value || "-"}</Text>
    </View>
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
    fontSize: 26,
    fontWeight: "800",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    shadowColor: "#064E44",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  row: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
    color: COLORS.primary,
  },
});