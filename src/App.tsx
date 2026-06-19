import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Main from './pages/Main'
import MyPage from './pages/MyPage'
import ResetPassword from './pages/ResetPassword'
import Entry from './pages/Entry'
import Components from './pages/Components'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/weeklog/login" element={<Login />} />
        <Route path="/weeklog/main" element={<Main />} />
        <Route path="/weeklog/my" element={<MyPage />} />
        <Route path="/weeklog/reset-password" element={<ResetPassword />} />
        <Route path="/weeklog/entry" element={<Entry />} />
        <Route path="/weeklog/components" element={<Components />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
