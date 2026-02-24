import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import { createEnquiryApi } from "../../../api/enquiry";

//////////////// COLORS ////////////////

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

////////////////////////////////////////////////////
//////////////// HEADER /////////////////////////////
////////////////////////////////////////////////////

const Header = () => (
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
      <Text style={styles.headerTitle}>Send Enquiry</Text>
    </View>
  </View>
);

////////////////////////////////////////////////////
//////////////// MAIN ///////////////////////////////
////////////////////////////////////////////////////

export default function EnquiryScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<any[]>([
    {
      id: "1",
      from: "bot",
      text: "Hi 👋 I am your Question Solver. Ask me anything!",
    },
  ]);

  // Enquiry form state
  const [enquiryType, setEnquiryType] = useState("");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
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
  const handleSendEnquiry = async () => {
    if (!name || !mobile || !enquiryMessage) {
      Alert.alert("Error", "Please fill name, mobile, and message");
      return;
    }

    try {
      setLoading(true);
      const messageToSend = enquiryType
        ? `[${enquiryType}] ${enquiryMessage}`
        : enquiryMessage;

      await createEnquiryApi({
        name,
        mobile,
        message: messageToSend,
      });

      Alert.alert("Success", "Enquiry sent successfully!");
      setEnquiryType("");
      setEnquiryMessage("");
      setName("");
      setMobile("");
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.response?.data?.message || "Failed to send enquiry"
      );
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      from: "user",
      text: chatInput,
    };

    const botMsg = {
      id: (Date.now() + 1).toString(),
      from: "bot",
      text: getBotResponse(chatInput),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setChatInput("");
  };

  

  return (
    <LinearGradient colors={[COLORS.bgTop, COLORS.bgBottom]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        <Header />

        {/* ENQUIRY CARD */}
        <LinearGradient colors={[COLORS.cardTop, COLORS.cardBottom]} style={styles.card}>
          <Text style={styles.section}>Your Name</Text>
          <TextInput
            placeholder="Enter your name..."
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.section}>Mobile Number</Text>
          <TextInput
            placeholder="Enter mobile number..."
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />

          <Text style={styles.section}>Enquiry Type</Text>
          <TextInput
            placeholder="Pricing / Bulk Booking / Partnership..."
            style={styles.input}
            value={enquiryType}
            onChangeText={setEnquiryType}
          />

          <Text style={styles.section}>Message</Text>
          <TextInput
            placeholder="Tell us what you need..."
            style={[styles.input, { height: 110 }]}
            multiline
            value={enquiryMessage}
            onChangeText={setEnquiryMessage}
          />

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

        {/* SEND BUTTON */}
        <LinearGradient colors={["#0B3B34", "#062D27"]} style={styles.submitBtn}>
          <Pressable onPress={handleSendEnquiry} disabled={loading}>
            <Text style={styles.submitText}>
              {loading ? "SENDING..." : "SEND ENQUIRY"}
            </Text>
          </Pressable>
        </LinearGradient>
      </ScrollView>

      {/* FLOATING CHAT ICON (LIKE WHATSAPP META AI) */}
      <Pressable style={styles.chatFab} onPress={() => setChatVisible(true)}>
        <Text style={{ color: "#fff", fontSize: 22 }}>💬</Text>
      </Pressable>

      {/* CHAT MODAL */}
      <Modal visible={chatVisible} animationType="slide" transparent>
        <View style={styles.chatOverlay}>
          <View style={styles.chatSheet}>
            {/* CHAT HEADER */}
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>Question Solver</Text>
              <Pressable onPress={() => setChatVisible(false)}>
                <Text style={{ fontSize: 18 }}>✖</Text>
              </Pressable>
            </View>

            {/* CHAT BODY */}
            <ScrollView style={{ flex: 1 }}>
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.chatBubble,
                    msg.from === "user"
                      ? styles.userBubble
                      : styles.botBubble,
                  ]}
                >
                  <Text>{msg.text}</Text>
                </View>
              ))}
            </ScrollView>

            {/* CHAT INPUT */}
            <View style={styles.chatInputRow}>
              <TextInput
                placeholder="Ask your question..."
                value={chatInput}
                onChangeText={setChatInput}
                style={styles.chatInput}
              />
              <Pressable style={styles.sendBtn} onPress={sendMessage}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Send</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

////////////////////////////////////////////////////
//////////////// BOT LOGIC //////////////////////////
////////////////////////////////////////////////////

const getBotResponse = (text: string) => {
  const msg = text.toLowerCase();

  if (msg.includes("price"))
    return "Pricing depends on parcel weight and destination.";
  if (msg.includes("booking"))
    return "You can book a parcel from the New Entry page.";
  if (msg.includes("support"))
    return "Our support team will contact you shortly.";

  return "Thanks for your question! 😊";
};

////////////////////////////////////////////////////
//////////////// STYLES /////////////////////////////
////////////////////////////////////////////////////

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
    fontWeight: "700",
  },

  card: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 26,
    padding: 20,
  },

  section: {
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 10,
    color: "#6B7280",
    textTransform: "uppercase",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E3ECE8",
  },

  submitBtn: {
    marginHorizontal: 18,
    marginTop: 28,
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  submitText: {
    color: "#FFFFFF",
    fontWeight: "700",
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

  /* CHAT STYLES */

  chatFab: {
    position: "absolute",
    bottom: 84,
    right: 20,
    width: 66,
    height: 66,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  chatOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

  chatSheet: {
    height: "80%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 14,
  },

  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  chatTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  chatBubble: {
    padding: 12,
    borderRadius: 14,
    marginVertical: 6,
    maxWidth: "80%",
  },

  userBubble: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },

  botBubble: {
    backgroundColor: "#F1F5F9",
    alignSelf: "flex-start",
  },

  chatInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    paddingTop: 8,
  },

  chatInput: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 40,
  },

  sendBtn: {
    marginLeft: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
