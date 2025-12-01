import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme'

type Props = {
  nome: string
  secao: string
  zona: string
  endereco: string
  latitude: number
  longitude: number
}

export default function VotingPlaceCard({ nome, secao, zona, endereco, latitude, longitude }: Props) {
  const abrirRotas = () => {
    Alert.alert(
      'Abrir aplicação externa?',
      'A rota será traçada por um aplicativo externo, o qual não é de responsabilidade do TSE. Deseja prosseguir?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: () => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
            Linking.openURL(url)
          },
        },
      ]
    )
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
        <Text style={styles.secaozona}>  Seção {secao}   •   Zona {zona}</Text>
      </View>
      <Text style={styles.nome}>{nome}</Text>
      <Text style={styles.endereco}>{endereco}</Text>
      <Text style={styles.atualizado}>Atualizado em 30/07/2025 12:51:53</Text>

      <TouchableOpacity style={styles.botao} onPress={abrirRotas}>
        <Ionicons name="navigate-outline" size={16} color="#0033A0" />
        <Text style={styles.botaoTexto}>  VER ROTAS</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  secaozona: {
    fontSize: 14,
    color: '#666',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  endereco: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  atualizado: {
    fontSize: 12,
    color: '#999',
  },
  botao: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  botaoTexto: {
    color: colors.primary,
    fontWeight: '600',
  },
})
