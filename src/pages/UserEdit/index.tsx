import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AlertPopup from '@/components/AlertPopup'
import Button from '@/components/Button'
import ButtonContainer from '@/components/ButtonContainer'
import DetailHeader from '@/components/DetailHeader'
import Radio from '@/components/Radio'
import RadioGroup from '@/components/Radio/RadioGroup'
import ScrollTop from '@/components/ScrollTop'
import Select from '@/components/Select'
import { useAuth } from '@/contexts/AuthContext'
import './UserEdit.scss'

type UserRole = 'admin' | 'user'

interface EditableUser {
  id: number
  name: string
  email: string
  department: string
  position: string
  role: UserRole
  is_active: boolean
}

interface UserEditForm {
  department: string
  role: UserRole
  isActive: boolean
}

function UserEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement | null>(null)
  const { user: currentUser, apiFetch } = useAuth()
  const [managedUser, setManagedUser] = useState<EditableUser | null>(null)
  const [form, setForm] = useState<UserEditForm>({
    department: '',
    role: 'user',
    isActive: true,
  })
  const [departments, setDepartments] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [savedOpen, setSavedOpen] = useState(false)

  useEffect(() => {
    if (!id) return

    setLoading(true)
    setError('')
    Promise.all([
      apiFetch(`/api/users/${id}`),
      apiFetch('/api/users'),
    ])
      .then(async ([userRes, usersRes]) => {
        if (!userRes.ok) {
          const data = await userRes.json().catch(() => null)
          throw new Error(data?.message ?? '사용자 정보를 불러오지 못했습니다.')
        }

        const userData: EditableUser = await userRes.json()
        const usersData: EditableUser[] = usersRes.ok ? await usersRes.json() : []
        setManagedUser(userData)
        setForm({
          department: userData.department,
          role: userData.role,
          isActive: userData.is_active,
        })
        setDepartments(Array.from(new Set(
          [...usersData.map((user) => user.department), userData.department].filter(Boolean)
        )).sort((a, b) => a.localeCompare(b, 'ko')))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [apiFetch, id])

  const departmentOptions = useMemo(() => [
    { value: '', label: '부서 미지정' },
    ...departments.map((value) => ({ value, label: value })),
  ], [departments])

  const isSelf = managedUser?.id === currentUser?.id
  const isDirty = Boolean(managedUser && (
    form.department !== managedUser.department
    || form.role !== managedUser.role
    || form.isActive !== managedUser.is_active
  ))

  async function handleSave() {
    if (!id || !managedUser || !isDirty || saving) return

    setSaving(true)
    try {
      const res = await apiFetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: form.department,
          role: form.role,
          is_active: form.isActive,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? '사용자 정보 저장에 실패했습니다.')
        return
      }

      setManagedUser(data)
      setForm({
        department: data.department,
        role: data.role,
        isActive: data.is_active,
      })
      setError('')
      setSavedOpen(true)
    } catch {
      setError('사용자 정보 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id || isSelf) return

    try {
      const res = await apiFetch(`/api/users/${id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setDeleteOpen(false)
        setError(data?.message ?? '계정 삭제에 실패했습니다.')
        return
      }

      navigate('/admin/users', { replace: true })
    } catch {
      setDeleteOpen(false)
      setError('계정 삭제에 실패했습니다.')
    }
  }

  return (
    <div className="user-edit">
      <DetailHeader
        title="사용자 정보 수정"
        scrollTargetRef={contentRef}
        onClick={() => navigate('/admin/users')}
      />

      <div ref={contentRef} className="user-edit-content">
        {loading && <p className="user-edit-state">불러오는 중...</p>}
        {!loading && error && !managedUser && <p className="user-edit-state is-error">{error}</p>}

        {!loading && managedUser && (
          <>
            <section className="user-edit-section">
              <h2>사용자 정보</h2>
              <dl className="user-edit-readonly">
                <div>
                  <dt>이름</dt>
                  <dd>{managedUser.name}</dd>
                </div>
                <div>
                  <dt>이메일</dt>
                  <dd>{managedUser.email}</dd>
                </div>
              </dl>
            </section>

            <section className="user-edit-section">
              <h2>계정 설정</h2>
              <div className="user-edit-form">
                <Select
                  label="소속 부서"
                  options={departmentOptions}
                  value={form.department}
                  onChange={(department) => setForm((prev) => ({ ...prev, department }))}
                />

                <RadioGroup label="앱 권한" className="user-edit-radio-group">
                  <Radio
                    name="user-role"
                    label="일반회원"
                    checked={form.role === 'user'}
                    disabled={isSelf}
                    onChange={() => setForm((prev) => ({ ...prev, role: 'user' }))}
                  />
                  <Radio
                    name="user-role"
                    label="관리자"
                    checked={form.role === 'admin'}
                    disabled={isSelf}
                    onChange={() => setForm((prev) => ({ ...prev, role: 'admin' }))}
                  />
                </RadioGroup>

                <RadioGroup label="계정 상태" className="user-edit-radio-group">
                  <Radio
                    name="user-status"
                    label="활성화"
                    checked={form.isActive}
                    disabled={isSelf}
                    onChange={() => setForm((prev) => ({ ...prev, isActive: true }))}
                  />
                  <Radio
                    name="user-status"
                    label="비활성화"
                    checked={!form.isActive}
                    disabled={isSelf}
                    onChange={() => setForm((prev) => ({ ...prev, isActive: false }))}
                  />
                </RadioGroup>

                {isSelf && (
                  <p className="user-edit-help">
                    현재 로그인한 계정의 권한과 상태는 변경할 수 없습니다.
                  </p>
                )}
                {error && <p className="user-edit-error">{error}</p>}
              </div>
            </section>
          </>
        )}
      </div>

      {!loading && managedUser && (
        <div className="user-edit-foot">
          <ButtonContainer>
            <Button
              variant="secondary"
              className="user-edit-delete"
              disabled={isSelf}
              onClick={() => setDeleteOpen(true)}
            >
              계정 삭제
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin/users')}>
              취소
            </Button>
            <Button disabled={!isDirty || saving} onClick={handleSave}>
              {saving ? '저장 중...' : '저장'}
            </Button>
          </ButtonContainer>
        </div>
      )}

      <ScrollTop scrollTargetRef={contentRef} hasBottomButton />

      <AlertPopup
        open={deleteOpen}
        message="계정을 삭제하시겠습니까?"
        description="계정과 해당 사용자의 업무일지가 모두 삭제되며 복구할 수 없습니다."
        descriptionSize="sm"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
      <AlertPopup
        open={savedOpen}
        message="사용자 정보가 저장되었습니다."
        cancelText="확인"
        onCancel={() => setSavedOpen(false)}
      />
    </div>
  )
}

export default UserEdit
