import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import './SideMenu.scss'

type MenuKey = 'home' | 'register' | 'users' | 'my' | 'logout'

interface MenuItem {
  key: MenuKey
  label: string
  path: string
}

const MY_SUBMENU_ITEMS = [
  { label: '비밀번호 변경', path: '/my/password' },
  { label: 'Swit 연결 확인', path: '/my/swit' },
]

function MenuIcon({ type }: { type: MenuKey }) {
  if (type === 'home') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5v-9.7Z" />
      </svg>
    )
  }

  if (type === 'register') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 3h9l5 5v13H5V3Zm9 0v5h5M8 13h8M8 17h8" />
      </svg>
    )
  }

  if (type === 'users') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 6.5a3 3 0 0 1 0 5.8M17 15a5 5 0 0 1 4.5 5" />
      </svg>
    )
  }

  if (type === 'logout') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  )
}

function SideMenu() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const homePath = user?.role === 'admin' ? '/admin' : '/main'
  const items: MenuItem[] = [
    { key: 'home', label: '홈', path: homePath },
    ...(user?.role === 'admin'
      ? [{ key: 'users' as const, label: '사용자 관리', path: '/admin/users' }]
      : [{ key: 'register' as const, label: '업무일지 쓰러가기', path: '/entry' }]),
    { key: 'my', label: '마이페이지', path: '/my' },
  ]
  const mySubmenuItems = [
    ...MY_SUBMENU_ITEMS,
    ...(user?.role === 'admin'
      ? [{ label: '카카오톡 연결 확인', path: '/my/kakao' }]
      : []),
  ]

  useEffect(() => {
    if (!open) return

    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  function isActive(key: MenuKey) {
    if (key === 'home') {
      return user?.role === 'admin'
        ? location.pathname === '/admin'
          || location.pathname.startsWith('/adminlist')
          || location.pathname.startsWith('/admin-entry-view')
        : location.pathname === '/main'
    }
    if (key === 'register') return location.pathname === '/entry'
    if (key === 'users') return location.pathname.startsWith('/admin/users')
    return location.pathname.startsWith('/my')
  }

  function handleNavigate(path: string) {
    setOpen(false)
    if (location.pathname !== path) navigate(path)
  }

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/login')
  }

  return (
    <>
      <button
        type="button"
        className="side-menu-trigger"
        aria-label="메뉴 열기"
        aria-expanded={open}
        aria-controls="app-side-menu"
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="side-menu-layer">
          <button
            type="button"
            className="side-menu-overlay"
            aria-label="메뉴 닫기"
            onClick={() => setOpen(false)}
          />
          <aside
            id="app-side-menu"
            className="side-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="전체 메뉴"
          >
            <div className="side-menu-header">
              <div className="side-menu-user">
                <span className="side-menu-user-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
                  </svg>
                </span>
                <div className="side-menu-user-info">
                  <div className="side-menu-user-summary">
                    <strong className="side-menu-user-name">{user?.name ?? ''}</strong>
                    {user?.position && (
                      <span className="side-menu-user-position">{user.position}</span>
                    )}
                  </div>
                  <span className="side-menu-user-email">{user?.email ?? ''}</span>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="side-menu-close"
                aria-label="메뉴 닫기"
                onClick={() => setOpen(false)}
              >
                <span />
                <span />
              </button>
            </div>

            <nav className="side-menu-nav" aria-label="주요 메뉴">
              {items.map((item) => (
                <div className="side-menu-group" key={item.key}>
                  <button
                    type="button"
                    className={`side-menu-item ${isActive(item.key) ? 'is-active' : ''}`}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                    onClick={() => handleNavigate(item.path)}
                  >
                    <span className="side-menu-icon">
                      <MenuIcon type={item.key} />
                    </span>
                    <span>{item.label}</span>
                  </button>

                  {item.key === 'my' && (
                    <div className="side-menu-submenu" aria-label="마이페이지 하위 메뉴">
                      {mySubmenuItems.map((subItem) => {
                        const subItemActive = location.pathname === subItem.path

                        return (
                          <button
                            key={subItem.path}
                            type="button"
                            className={`side-menu-subitem ${subItemActive ? 'is-active' : ''}`}
                            aria-current={subItemActive ? 'page' : undefined}
                            onClick={() => handleNavigate(subItem.path)}
                          >
                            {subItem.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="side-menu-item side-menu-logout"
                onClick={handleLogout}
              >
                <span className="side-menu-icon">
                  <MenuIcon type="logout" />
                </span>
                <span>로그아웃</span>
              </button>
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}

export default SideMenu
