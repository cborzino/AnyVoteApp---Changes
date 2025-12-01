import React from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { useElection } from '../context/ElectionContext'
import type { ElectionPhase, UserStatus } from '../domain/electionTypes'

const PHASES: ElectionPhase[] = [
  'BEFORE_REG',
  'REG_OPEN',
  'LOCATION_CHOICE',
  'LOCATION_LOCKED',
  'PRE_ELECTION_QR',
]

const USER_STATUSES: UserStatus[] = [
  'FIRST_TIME',
  'NOT_REGISTERED',
  'REG_PENDING',
  'REG_CONFIRMED',
  'LOCATION_CHOSEN',
]

export const DebugScreen: React.FC = () => {
  const { phase, userStatus, setPhase, setUserStatus } = useElection()

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Debug de Estados (Mock)
      </Text>

      {/* BLOCO: FASE GLOBAL */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>
          Fase global da eleição:
        </Text>
        <Text style={{ marginBottom: 12 }}>Atual: {phase}</Text>

        {PHASES.map(p => (
          <Pressable
            key={p}
            onPress={() => setPhase(p)}
            style={{
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: p === phase ? '#007aff' : '#ddd',
              marginBottom: 6,
            }}
          >
            <Text>{p}</Text>
          </Pressable>
        ))}
      </View>

      {/* linha separadora */}
      <View
        style={{
          height: 1,
          backgroundColor: '#eee',
          marginBottom: 24,
        }}
      />

      {/* BLOCO: ESTADO DO USUÁRIO */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>
          Estado do usuário:
        </Text>
        <Text style={{ marginBottom: 12 }}>Atual: {userStatus}</Text>

        {USER_STATUSES.map(s => (
          <Pressable
            key={s}
            onPress={() => setUserStatus(s)}
            style={{
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: s === userStatus ? '#007aff' : '#ddd',
              marginBottom: 6,
            }}
          >
            <Text>{s}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  )
}
