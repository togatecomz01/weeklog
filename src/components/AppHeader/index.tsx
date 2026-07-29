import React from 'react'
import SideMenu from '@/components/SideMenu'
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
      <div className="app-header-right">
        {right}
        <SideMenu />
      </div>
    </header>
  )
}

export default AppHeader
