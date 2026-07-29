import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '@/components/AppHeader'
import Input from '@/components/Input'
import ScrollTop from '@/components/ScrollTop'
import Select from '@/components/Select'
import { useAuth } from '@/contexts/AuthContext'
import './UserManagement.scss'

type UserRole = 'admin' | 'user'

interface ManagedUser {
  id: number
  name: string
  email: string
  department: string
  position: string
  role: UserRole
  is_active: boolean
  created_at: string
}

const ROLE_OPTIONS = [
  { value: 'all', label: '전체 권한' },
  { value: 'admin', label: '관리자' },
  { value: 'user', label: '사용자' },
]

function UserManagement() {
  const navigate = useNavigate()
  const { apiFetch } = useAuth()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [nameQuery, setNameQuery] = useState('')
  const [department, setDepartment] = useState('all')
  const [role, setRole] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    apiFetch('/api/users')
      .then(async (res) => {
        if (!res.ok) throw new Error('사용자 목록을 불러오지 못했습니다.')
        return res.json()
      })
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [apiFetch])

  const departmentOptions = useMemo(() => [
    { value: 'all', label: '전체 부서' },
    ...Array.from(new Set(users.map((user) => user.department).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b, 'ko'))
      .map((value) => ({ value, label: value })),
  ], [users])

  const filteredUsers = useMemo(() => {
    const query = nameQuery.trim().toLocaleLowerCase('ko-KR')

    return users.filter((user) => {
      const matchesKeyword = !query
        || user.name.toLocaleLowerCase('ko-KR').includes(query)
        || user.email.toLocaleLowerCase().includes(query)
      const matchesDepartment = department === 'all' || user.department === department
      const matchesRole = role === 'all' || user.role === role
      return matchesKeyword && matchesDepartment && matchesRole
    })
  }, [department, nameQuery, role, users])

  return (
    <div className="user-management">
      <AppHeader left={<h1 className="user-management-header-title">사용자 관리</h1>} />

      <div ref={contentRef} className="user-management-content">
        <section className="user-management-filters" aria-label="사용자 검색 필터">
          <Input
            id="user-name-search"
            label="이름 또는 이메일 검색"
            type="search"
            placeholder="이름 또는 이메일을 검색해 주세요."
            value={nameQuery}
            onChange={(event) => setNameQuery(event.target.value)}
          />
          <div className="user-management-selects">
            <Select
              label="부서"
              options={departmentOptions}
              value={department}
              onChange={setDepartment}
            />
            <Select
              label="권한"
              options={ROLE_OPTIONS}
              value={role}
              onChange={setRole}
            />
          </div>
        </section>

        <section className="user-management-list-section">
          <div className="user-management-list-header">
            <h2>등록 사용자</h2>
            <span>{filteredUsers.length}명</span>
          </div>

          {loading && <p className="user-management-state">불러오는 중...</p>}
          {error && <p className="user-management-state is-error">{error}</p>}
          {!loading && !error && filteredUsers.length === 0 && (
            <p className="user-management-state">조건에 맞는 사용자가 없습니다.</p>
          )}
          {!loading && !error && filteredUsers.length > 0 && (
            <ul className="user-management-list">
              {filteredUsers.map((managedUser) => (
                <li key={managedUser.id}>
                  <button
                    type="button"
                    className="user-management-card"
                    onClick={() => navigate(`/admin/users/${managedUser.id}`)}
                  >
                    <span className="user-management-avatar" aria-hidden="true">
                      {managedUser.name.slice(0, 1)}
                    </span>
                    <div className="user-management-info">
                      <div className="user-management-name-row">
                        <strong>{managedUser.name}</strong>
                        {managedUser.position && <span>{managedUser.position}</span>}
                      </div>
                      <p>{managedUser.email}</p>
                      <p>{managedUser.department || '부서 미지정'}</p>
                    </div>
                    <div className="user-management-badges">
                      {!managedUser.is_active && (
                        <span className="user-management-status">비활성화</span>
                      )}
                      <span className={`user-management-role is-${managedUser.role}`}>
                        {managedUser.role === 'admin' ? '관리자' : '사용자'}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <ScrollTop scrollTargetRef={contentRef} />
    </div>
  )
}

export default UserManagement
