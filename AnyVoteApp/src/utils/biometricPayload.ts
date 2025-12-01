// src/utils/biometricPayload.ts

// Tamanho alvo do template biométrico em bytes/caracteres
export const TEMPLATE_BYTES = 12488 // ≈ 12.4 KB, como você já vinha usando

// Payload lógico (independente de QR)
export interface BiometricTokenPayload {
  tokenId: string
  zona: string
  secao: string
  municipioId: string // pode ser ID do município ou código que define os cargos
  templateBytes: number
  template: string // ASCII aleatórios simulando o template biométrico
  ecdsaSignatureHex: string
}

export function generateMockEcdsaSignatureHex(
  lengthBytes: number = 64,
  rng: () => number = Math.random,
): string {
  const hexAlphabet = '0123456789abcdef'
  const n = hexAlphabet.length
  let hex = ''

  // 64 bytes = 128 caracteres hex
  const hexLen = lengthBytes * 2

  for (let i = 0; i < hexLen; i++) {
    const idx = Math.floor(rng() * n)
    hex += hexAlphabet[idx]
  }

  return hex
}
/**
 * Gera uma string ASCII aleatória com o comprimento desejado.
 * Isso é só para fins de DEMO, **não** é aleatoriedade criptográfica real.
 */
export function generateRandomAsciiTemplate(
  length: number = TEMPLATE_BYTES,
  rng: () => number = Math.random, // você pode injetar um RNG melhor depois
): string {
  // Alfabeto ASCII "seguro pra texto" (você pode ajustar)
  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=-_.,:;!@#$%&*()[]{}<>?'

  const n = alphabet.length
  let result = ''

  for (let i = 0; i < length; i++) {
    const idx = Math.floor(rng() * n)
    result += alphabet[idx]
  }

  return result
}

/**
 * Constrói o payload lógico do token biométrico.
 *
 * Aqui você só define os metadados (token, zona, seção, município)
 * e o template biométrico "fake" de ~12.4 KB em ASCII.
 *
 * Nada de QR, partes, ECC, etc — isso fica para o encoder de QR.
 */
export function buildBiometricTokenPayload(params: {
  tokenId: string
  zona: string
  secao: string
  municipioId: string
  templateLength?: number
  rng?: () => number
}): BiometricTokenPayload {
  const {
    tokenId,
    zona,
    secao,
    municipioId,
    templateLength = TEMPLATE_BYTES,
    rng = Math.random,
  } = params

  const template = generateRandomAsciiTemplate(templateLength, rng)

  // NOVO: mock de assinatura ECDSA 64 bytes em hex
  const ecdsaSignatureHex = generateMockEcdsaSignatureHex(64, rng)

  return {
    tokenId,
    zona,
    secao,
    municipioId,
    templateBytes: template.length,
    template,
    ecdsaSignatureHex,
  }
}

/**
 * Conveniência: transforma o payload em uma string única (por exemplo,
 * para salvar em arquivo, mandar pra rede ou depois quebrar em partes de QR).
 */
export function serializeBiometricTokenPayload(
  payload: BiometricTokenPayload,
): string {
  return JSON.stringify(payload)
}
