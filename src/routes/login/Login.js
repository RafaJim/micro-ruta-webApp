import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/login.css'
import logo from './logo.png'

import firebaseApp from '../../firebase-config'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

import { Input, Button, Modal } from 'antd'
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

    const handleSignIn = async() => {
        if(email === 'ruta@micro.com') {
            return errorUnAuth()
        }

        try {
            const login = await signInWithEmailAndPassword(auth, email, pass)
            const userUID = login.user.uid
            const token = login.user.accessToken
            localStorage.setItem("token", token)
            if(userUID === 'pj11HPPJyKUnx2gZ3Gm8f7dq9q82') localStorage.setItem("UID", "pj11HPPJyKUnx2gZ3Gm8f7dq9q82")
            authen()
            navigate('/Dashboard')
        }catch(err) {
            errorLogin()
        }    
    }

    const redirect = () => {
        localStorage.getItem('token') && navigate('/Dashboard')
    }

    const errorLogin = () => {
        Modal.error({
            title: 'Error al iniciar sesion',
            content: 'Correo o contraseña incorrectas'
        })
    }

    const errorUnAuth = () => {
        Modal.error({
            title: 'Error al iniciar sesion',
            content: 'Esta cuenta no tiene acceso.',
        })
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