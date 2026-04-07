import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function MainLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-4 sticky top-0 z-40">
        <div className="flex-1 flex items-center gap-1">
          <span className="text-lg">🎵</span>
          <span className="font-semibold text-slate-100 text-sm hidden sm:block">Keys Manager</span>
        </div>
        <nav className="flex gap-1">
          <NavLink
            to="/singers"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            Cantantes
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            Buscar
          </NavLink>
        </nav>
        <button
          onClick={handleSignOut}
          className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
          title={`${user?.displayName ?? ''} — Cerrar sesión`}
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName ?? ''} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center text-xs text-slate-300">
              {user?.displayName?.charAt(0) ?? '?'}
            </div>
          )}
        </button>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
