import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { useSnackbar } from './SnackbarContext'

const UsersContext = createContext()

export const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { showSnackbar } = useSnackbar()

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const cachedUsers = localStorage.getItem('users')

                if (cachedUsers) {
                    setUsers(JSON.parse(cachedUsers))
                    setLoading(false)
                    return
                }
                let allUsers = []
                const totalUsersNeeded = 100
                const usersPerRequest = 10 

                const requestCount = Math.ceil(totalUsersNeeded / usersPerRequest)

                for (let i = 0; i < requestCount; i++) {
                    const response = await axios.get('https://jsonplaceholder.typicode.com/users')

                    const batchUsers = response.data.map(user => ({
                        ...user,
                        id: user.id + (i * usersPerRequest) 
                    }))

                    allUsers = [...allUsers, ...batchUsers]

                    if (allUsers.length >= totalUsersNeeded) {
                        allUsers = allUsers.slice(0, totalUsersNeeded)
                        break
                    }
                }

                setUsers(allUsers)

                localStorage.setItem('users', JSON.stringify(allUsers))

            } catch (err) {
                const errorMsg = 'Failed to fetch users. Please try again later.'
                setError(errorMsg)
                showSnackbar(errorMsg, 'error')
                console.error('Error fetching users:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [showSnackbar])

    useEffect(() => {
        if (users.length > 0 && !loading) {
            localStorage.setItem('users', JSON.stringify(users))
        }
    }, [users, loading])

    const addUser = (newUser) => {
        const userWithId = {
            ...newUser,
            id: Math.max(0, ...users.map(user => user.id)) + 1,
            createdAt: new Date().toISOString(),
        }
        setUsers((prevUsers) => {
            const updatedUsers = [...prevUsers, userWithId]
            showSnackbar('User added successfully', 'success')
            return updatedUsers
        })
        return userWithId
    }

    const updateUser = (id, updatedUser) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id
                    ? {
                        ...user,
                        ...updatedUser,
                        updatedAt: new Date().toISOString(),
                    }
                    : user
            )
        )
        showSnackbar('User updated successfully', 'info')
        return users.find(user => user.id === id)
    }

    const deleteUser = (id) => {
        setUsers((prevUsers) => {
            const updatedUsers = prevUsers.filter((user) => user.id !== id)
            showSnackbar('User deleted successfully', 'warning')
            return updatedUsers
        })
    }

    const refreshUsers = async () => {
        setLoading(true)
        try {
            let allUsers = []
            const totalUsersNeeded = 100
            const usersPerRequest = 10 

            const requestCount = Math.ceil(totalUsersNeeded / usersPerRequest)

            for (let i = 0; i < requestCount; i++) {
                const response = await axios.get('https://jsonplaceholder.typicode.com/users')

                const batchUsers = response.data.map(user => ({
                    ...user,
                    id: user.id + (i * usersPerRequest) 
                }))

                allUsers = [...allUsers, ...batchUsers]

                if (allUsers.length >= totalUsersNeeded) {
                    allUsers = allUsers.slice(0, totalUsersNeeded)
                    break
                }
            }

            setUsers(allUsers)
            localStorage.setItem('users', JSON.stringify(allUsers))
            showSnackbar('User data refreshed successfully', 'success')
        } catch (err) {
            const errorMsg = 'Failed to refresh users. Please try again later.'
            setError(errorMsg)
            showSnackbar(errorMsg, 'error')
            console.error('Error refreshing users:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <UsersContext.Provider
            value={{
                users,
                loading,
                error,
                addUser,
                updateUser,
                deleteUser,
                refreshUsers,
            }}
        >
            {children}
        </UsersContext.Provider>
    )
}

export const useUsers = () => {
    const context = useContext(UsersContext)
    if (!context) {
        throw new Error('useUsers must be used within a UsersProvider')
    }
    return context
}
