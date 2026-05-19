import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Login from './pages/Login'
import Admin from './pages/Admin'
import ProtectedRoute from './features/auth/components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default App
