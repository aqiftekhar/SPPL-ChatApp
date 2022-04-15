import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';


import Login from "./screens/login";
import Chat from "./screens/chat";
import Home from "./screens/home";
import Halls from './screens/halls';
import Seats from './screens/seats';

import LoaderContextProvider, {LoaderContextConsumer} from './screens/shared/LoaderContext';

const Stack = createStackNavigator();

export default function App() {
  LogBox.ignoreLogs(['Setting a timer']);
  return (
    <LoaderContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoaderContextConsumer(Login)} options={{headerShown: false}}  />
          <Stack.Screen name="Home" component={LoaderContextConsumer(Home)} options={{headerShown: false}}  />
          <Stack.Screen name="Halls" component={LoaderContextConsumer(Halls)} options={{headerShown: false}}  />
          <Stack.Screen name="Seats" component={LoaderContextConsumer(Seats)} options={{headerShown: false}}  />
          <Stack.Screen name="Chat" component={LoaderContextConsumer(Chat)} options={{headerShown: false}} />
        </Stack.Navigator>
    </NavigationContainer>
    </LoaderContextProvider>
  );
};