import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NoteDetail from './pages/NoteDetail'
import Filter from './pages/Filter'
import Reminders from './pages/Reminders'
import Today from './pages/Today'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Publieke routes */}
          <Route path="/" element={<Login />} />

          {/* Private routes – alleen toegankelijk als ingelogd */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notitie/nieuw" element={<NoteDetail />} />
            <Route path="/notitie/:id" element={<NoteDetail />} />
            <Route path="/filter" element={<Filter />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/today" element={<Today />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
