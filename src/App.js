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

// Import components
import Landing from './pages/Landing'
import Login from './auth/Login'
import Signup from './auth/Signup'
import Dashboard from './pages/Dashboard'
import DashboardHome from './components/DashboardHome'
import AddUser from './components/AddUser'
import EditUsers from './components/EditUsers'
import About from './pages/About'
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
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    return isAuthenticated ? children : <Navigate to="/login" replace />
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
                        <PageTransition>
                            <Login />
                        </PageTransition>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PageTransition>
                            <Signup />
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
            <UsersProvider>
                <Router>
                    <AnimatedRoutes />
                </Router>
            </UsersProvider>
        </ThemeProvider>
    )
}

export default App
