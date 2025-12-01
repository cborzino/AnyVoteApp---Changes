// src/components/AnyVoteInfoStack.tsx
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AnyVoteStart from '../screens/AnyVoteStackScreens/AnyVoteStart'
import Warning from '../screens/AnyVoteStackScreens/Warning'
import Faq from '../screens/AnyVoteStackScreens/Faq'
import AnyVoteInfoScreen from '../screens/AnyVoteInfo'
import AnyVoteSteps from '../screens/AnyVoteStackScreens/AnyVoteSteps'
import TokenScreen from '../screens/TokenScreen'
import MapScreen from '../screens/Map'

const Stack = createNativeStackNavigator()

export default function AnyVoteStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="AnyVoteInfo"   // 👈 SEMPRE começa aqui
    >
      <Stack.Screen name="AnyVoteInfo" component={AnyVoteInfoScreen} />

      {/* Telas do tutorial */}
      <Stack.Screen name="AnyVoteStart" component={AnyVoteStart} />
      <Stack.Screen name="AnyVoteWarning" component={Warning} />
      <Stack.Screen name="AnyVoteFAQ" component={Faq} />
      <Stack.Screen name="AnyVoteSteps" component={AnyVoteSteps} />

      {/* Telas normais */}
      <Stack.Screen name="AnyVoteToken" component={TokenScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  )
}
