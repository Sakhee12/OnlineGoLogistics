import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Path } from 'react-native-svg';
import { router, useFocusEffect } from 'expo-router';
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getParcelRequestsApi, ParcelRequestResponse } from "../../../api/booking";

const { width } = Dimensions.get('window');

// 🔥 ELITE COLOR SYSTEM
const COLORS = {
  primary: '#062D27',
  emerald: '#064E44',
  backgroundTop: '#FFFFFF',
  backgroundBottom: '#DCEBE4',
  cardTop: '#FFFFFF',
  cardBottom: '#EEF6F2',
  textPrimary: '#0F172A',
  textSecondary: '#6B7280',
};

export default function EliteDashboard() {
  const [userName, setUserName] = useState("User");
  const [entries, setEntries] = useState<ParcelRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const storedName = await AsyncStorage.getItem("userName");
      if (storedName) setUserName(storedName);

      const data = await getParcelRequestsApi();
      setEntries(data);
    } catch (e) {
      console.log("Dashboard fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const filteredEntries = entries.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.deliveryAddress || "").toLowerCase().includes(q) ||
      (item.pickupAddress || "").toLowerCase().includes(q) ||
      (item.packageDescription || "").toLowerCase().includes(q) ||
      (item.status || "").toLowerCase().includes(q)
    );
  });

  const todayCount = entries.filter((e) => {
    const d = new Date(e.createdAt);
    return d.toDateString() === new Date().toDateString();
  }).length;

  const inProgressCount = entries.filter((e) =>
    ["Approved", "Picked Up", "In Transit"].includes(e.status)
  ).length;

  const renderItem = ({ item }: { item: ParcelRequestResponse }) => (
    <LinearGradient
      colors={[COLORS.cardTop, COLORS.cardBottom]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.card}
    >
      <View style={styles.rowBetween}>
        <LinearGradient
          colors={['#E6F4EF', '#D7ECE5']}
          style={styles.lrPill}
        >
          <Text style={styles.lrText}>{item.status}</Text>
        </LinearGradient>

        <Text style={styles.amount}>{item.quantity || 1} pcs</Text>
      </View>

      <Text style={styles.senderReceiver}>
        {item.pickupAddress} → {item.deliveryAddress}
      </Text>

      <Text style={styles.destination}>{item.packageDescription || "Parcel"}</Text>

      <Text style={styles.viewDetails}>
        {new Date(item.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </Text>
    </LinearGradient>
  );

  const navigation = useNavigation();

  const ListHeader = () => (
    <>
      {/* HEADER WITH DRAWER */}
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            navigation.getParent()?.dispatch(DrawerActions.openDrawer())
          }
        >
          <Ionicons name="menu" size={26} />
        </Pressable>

        <View style={styles.centerContainer}>
          <Text style={styles.greeting}>Welcome, Raju</Text>
        </View>

        {/* <Pressable>
          <LinearGradient
            colors={[COLORS.emerald, COLORS.primary]}
            style={styles.fab}
          >
            <Ionicons name="notifications" size={26} color="#FFFFFF" />
          </LinearGradient>
        </Pressable> */}
      </View>

      {/* SVG FLOWING GRADIENT */}
      <View style={styles.svgContainer} pointerEvents="none">
        <Svg width={width} height={260}>
          <Defs>
            <SvgGradient id="waveGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#CFE3DB" stopOpacity="0.8" />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.2" />
            </SvgGradient>
          </Defs>

          <Path
            d={`M0 140 Q ${width / 2} 20 ${width} 140 L ${width} 260 L 0 260 Z`}
            fill="url(#waveGradient)"
          />
        </Svg>
      </View>

      {/* Stat Cards */}
      <View style={styles.statsContainer}>
        <LinearGradient
          colors={[COLORS.cardTop, COLORS.cardBottom]}
          style={styles.statCard}
        >
          <Text style={styles.revenue}>Today's Booking</Text>
          <Text style={styles.cardLabel}>{todayCount} request{todayCount !== 1 ? 's' : ''} today</Text>
        </LinearGradient>

        <LinearGradient
          colors={[COLORS.cardTop, COLORS.cardBottom]}
          style={styles.statCard}
        >
          <Text style={styles.cardLabel}>Orders in process </Text>

          <View style={styles.opsRow}>
            <Ionicons name="caret-up-circle-outline" size={18} color={COLORS.primary} />
            <Text style={styles.opsText}>{inProgressCount} active</Text>
          </View>

          <View style={styles.opsRow}>
            <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
            <Text style={styles.opsText}>{entries.length} total requests</Text>
          </View>
        </LinearGradient>
      </View>

      {/* 🔍 SEARCH BAR */}
      <LinearGradient
        colors={[COLORS.cardTop, COLORS.cardBottom]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.searchBar}
      >
        <Ionicons name="search" size={18} color={COLORS.textSecondary} />
        <TextInput
          placeholder="Search destination, article..."
          placeholderTextColor={COLORS.textSecondary}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </LinearGradient>

      <Text style={styles.sectionTitle}>Recent Requests</Text>
    </>
  );

  return (
    <LinearGradient
      colors={[COLORS.backgroundTop, COLORS.backgroundBottom]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredEntries.slice(0, 10)}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={styles.container}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20, color: COLORS.textSecondary }}>
                No entries found
              </Text>
            }
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  drawerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F7F4',
    alignItems: 'center',
    justifyContent: 'center',
  },

 centerContainer: {
    flex: 1,                     
    justifyContent: "center",    
    alignItems: "center",        
  },

  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
  },

  fab: {
    height: 56,
    width: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#064E44',
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },

    elevation: 12,
  },

  svgContainer: {
    position: 'absolute',
    top: 100,
  },

  statsContainer: {
    marginTop: 40,
    gap: 18,
  },

  statCard: {
    borderRadius: 30,
    padding: 24,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 12 },

    elevation: 8,
  },

  searchBar: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 16,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },

    elevation: 5,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },

  cardLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },

  revenue: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 14,
    color: COLORS.textPrimary,
  },

  card: {
    borderRadius: 26,
    padding: 20,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },

    elevation: 6,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  lrPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },

  lrText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },

  senderReceiver: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: COLORS.textPrimary,
  },

  destination: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  amount: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 18,
  },

  viewDetails: {
    marginTop: 10,
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  opsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },

  opsText: {
    color: COLORS.textPrimary,
    fontSize: 15,
  },
});
