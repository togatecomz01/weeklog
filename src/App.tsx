import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Main from './pages/Main'
import MyPage from './pages/MyPage'
import MyPasswordPage from './pages/MyPassword'
import MySwitPage from './pages/MySwit'
import ResetPassword from './pages/ResetPassword'
import Entry from './pages/Entry'
import Admin from './pages/Admin'
import EntryView from './pages/EntryView'
import AdminEntryView from './pages/AdminEntryView'
import Components from './pages/Components'
import AdminList from './pages/AdminList'

function RootRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'admin' ? '/admin' : '/main'} replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* 일반 유저 전용 */}
          <Route path="/main" element={<ProtectedRoute allowedRoles={['user']}><Main /></ProtectedRoute>} />
          <Route path="/my" element={<ProtectedRoute allowedRoles={['user', 'admin']}><MyPage /></ProtectedRoute>} />
          <Route path="/my/password" element={<ProtectedRoute allowedRoles={['user', 'admin']}><MyPasswordPage /></ProtectedRoute>} />
          <Route path="/my/swit" element={<ProtectedRoute allowedRoles={['user', 'admin']}><MySwitPage /></ProtectedRoute>} />
          <Route path="/entry" element={<ProtectedRoute allowedRoles={['user']}><Entry /></ProtectedRoute>} />
          <Route path="/entry-view" element={<ProtectedRoute allowedRoles={['user']}><EntryView /></ProtectedRoute>} />

          {/* 어드민 전용 */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
          <Route path="/adminlist" element={<ProtectedRoute allowedRoles={['admin']}><AdminList /></ProtectedRoute>} />
          <Route path="/admin-entry-view" element={<ProtectedRoute allowedRoles={['admin']}><AdminEntryView /></ProtectedRoute>} />

          <Route path="/components" element={<Components />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
