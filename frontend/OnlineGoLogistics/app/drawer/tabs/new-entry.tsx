import React, { useState } from 'react';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';
import { router } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createParcelRequestApi } from "../../../api/booking";

const COLORS = {
  primary: '#062D27',
  emerald: '#064E44',
  bgTop: '#FFFFFF',
  bgBottom: '#DCEBE4',
  cardTop: '#FFFFFF',
  cardBottom: '#d0eee0',
  textPrimary: '#0F172A',
  textSecondary: '#6B7280',
};

export default function BookParcel() {
  const [pickupAddress, setPickupAddress] = useState("");
  const [destination, setDestination] = useState("");
  const [article, setArticle] = useState("");
  const [weight, setWeight] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleCreateBooking = async () => {
    if (!pickupAddress || !destination || !article || !weight || !quantity) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      setLoading(true);

      await createParcelRequestApi({
        pickupAddress,
        deliveryAddress: destination,
        packageDescription: article,
        weight: Number(weight),
        quantity: Number(quantity),
      });

      setSheetVisible(true);
      // Reset form
      setPickupAddress("");
      setDestination("");
      setArticle("");
      setWeight("");
      setQuantity("");
    } catch (e: any) {
      Alert.alert(
        "Booking Failed",
        e?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.bgTop, COLORS.bgBottom]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Header */}
        <View style={{ height: 180 }}>
          <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
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

          <View style={styles.svgHeaderText}>
            <Text style={styles.headerTitle}>Book Parcel</Text>
          </View>
        </View>

        {/* Pickup Address */}
        <LinearGradient
          colors={[COLORS.cardTop, COLORS.cardBottom]}
          style={styles.card}
        >
          <Text style={styles.section}>Pickup Address</Text>

          <TextInput
            placeholder="Enter Pickup Address"
            style={styles.input}
            value={pickupAddress}
            onChangeText={setPickupAddress}
          />
        </LinearGradient>

        {/* Destination */}
        <LinearGradient
          colors={[COLORS.cardTop, COLORS.cardBottom]}
          style={styles.card}
        >
          <Text style={styles.section}>Destination</Text>

          <TextInput
            placeholder="Enter Destination"
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
          />
        </LinearGradient>

        {/* Parcel Information */}
        <LinearGradient
          colors={[COLORS.cardTop, COLORS.cardBottom]}
          style={styles.card}
        >
          <Text style={styles.section}>Parcel Information</Text>

          <TextInput
            placeholder="Weight (kg)"
            style={styles.input}
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          <TextInput
            placeholder="Article"
            style={styles.input}
            value={article}
            onChangeText={setArticle}
          />

          <TextInput
            placeholder="Quantity"
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
        </LinearGradient>

        {/* Submit Button */}
        <LinearGradient
          colors={[COLORS.emerald, COLORS.primary]}
          style={styles.bookBtn}
        >
          <Pressable onPress={handleCreateBooking} disabled={loading}>
            <Text style={styles.bookText}>
              {loading ? "PLEASE WAIT..." : "REQUEST TO COLLECT PARCEL"}
            </Text>
          </Pressable>
        </LinearGradient>

        {/* Success Bottom Sheet */}
        <Modal visible={sheetVisible} transparent animationType="slide">
          <View style={styles.sheetOverlay}>
            <View style={styles.bottomSheet}>
              <View style={styles.dragBar} />

              <Text style={styles.successIcon}>✅</Text>

              <Text style={styles.sheetTitle}>
                Your request is sent!
              </Text>

              <Pressable
                style={styles.sheetBtn}
                onPress={() => {
                  setSheetVisible(false);
                  router.push('/drawer/tabs/requests');
                }}
              >
                <Text style={styles.sheetBtnText}>
                  Go to See Requests
                </Text>
              </Pressable>

              <Pressable onPress={() => setSheetVisible(false)}>
                <Text style={styles.sheetClose}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },

  svgHeaderText: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 26,
    padding: 18,
    shadowColor: '#064E44',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  section: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
    color: COLORS.textPrimary,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  bookBtn: {
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 10,
  },

  bookText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },

  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  bottomSheet: {
    backgroundColor: '#FFFFFF',
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 22,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 20,
  },

  dragBar: {
    width: 55,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 18,
  },

  successIcon: {
    fontSize: 42,
    textAlign: 'center',
    marginBottom: 10,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    color: '#0F172A',
    marginBottom: 22,
  },

  sheetBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },

  sheetBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },

  sheetClose: {
    textAlign: 'center',
    marginTop: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
});
