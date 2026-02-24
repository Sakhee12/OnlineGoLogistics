import React from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* White Card */}
      <View style={styles.card}>
        {/* Illustration */}
        <Image
          source={require('../assets/images/welcome.png')} 
          style={styles.image}
          resizeMode="contain"
        />

        {/* Text */}
        <Text style={styles.title}>
          Send Anything <Text style={styles.fast}>Fast</Text>
        </Text>

        <Text style={styles.subtitle}>
          Create your quick account, and the best way to transfer your items
          from one location to another.
        </Text>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
         onPress={() => router.push('/login')}

        >
          <Ionicons name="arrow-forward" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F3D2E', // dark green background
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
  width: '90%',              // 👈 makes pill shape
  height: '82%',
  backgroundColor: '#fff',

  // 👇 asymmetric curves (matches image)
  borderTopLeftRadius: 120,
  borderTopRightRadius: 120,
  borderBottomLeftRadius: 120,
  borderBottomRightRadius: 120,

  alignItems: 'center',
  paddingHorizontal: 25,
  paddingTop: 40,

  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowRadius: 20,
  elevation: 20,
},


 image: {
  width: 260,     // 👈 EXACT like design
  height: 230,
  marginBottom: 25,
},


  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
  },

  fast: {
    color: '#0F3D2E',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },

  button: {
    marginTop: 35,
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: '#0F3D2E',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
     transform: [{ rotate: '-35deg' }],
  },
});
