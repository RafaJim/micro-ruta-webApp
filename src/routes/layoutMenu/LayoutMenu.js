import React, { useState } from "react"
import { useNavigate, Outlet } from "react-router-dom"

import firebaseApp from "../../firebase-config"
import { getAuth, signOut } from "firebase/auth"

import './styles/layoutMenu.css'
import 'antd/dist/antd.min.css'

import { Layout, Menu,  } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  LogoutOutlined,
  FireOutlined
} from "@ant-design/icons"

const { Header, Sider, Content } = Layout;

const LayoutMenu = () => {
  const [collapsed, setCollapsed] = useState(false)
  
  const navigate = useNavigate()

  const handleLogOut = () => {
    const auth = getAuth(firebaseApp)
    localStorage.clear()
    signOut(auth)
    window.location.reload()
  }

  const items = [
    {
      key: '1',
      icon: <HomeOutlined style={{ fontSize: '25px' }} />,
      label: 'Home',
      onClick: (() => navigate('/Dashboard/Home'))

    },
    {
      key: "2",
      icon: <DollarCircleOutlined style={{ fontSize: '25px' }} />,
      label: "Show sales",
      onClick: (() => navigate('/Dashboard/ShowSales'))
    }
  ]
  
  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        theme="dark"
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="md"
        collapsedWidth="0"
        onBreakpoint={(broken) => setCollapsed(broken)}
      >
        <div className="logo"><FireOutlined style={{ fontSize: 30 }} /> Micro Ruta </div>
        <Menu
          theme="dark"
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            display: 'flex',
            direction: 'column',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed)
            }
          )}

          <LogoutOutlined className="trigger" style={{fontSize: 30 }} onClick={handleLogOut} />
        </Header>
        <Content
          className=""
          style={{
            margin: "24px 16px",
            backgroundColor: '#f0ecec'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default LayoutMenu
