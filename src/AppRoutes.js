import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './routes/login/Login'
import GuardedRoutes from './GuardedRoutes'
import Production from './routes/production/Production'
import ShowSales from './routes/showSales/ShowSales'
import LayoutMenu from './routes/layoutMenu/LayoutMenu'
import Clients from './routes/clients/Clients'
import Products from './routes/products/Products'
import KmReg from './routes/kmReg/KmReg'

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
              <Route path='/Dashboard/Production' element={ <Production/> } />
              <Route path='/Dashboard/ShowSales' element={ <ShowSales/> } />
              <Route path='/Dashboard/Clients' element={ <Clients/> } />
              <Route path='/Dashboard/Products' element={ <Products /> } />
              <Route path='/Dashboard/KmReg' element={ <KmReg /> } />
            </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRoutes;
