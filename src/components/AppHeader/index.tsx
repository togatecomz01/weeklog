import React from 'react'
import './AppHeader.scss'

type HeaderVariant = '' | 'basics'
interface AppHeaderProps {
  left?: React.ReactNode
  right?: React.ReactNode
  variant?: HeaderVariant
}

function AppHeader({ left, right, variant = '' }: AppHeaderProps) {
  return (
    <header className={`app-header ${variant}`}>
      <div className="app-header-left">{left}</div>
      {right && <div className="app-header-right">{right}</div>}
    </header>
  )
}

export default AppHeader
