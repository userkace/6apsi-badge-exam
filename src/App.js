import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AnimatePresence } from 'framer-motion'
import { UsersProvider } from './context/UsersContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SnackbarProvider } from './context/SnackbarContext'

// Import components
import Landing from './pages/Landing'
import Login from './auth/Login'
import Logout from './auth/Logout'
import Signup from './auth/Signup'
import Dashboard from './pages/Dashboard'
import DashboardHome from './components/DashboardHome'
import AddUser from './components/AddUser'
import EditUsers from './components/EditUsers'
import About from './pages/About'
import Reporting from './pages/Reporting'
import PageTransition from './components/PageTransition'

// Create a theme instance
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },
    },
})

// A wrapper for protected routes
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <div>Loading...</div> // Or a nice loading spinner
    }

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

// Wrapper for public-only routes (like login/signup when already authenticated)
const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth()
    const location = useLocation()

    if (isAuthenticated) {
        // If user is already authenticated, redirect them to the dashboard or their intended destination
        const from = location.state?.from?.pathname || '/dashboard'
        return <Navigate to={from} replace />
    }

    return children
}

// Wrapper component to enable page transitions
const AnimatedRoutes = () => {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public routes */}
                <Route
                    path="/"
                    element={
                        <PageTransition>
                            <Landing />
                        </PageTransition>
                    }
                />
                <Route
                    path="/about"
                    element={
                        <PageTransition>
                            <About />
                        </PageTransition>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <PageTransition>
                                <Login />
                            </PageTransition>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <PageTransition>
                                <Signup />
                            </PageTransition>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/logout"
                    element={
                        <PageTransition>
                            <Logout />
                        </PageTransition>
                    }
                />

                {/* Protected routes */}
                <Route
                    path="/dashboard/*"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        index
                        element={
                            <PageTransition>
                                <DashboardHome />
                            </PageTransition>
                        }
                    />
                    <Route
                        path="add"
                        element={
                            <PageTransition>
                                <AddUser />
                            </PageTransition>
                        }
                    />
                    <Route
                        path="edit"
                        element={
                            <PageTransition>
                                <EditUsers />
                            </PageTransition>
                        }
                    />
                    <Route
                        path="edit/:id"
                        element={
                            <PageTransition>
                                <AddUser editMode />
                            </PageTransition>
                        }
                    />
                    <Route
                        path="reports"
                        element={
                            <PageTransition>
                                <Reporting />
                            </PageTransition>
                        }
                    />
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AnimatePresence>
    )
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <SnackbarProvider>
                    <UsersProvider>
                        <Router>
                            <AnimatedRoutes />
                        </Router>
                    </UsersProvider>
                </SnackbarProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
