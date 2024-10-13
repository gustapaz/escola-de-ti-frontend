/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './screens/Login';
import ForgotPassword from './screens/ForgotPassword';
import Register from './screens/Register';
import HomeScreen from './screens/Home';
import StoreScreen from './screens/Store';
import Delivery from './screens/Delivery';
import ProfileScreen from './screens/Profile';
import Splash from './screens/Splash';
import Campaign from './screens/Campaign';
import Edit from './screens/Edit';
import Achievement from './screens/Achievement';
import ShoppingHistory from './screens/ShoppingHistory';
import About from './screens/About';
import ProductDetail from './screens/ProductDetail';
import Cart from './screens/Cart';
import { Home, Box, ShoppingBag, User } from 'react-native-feather';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Campaign"
        component={Campaign}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const StoreStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StoreScreen"
        component={StoreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit"
        component={Edit}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Achievement"
        component={Achievement}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShoppingHistory"
        component={ShoppingHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#7B1FA2',
        tabBarInactiveTintColor: '#8F9494',
        tabBarIcon: ({ focused }) => {
          let icon;

          if (route.name === 'Home') {
            icon = focused ? (
              <Home stroke="#7B1FA2" width={24} height={24} />
            ) : (
              <Home stroke="#8F9494" width={24} height={24} />
            );
          } else if (route.name === 'Store') {
            icon = focused ? (
              <ShoppingBag stroke="#7B1FA2" width={24} height={24} />
            ) : (
              <ShoppingBag stroke="#8F9494" width={24} height={24} />
            );
          } else if (route.name === 'Delivery') {
            icon = focused ? (
              <Box stroke="#7B1FA2" width={24} height={24} />
            ) : (
              <Box stroke="#8F9494" width={24} height={24} />
            );
          } else if (route.name === 'Profile') {
            icon = focused ? (
              <User stroke="#7B1FA2" width={24} height={24} />
            ) : (
              <User stroke="#8F9494" width={24} height={24} />
            );
          }

          return icon;
        },
        tabBarStyle: {
          paddingTop: 20,
          paddingBottom: 20,
          height: 90,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Store"
        component={StoreStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Delivery"
        component={Delivery}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export const Navigation = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const initialRouteName = authenticated ? 'Main' : 'Splash';

  const checkAuthentication = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const refreshToken = await AsyncStorage.getItem('refresh_token');

      return !!accessToken && !!refreshToken;
    } catch (error) {
      console.error('Erro ao verificar a autenticação', error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkAuthentication();
      setAuthenticated(isAuthenticated);
    };

    checkAuth();
  }, [authenticated]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={Tabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
