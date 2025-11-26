import React from 'react'
import { View, Text, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const MOCK = {
  nome: 'José de Souza Andrade',
  titulo: 'Nº 4596 5089 0116', // ilustrativo
  biometria: true,
  nascimento: '30/01/2001',
  cpf: '123.456.789-00',
  zona: '227',
  sessao: '0047',
  municipioUf: 'Cotia/SP',
  filiacao: ['Maria de Souza', 'Pedro Andrade'],
}

export default function Info() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7FA' }}>
      {/* Faixa azul topo */}
      <View style={{ height: 120, backgroundColor: '#163A5C' }} />

      {/* Cartão principal */}
      <View
        style={{
          flex: 1,
          marginTop: -40,
          marginHorizontal: 16,
          backgroundColor: '#FFF',
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 2,
        }}
      >
        {/* Foto/Avatar sobre a faixa */}
        <View style={{ alignItems: 'center', marginTop: -56 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 16,
              backgroundColor: '#E9EEF4',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: '#FFF',
            }}
          >
            {/* se tiver foto real, troque pelo <Image source={{uri}}/> */}
            <Ionicons name="person" size={56} color="#1F2D3D" />
          </View>
        </View>

        {/* Nome e número do título */}
        <View style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#122132', textAlign: 'center' }}>
            {MOCK.nome}
          </Text>
          <Text style={{ marginTop: 4, fontSize: 16, fontWeight: '700', color: '#1A5BAA' }}>
            {MOCK.titulo}
          </Text>
        </View>

        {/* Selo de biometria */}
        <View
          style={{
            marginTop: 12,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Text style={{ color: '#233447', fontWeight: '600' }}>
            ELEITOR(A) COM BIOMETRIA COLETADA
          </Text>
          <Ionicons name="information-circle-outline" size={16} color="#5C6D81" />
        </View>

        {/* Blocos de informação em 2 colunas (quando fizer sentido) */}
        <Section>
          <Row2
            leftLabel="Data de nascimento"
            leftValue={MOCK.nascimento}
            rightLabel="CPF"
            rightValue={MOCK.cpf}
          />
          <Row2
            leftLabel="Zona"
            leftValue={MOCK.zona}
            rightLabel="Seção"
            rightValue={MOCK.sessao}
            rightIcon // ícone de info ao lado de Seção
          />
          <Row1 label="Município/UF" value={MOCK.municipioUf} />
          <RowFiliacao labels={['Filiação']} values={MOCK.filiacao} />
        </Section>
      </View>
    </View>
  )
}

/* ===== componentes de layout simples ===== */

const Label = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ color: '#5C6D81', fontSize: 12 }}>{children}</Text>
)
const Value = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ color: '#0E1C2E', fontWeight: '700', fontSize: 16 }}>{children}</Text>
)

function Section({ children }: { children: React.ReactNode }) {
  return <View style={{ marginTop: 16, gap: 16 }}>{children}</View>
}

function Row2({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  rightIcon,
}: {
  leftLabel: string
  leftValue: string
  rightLabel: string
  rightValue: string
  rightIcon?: boolean
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <View style={{ flex: 1 }}>
        <Label>{leftLabel}</Label>
        <Value>{leftValue}</Value>
      </View>
      <View style={{ flex: 1 }}>
        <Label>
          {rightLabel}{' '}
          {rightIcon ? <Ionicons name="information-circle-outline" size={14} color="#5C6D81" /> : null}
        </Label>
        <Value>{rightValue}</Value>
      </View>
    </View>
  )
}

function Row1({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </View>
  )
}

function RowFiliacao({ labels, values }: { labels: string[]; values: string[] }) {
  return (
    <View>
      <Label>{labels[0]}</Label>
      <View style={{ marginTop: 2 }}>
        {values.map((v, i) => (
          <Text key={i} style={{ color: '#0E1C2E', fontWeight: '700', fontSize: 16, lineHeight: 22 }}>
            {v}
          </Text>
        ))}
      </View>
    </View>
  )
}
