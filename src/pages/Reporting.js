import { useState, useEffect, useMemo, useContext } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
    TextField,
    Typography,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    Avatar
} from '@mui/material';
import {
    Search as SearchIcon,
    Refresh as RefreshIcon,
    ArrowBack as ArrowBackIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Language as LanguageIcon,
    Business as CompanyIcon,
    LocationOn as AddressIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { UsersProvider, useUsers } from '../context/UsersContext';

// Constants
const STATUS_OPTIONS = [
    'Active',
    'Inactive',
    'Suspended',
    'Pending',
];

const statusColors = {
    Active: 'success',
    Inactive: 'warning',
    Suspended: 'error',
    Pending: 'info',
};

const Reporting = () => {
    const navigate = useNavigate();
    const { 
        users, 
        loading: usersLoading, 
        error: usersError, 
        refreshUsers, 
        updateUser 
    } = useUsers();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [companyFilter, setCompanyFilter] = useState('all');
    const [orderBy, setOrderBy] = useState('id');
    const [order, setOrder] = useState('asc');
    const [error, setError] = useState(null);
    const [editingStatus, setEditingStatus] = useState(null);

    // Get unique companies for the filter
    const companyOptions = useMemo(() => {
        if (!users) return [];
        const companies = new Set(users.map(user => user.company?.name).filter(Boolean));
        return Array.from(companies).sort();
    }, [users]);

    // Process users data for reporting
    const processedUsers = useMemo(() => {
        if (!users) return [];

        return users.map(user => ({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            website: user.website,
            company: user.company?.name || 'N/A',
            city: user.address?.city || 'N/A',
            status: user.status || STATUS_OPTIONS[user.id % STATUS_OPTIONS.length],
            joinDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }));
    }, [users]);

    // Handle refresh
    const handleRefresh = async () => {
        try {
            await refreshUsers();
            // Reset filters on refresh
            setStatusFilter('all');
            setCompanyFilter('all');
            setSearchTerm('');
        } catch (err) {
            setError('Failed to refresh users. Please try again.');
            console.error('Error refreshing users:', err);
        }
    };

    // Handle sort
    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Handle status change
    const handleStatusChange = async (userId, newStatus) => {
        try {
            const userToUpdate = users.find(user => user.id === userId);
            if (userToUpdate) {
                await updateUser(userId, { ...userToUpdate, status: newStatus });
            }
        } catch (err) {
            console.error('Error updating user status:', err);
            setError('Failed to update user status');
        } finally {
            setEditingStatus(null);
        }
    };

    // Filter and sort users
    const filteredAndSortedUsers = useMemo(() => {
        if (!processedUsers.length) return [];

        return processedUsers
            .filter(user => {
                const matchesSearch = searchTerm === '' ||
                    Object.values(user).some(value =>
                        String(value).toLowerCase().includes(searchTerm.toLowerCase())
                    );
                const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
                const matchesCompany = companyFilter === 'all' || user.company === companyFilter;
                return matchesSearch && matchesStatus && matchesCompany;
            })
            .sort((a, b) => {
                if (orderBy === 'joinDate') {
                    return order === 'asc'
                        ? new Date(a.joinDate) - new Date(b.joinDate)
                        : new Date(b.joinDate) - new Date(a.joinDate);
                }
                return order === 'asc'
                    ? a[orderBy] > b[orderBy] ? 1 : -1
                    : a[orderBy] < b[orderBy] ? 1 : -1;
            });
    }, [processedUsers, searchTerm, statusFilter, companyFilter, orderBy, order]);

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Pagination
    const paginatedUsers = filteredAndSortedUsers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (usersLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (usersError || error) {
        return (
            <Box p={3}>
                <Alert severity="error" sx={{ mb: 2 }}>{usersError || error}</Alert>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRefresh}
                    startIcon={<RefreshIcon />}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                flexWrap="wrap"
                gap={2}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Tooltip title="Go back">
                        <IconButton onClick={() => navigate(-1)}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="h5" component="h1">
                        Users Report
                    </Typography>
                </Box>

                <Box display="flex" gap={2} flexWrap="wrap">
                    <TextField
                        size="small"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ minWidth: 200, flexGrow: 1 }}
                        InputProps={{
                            startAdornment: (
                                <SearchIcon color="action" sx={{ mr: 1 }} />
                            ),
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150, mr: 1 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(0); // Reset to first page when filter changes
                            }}
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            {STATUS_OPTIONS.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 200, mr: 1 }}>
                        <InputLabel>Company</InputLabel>
                        <Select
                            value={companyFilter}
                            label="Company"
                            onChange={(e) => {
                                setCompanyFilter(e.target.value);
                                setPage(0); // Reset to first page when filter changes
                            }}
                        >
                            <MenuItem value="all">All Companies</MenuItem>
                            {companyOptions.map((company) => (
                                <MenuItem key={company} value={company}>
                                    {company}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Tooltip title="Refresh data">
                        <Button
                            variant="outlined"
                            onClick={handleRefresh}
                            startIcon={<RefreshIcon />}
                        >
                            Refresh
                        </Button>
                    </Tooltip>
                </Box>
            </Box>

            <Paper elevation={3} sx={{ overflow: 'hidden', mb: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'id'}
                                        direction={orderBy === 'id' ? order : 'asc'}
                                        onClick={() => handleSort('id')}
                                    >
                                        ID
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>User</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'email'}
                                        direction={orderBy === 'email' ? order : 'asc'}
                                        onClick={() => handleSort('email')}
                                    >
                                        Contact
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'status'}
                                        direction={orderBy === 'status' ? order : 'asc'}
                                        onClick={() => handleSort('status')}
                                    >
                                        Status
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'joinDate'}
                                        direction={orderBy === 'joinDate' ? order : 'desc'}
                                        onClick={() => handleSort('joinDate')}
                                    >
                                        Join Date
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                                    {user.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {user.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        @{user.username}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" flexDirection="column" gap={0.5}>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <EmailIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" noWrap>
                                                        {user.email}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <PhoneIcon fontSize="small" color="action" />
                                                    <Typography variant="body2">
                                                        {user.phone}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <CompanyIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {user.company}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <AddressIcon fontSize="small" color="action" />
                                                <Typography variant="body2">
                                                    {user.city}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {editingStatus === user.id ? (
                                                <Select
                                                    value={user.status}
                                                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                                    size="small"
                                                    autoFocus
                                                    onBlur={() => setEditingStatus(null)}
                                                    sx={{ minWidth: 120 }}
                                                >
                                                    {STATUS_OPTIONS.map((status) => (
                                                        <MenuItem key={status} value={status}>
                                                            {status}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <Chip
                                                    label={user.status}
                                                    color={statusColors[user.status] || 'default'}
                                                    size="small"
                                                    sx={{ 
                                                        minWidth: 120,
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            opacity: 0.8
                                                        }
                                                    }}
                                                    onClick={() => setEditingStatus(user.id)}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>{user.joinDate}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredAndSortedUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
};

export default Reporting;
