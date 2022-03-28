import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';


import Login from "./screens/login";
import Chat from "./screens/chat";
import Home from "./screens/home";
import Halls from './screens/halls';
import Seats from './screens/seats';


const Stack = createStackNavigator();

export default function App() {
  LogBox.ignoreLogs(['Setting a timer']);
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}}  />
      <Stack.Screen name="Home" component={Home} options={{headerShown: false}}  />
      <Stack.Screen name="Halls" component={Halls} options={{headerShown: false}}  />
      <Stack.Screen name="Seats" component={Seats} options={{headerShown: false}}  />
      <Stack.Screen name="Chat" component={Chat} options={{headerShown: false}} />
    </Stack.Navigator>
  </NavigationContainer>
  );
};