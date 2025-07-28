import { useState, useMemo } from 'react'
import {
    Box,
    Button,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
    TextField,
    Chip,
    Tooltip,
    CircularProgress,
    Alert,
    IconButton,
} from '@mui/material'
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    ArrowBack as ArrowBackIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Web as WebIcon,
    Business as BusinessIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '../context/UsersContext'

const EditUsers = () => {
    const { users, deleteUser, loading, error, refreshUsers } = useUsers()
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setPage(0)
    }

    const handleEdit = (id) => {
        navigate(`/dashboard/edit/${id}`)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await deleteUser(id)
        }
    }

    const handleRefresh = () => {
        refreshUsers()
        setSearchTerm('')
        setPage(0)
    }

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const filteredUsers = useMemo(() => {
        const filtered = users.filter(
            (user) =>
                (user.name &&
                    user.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (user.email &&
                    user.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (user.username &&
                    user.username
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (user.company?.name &&
                    user.company.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
        )

        // Sort the filtered users
        return [...filtered].sort((a, b) => {
            if (orderBy === 'id') {
                return order === 'asc' ? a.id - b.id : b.id - a.id
            }
            return 0
        })
    }, [users, searchTerm, orderBy, order])

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // Calculate paginated users
    const paginatedUsers = useMemo(() => {
        return filteredUsers.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        )
    }, [filteredUsers, page, rowsPerPage])

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
                    onClick={handleRefresh}
                    startIcon={<RefreshIcon />}
                    sx={{ mt: 2 }}
                >
                    Try Again
                </Button>
            </Box>
        )
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{ mb: 3 }}
                variant="outlined"
            >
                Back to Dashboard
            </Button>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                    flexWrap="wrap"
                    gap={2}
                >
                    <Typography variant="h5" component="h1">
                        Manage Users
                    </Typography>
                    <Box display="flex" gap={2} alignItems="center">
                        <TextField
                            size="small"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon color="action" sx={{ mr: 1 }} />
                                ),
                            }}
                            sx={{ minWidth: 250 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/dashboard/add')}
                        >
                            Add New User
                        </Button>
                        <IconButton
                            onClick={handleRefresh}
                            color="primary"
                            title="Refresh"
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Box>
                </Box>

                {filteredUsers.length === 0 ? (
                    <Typography variant="body1" color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
                        No users found. Try a different search or add new users.
                    </Typography>
                ) : (
                    <>
                        <TableContainer component={Paper} variant="outlined">
                            <Table sx={{ minWidth: 650 }} aria-label="users table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'action.hover' }}>
                                        <TableCell 
                                            sx={{ 
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                '&:hover': { backgroundColor: 'action.selected' }
                                            }}
                                        >
                                            <TableSortLabel
                                                active={orderBy === 'id'}
                                                direction={orderBy === 'id' ? order : 'asc'}
                                                onClick={() => handleSort('id')}
                                            >
                                                ID
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedUsers.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                '&:hover': { backgroundColor: 'action.hover' },
                                            }}
                                        >
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {user.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>@{user.username}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                                        {user.email}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                    {user.phone}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                    {user.company?.name}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="Edit User">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleEdit(user.id)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete User">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDelete(user.id)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="View Website">
                                                        <IconButton
                                                            size="small"
                                                            color="info"
                                                            component="a"
                                                            href={user.website?.startsWith('http') ? user.website : `http://${user.website}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <WebIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredUsers.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </Paper>
        </Box>
    )
}

export default EditUsers
