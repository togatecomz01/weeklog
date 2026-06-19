import React from 'react'
import './AuthLayout.scss'

interface AuthLayoutProps {
  title: string
  footer: React.ReactNode
  children: React.ReactNode
}

function AuthLayout({ title, footer, children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className="auth-layout-body">
        <h1 className="auth-layout-title">{title}</h1>
        <div className="auth-layout-form">{children}</div>
      </div>
      <div className="auth-layout-footer">{footer}</div>
    </div>
  )
}

export default AuthLayout
