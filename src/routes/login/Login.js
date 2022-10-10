import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/login.css'
import logo from './logo.png'

import firebaseApp from '../../firebase-config'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

import { Input, Button } from 'antd'
import { UserOutlined,
        EyeInvisibleOutlined,
        EyeTwoTone,
        LockOutlined  } from '@ant-design/icons'

import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'

const auth = getAuth(firebaseApp)

const Login = ({authen}) => {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    const navigate = useNavigate()

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, pass)
        .then((result) => {
            const userUID = result.user.uid
            const token = result.user.accessToken
            localStorage.setItem("token", token)
            if(userUID === 'pj11HPPJyKUnx2gZ3Gm8f7dq9q82') localStorage.setItem("isAdmin", "true")
            else localStorage.setItem("isAdmin", "")
            authen()
        })
        .then(() => navigate('/Dashboard') )        
    }

    const redirect = () => {
        localStorage.getItem('token') && navigate('/Dashboard')
    }

    useEffect(() => {
        redirect()
    }, [])

    return (
        <div className='container'>
            <Container sx={{ backgroundColor: '#fff', border: 'solid', borderRadius: '25px'}} component="main" maxWidth="xs">
                <h1>Micro Ruta</h1>
                <img src={logo} alt="Logo"/>
                <h2>Iniciar Sesion</h2>
                <CssBaseline/>
                    <Box sx={{
                        marginTop: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }} 
                    >
                        <Input
                            size="large"
                            placeholder="Correo" 
                            prefix={<UserOutlined />}
                            style={{ borderRadius: '10px' }}
                            onChange={ e => setEmail(e.target.value)}
                        />
                        <Input.Password
                            size="large"
                            placeholder="Contraseña"
                            prefix={<LockOutlined />}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            style={{ marginTop: '15px', borderRadius: '10px' }}
                            onChange={ e => setPass(e.target.value)}
                            onPressEnter={handleSignIn}
                        />
                        <Button
                            style={{ 
                                margin: '15px', 
                                backgroundColor: '#282c34', 
                                color: '#fff', 
                                borderRadius: '6px',
                                width: '100%'
                            }}
                            onClick={handleSignIn}
                            size="large"
                            >Iniciar Sesion
                        </Button>
                    </Box>
            </Container>
        </div>
    )
}
 
export default Login;