import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AnyVoteStart from '../screens/AnyVoteStackScreens/AnyVoteStart'
import Warning from '../screens/AnyVoteStackScreens/Warning'
import Faq from '../screens/AnyVoteStackScreens/Faq'
import AnyVoteInfoScreen from '../screens/AnyVoteInfo'
import AnyVoteSteps from '../screens/AnyVoteStackScreens/AnyVoteSteps'
import TokenScreen from '../screens/TokenScreen'
import { useElection } from '../context/ElectionContext'
import MapScreen from '../screens/Map'

const Stack = createNativeStackNavigator()

export default function AnyVoteStack() {
  const { userStatus } = useElection()
  const isFirstTime = userStatus === 'FIRST_TIME'

  console.log('[AnyVoteStack] userStatus =', userStatus, 'isFirstTime =', isFirstTime)

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isFirstTime ? 'AnyVoteStart' : 'AnyVoteInfo'}
    >
      <Stack.Screen name="AnyVoteStart" component={AnyVoteStart} />
      <Stack.Screen name="AnyVoteWarning" component={Warning} />
      <Stack.Screen name="AnyVoteFAQ" component={Faq} />
      <Stack.Screen name="AnyVoteInfo" component={AnyVoteInfoScreen} />
      <Stack.Screen name="AnyVoteSteps" component={AnyVoteSteps} />
      <Stack.Screen name="AnyVoteToken" component={TokenScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />

    </Stack.Navigator>
  )
}
