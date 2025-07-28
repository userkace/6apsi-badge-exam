import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUsers } from '../context/UsersContext'
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    Divider,
} from '@mui/material'
import {
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material'

const AddUser = ({ editMode: editModeProp = false }) => {
    const { id } = useParams()
    const {
        users,
        addUser,
        updateUser,
        loading: contextLoading
    } = useUsers()
    const editMode = editModeProp || Boolean(id)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(editMode)
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        website: '',
        company: {
            name: '',
            catchPhrase: '',
            bs: ''
        },
        address: {
            street: '',
            suite: '',
            city: '',
            zipcode: '',
            geo: {
                lat: '',
                lng: ''
            }
        }
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (editMode && id) {
            const user = users.find((u) => u.id === parseInt(id))
            if (user) {
                setFormData({
                    name: user.name || '',
                    username: user.username || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    website: user.website || '',
                    company: {
                        name: user.company?.name || '',
                        catchPhrase: user.company?.catchPhrase || '',
                        bs: user.company?.bs || ''
                    },
                    address: {
                        street: user.address?.street || '',
                        suite: user.address?.suite || '',
                        city: user.address?.city || '',
                        zipcode: user.address?.zipcode || '',
                        geo: {
                            lat: user.address?.geo?.lat || '',
                            lng: user.address?.geo?.lng || ''
                        }
                    }
                })
            }
        }
        setLoading(false)
    }, [editMode, id, users])

    const handleChange = (e) => {
        const { name, value } = e.target

        // Handle nested fields
        if (name.includes('.')) {
            const [parent, child, subChild] = name.split('.')

            if (subChild) {
                setFormData((prev) => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: {
                            ...prev[parent][child],
                            [subChild]: value
                        }
                    }
                }))
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value
                    }
                }))
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }

        // Clear error when user starts typing in a field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        // Basic validation
        if (!formData.name) newErrors.name = 'Name is required'
        if (!formData.username) newErrors.username = 'Username is required'

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }

        if (!formData.company.name) newErrors['company.name'] = 'Company name is required'

        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        try {
            setLoading(true)

            if (editMode && id) {
                await updateUser(parseInt(id), formData)
                navigate('/dashboard/edit')
            } else {
                await addUser(formData)
                navigate('/dashboard/')
            }
        } catch (error) {
            console.error('Error saving user:', error)
            setErrors({
                submit: 'Failed to save user. Please try again.'
            })
        } finally {
            setLoading(false)
        }
    }

    if (contextLoading || loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard/reports')}
                sx={{ mb: 3 }}
                variant="outlined"
            >
                Back to User List
            </Button>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" component="h1" sx={{ mb: 4 }}>
                    {editMode ? 'Edit User' : 'Add New User'}
                </Typography>

                {errors.submit && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {errors.submit}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Basic Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                error={!!errors.username}
                                helperText={errors.username}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Website"
                                name="website"
                                placeholder="example.com"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Company Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Company Name"
                                name="company.name"
                                value={formData.company.name}
                                onChange={handleChange}
                                error={!!errors['company.name']}
                                helperText={errors['company.name']}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Catch Phrase"
                                name="company.catchPhrase"
                                value={formData.company.catchPhrase}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Business Services"
                                name="company.bs"
                                value={formData.company.bs}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Address Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Street"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Suite/Apt"
                                name="address.suite"
                                value={formData.address.suite}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Zipcode"
                                name="address.zipcode"
                                value={formData.address.zipcode}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<SaveIcon />}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : editMode ? 'Update User' : 'Add User'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default AddUser
