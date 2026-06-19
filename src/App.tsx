import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Main from './pages/Main'
import MyPage from './pages/MyPage'
import ResetPassword from './pages/ResetPassword'
import Entry from './pages/Entry'
import Admin from './pages/Admin'
import EntryView from './pages/EntryView'
import Components from './pages/Components'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/weeklog/login" element={<Login />} />
          <Route path="/weeklog/reset-password" element={<ResetPassword />} />
          <Route path="/weeklog/main" element={<Main />} />
          <Route path="/weeklog/my" element={<MyPage />} />
          <Route path="/weeklog/entry" element={<Entry />} />
          <Route path="/weeklog/admin" element={<Admin />} />
          <Route path="/weeklog/entry-view" element={<EntryView />} />
          <Route path="/weeklog/components" element={<Components />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
