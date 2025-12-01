// src/screens/Login.tsx
import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  onContinue: () => void   // quem usa essa tela decide o que acontece ao continuar
}

export default function Login({ onContinue }: Props) {
  const [hidden, setHidden] = useState(true)

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F4F5F7' }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      {/* Barra azul superior */}
      <View style={{ height: 140, backgroundColor: '#12365A' }} />

      <View style={{ flex: 1, paddingHorizontal: 20, marginTop: -40 }}>
        {/* Avatar + Nome */}
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 96, height: 96, borderRadius: 18, backgroundColor: '#FFF',
              alignItems: 'center', justifyContent: 'center',
              elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8,
            }}
          >
            <Ionicons name="person" size={56} color="#1C2D3E" />
          </View>
          <Text style={{ marginTop: 12, fontWeight: '700', letterSpacing: 1, color: '#1C2D3E' }}>
            NOME COMPLETO
          </Text>
        </View>

        {/* Campo "senha" meramente visual */}
        <View style={{ marginTop: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ color: '#5B6C80' }}>Digite sua senha</Text>
            <Pressable onPress={() => setHidden(h => !h)} style={{ marginLeft: 'auto', padding: 6 }}>
              <Ionicons name={hidden ? 'eye-off' : 'eye'} size={18} color="#5B6C80" />
            </Pressable>
          </View>

          <View
            style={{
              backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: '#DADFE6',
              paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 8,
            }}
          >
            <TextInput
              placeholder=""
              secureTextEntry={hidden}
              style={{ fontSize: 16, paddingVertical: 4 }}
              // sem onChange, sem validação — é só visual
            />
          </View>
        </View>

        {/* Links ilustrativos */}
        <View style={{ marginTop: 18, gap: 14, alignItems: 'center' }}>
          <Text style={{ color: '#D75C5C' }}>Esqueci minha senha</Text>
          <Text style={{ color: '#D75C5C' }}>Apagar meus dados</Text>
        </View>

        {/* Botão Continuar */}
        <Pressable
          onPress={onContinue}
          style={{
            marginTop: 40,
            backgroundColor: '#FFB33A',
            borderRadius: 28,
            paddingVertical: 16,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 6,
          }}
        >
          <Text style={{ fontWeight: '700', letterSpacing: 1, color: '#1C2D3E' }}>
            Continuar
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}
