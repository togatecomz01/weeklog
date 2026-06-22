import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Main from './pages/Main'
import MyPage from './pages/MyPage'
import ResetPassword from './pages/ResetPassword'
import Entry from './pages/Entry'
import Admin from './pages/Admin'
import EntryView from './pages/EntryView'
import AdminEntryView from './pages/AdminEntryView'
import Components from './pages/Components'
import AdminList from './pages/AdminList'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/main" element={<Main />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/entry" element={<Entry />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/adminlist" element={<AdminList />} />
          <Route path="/entry-view" element={<EntryView />} />
          <Route path="/admin-entry-view" element={<AdminEntryView />} />
          <Route path="/components" element={<Components />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
