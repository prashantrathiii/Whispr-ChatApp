import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import auth from "@react-native-firebase/auth";
import Login from "../components/auth/Login";
import Detail from "../components/auth/Detail";
import Dashboard from "../components/dashboard/Dashboard";
import ChatScreen from "../components/chat/ChatScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const onAuthStateChanged = (result) => {
    setUser(result);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <Stack.Navigator initialRouteName={user ? "Dashboard" : "Login"}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
