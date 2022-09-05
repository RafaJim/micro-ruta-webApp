import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/login.css'

import firebaseApp from '../../firebase-config'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'

const auth = getAuth(firebaseApp)

const Login = ({authen}) => {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    const navigate = useNavigate()

    const handleSignIn = async () => {
        signInWithEmailAndPassword(auth, email, pass)
        .then((result) => {
            const token = result.user.accessToken
            localStorage.setItem("token", token)
            authen()
        })
        .then(() => navigate('/Dashboard/Home') )        
    }

    return (
        <div className='container'>
            <Container sx={{ backgroundColor: '#fff', border: 'solid', borderRadius: '25px'}} component="main" maxWidth="xs">
                <h1 style={{textAlign: 'center'}}>Iniciar Sesion</h1>
                <CssBaseline/>
                    <Box sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }} 
                    >
                        <TextField  
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={ e => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={ e => setPass(e.target.value)}
                        />
                        <Button 
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={ handleSignIn }
                        >Sign In</Button>
                    </Box>
            </Container>
        </div>
    )
}
 
export default Login;