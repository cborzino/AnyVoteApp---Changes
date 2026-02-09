// src/screens/AnyVoteInfo.tsx
import React, { useEffect, useMemo, useRef } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useElection } from '../context/ElectionContext'
import type { ElectionPhase, UserStatus } from '../domain/electionTypes'

type Period = { start: Date; end: Date }

/* Só pra exibição das datas na tela */
const cadastroPeriod: Period = {
  start: new Date(2025, 6, 1, 8, 0, 0),
  end:   new Date(2025, 6, 20, 23, 59, 59),
}
const escolhaPeriod: Period = {
  start: new Date(2025, 6, 21, 0, 0, 0),
  end:   new Date(2025, 8, 28, 23, 59, 59),
}

function fmt(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/* ===== status dos períodos guiados pela phase ===== */

function getCadastroStatusFromPhase(phase: ElectionPhase) {
  if (phase === 'BEFORE_REG') return { label: 'Não iniciado', color: '#8A8F99' }
  if (phase === 'REG_OPEN')   return { label: 'Aberto',       color: '#1B7F4E' }
  return { label: 'Encerrado', color: '#B33636' }
}

function getEscolhaStatusFromPhase(phase: ElectionPhase) {
  if (phase === 'LOCATION_CHOICE')             return { label: 'Aberto',       color: '#1B7F4E' }
  if (phase === 'BEFORE_REG' || phase === 'REG_OPEN')
                                               return { label: 'Não iniciado', color: '#8A8F99' }
  return { label: 'Encerrado', color: '#B33636' }
}

/* ===== status pessoal guiado pelo userStatus ===== */

type PersonalStage = 'pending' | 'review' | 'done'
function getUserCadastroStatus(userStatus: UserStatus): {
  label: string
  color: string
  stage: PersonalStage
} {
  switch (userStatus) {
    case 'REG_PENDING':
      return { label: 'Seu status: Em análise',  color: '#E09B00', stage: 'review' }

    case 'REG_CONFIRMED':
    case 'LOCATION_CHOSEN':
      return { label: 'Seu status: Concluído',   color: '#1B7F4E', stage: 'done' }

    case 'NOT_REGISTERED':
      return { label: 'Seu status: Não registrado', color: '#B33636', stage: 'pending' }

    case 'FIRST_TIME':
      return { label: 'Seu status: Primeiro acesso', color: '#B33636', stage: 'pending' }

    default:
      return { label: 'Seu status: Pendente',    color: '#B33636', stage: 'pending' }
  }
}

export default function AnyVoteInfo() {
  const navigation = useNavigation<any>()
  const { phase, userStatus } = useElection()

  const canChooseLocation = phase === 'LOCATION_CHOICE'
  const alreadyRedirectedRef = useRef(false)
  // as linhas comentadas abaixo ativam o aviso em caso de primeiro uso do app
  // useEffect(() => {
  //   // dispara o tutorial só se for FIRST_TIME
  //   if (userStatus === 'FIRST_TIME' && !alreadyRedirectedRef.current) {
  //     alreadyRedirectedRef.current = true

  //     // entra na tela inicial do tutorial
  //     // (usa o nome que você já tem registrado no stack root)A
  //     navigation.replace('AnyVoteStart' as never)
  //     // ou navigation.replace('AnyVoteStart' as never) se não quiser que volte pra info com "voltar"
  //   }
  // }, [userStatus, navigation])


  const cad = useMemo(() => ({
    ...getCadastroStatusFromPhase(phase),
    start: fmt(cadastroPeriod.start),
    end:   fmt(cadastroPeriod.end),
  }), [phase])

  const esc = useMemo(() => ({
    ...getEscolhaStatusFromPhase(phase),
    start: fmt(escolhaPeriod.start),
    end:   fmt(escolhaPeriod.end),
  }), [phase])

  const personal = useMemo(
    () => getUserCadastroStatus(userStatus),
    [userStatus],
  )

  // token só sai quando chegar na fase PRE_ELECTION_QR
  const tokenAvailable = phase === 'PRE_ELECTION_QR'

  const goHelp = () => navigation.navigate('AnyVoteWarning' as never)
  const openSteps = () => navigation.navigate('AnyVoteSteps' as never)

  // se você tiver uma tela de mapa no stack, ajuste o nome aqui:
  const goToMap = () => navigation.navigate('MapScreen' as never)

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7FA' }}>
      {/* HEADER FIXO */}
      <View
        style={{
          backgroundColor: '#163A5C',
          paddingTop: 18,
          paddingBottom: 14,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#FFF',
            fontSize: 18,
            fontWeight: '700',
            flex: 1,
          }}
        >
          Voto Móvel — Informações
        </Text>
        <Pressable onPress={goHelp} hitSlop={8}>
          <Ionicons name="help-circle-outline" size={22} color="#FFF" />
        </Pressable>
      </View>

      {/* CONTEÚDO ROLÁVEL */}
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 14,
          paddingBottom: 32,
        }}
      >
        {/* HERO: PASSO A PASSO */}
        <View
          style={{
            backgroundColor: '#FFF8E6',
            borderColor: '#FFE1A6',
            borderWidth: 1,
            borderRadius: 16,
            padding: 14,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Ionicons name="walk-outline" size={18} color="#C07A00" />
            <Text
              style={{
                marginLeft: 8,
                color: '#3A2A00',
                fontWeight: '700',
                fontSize: 16,
                flex: 1,
              }}
            >
              Siga o passo a passo
            </Text>
          </View>
          <Text style={{ color: '#5C4B1A', marginBottom: 12 }}>
            Entenda rapidamente como usar o Voto Móvel: solicite cadastro,
            escolha o local e receba seu token.
          </Text>

          <Pressable
            onPress={openSteps}
            style={{
              backgroundColor: '#FFB33A',
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#111', fontWeight: '700' }}>
              Ver passo a passo
            </Text>
          </Pressable>

          <Pressable
            onPress={goHelp}
            style={{ alignSelf: 'center', marginTop: 10, padding: 6 }}
          >
            <Text
              style={{
                color: '#8A6A22',
                textDecorationLine: 'underline',
              }}
            >
              Ver aviso e informações gerais
            </Text>
          </Pressable>
        </View>

        {/* PERÍODO DE CADASTRO */}
        <Card>
          <HeaderRow
            title="Período de cadastro"
            badge={{ text: cad.label, color: cad.color }}
          />

          <SubBadge text={personal.label} color={personal.color} />

          <Field label="Abertura" value={cad.start} />
          <Field label="Encerramento" value={cad.end} />
          <Hint
            text={
              cad.label === 'Aberto'
                ? personal.stage === 'pending'
                  ? 'Você ainda não registrou sua intenção. O cadastro é presencial durante o período acima.'
                  : personal.stage === 'review'
                  ? 'Cadastro registrado. Aguarde confirmação.'
                  : 'Cadastro concluído. Você já está habilitado a usar o Voto Móvel.'
                : cad.label === 'Não iniciado'
                ? 'Fique atento: o cadastro é presencial quando o período abrir.'
                : 'Período encerrado. Para próximas eleições, verifique as novas datas.'
            }
          />
        </Card>

        {/* ESCOLHA DO LOCAL */}
        <Card>
          <HeaderRow
            title="Período para escolher local"
            badge={{ text: esc.label, color: esc.color }}
          />

          <Field label="Abertura" value={esc.start} />
          <Field label="Encerramento" value={esc.end} />
          <Hint
            text={
              esc.label === 'Aberto'
                ? 'Você pode alterar o local de votação quantas vezes quiser dentro do período.'
                : esc.label === 'Não iniciado'
                ? 'Assim que abrir, você poderá escolher e alterar o local de votação.'
                : 'Encerrado. O local selecionado por último será utilizado no dia da eleição.'
            }
          />

<Pressable
  onPress={goToMap}
  disabled={!canChooseLocation}
  style={{
    marginTop: 10,
    backgroundColor: canChooseLocation ? '#0D6EFD' : '#A0AEC0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    opacity: canChooseLocation ? 1 : 0.6,
  }}
>
  <Text style={{ color: '#FFF', fontWeight: '700' }}>
    Escolher local de votação
  </Text>
</Pressable>
        </Card>

        {/* TOKEN */}
        <Card>
          <HeaderRow
            title="Token de votação"
            badge={{
              text: tokenAvailable ? 'Disponível' : 'Indisponível',
              color: tokenAvailable ? '#1B7F4E' : '#8A8F99',
            }}
          />

          {tokenAvailable ? (
            <>
              <View
                style={{
                  marginTop: 8,
                  height: 120,
                  borderRadius: 12,
                  backgroundColor: '#F1F5FA',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontWeight: '700' }}>Seu token está pronto.</Text>
                <Text style={{ color: '#5A6B84', marginTop: 6 }}>
                  Será exibida uma sequência de QR Codes.
                </Text>
              </View>

              <Pressable
                onPress={() => navigation.navigate('AnyVoteToken' as never)}
                style={{
                  marginTop: 10,
                  backgroundColor: '#0D6EFD',
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#FFF', fontWeight: '700' }}>
                  Abrir token (multi-QR)
                </Text>
              </Pressable>
            </>
          ) : (
            <View style={{ marginTop: 8, gap: 8 }}>
              <View
                style={{
                  height: 120,
                  borderRadius: 12,
                  backgroundColor: '#F1F5FA',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#5A6B84' }}>
                  Seu token aparecerá aqui próximo à eleição.
                </Text>
              </View>
              {/* <Hint text="O token é pessoal e intransferível. Não compartilhe!" /> */}
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  )
}

/* ===== Helpers de UI ===== */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 14,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {children}
    </View>
  )
}

function HeaderRow({
  title,
  badge,
}: {
  title: string
  badge: { text: string; color: string }
}) {
  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: '700',
          color: '#0E1C2E',
          flex: 1,
        }}
      >
        {title}
      </Text>
      <Pill text={badge.text} color={badge.color} />
    </View>
  )
}

function SubBadge({ text, color }: { text: string; color: string }) {
  return (
    <View style={{ marginBottom: 6 }}>
      <Pill text={text} color={color} small />
    </View>
  )
}

function Pill({
  text,
  color,
  small,
}: {
  text: string
  color: string
  small?: boolean
}) {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: color,
        paddingHorizontal: small ? 8 : 10,
        paddingVertical: small ? 3 : 4,
        borderRadius: 999,
      }}
    >
      <Text
        style={{
          color: '#FFF',
          fontSize: small ? 11 : 12,
          fontWeight: '700',
        }}
      >
        {text}
      </Text>
    </View>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', marginTop: 2 }}>
      <Text style={{ width: 120, color: '#5C6D81' }}>{label}</Text>
      <Text style={{ color: '#0E1C2E', fontWeight: '700' }}>{value}</Text>
    </View>
  )
}

function Hint({ text }: { text: string }) {
  return <Text style={{ color: '#5A6B84', marginTop: 8 }}>{text}</Text>
}
