// src/screens/Map.tsx
import React, { useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Linking,
  Platform,
  Modal,
} from 'react-native'
import MapView, { Marker, Region } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'

type Place = {
  id: string
  name: string
  address: string
  zone: string
  secao: string
  lat: number
  lng: number
  capacity: number
  reserved: number
  updatedAt: string
}

const PLACES: Place[] = [
  {
    id: '1',
    name: 'COLÉGIO RIO BRANCO',
    address: 'RODOVIA RAPOSO TAVARES, 7200 (KM 24), Granja Viana, Cotia/SP',
    zone: '227',
    secao: '0047',
    lat: -23.5787,
    lng: -46.8408,
    capacity: 999,
    reserved: 93,
    updatedAt: '30/07/2025 12:51:53',
  },
  {
    id: '2',
    name: 'ESCOLA ESTADUAL X',
    address: 'Rua das Palmeiras, 100, Cotia/SP',
    zone: '227',
    secao: '0051',
    lat: -23.5832,
    lng: -46.852,
    capacity: 80,
    reserved: 80,
    updatedAt: '30/07/2025 12:30:10',
  },
  {
    id: '3',
    name: 'EE Y JARDIM DA GRANJA',
    address: 'Av. Central, 500, Cotia/SP',
    zone: '227',
    secao: '0063',
    lat: -23.5725,
    lng: -46.8301,
    capacity: 60,
    reserved: 12,
    updatedAt: '30/07/2025 12:45:20',
  },
]

export default function MapScreen() {
  const mapRef = useRef<MapView>(null)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Place | null>(PLACES[0])

  // local que o usuário está prestes a transferir (pra abrir o modal)
  const [pendingPlace, setPendingPlace] = useState<Place | null>(null)

  // local “escolhido” mockado só pra feedback visual
  const [chosenPlace, setChosenPlace] = useState<Place | null>(null)

  const initialRegion: Region = {
    latitude: selected?.lat ?? -23.58,
    longitude: selected?.lng ?? -46.84,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return PLACES.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.secao.toLowerCase().includes(q) ||
        p.zone.toLowerCase().includes(q),
    )
  }, [query])

  const moveTo = (p: Place) => {
    setSelected(p)
    mapRef.current?.animateToRegion(
      { latitude: p.lat, longitude: p.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      500,
    )
    setQuery('') // fecha sugestões
  }

  const openRoutes = (p: Place) => {
    const url =
      Platform.select({
        ios: `http://maps.apple.com/?daddr=${p.lat},${p.lng}`,
        android: `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`,
      }) || ''
    Linking.openURL(url).catch(() => {})
  }

  const available = (p?: Place | null) => {
    if (!p) return 0
    return Math.max(0, p.capacity - p.reserved)
  }

  const percent = (p?: Place | null) => {
    if (!p) return 0
    const a = available(p)
    return Math.round((a / p.capacity) * 100)
  }

  const isFull = (p?: Place | null) => available(p) === 0

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7FA' }}>
      {/* Search bar tipo Uber */}
      <View
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          right: 14,
          zIndex: 10,
          backgroundColor: '#FFF',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 3,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Ionicons name="search" size={18} color="#6B7280" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Digite endereço do local"
          style={{ flex: 1, paddingVertical: 2 }}
        />
      </View>

      {/* Sugestões (mock) */}
      {results.length > 0 && (
        <View
          style={{
            position: 'absolute',
            top: 60,
            left: 14,
            right: 14,
            zIndex: 9,
            backgroundColor: '#FFF',
            borderRadius: 12,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={results}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => moveTo(item)}
                style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#EEF1F5' }}
              >
                <Text style={{ fontWeight: '700', color: '#0E1C2E' }}>{item.name}</Text>
                <Text style={{ color: '#6B7280' }}>{item.address}</Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
      >
        {PLACES.map(p => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            onPress={() => setSelected(p)}
            title={p.name}
            description={`${p.secao} • Zona ${p.zone}`}
            pinColor={isFull(p) ? '#B33636' : '#1677FF'}
          />
        ))}
      </MapView>

      {/* Card do local selecionado */}
      {selected && (
        <View
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            top: 90,
            backgroundColor: '#FFF',
            borderRadius: 16,
            padding: 14,
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ color: '#6B7280' }}>
              Seção {selected.secao}  •  Zona {selected.zone}
            </Text>
          </View>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#0E1C2E' }}>
            {selected.name}
          </Text>
          <Text style={{ color: '#44566C', marginTop: 2 }}>{selected.address}</Text>
          <Text style={{ color: '#8A8F99', marginTop: 4, fontSize: 12 }}>
            Atualizado em {selected.updatedAt}
          </Text>

          {/* Vagas disponíveis */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: '700', color: '#0E1C2E' }}>
              Vagas disponíveis: {available(selected)} / {selected.capacity}
            </Text>

            {/* Barra de capacidade */}
            <View
              style={{
                height: 8,
                borderRadius: 999,
                backgroundColor: '#EDF2F7',
                marginTop: 6,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${percent(selected)}%`,
                  height: 8,
                  backgroundColor: isFull(selected) ? '#B33636' : '#16A34A',
                }}
              />
            </View>

            <Text style={{ color: '#6B7280', marginTop: 4, fontSize: 12 }}>
              {isFull(selected) ? 'Local lotado' : 'Ainda há vagas para transferência'}
            </Text>
          </View>

          {/* Ações */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <Pressable
              onPress={() => openRoutes(selected)}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#C7D2FE',
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Ionicons name="navigate-outline" size={18} color="#1D4ED8" />
              <Text style={{ color: '#1D4ED8', fontWeight: '700' }}>Ver rotas</Text>
            </Pressable>

            <Pressable
              onPress={() => setPendingPlace(selected)}
              disabled={isFull(selected)}
              style={{
                flex: 1,
                backgroundColor: isFull(selected) ? '#BFC7D4' : '#2563EB',
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: '700' }}>
                {isFull(selected)
                  ? 'Sem vagas'
                  : chosenPlace && chosenPlace.id === selected.id
                  ? 'Local escolhido'
                  : 'Transferir local'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Modal de confirmação (simples, por cima da tela) */}
      <Modal
        visible={!!pendingPlace}
        transparent
        animationType="fade"
        onRequestClose={() => setPendingPlace(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}
        >
          {pendingPlace && (
            <View
              style={{
                backgroundColor: '#FFF',
                borderRadius: 16,
                padding: 18,
                width: '100%',
                maxWidth: 420,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  marginBottom: 8,
                  color: '#0E1C2E',
                }}
              >
                Confirmar transferência
              </Text>

              <Text style={{ color: '#4B5563', marginBottom: 8 }}>
                Você está prestes a transferir seu local de votação para:
              </Text>

              <Text style={{ fontWeight: '700', color: '#111827' }}>
                {pendingPlace.name}
              </Text>
              <Text style={{ color: '#6B7280', marginBottom: 10 }}>
                {pendingPlace.address}
              </Text>

              <Text style={{ color: '#4B5563', fontSize: 13, marginBottom: 14 }}>
                Enquanto o período de escolha de local estiver aberto, você poderá alterar esse
                local novamente quantas vezes precisar. Após o encerramento do prazo, vale o último
                local escolhido.
              </Text>



              <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
                <Pressable
                  onPress={() => setPendingPlace(null)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: '#D1D5DB',
                  }}
                >
                  <Text style={{ color: '#374151', fontWeight: '600' }}>Cancelar</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setChosenPlace(pendingPlace)
                    setPendingPlace(null)
                  }}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 999,
                    backgroundColor: '#2563EB',
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: '700' }}>Confirmar</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  )
}
