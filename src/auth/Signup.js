import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
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
    FormHelperText,
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState({})
    const [passwordTouched, setPasswordTouched] = useState(false)
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)
    const navigate = useNavigate()

    // Password validation rules
    const passwordValidation = {
        minLength: 8,
        hasUpperCase: /[A-Z]/,
        hasLowerCase: /[a-z]/,
        hasNumber: /\d/,
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
    }

    const validatePassword = (password) => {
        const validationErrors = []
        
        if (password.length < passwordValidation.minLength) {
            validationErrors.push(`Password must be at least ${passwordValidation.minLength} characters long`)
        }
        if (!passwordValidation.hasUpperCase.test(password)) {
            validationErrors.push('Password must contain at least one uppercase letter')
        }
        if (!passwordValidation.hasLowerCase.test(password)) {
            validationErrors.push('Password must contain at least one lowercase letter')
        }
        if (!passwordValidation.hasNumber.test(password)) {
            validationErrors.push('Password must contain at least one number')
        }
        if (!passwordValidation.hasSpecialChar.test(password)) {
            validationErrors.push('Password must contain at least one special character')
        }
        
        return validationErrors
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Clear specific field errors when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }))
        }

        // Real-time validation for password
        if (name === 'password' && passwordTouched) {
            const passwordErrors = validatePassword(value)
            setErrors((prev) => ({
                ...prev,
                password: passwordErrors.length > 0 ? passwordErrors : '',
            }))
        }

        // Real-time validation for confirm password
        if (name === 'confirmPassword' && confirmPasswordTouched) {
            if (value !== formData.password) {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: 'Passwords do not match',
                }))
            } else {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: '',
                }))
            }
        }

        // Check confirm password when password changes
        if (name === 'password' && formData.confirmPassword && confirmPasswordTouched) {
            if (value !== formData.confirmPassword) {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: 'Passwords do not match',
                }))
            } else {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: '',
                }))
            }
        }
    }

    const handleBlur = (e) => {
        const { name, value } = e.target

        if (name === 'password') {
            setPasswordTouched(true)
            const passwordErrors = validatePassword(value)
            setErrors((prev) => ({
                ...prev,
                password: passwordErrors.length > 0 ? passwordErrors : '',
            }))
        }

        if (name === 'confirmPassword') {
            setConfirmPasswordTouched(true)
            if (value !== formData.password) {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: 'Passwords do not match',
                }))
            }
        }

        if (name === 'email') {
            if (value && !validateEmail(value)) {
                setErrors((prev) => ({
                    ...prev,
                    email: 'Please enter a valid email address',
                }))
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        const newErrors = {}

        // Validate all fields
        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else {
            const passwordErrors = validatePassword(formData.password)
            if (passwordErrors.length > 0) {
                newErrors.password = passwordErrors
            }
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors(newErrors)

        // If no errors, proceed with signup
        if (Object.keys(newErrors).length === 0) {
            // TODO: Replace with actual signup logic
            console.log('Signup attempt with:', {
                email: formData.email,
                password: formData.password,
            })

            // For demo purposes, show success and redirect
            // In a real app, you would send data to your backend
            localStorage.setItem('isAuthenticated', 'true')
            navigate('/dashboard')
        }
    }

    const getPasswordStrength = () => {
        if (!formData.password) return ''
        
        const passwordErrors = validatePassword(formData.password)
        const strength = 5 - passwordErrors.length
        
        if (strength <= 2) return 'Weak'
        if (strength <= 3) return 'Medium'
        if (strength <= 4) return 'Strong'
        return 'Very Strong'
    }

    const getPasswordStrengthColor = () => {
        const strength = getPasswordStrength()
        switch (strength) {
            case 'Weak': return 'error'
            case 'Medium': return 'warning'
            case 'Strong': return 'info'
            case 'Very Strong': return 'success'
            default: return 'inherit'
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
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <PersonAddIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
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
                        onBlur={handleBlur}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.password}
                    />
                    {errors.password && Array.isArray(errors.password) && (
                        <FormHelperText error sx={{ mx: 2 }}>
                            {errors.password.map((error, index) => (
                                <div key={index}>• {error}</div>
                            ))}
                        </FormHelperText>
                    )}
                    {formData.password && passwordTouched && (
                        <Typography
                            variant="caption"
                            color={getPasswordStrengthColor()}
                            sx={{ ml: 2, display: 'block', mt: 0.5 }}
                        >
                            Password strength: {getPasswordStrength()}
                        </Typography>
                    )}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container spacing={1}>
                        <Grid item xs>
                            <Link component={RouterLink} to="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link component={RouterLink} to="/" variant="body2">
                                Back to Home
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

export default Signup
