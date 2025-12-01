import React from 'react'
import { ScrollView, View, Text, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useElection } from '../../context/ElectionContext'
export default function Faq() {
  const nav = useNavigation<any>()
  const { setUserStatus } = useElection()

  const handleFinish = () => {
    // 1) marca que não é mais primeira vez
    setUserStatus('NOT_REGISTERED')

    // 2) reseta a pilha para ir direto para AnyVoteInfo
    nav.reset({
      index: 0,
      routes: [{ name: 'AnyVoteInfo' as never }],
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Cabeçalho azul */}
      <View style={{ backgroundColor: '#0D2B57', paddingVertical: 18, paddingHorizontal: 20 }}>
        <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '700' }}>
          O que é Mobilidade na Votação?
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80, gap: 24 }}>
        <Section title="O que é?">
          É um mecanismo que habilita o eleitor a votar fora da sua seção cadastrada, em locais
          previamente autorizados, durante o período estipulado.
        </Section>

        <Section title="Por quê?">
          Serve para que o eleitor não perca o direito de votar quando não puder comparecer à sua
          seção de origem, em casos como viagem ou mudança.
        </Section>

        <Section title="Como Funciona?">
          Durante o período de ativação, o eleitor deve solicitar a ativação do voto móvel
          pessoalmente. Durante esse período poderá escolher o local desejado e, no dia da eleição,
          basta mostrar seu QR code para autenticar-se.
        </Section>

      </ScrollView>

      <Pressable
        onPress={handleFinish}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#FFB33A',
          borderRadius: 24,
          paddingVertical: 14,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#111', fontWeight: '700' }}>Entendi</Text>
      </Pressable>
    </View>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>{title}</Text>
      <Text style={{ fontSize: 16, lineHeight: 22 }}>{children}</Text>
    </View>
  )
}
