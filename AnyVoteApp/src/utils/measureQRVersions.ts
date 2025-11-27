// scripts/measureQrVersions.ts

const QRCode = require('qrcode')

// importa a lógica do payload usando require também
const {
  buildBiometricTokenPayload,
  serializeBiometricTokenPayload,
} = require('./biometricPayload')
// capacidades máximas do QR Code versão 40 em modo byte (aprox.) — igual você já usava
const ECC_M_CAPACITY = 2331 // “modo real”
const ECC_L_CAPACITY = 2953 // “modo demo”

type Mode = 'real' | 'demo'

interface QrPart {
  idx: number
  total: number
  slice: string
  value: string // o que vai pro QR de fato
  partBytes: number
}

/**
 * Divide o payload serializado em partes, controlando “espalhamento”.
 *
 * - mode: 'real' (ECC-M) ou 'demo' (ECC-L)
 * - extraParts: quantos QRs a mais além do mínimo teórico
 */
function splitPayloadIntoQrParts(params: {
  serialized: string
  mode: Mode
  extraParts: number
}): QrPart[] {
  const { serialized, mode, extraParts } = params

  // capacidade base depende do modo (ECC)
  const baseCap = mode === 'real' ? ECC_M_CAPACITY : ECC_L_CAPACITY

  const totalBytes = serialized.length

  // menor número de QRs possível, se cada um usasse até a capacidade de v40
  const minParts = Math.ceil(totalBytes / baseCap)

  // quantos QRs queremos de fato (mínimo + extra)
  const desiredParts = Math.max(minParts + extraParts, minParts)

  // tamanho aproximado por parte pra chegar no desiredParts
  const cap = Math.ceil(totalBytes / desiredParts)

  const parts: QrPart[] = []
  const total = Math.ceil(totalBytes / cap)

  let start = 0
  for (let idx = 0; idx < total; idx++) {
    const end = Math.min(start + cap, totalBytes)
    const slice = serialized.slice(start, end)

    // aqui você pode, se quiser, colocar um header por parte.
    // por enquanto, só coloco um prefixo simples informando posição:
    const header = {
      mode,
      idx,
      total,
      totalBytes,
      partBytes: slice.length,
    }

    const value = JSON.stringify(header) + '|' + slice

    parts.push({
      idx,
      total,
      slice,
      value,
      partBytes: slice.length,
    })

    start = end
  }

  return parts
}

/**
 * Mede e imprime a versão de todos os QRs para um dado modo + extraParts.
 */
async function measureForModeAndExtraParts(mode: Mode, extraParts: number) {
  // 1) gera o payload lógico (independente de QR)
  const payload = buildBiometricTokenPayload({
    tokenId: 'TKN-DEMO-123',
    zona: '227',
    secao: '0047',
    municipioId: 'SP-Cotia',
  })

  // 2) serializa tudo em uma string contínua
  const serialized = serializeBiometricTokenPayload(payload)

  console.log('============================================')
  console.log(`Modo=${mode}, extraParts=${extraParts}`)
  console.log(`Tamanho total do payload serializado: ${serialized.length} bytes`)

  // 3) divide em partes conforme o “espalhamento”
  const parts = splitPayloadIntoQrParts({ serialized, mode, extraParts })

  console.log(`Total de QRs gerados: ${parts.length}`)

  // 4) para cada parte, gera o QR com node-qrcode e inspeciona a versão
  for (const p of parts) {
    const qr = QRCode.create(p.value, {
      errorCorrectionLevel: mode === 'real' ? 'M' : 'L',
    })

    console.log(
      `Parte ${p.idx + 1}/${p.total} | bytes=${p.partBytes} | versao=${qr.version} | matriz=${qr.modules.size}x${qr.modules.size}`,
    )
  }
}

/**
 * Função principal: você pode brincar com vários valores de extraParts aqui.
 */
async function main() {
  // mínimo de QRs
  await measureForModeAndExtraParts('real', 0)
//   await measureForModeAndExtraParts('demo', 0)

  // por exemplo: 3 QRs a mais do mínimo (menos denso)
  await measureForModeAndExtraParts('real', 10)
//   await measureForModeAndExtraParts('demo', 3)

  // se depois você quiser testar “até dar 9 QRs”, dá pra botar um loop
  // variando extraParts até que parts.length === 9.
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
