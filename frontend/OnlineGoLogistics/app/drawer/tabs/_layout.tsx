import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (

    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          position: 'absolute',

          bottom: 0,
          left: 0,
          right: 0,

          height: 70,

          backgroundColor: '#062D27',
          borderTopWidth: 0,
          elevation: 0,
        },

        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },

        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#A8C1BA',
      }}

    >
      {/* Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          ),
        }}
      />

      {/* New Entry — CENTER FAB */}
      <Tabs.Screen
        name="new-entry"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="add" size={24} color={color} />
          ),
        }}
      />

      {/* Requests */}
      <Tabs.Screen
        name="requests"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Complaints */}
      <Tabs.Screen
        name="complaints"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="alert-circle-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Enquiries */}
      <Tabs.Screen
        name="enquiries"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
