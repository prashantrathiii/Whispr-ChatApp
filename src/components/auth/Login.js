import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getApp } from "@react-native-firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigation = useNavigation();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    const auth = getAuth(getApp());
    const db = getFirestore(getApp());

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const { uid } = userCredential.user;
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        navigation.navigate("Dashboard");
      } else {
        navigation.navigate("Detail", { uid });
      }
    } catch (error) {
      console.error("Auth Error:", error);
      Alert.alert("Authentication Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
        
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Image
            source={require("../../../assets/logo.png")}
            style={{ width: 150, height: 150, borderRadius: 50, marginTop: 120 }}
          />
        </View>

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={{
            height: 50,
            borderColor: "black",
            borderWidth: 1.5,
            marginBottom: 20,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            height: 50,
            borderColor: "black",
            borderWidth: 1.5,
            marginBottom: 30,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
        />

        <TouchableOpacity
          onPress={handleAuth}
          style={{
            backgroundColor: "#007BFF",
            padding: 15,
            borderRadius: 5,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            {isSignUp ? "Sign Up" : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.signupTextContainer}>
          <Text style={{ textAlign: "center", color: "black" }}>
            {isSignUp
              ? "Already have an account? "
              : "Don't have an account? "}
          </Text>

          <Text style={{ textAlign: "center", color: "#007BFF" }}>
            {isSignUp
              ? "Login"
              : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  signupTextContainer: {
    justifyContent: "center",
    flexDirection: "row",
  }
})