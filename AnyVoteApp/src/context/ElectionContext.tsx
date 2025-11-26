import React, { createContext, useContext, useState } from 'react'
import type { ElectionPhase, UserStatus } from '../domain/electionTypes'

// O que o contexto vai expor pra app inteira
type ElectionContextValue = {
  phase: ElectionPhase
  userStatus: UserStatus
  setPhase: (p: ElectionPhase) => void
  setUserStatus: (s: UserStatus) => void
}

// Cria o contexto (pode começar como undefined)
const ElectionContext = createContext<ElectionContextValue | undefined>(undefined)

// Provider: componente que vai ficar em volta do app
export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // valores iniciais (pode ajustar depois)
  const [phase, setPhase] = useState<ElectionPhase>('BEFORE_REG')
  const [userStatus, setUserStatus] = useState<UserStatus>('FIRST_TIME')

  return (
    <ElectionContext.Provider value={{ phase, userStatus, setPhase, setUserStatus }}>
      {children}
    </ElectionContext.Provider>
  )
}

// Hookzinho pra usar isso nas telas
export const useElection = () => {
  const ctx = useContext(ElectionContext)
  if (!ctx) {
    throw new Error('useElection deve ser usado dentro de <ElectionProvider>')
  }
  return ctx
}
