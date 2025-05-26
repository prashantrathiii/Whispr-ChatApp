import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await firestore().collection("users").get();
        const usersData = usersSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => user.id !== auth().currentUser?.uid && user.name); // Exclude current user
        setUsers(usersData);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    const fetchUserName = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userDoc = await firestore()
            .collection("users")
            .doc(currentUser.uid)
            .get();
          setUserName(userDoc.data()?.name || "");
        }
      } catch (error) {
        console.log("Error fetching user name:", error);
      }
    };

    if (isFocused && auth().currentUser) {
      fetchUsers();
      fetchUserName();
    }
  }, [isFocused]);

  const navigateToChat = (userId, userName) => {
    navigation.navigate("ChatScreen", { userId, userName });
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate("Login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <SafeAreaView style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Whispr</Text>
            <TouchableOpacity onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={26} color="#20367A" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.chatListContainer}>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chatTile}
                onPress={() => navigateToChat(item.id, item.name)}
              >
                <LinearGradient
                  colors={["#d9dcfa", "#f5f5f5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.chatTileInner}
                >
                  <Text style={styles.chatName}>{item.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>

        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => console.log("Add new chat")}
        >
          <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "black",
  },
  header: {
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#20367A",
    marginBottom: 10,
    textAlign: "center",
    flex: 1,
  },
  chatListContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
  },
  chatTile: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: "hidden",
  },
  chatTileInner: {
    padding: 18,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  chatName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#20367A",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#6a11cb",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});
