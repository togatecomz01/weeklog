import './BottomNav.scss'

type NavTab = 'home' | 'register' | 'my'

interface BottomNavProps {
  active?: NavTab
  onTabChange?: (tab: NavTab) => void
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 9.5L11 2L20 9.5V20H14.5V14H7.5V20H2V9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function RegisterIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7H15M7 11H15M7 15H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function MyIcon() {
  return (
    <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.5" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M1 21C1 17.134 4.358 14 8.5 14C12.642 14 16 17.134 16 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

const TABS: { key: NavTab; label: string; icon: React.ReactNode }[] = [
  { key: 'home', label: '홈', icon: <HomeIcon /> },
  { key: 'register', label: '등록', icon: <RegisterIcon /> },
  { key: 'my', label: 'MY', icon: <MyIcon /> },
]

function BottomNav({ active = 'home', onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ key, label, icon }) => (
        <button
          key={key}
          type="button"
          className={`bottom-nav__item ${active === key ? 'bottom-nav__item--active' : ''}`}
          onClick={() => onTabChange?.(key)}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
