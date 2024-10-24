import {Tabs} from 'expo-router';
import React from 'react';

import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {Text, View} from "react-native";
import {Circle} from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Foundations',
          tabBarIcon: ({color, focused}) => (
            <Circle size={20} color={focused? "#0284c7": "#e0f2fe"}/>
          ),
        }}
      />
      <Tabs.Screen
        name="organic"
        options={{
          title: 'Organic',
          tabBarIcon: ({color, focused}) => (
            <Circle size={20} color={focused? "#ea580c": "#ffedd5"}/>
          ),
        }}
      />
    </Tabs>
  );
}
