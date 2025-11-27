import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, Pressable, useWindowDimensions } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import {
  buildBiometricTokenPayload,
  serializeBiometricTokenPayload,
} from '../utils/biometricPayload'

// capacidades típicas (máximo, versão 40, modo byte)
const ECC_M_CAPACITY = 2331 // ECC-M, v40
const ECC_L_CAPACITY = 2953 // ECC-L, v40

type Mode = 'M' | 'L'

type Part = {
  value: string
  idx: number
  total: number
  start: number
  end: number
  partBytes: number
}

export default function BiometricTokenQR() {
  const navigation = useNavigation<any>()
  const { width, height } = useWindowDimensions()

  const [mode, setMode] = useState<Mode>('M')
  const [index, setIndex] = useState(0)
  const [extraParts, setExtraParts] = useState(0)

  // ===== 1) GERA O PAYLOAD LÓGICO (INDEPENDENTE DE QR) =====

  const [serializedPayload] = useState(() => {
    const payload = buildBiometricTokenPayload({
      tokenId: 'TKN-DEMO-123',
      zona: '227',
      secao: '0047',
      municipioId: 'SP-Cotia',
    })
    const serialized = serializeBiometricTokenPayload(payload)

    console.log('=== [BiometricTokenQR] Payload gerado ===')
    console.log('tokenId:', payload.tokenId)
    console.log('zona/secao/municipioId:', payload.zona, payload.secao, payload.municipioId)
    console.log('templateBytes (apenas template biométrico):', payload.templateBytes)
    console.log('tamanho total do payload serializado (JSON):', serialized.length, 'bytes')

    return serialized
  })

  // ===== 2) FATIAR O PAYLOAD EM PARTES (UNIFORME) =====

  const parts: Part[] = useMemo(() => {
    const totalBytes = serializedPayload.length
    const baseCap = mode === 'M' ? ECC_M_CAPACITY : ECC_L_CAPACITY

    // menor número possível de QRs assumindo “capacidade máxima” de v40
    const minParts = Math.ceil(totalBytes / baseCap)

    // quantos QRs queremos de fato (mínimo + “espalhamento”)
    const desiredParts = Math.max(minParts + extraParts, minParts)

    // bytes por parte para dar aproximadamente desiredParts (divisão uniforme)
    const cap = Math.ceil(totalBytes / desiredParts)

    const numParts = Math.ceil(totalBytes / cap)

    const arr: Part[] = []
    let start = 0

    for (let i = 0; i < numParts; i++) {
      const end = Math.min(start + cap, totalBytes)
      const slice = serializedPayload.slice(start, end)

      const header = {
        eccLevel: mode,        // agora diz claramente o nível de correção de erro
        idx: i,
        total: numParts,
        totalBytes,
        partBytes: slice.length,
        offsetStart: start,
        offsetEnd: end - 1,
      }

      arr.push({
        value: JSON.stringify(header) + '|' + slice,
        idx: i,
        total: numParts,
        start,
        end: end - 1,
        partBytes: slice.length,
      })

      start = end
    }

    // ===== DEBUG: log técnico no console =====
    console.log('=== [BiometricTokenQR] Recalculo de partes ===')
    console.log('eccLevel:', mode, '| extraParts:', extraParts)
    console.log('totalBytes do payload serializado:', totalBytes)
    console.log('baseCap teórica v40:', baseCap, 'bytes')
    console.log('minParts (teórico):', minParts)
    console.log('desiredParts (min + extra):', desiredParts)
    console.log('numParts fatiado:', numParts)
    arr.forEach(p => {
      console.log(
        `Parte ${p.idx + 1}/${p.total} | bytes=${p.partBytes} | range=${p.start}–${p.end}`,
      )
    })

    return arr
  }, [serializedPayload, mode, extraParts])

  // resetar index ao trocar de modo ou espalhamento
  useEffect(() => {
    setIndex(0)
  }, [mode, extraParts])

  if (parts.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F6F7FA',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Carregando token biométrico...</Text>
      </View>
    )
  }

  const p = parts[index]

  // QR bem grande, usando praticamente toda a largura e boa parte da altura
  const qrSize = Math.min(width * 0.85, height * 0.6)

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7FA' }}>
      {/* HEADER */}
      <View
        style={{
          backgroundColor: '#163A5C',
          paddingTop: 16,
          paddingBottom: 12,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Pressable onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
          <Ionicons name="chevron-back" size={22} color="#FFF" />
        </Pressable>

        <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 18, flex: 1 }}>
          Token biométrico — QR {p.idx + 1}/{p.total}
        </Text>
      </View>

      {/* MODO (ECC-M / ECC-L) */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 14,
          gap: 14,
        }}
      >
        <ModeButton
          label="ECC-M (nível M)"
          active={mode === 'M'}
          onPress={() => setMode('M')}
        />
        <ModeButton
          label="ECC-L (nível L)"
          active={mode === 'L'}
          onPress={() => setMode('L')}
        />
      </View>

      {/* CONTROLE DE ESPALHAMENTO */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 12,
          gap: 8,
        }}
      >
        <Pressable
          onPress={() => setExtraParts(v => Math.max(0, v - 1))}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: '#DDD',
            borderRadius: 6,
          }}
        >
          <Text style={{ fontSize: 16 }}>−</Text>
        </Pressable>

        <Text style={{ color: '#5A6B84' }}>
          Dividido em {parts.length} QR codes
        </Text>

        <Pressable
          onPress={() => setExtraParts(v => v + 1)}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: '#DDD',
            borderRadius: 6,
          }}
        >
          <Text style={{ fontSize: 16 }}>+</Text>
        </Pressable>
      </View>



      {/* QR ATUAL – BEM GRANDE */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
        }}
      >
        <QRCode
          value={p.value}
          size={qrSize}
          ecl={mode} // 'M' ou 'L'
          backgroundColor="#FFF"
          color="#000"
          quietZone={8}
        />

        <Text style={{ marginTop: 12, color: '#5A6B84' }}>
          Parte {p.idx + 1} de {p.total}
        </Text>
      </View>

      {/* CONTROLES DE NAVEGAÇÃO ENTRE PARTES */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 12,
          paddingBottom: 24,
        }}
      >
        <IconButton
          icon="arrow-back"
          onPress={() =>
            setIndex((index - 1 + parts.length) % parts.length)
          }
        />
        <IconButton
          icon="arrow-forward"
          onPress={() =>
            setIndex((index + 1) % parts.length)
          }
        />
      </View>
    </View>
  )
}

// ===== COMPONENTES AUXILIARES =====

function ModeButton({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: active ? '#FFB33A' : '#DDD',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: active ? '#111' : '#555', fontWeight: '700' }}>
        {label}
      </Text>
    </Pressable>
  )
}

function IconButton({
  icon,
  onPress,
}: {
  icon: any
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: '#FFB33A',
        borderRadius: 999,
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
    >
      <Ionicons name={icon} size={20} color="#111" />
    </Pressable>
  )
}
