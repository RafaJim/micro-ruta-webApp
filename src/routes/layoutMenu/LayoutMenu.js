import React, { useEffect, useState } from "react"
import { useNavigate, Outlet, useLocation } from "react-router-dom"
import logo from './images/logo.png'
import products from './images/products.svg'

import firebaseApp from "../../firebase-config"
import { getAuth, signOut } from "firebase/auth"

import './styles/layoutMenu.css'
import 'antd/dist/antd.min.css'

import { Layout, Menu, Divider } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DollarCircleOutlined,
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
  AuditOutlined
} from "@ant-design/icons"

const { Header, Sider, Content } = Layout;

const LayoutMenu = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [h2, setH2] = useState(true)
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin'))
  
  const navigate = useNavigate()
  const location = useLocation().pathname

  const handleLogOut = () => {
    const auth = getAuth(firebaseApp)
    localStorage.clear()
    signOut(auth)
    window.location.reload()
  }

  const items2 = [
    {
      key: 'Production',
      icon: <AuditOutlined style={{ fontSize: '25px' }} />,
      label: 'Produccion',
      onClick: (() => navigate('/Dashboard/Production'))

    },
    {
      key: 'Kilometers',
      icon: <DashboardOutlined style={{ fontSize: '25px' }} />,
      label: 'Kilometraje',
      onClick: (() => navigate('/Dashboard/KmReg'))
    }
  ]

  const items = [
    {
      key: 'Production',
      icon: <AuditOutlined style={{ fontSize: '25px' }} />,
      label: 'Produccion',
      onClick: (() => navigate('/Dashboard/Production'))

    },
    {
      key: 'Kilometers',
      icon: <DashboardOutlined style={{ fontSize: '25px' }} />,
      label: 'Kilometraje',
      onClick: (() => navigate('/Dashboard/KmReg'))
    },
    {
      key: "ShowSales",
      icon: <DollarCircleOutlined style={{ fontSize: '25px' }} />,
      label: "Ventas",
      onClick: (() => navigate('/Dashboard/ShowSales'))
    },
    {
      key: 'Clients',
      icon: <UserOutlined style={{ fontSize: '25px' }} />,
      label: 'Clientes',
      onClick: (() => navigate('/Dashboard/Clients'))
    },
    {
      key: 'Products',
      icon: <img src={products} alt='products' style={{ width: '40px', marginLeft: '-10px' }} />,
      label: 'Productos',
      onClick: (() => navigate('/Dashboard/Products'))
    }
  ]
  
  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        theme="dark"
        trigger={null}
        collapsed={collapsed}
        breakpoint="md"
        collapsedWidth="75"
        onBreakpoint={(broken) => {
          setCollapsed(broken)
          setH2(!broken)
        }}
      >
        <div className="logo" onClick={() => navigate('/Dashboard/Home')} >
          <img src={logo} alt="logo" />
          {h2 ? <h2>Micro Ruta</h2> : null}
        </div>

        <Divider style={{ marginBottom: 1, backgroundColor: '#fff' }} />

        <Menu
          theme="dark"
          defaultSelectedKeys={location.split('/')[2]}
          mode="inline"
          items={ isAdmin ? items:items2}
          inlineCollapsed={collapsed}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "logout",
              onClick: () => {
                setCollapsed(!collapsed)
                setH2(!h2)
              }
            }
          )}

          <LogoutOutlined className="logout" style={{fontSize: 30 }} onClick={handleLogOut} />
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default LayoutMenu
