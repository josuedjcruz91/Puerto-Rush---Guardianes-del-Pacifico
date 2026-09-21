import { Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import HomePage from '../pages/HomePage'
import InstructionsPage from '../pages/InstructionsPage'
import GamePage from '../pages/GamePage'
import ScoresPage from '../pages/ScoresPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRouter() {
  return <Routes><Route element={<MainLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/instrucciones" element={<InstructionsPage />} />
    <Route path="/juego/:nivel" element={<GamePage />} />
    <Route path="/puntajes" element={<ScoresPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route></Routes>
}
