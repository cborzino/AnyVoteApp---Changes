// App.tsx
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { ElectionProvider } from './src/context/ElectionContext'

import BottomTabs from './src/components/BottomTabs'
import Login from './src/screens/Login'

export default function App() {
  const [logged, setLogged] = useState(false)

  return (
    <ElectionProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        {logged ? (
          <BottomTabs />
        ) : (
          <Login onContinue={() => setLogged(true)} />
        )}
      </NavigationContainer>
    </ElectionProvider>
  )
}
