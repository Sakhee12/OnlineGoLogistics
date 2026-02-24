import React from 'react';
import { router } from 'expo-router';
import { useState } from "react";
import { loginApi } from "../api/auth";
import { saveToken } from "../utils/token";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

const { height } = Dimensions.get('window');

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Username and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await loginApi({
      username: username.trim().toLowerCase(),
      password: password,
      });

      if (res && res.token) {
        await saveToken(res.token);
        await AsyncStorage.setItem("userName", res.name || "");
        await AsyncStorage.setItem("userRole", res.role || "");
        await AsyncStorage.setItem("userId", res._id || "");

        console.log("Token saved successfully");
        router.replace("/drawer/tabs/dashboard");
      } else {
        console.error("Token missing in response:", res);
        Alert.alert("Error", "Login succeeded but token is missing");
      }
    } catch (error: any) {
      console.error("Login Error Full:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
      }
      Alert.alert(
        "Login Failed",
        error?.response?.data?.message || "Invalid credentials or network error"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>

      {/* Top Right Green Curve */}
      <View style={styles.cornerBlob} />

      {/* MAIN CONTENT */}
      <View style={styles.content}>

        {/* Title */}
        <Text style={styles.title}>Welcome back!</Text>

        {/* Illustration */}
        <View style={styles.imageWrapper}>
          <Image
            source={require('../assets/images/login.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Username */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <Ionicons name="person-outline" size={20} color="#333" />
        </View>

        {/* Password */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <Ionicons name="key-outline" size={20} color="#333" />
        </View>

        {/* Options */}
        <View style={styles.optionsRow}>
          <Text style={styles.remember}>☑ Remember Me</Text>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </View>
      </View>

      {/* BOTTOM ACTION AREA */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Ionicons
            name="arrow-forward"
            size={26}
            color="#fff"
            style={{ transform: [{ rotate: '35deg' }] }}
          />
        </TouchableOpacity>
      </View>

      {/* PERFECT BOTTOM CURVE (SVG) */}
      <Svg
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        height={280}
        width="100%"
        style={styles.svgCurve}
      >
        <Path
          d="M0,20 Q200,160 400,60 L400,200 L0,200 Z"
          fill="#0F3D2E"
        />
      </Svg>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },

  /* Top green blob */
  cornerBlob: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 200,
    backgroundColor: '#0F3D2E',
    top: -160,
    right: -160,
  },

  /* Main content */
  content: {
    width: '88%',
    marginTop: 80,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },

  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },

  image: {
    width: 119,
    height: 193,
  },

  inputBox: {
    width: '100%',
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DCDCDC',
  },

  input: {
    flex: 1,
  },

  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },

  remember: {
    fontSize: 12,
    color: '#333',
  },

  forgot: {
    fontSize: 12,
    color: '#0F3D2E',
    fontWeight: '600',
  },

  /* Bottom area */
  bottomArea: {
    alignItems: 'center',
    marginTop: 30,
    zIndex: 10,
  },

  button: {
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: '#0F3D2E',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    transform: [{ rotate: '-35deg' }],
  },

  signupText: {
    marginTop: 14,
    color: '#333',
  },

  signup: {
    color: '#0F3D2E',
    fontWeight: '700',
  },

  /* SVG curve */
  svgCurve: {
    position: 'absolute',
    bottom: 0,
    top: height - 100,

  },
});
