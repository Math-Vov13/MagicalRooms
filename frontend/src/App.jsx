import { createBrowserRouter, RouterProvider } from 'react-router'

import Home from './pages/Home.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import Profile from './pages/Profile.jsx'
import RegisterPage from './pages/Register.jsx'
import ChatRoom from './pages/ChatRoom.jsx'
import MatchMaking from './pages/MatchMaking.jsx'

import { AuthContextProvider } from './Contexts/AuthContext.jsx'
import { ChronoContextProvider } from './Contexts/ChronoContext.jsx'

const router = createBrowserRouter([
  { path: "/", element: <Home/> },
  { path: "/about", element: <Home/>},

  { path: "/register", element: <RegisterPage/> },
  { path: "/profile/:userId", element: <Profile/> },

  { path: "/room", element: <ChronoContextProvider><MatchMaking/></ChronoContextProvider> },
  { path: "/room/:roomId", element: <ChronoContextProvider><ChatRoom/></ChronoContextProvider> },

  { path: "*", element: <NotFoundPage/> }
]);


function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  )
}

export default App
