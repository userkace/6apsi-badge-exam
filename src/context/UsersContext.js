import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const UsersContext = createContext()

export const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch users from JSONPlaceholder API on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Check if we have cached users in localStorage first
                const cachedUsers = localStorage.getItem('users')

                if (cachedUsers) {
                    setUsers(JSON.parse(cachedUsers))
                    setLoading(false)
                    return
                }
                let allUsers = []
                const totalUsersNeeded = 100
                const usersPerRequest = 10 // JSONPlaceholder default limit

                // Calculate how many requests we need
                const requestCount = Math.ceil(totalUsersNeeded / usersPerRequest)

                // Make multiple requests and combine the results
                for (let i = 0; i < requestCount; i++) {
                    const response = await axios.get('https://jsonplaceholder.typicode.com/users')

                    // For each batch, modify user IDs to make them unique
                    const batchUsers = response.data.map(user => ({
                        ...user,
                        id: user.id + (i * usersPerRequest) // Ensure unique IDs across batches
                    }))

                    allUsers = [...allUsers, ...batchUsers]

                    // Break if we've reached our target
                    if (allUsers.length >= totalUsersNeeded) {
                        allUsers = allUsers.slice(0, totalUsersNeeded)
                        break
                    }
                }

                setUsers(allUsers)

                // Cache the results
                localStorage.setItem('users', JSON.stringify(allUsers))

            } catch (err) {
                setError('Failed to fetch users. Please try again later.')
                console.error('Error fetching users:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    // Save to localStorage whenever users change
    useEffect(() => {
        if (users.length > 0 && !loading) {
            localStorage.setItem('users', JSON.stringify(users))
        }
    }, [users, loading])

    const addUser = (newUser) => {
        // In a real app, you would post to an API first
        const userWithId = {
            ...newUser,
            id: Math.max(0, ...users.map(user => user.id)) + 1, // Generate next ID
            createdAt: new Date().toISOString(),
        }
        setUsers((prevUsers) => [...prevUsers, userWithId])
        return userWithId
    }

    const updateUser = (id, updatedUser) => {
        // In a real app, you would put to an API first
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
    }

    const deleteUser = (id) => {
        // In a real app, you would delete from an API first
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
    }

    // Refresh users from API
    const refreshUsers = async () => {
        setLoading(true)
        try {
            // Fetch 100 users total from API
            let allUsers = []
            const totalUsersNeeded = 100
            const usersPerRequest = 10 // JSONPlaceholder default limit

            // Calculate how many requests we need
            const requestCount = Math.ceil(totalUsersNeeded / usersPerRequest)

            // Make multiple requests and combine the results
            for (let i = 0; i < requestCount; i++) {
                const response = await axios.get('https://jsonplaceholder.typicode.com/users')

                // For each batch, modify user IDs to make them unique
                const batchUsers = response.data.map(user => ({
                    ...user,
                    id: user.id + (i * usersPerRequest) // Ensure unique IDs across batches
                }))

                allUsers = [...allUsers, ...batchUsers]

                // Break if we've reached our target
                if (allUsers.length >= totalUsersNeeded) {
                    allUsers = allUsers.slice(0, totalUsersNeeded)
                    break
                }
            }

            setUsers(allUsers)
            localStorage.setItem('users', JSON.stringify(allUsers))
        } catch (err) {
            setError('Failed to refresh users. Please try again later.')
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
