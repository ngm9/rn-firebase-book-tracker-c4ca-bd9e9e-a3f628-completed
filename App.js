import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import MyBooksScreen from './src/screens/MyBooksScreen';
import AddBookScreen from './src/screens/AddBookScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MyBooks">
              {props => <MyBooksScreen {...props} user={user} onSignOut={() => setUser(null)} />}
            </Stack.Screen>
            <Stack.Screen name="AddBook">
              {props => <AddBookScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} onLoginSuccess={setUser} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}