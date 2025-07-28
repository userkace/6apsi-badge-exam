import { useState } from 'react'
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom'
import {
    Avatar,
    Button,
    TextField,
    Link,
    Box,
    Grid,
    Typography,
    Container,
    CssBaseline,
    CircularProgress,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()

    const from = location.state?.from?.pathname || '/dashboard'

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Basic validation
            if (!formData.email || !formData.password) {
                throw new Error('Please fill in all fields')
            }

            // In a real app, you would make an API call to your backend here
            // For demo purposes, we'll simulate an API call
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    // This is just for demo - in a real app, verify credentials with your backend
                    if (formData.email && formData.password) {
                        resolve({
                            token: 'demo-token-123',
                            user: {
                                id: '1',
                                email: formData.email,
                                name: formData.email.split('@')[0] // Just for demo
                            }
                        })
                    } else {
                        throw new Error('Invalid credentials')
                    }
                }, 1000)
            })

            // Save the token and user data
            login(response.token, response.user)

            // Redirect to the page they were trying to access, or to dashboard
            navigate(from, { replace: true })
        } catch (err) {
            setError(err.message || 'Failed to log in')
            console.error('Login error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
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
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
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
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                    <Grid container spacing={1}>
                        <Grid item>
                            <Link
                                component={RouterLink}
                                to="/signup"
                                variant="body2"
                            >
                                {"Don't have an account?"}
                            </Link>
                        </Grid>
                        <Grid item>
                        <Link
                                component={RouterLink}
                                to="/"
                                variant="body2"
                            >
                                {"Back to Home"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

export default Login
