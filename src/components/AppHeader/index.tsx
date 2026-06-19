import React from 'react'
import './AppHeader.scss'

interface AppHeaderProps {
  left?: React.ReactNode
  right?: React.ReactNode
}

function AppHeader({ left, right }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-left">{left}</div>
      {right && <div className="app-header-right">{right}</div>}
    </header>
  )
}

export default AppHeader
