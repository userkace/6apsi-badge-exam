import React, { useState } from 'react'
import {
    Box,
    Typography,
    Paper,
    Grid,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    Snackbar,
    Alert,
    CircularProgress,
    Chip,
    Card,
    CardContent,
    Avatar,
    ListItemAvatar,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
    AddCircle as AddCircleIcon,
    Edit as EditIcon,
    List as ListIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Public as PublicIcon,
    Email as EmailIcon,
} from '@mui/icons-material'
import { useUsers } from '../context/UsersContext'

const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
    <Paper
        elevation={2}
        sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
        }}
    >
        <Box
            sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: `${color}.light`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
            }}
        >
            <Icon color={color} fontSize="large" />
        </Box>
        <Typography variant="h6" component="div" gutterBottom>
            {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
            {title}
        </Typography>
    </Paper>
)

const ActionCard = ({ title, description, buttonText, icon: Icon, onClick }) => (
    <Paper
        elevation={2}
        sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        }}
    >
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
            }}
        >
            <Icon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
                {title}
            </Typography>
        </Box>
        <Typography color="text.secondary" variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
            {description}
        </Typography>
        <Button
            variant="outlined"
            color="primary"
            onClick={onClick}
            startIcon={<Icon />}
        >
            {buttonText}
        </Button>
    </Paper>
)

const DashboardHome = () => {
    const { users, loading, error, refreshUsers } = useUsers()
    const navigate = useNavigate()
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('info')

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false)
    }

    const showSnackbar = (message, severity = 'info') => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setSnackbarOpen(true)
    }

    // Get the distribution of users by company
    const companyDistribution = users.reduce((acc, user) => {
        const company = user.company?.name || 'Unknown'
        acc[company] = (acc[company] || 0) + 1
        return acc
    }, {})

    const recentUsers = [...users]
        .sort((a, b) => b.id - a.id)
        .slice(0, 3)

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
                <Button 
                    variant="outlined" 
                    onClick={refreshUsers}
                    sx={{ mt: 2 }}
                >
                    Try Again
                </Button>
            </Box>
        )
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Users Dashboard
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Welcome to your user management dashboard
            </Typography>

            {/* Stats section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Users"
                        value={users.length}
                        icon={PersonIcon}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Companies"
                        value={Object.keys(companyDistribution).length}
                        icon={BusinessIcon}
                        color="secondary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Cities"
                        value={new Set(users.map(user => user.address?.city).filter(Boolean)).size}
                        icon={PublicIcon}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Email Domains"
                        value={new Set(users.map(user => user.email?.split('@')[1]).filter(Boolean)).size}
                        icon={EmailIcon}
                        color="warning"
                    />
                </Grid>
            </Grid>

            {/* Quick actions */}
            <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
                Quick Actions
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <ActionCard
                        title="Add User"
                        description="Create a new user with details like name, email, and company information."
                        buttonText="Add User"
                        icon={AddCircleIcon}
                        onClick={() => navigate('/dashboard/add')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ActionCard
                        title="Manage Users"
                        description="View, edit, or delete existing users in the system."
                        buttonText="Manage Users"
                        icon={EditIcon}
                        onClick={() => navigate('/dashboard/edit')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ActionCard
                        title="Refresh Data"
                        description="Reload user data from the server to get the latest updates."
                        buttonText="Refresh Data"
                        icon={ListIcon}
                        onClick={() => {
                            refreshUsers()
                            showSnackbar('User data refreshed successfully!', 'success')
                        }}
                    />
                </Grid>
            </Grid>

            {/* Recent users */}
            <Typography variant="h5" sx={{ mb: 2 }}>
                Recent Users
            </Typography>
            <Paper sx={{ mb: 4, p: 0 }}>
                <List>
                    {recentUsers.length > 0 ? (
                        recentUsers.map((user, index) => (
                            <React.Fragment key={user.id}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="subtitle1">
                                                    {user.name}
                                                </Typography>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ ml: 1, color: 'text.secondary' }}
                                                >
                                                    @{user.username}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" component="span">
                                                    {user.email} • {user.phone}
                                                </Typography>
                                                <Box sx={{ mt: 0.5 }}>
                                                    <Chip 
                                                        size="small" 
                                                        icon={<BusinessIcon />} 
                                                        label={user.company?.name} 
                                                        variant="outlined" 
                                                        sx={{ mr: 1 }}
                                                    />
                                                    <Chip 
                                                        size="small" 
                                                        icon={<PublicIcon />} 
                                                        label={user.address?.city || 'N/A'} 
                                                        variant="outlined" 
                                                    />
                                                </Box>
                                            </Box>
                                        }
                                    />
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => navigate(`/dashboard/edit/${user.id}`)}
                                    >
                                        Edit
                                    </Button>
                                </ListItem>
                                {index < recentUsers.length - 1 && <Divider variant="inset" component="li" />}
                            </React.Fragment>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No users found" />
                        </ListItem>
                    )}
                </List>
            </Paper>

            {/* Company distribution */}
            <Typography variant="h5" sx={{ mb: 2 }}>
                Company Distribution
            </Typography>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2}>
                    {Object.entries(companyDistribution).map(([company, count]) => (
                        <Grid item xs={12} sm={6} md={4} key={company}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle1" component="div">
                                            {company}
                                        </Typography>
                                        <Chip 
                                            label={`${count} users`} 
                                            color="primary" 
                                            size="small" 
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default DashboardHome
