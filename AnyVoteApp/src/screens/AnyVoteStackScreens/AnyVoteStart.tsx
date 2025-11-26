import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function AnyVoteStart() {
  const nav = useNavigation<any>()

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F8FA', padding: 24, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', gap: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#122132', textAlign: 'center' }}>
          Conheça o voto móvel
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: '#333',
            textAlign: 'center',
            lineHeight: 22,
            maxWidth: 320,
          }}
        >
          O Voto Móvel permite que o eleitor escolha um local autorizado diferente da sua seção de
          origem para votar durante o período estabelecido.
        </Text>
      </View>

      <Pressable
        onPress={() => nav.navigate('AnyVoteWarning')}
        style={{
          backgroundColor: '#FFB33A',
          borderRadius: 28,
          paddingVertical: 14,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 40,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <Text style={{ color: '#111', fontWeight: '700', fontSize: 16 }}>
          Conheça o voto móvel
        </Text>
      </Pressable>
    </View>
  )
}
