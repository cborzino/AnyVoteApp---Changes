// Fase global da eleição (é igual pra todo mundo)
export type ElectionPhase =
  | 'BEFORE_REG'        // antes do período de cadastro
  | 'REG_OPEN'          // período de cadastro aberto
  | 'LOCATION_CHOICE'   // período de escolher local
  | 'LOCATION_LOCKED'   // fechou escolha de local
  | 'PRE_ELECTION_QR';  // período antes da eleição, QR liberado

// Estado do usuário dentro desse processo
export type UserStatus =
  | 'FIRST_TIME'        // primeira vez abrindo o app
  | 'NOT_REGISTERED'    // ainda não pediu mobilidade
  | 'REG_PENDING'       // cadastro solicitado, aguardando
  | 'REG_CONFIRMED'     // cadastro aprovado
  | 'LOCATION_CHOSEN';  // local escolhido
