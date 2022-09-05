import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './routes/login/Login'
import GuardedRoutes from './GuardedRoutes'
import Home from './routes/home/Home';
import ShowSales from './routes/showSales/ShowSales'
import LayoutMenu from './routes/layoutMenu/LayoutMenu'

// import firebaseApp from './firebase-config';
// import { getAuth, onAuthStateChanged } from 'firebase/auth'

// const auth = getAuth(firebaseApp)

function AppRoutes() {
  const [isAuthenticated, setIsAutheticated] = useState(localStorage.getItem('token'))
  
  const authen = () => {
    const token = localStorage.getItem('token')
    setIsAutheticated(token)
  }
  

  return (
    <Router>
      <Routes>
        <Route path='/' element={ <Login authen={authen} /> } />
        <Route element={<GuardedRoutes isAuthenticated={ isAuthenticated } />}>
            <Route path='/Dashboard' element={ <LayoutMenu/> } >
              <Route path='/Dashboard/Home' element={ <Home/> } />
              <Route path='/Dashboard/ShowSales' element={ <ShowSales/> } />
            </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRoutes;
