import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function Warning() {
  const nav = useNavigation<any>()

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F8FA', padding: 24, justifyContent: 'center' }}>
      <View
        style={{
          borderWidth: 1.5,
          borderColor: '#B33636',
          borderRadius: 12,
          backgroundColor: '#FFF',
          paddingVertical: 20,
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            backgroundColor: '#B33636',
            paddingVertical: 8,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            marginTop: -20,
            marginHorizontal: -16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 18 }}>Atenção!</Text>
        </View>

        <View style={{ marginTop: 16, gap: 10 }}>
          <Bullet>
            A mobilidade de voto não é obrigatória. Caso não opte por usá-la, vote normalmente em sua seção de
            origem.
          </Bullet>
          <Bullet>
            Ao usar este recurso, o seu voto será registrado na seção de mobilidade escolhida e não
            na sua seção de origem, sendo um processo irreversível.
          </Bullet>
          {/* <Bullet>
            O token é único e pessoal. Se alguém tiver acesso ao seu token, isso pode comprometer a
            sua votação.
          </Bullet> */}
        </View>
      </View>

      <Pressable
        onPress={() => nav.navigate('AnyVoteFAQ')}
        style={{
          backgroundColor: '#B33636',
          borderRadius: 24,
          paddingVertical: 14,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 32,
        }}
      >
        <Text style={{ color: '#FFF', fontWeight: '700' }}>Prosseguir</Text>
      </Pressable>
    </View>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      <Text style={{ fontSize: 16 }}>•</Text>
      <Text style={{ flex: 1, fontSize: 16, color: '#111' }}>{children}</Text>
    </View>
  )
}
