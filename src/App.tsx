import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Main from './pages/Main'
import Components from './pages/Components'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/weeklog" element={<Login />} />
        <Route path="/weeklog/main" element={<Main />} />
        <Route path="/weeklog/components" element={<Components />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
