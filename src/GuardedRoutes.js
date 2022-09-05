import { Outlet, Navigate } from "react-router-dom";

const GuardedRoutes = (isAuthenticated) => {
    const isAuth = isAuthenticated.isAuthenticated
    return isAuth ? <Outlet /> : <Navigate to="/" />
}

export default GuardedRoutes;