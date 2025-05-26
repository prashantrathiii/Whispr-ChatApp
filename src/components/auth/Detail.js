import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { Picker } from "@react-native-picker/picker";
import firestore from "@react-native-firebase/firestore";

export default function Detail({ route, navigation }) {
  const { uid } = route.params;
  const [name, setName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState("");

  const saveDetails = async () => {
    try {
      await firestore()
        .collection("users")
        .doc(uid)
        .set({
          name,
          dob: dob.toISOString().slice(0, 10),
          gender,
          displayName: name,
        });
      navigation.navigate("Dashboard");
    } catch (error) {
      console.log("Error saving details: ", error);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ alignItems: "center", marginBottom: 10 }}>
        <Image
          source={require("../../../assets/logo.png")}
          style={{ width: 150, height: 150, borderRadius: 50, marginTop: 35 }}
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          Enter your details:
        </Text>
        <TextInput
          style={{
            height: 50,
            width: "100%",
            borderColor: "black",
            borderWidth: 1.5,
            marginBottom: 30,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <DatePicker
          style={{
            height: 80,
            width: Dimensions.get("window").width - 40,
            marginBottom: 30,
          }}
          date={dob}
          onDateChange={setDob}
          mode="date"
        />
        <Picker
          style={{ height: 50, width: "100%", marginBottom: 30 }}
          selectedValue={gender}
          onValueChange={setGender}
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
        <TouchableOpacity
          onPress={saveDetails}
          style={{
            backgroundColor: "#007BFF",
            padding: 10,
            borderRadius: 5,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
            Save Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
