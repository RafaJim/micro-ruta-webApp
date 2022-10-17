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
import Monday from './routes/dayRoutes/monday/Monday'
import Tuesday from './routes/dayRoutes/tuesday/Tuesday'
import Wednesday from './routes/dayRoutes/wednesday/Wednesday'
import Thursday from './routes/dayRoutes/thursday/Thursday'
import Friday from './routes/dayRoutes/friday/Friday'

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
              <Route path='/Dashboard/dayRoutes/Monday' element={ <Monday /> } />
              <Route path='/Dashboard/dayRoutes/Tuesday' element={ <Tuesday /> } />
              <Route path='/Dashboard/dayRoutes/Wednesday' element={ <Wednesday /> } />
              <Route path='/Dashboard/dayRoutes/Thursday' element={ <Thursday /> } />
              <Route path='/Dashboard/dayRoutes/Friday' element={ <Friday /> } />
            </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRoutes;
