import React from 'react'
import ScrollTop from '@/components/ScrollTop'
import './AuthLayout.scss'

interface AuthLayoutProps {
  title: React.ReactNode
  subTitle: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}

function AuthLayout({ title, subTitle, footer, children }: AuthLayoutProps) {
  const bodyRef = React.useRef<HTMLDivElement | null>(null)

  return (
    <div className="auth-layout">
      <div ref={bodyRef} className="auth-layout-body">
        <div className="auth-top">
          <h1 className="auth-layout-title">안녕하세요!<br />{title}</h1>
          <p className="auth-layout-sub">{subTitle}</p>
        </div>
        <div className="auth-layout-form">{children}</div>
      </div>
      <div className="auth-layout-footer">{footer}</div>
      <ScrollTop scrollTargetRef={bodyRef} />
    </div>
  )
}

export default AuthLayout
