# AnyVoteApp
Aplicativo protótipo para geração de Tokens em um cenário de "voto móvel". Desenvolvido como parte do Projeto de Formatura de 2025 do Departamento de Engenharia de Computação e Sistemas Digitais da POLI-USP.

<img width="200" height="1600" alt="image" src="https://github.com/user-attachments/assets/1e2eda20-7d64-42a1-8550-c436f2b340c6" />

<img width="200" height="1600" alt="image" src="https://github.com/user-attachments/assets/c2647f8a-f4aa-447e-84e0-5de136455af2" />

# Descrição

Aplicativo móvel desenvolvido em **React Native** utilizando o **framework Expo** como camada de runtime e empacotamento. O objetivo do protótipo é simular, de forma didática, a experiência do eleitor em um cenário de mobilidade na votação, focando na criação, transporte e apresentação de um token de voto móvel.

Do ponto de vista técnico, o app:

- é configurado como projeto Expo managed, com entrada em `index.ts`/`App.tsx` e metadados definidos em `app.json` (nome, pacote Android, ícones, splash e chave da API do Google Maps para `react-native-maps`).   
- usa **React Navigation** (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`) para organizar o fluxo em *stacks* e abas inferiores;  
- utiliza **react-native-maps** integrado ao Google Maps para exibir o mapa de locais de votação simulados;   
- gera QR Codes a partir do token de mobilidade com **react-native-qrcode-svg**, apoiado por **react-native-svg**;   
- é empacotado e servido pelo **Expo CLI** (`expo start`, `expo run:android`), com scripts declarados em `package.json`.   

A estrutura de código em `src/` é organizada da seguinte forma:

- `src/components/`: Componentes reutilizáveis de interface, como:

- `src/context/`: `ElectionContext.tsx`: contexto React responsável por manter o **estado global** da aplicação (fases da eleição, dados simulados do eleitor, estado do token, flags para telas de debug, etc.), expondo um `Provider` usado em `App.tsx`.

- `src/domain/`: tipos e modelos de domínio (tipagens TypeScript para fases da eleição, estrutura do token, modelo de local de votação, enums de períodos eleitorais, etc.), desacoplando regras de domínio da camada de UI.

- `src/screens/`: Telas principais do fluxo de navegação:

- `src/utils/`  
  - `biometricPayload.ts`: funções auxiliares para **montagem do payload do token biométrico**, usado para simular o que seria enviado/armazenado em um cenário real;
  - `measureQRVersions.ts`: script de apoio para testar o tamanho dos payloads em diferentes versões de QR Code (usado apenas durante desenvolvimento);

Tecnologias utilizadas:
- React Native
- Expo Go
- Android Studio

# Como Rodar
Requisitos para rodar:
- Node.js;
- Expo (já incluído no projeto; usado via `npx expo start`);
- Expo Go (opcional, recomendado para testar no celular);
- Android Studio (opcional, recomendado para rodar em emulador ou gerar APK);

1. Ir até a pasta do app:
```
cd AnyVoteApp/
```

2. Instalar Dependências:
```
npm install
```

3. Iniciar o servidor Expo:
```
npx expo start
```

# Ideias Futuras
- **Migrar de `react-native-qrcode-svg` para encoder de QR Code mais baixo nível, permitindo controle de versão, ECC e fragmentação personalizada.**
- Implementar backend dedicado (ex.: Node/Express ou Next.js) para dados dinâmicos, sincronização de locais e emissão realista de tokens.
- Trocar Google Maps por outra biblioteca open source (ex.: Open Street Map)
- Tornar o mapa dinâmico (ex.: API + atualização em tempo real via WebSockets).
- Implementar autenticação própria;
- Adicionar gerenciamento remoto de fases eleitorais e parâmetros do token;
