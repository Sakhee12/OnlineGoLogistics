import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';
import { createComplaintApi } from '../../../api/complaint';

const COLORS = {
  primary: '#062D27',
  emerald: '#064E44',
  bgTop: '#FFFFFF',
  bgBottom: '#DCEBE4',
  cardTop: '#FFFFFF',
  cardBottom: '#EAF4F0',
  textPrimary: '#0F172A',
  textSecondary: '#6B7280',
};

export default function Complaints() {
  const [image, setImage] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [receiptNo, setReceiptNo] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
    const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow gallery access");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const handleSubmit = async () => {
    if (!subject || !description || !receiptNo) {
      Alert.alert('Error', 'Please fill subject, LR number, and description');
      return;
    }

    try {
      setLoading(true);
      await createComplaintApi({
        subject,
        description,
        receiptNo,
        priority: 'Medium',
      });
      Alert.alert('Success', 'Complaint submitted successfully!');
      setSubject('');
      setReceiptNo('');
      setDescription('');
    } catch (e: any) {
      Alert.alert(
        'Error',
        e?.response?.data?.message || 'Failed to submit complaint'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.bgTop, COLORS.bgBottom]}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >

        {/* ✅ CURVED SVG HEADER */}
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

            <Path
              d="M0,0 L100,0 L100,65 Q50,95 0,65 Z"
              fill="url(#grad)"
            />
          </Svg>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Raise Complaint</Text>
          </View>
        </View>

        {/* Complaint Card */}
        <LinearGradient
          colors={[COLORS.cardTop, COLORS.cardBottom]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Text style={styles.section}>Complaint Type</Text>

          <TextInput
            placeholder="Parcel Delay / Damage / Wrong Delivery..."
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.section}>LR / Order Number</Text>

          <TextInput
            placeholder="Enter LR Number"
            style={styles.input}
            value={receiptNo}
            onChangeText={setReceiptNo}
          />

          <Text style={styles.section}>Description</Text>

          <TextInput
            placeholder="Explain the issue..."
            style={[styles.input, { height: 120 }]}
            multiline
            value={description}
            onChangeText={setDescription}
          />




          {/* Upload Placeholder */}
         <Pressable style={styles.uploadBox} onPress={pickImage}>
                   {image ? (
                     <Image source={{ uri: image }} style={styles.image} />
                   ) : (
                     <Text style={{ color: COLORS.textSecondary }}>
                       + Upload Image (optional)
                     </Text>
                   )}
                 </Pressable>
        </LinearGradient>

        {/* Submit Button */}
        <LinearGradient
          colors={[COLORS.emerald, COLORS.primary]}
          style={styles.submitBtn}
        >
          <Pressable onPress={handleSubmit} disabled={loading}>
            <Text style={styles.submitText}>
              {loading ? 'SUBMITTING...' : 'SUBMIT COMPLAINT'}
            </Text>
          </Pressable>
        </LinearGradient>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerText: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },

  card: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 26,
    padding: 20,

    shadowColor: '#064E44',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  section: {
    fontWeight: '700',
    marginBottom: 8,
    color: COLORS.textPrimary,
  },

  input: {
    backgroundColor: '#F8FBF9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  priorityBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 30,
    backgroundColor: '#EEF5F1',
    alignItems: 'center',
    marginHorizontal: 4,
  },

  activePriority: {
    backgroundColor: COLORS.primary,
  },

  priorityText: {
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  uploadBox: {
  height: 140,
  borderWidth: 1.5,
  borderStyle: "dashed",
  borderColor: "#CFE3DB",
  borderRadius: 14,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 10,
},
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  submitBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',

    shadowColor: '#064E44',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },

  submitText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 1,
  },
});
