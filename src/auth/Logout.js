import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Logout = () => {
    const { logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout()
                navigate('/', { replace: true })
            } catch (error) {
                console.error('Error during logout:', error)
                navigate('/', { replace: true })
            }
        }

        performLogout()
    }, [logout, navigate])

    return null // This component doesn't render anything
}

export default Logout
