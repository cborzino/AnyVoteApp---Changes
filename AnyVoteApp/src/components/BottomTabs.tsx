// src/components/BottomTabs.tsx
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'


import AnyVoteStack from './AnyVoteInfoStack'
import Info from '../screens/Info'
import { DebugScreen } from '../screens/DebugScreen'
import AnyVoteInfo from '../screens/AnyVoteInfo'

const Tab = createBottomTabNavigator()

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0033A0',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse-outline'

          if (route.name === 'Info') {
            iconName = 'person-circle-outline'
          } else if (route.name === 'Voto Móvel') {
            iconName = 'map-outline'
          } else if (route.name === 'Tela de Debug') {
            iconName = 'bug-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}

    >
      <Tab.Screen name="Info" component={Info} />
      <Tab.Screen name="Voto Móvel" component={AnyVoteStack} />
      <Tab.Screen name="Tela de Debug" component={DebugScreen} />
    </Tab.Navigator>
  )
}
