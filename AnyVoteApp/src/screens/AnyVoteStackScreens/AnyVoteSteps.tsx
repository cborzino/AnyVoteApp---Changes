import React, { useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, TabActions } from '@react-navigation/native'

type Step = { title: string; body: React.ReactNode }

const styles = StyleSheet.create({
  p: { fontSize: 16, lineHeight: 22, color: '#111' },
  subtle: { color: '#6B7280' },
  linkBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#E6E9F0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  linkBtnText: { fontWeight: '700', color: '#0E1C2E' },
})

export default function AnyVoteSteps() {
  const navigation = useNavigation<any>()
  const [idx, setIdx] = useState(0)

  // montamos os steps aqui dentro para poder usar a navegação no botão do passo 1
  const STEPS: Step[] = [
    {
      title: '1. Solicite intenção de usar o Voto Móvel',
      body: (
        <View>
          <Text style={styles.p}>
            <Text style={{ fontWeight: '700' }}>Etapa presencial.</Text> Dentro do período de
            cadastro, compareça a um posto autorizado para registrar a sua intenção de utilizar o
            voto móvel.
          </Text>
          <Text style={[styles.p, styles.subtle, { marginTop: 6 }]}>
            Leve um documento oficial com foto.
          </Text>

          <Pressable
            onPress={() => navigation.dispatch(TabActions.jumpTo('Onde votar'))}
            style={styles.linkBtn}
          >
            <Text style={styles.linkBtnText}>
              <Ionicons name="location-outline" size={16} /> Ver locais de registro próximos
            </Text>
          </Pressable>
        </View>
      ),
    },
    {
      title: '2. Acompanhe os períodos',
      body: (
        <View>
          <Text style={styles.p}>
            O processo tem <Text style={{ fontWeight: '700' }}>dois períodos principais</Text>:
          </Text>
          <Text style={[styles.p, { marginTop: 8 }]}>
            • <Text style={{ fontWeight: '700' }}>Cadastro</Text> — fecha cerca de{' '}
            <Text style={{ fontWeight: '700' }}>150 dias antes</Text> da eleição. É quando você
            registra presencialmente a intenção de usar o voto móvel.
          </Text>
          <Text style={[styles.p, { marginTop: 6 }]}>
            • <Text style={{ fontWeight: '700' }}>Escolha do local</Text> — abre por volta de{' '}
            <Text style={{ fontWeight: '700' }}>3 semanas antes</Text> da eleição. Nesse período,
            você seleciona (e pode alterar) o local de votação autorizado.
          </Text>
        </View>
      ),
    },
    {
      title: '3. Receba seu Token',
      body: (
        <View>
          <Text style={styles.p}>
            Próximo à eleição, um token único (QR Code) ficará disponível no app para confirmar a
            sua habilitação no local escolhido.
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>

          </View>
        </View>
      ),
    },
    {
      title: '4. No dia da eleição',
      body: (
        <Text style={styles.p}>
          Vá até a seção escolhida, apresente seu documento oficial e mostre o token para liberar a
          votação.
        </Text>
      ),
    },
  ]

  const next = () => (idx < STEPS.length - 1 ? setIdx(idx + 1) : navigation.goBack())
  const prev = () => (idx > 0 ? setIdx(idx - 1) : navigation.goBack())

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7FA' }}>
      {/* Cabeçalho azul */}
      <View style={{ backgroundColor: '#0D2B57', paddingVertical: 18, paddingHorizontal: 20 }}>
        <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '700' }}>Passo a Passo</Text>
      </View>

      {/* Stepper */}
      <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>
        <Stepper total={STEPS.length} current={idx} />
      </View>

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 28 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', marginBottom: 10 }}>
          {STEPS[idx].title}
        </Text>
        {STEPS[idx].body}
      </ScrollView>

      {/* Ações */}
      <View style={{ flexDirection: 'row', gap: 12, padding: 16 }}>
        <Secondary onPress={prev} label={idx === 0 ? 'Fechar' : 'Voltar'} />
        <Primary onPress={next} label={idx === STEPS.length - 1 ? 'Concluir' : 'Próximo'} />
      </View>
    </View>
  )
}

/* ===== componentes auxiliares ===== */

function Stepper({ total, current }: { total: number; current: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <Dot active={i <= current} current={i === current} />
          {i < total - 1 && <Line active={i < current} />}
        </React.Fragment>
      ))}
    </View>
  )
}

function Dot({ active, current }: { active: boolean; current: boolean }) {
  const bg = active ? '#7C3AED' : '#D7D9E0'
  const size = current ? 14 : 10
  return <View style={{ width: size, height: size, borderRadius: 999, backgroundColor: bg }} />
}

function Line({ active }: { active: boolean }) {
  return <View style={{ height: 2, flex: 1, marginHorizontal: 8, backgroundColor: active ? '#7C3AED' : '#D7D9E0' }} />
}

function Primary({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: '#FFB33A',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#111', fontWeight: '700' }}>{label}</Text>
    </Pressable>
  )
}

function Secondary({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: '#E6E9F0',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#122132', fontWeight: '700' }}>{label}</Text>
    </Pressable>
  )
}
