import React from 'react'
import ScrollTop from '@/components/ScrollTop'
import './AuthLayout.scss'

interface AuthLayoutProps {
  title: string
  footer: React.ReactNode
  children: React.ReactNode
}

function AuthLayout({ title, footer, children }: AuthLayoutProps) {
  const bodyRef = React.useRef<HTMLDivElement | null>(null)

  return (
    <div className="auth-layout">
      <div ref={bodyRef} className="auth-layout-body">
        <h1 className="auth-layout-title">{title}</h1>
        <div className="auth-layout-form">{children}</div>
      </div>
      <div className="auth-layout-footer">{footer}</div>
      <ScrollTop scrollTargetRef={bodyRef} />
    </div>
  )
}

export default AuthLayout
