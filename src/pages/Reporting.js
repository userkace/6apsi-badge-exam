import { useState, useEffect, useMemo } from 'react';
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
    Tooltip
} from '@mui/material';
import {
    Search as SearchIcon,
    Refresh as RefreshIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Constants
const STATUS_OPTIONS = [
    'Active',
    'Pending',
    'Completed',
    'Cancelled',
    'On Hold',
];

const statusColors = {
    Active: 'success',
    Pending: 'warning',
    Completed: 'primary',
    Cancelled: 'error',
    'On Hold': 'info',
};

const Reporting = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [orderBy, setOrderBy] = useState('id');
    const [order, setOrder] = useState('asc');

    // Fetch records from API
    const fetchRecords = async () => {
        setLoading(true);
        setError(null);
        try {
            // Check if we have cached records in localStorage first
            const cachedRecords = localStorage.getItem('reportingRecords');

            if (cachedRecords) {
                setRecords(JSON.parse(cachedRecords));
                setLoading(false);
                return;
            }

            // Fetch from API if not in cache
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts');

            // Transform the data to match our reporting structure
            const formattedRecords = response.data.map((post, index) => ({
                id: post.id,
                title: post.title,
                description: post.body,
                status: STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)],
                date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            }));

            // Cache the results
            localStorage.setItem('reportingRecords', JSON.stringify(formattedRecords));
            setRecords(formattedRecords);
        } catch (err) {
            console.error('Error fetching records:', err);
            setError('Failed to load records. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchRecords();
    }, []);

    // Handle refresh
    const handleRefresh = () => {
        // Clear cache and refetch
        localStorage.removeItem('reportingRecords');
        fetchRecords();
    };

    // Handle sort
    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Filter and sort records
    const filteredAndSortedRecords = useMemo(() => {
        return records
            .filter(record => {
                const matchesSearch = searchTerm === '' ||
                    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    record.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                if (orderBy === 'date') {
                    return order === 'asc'
                        ? new Date(a.date) - new Date(b.date)
                        : new Date(b.date) - new Date(a.date);
                }
                return order === 'asc'
                    ? a[orderBy] > b[orderBy] ? 1 : -1
                    : a[orderBy] < b[orderBy] ? 1 : -1;
            });
    }, [records, searchTerm, statusFilter, orderBy, order]);

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Pagination
    const paginatedRecords = filteredAndSortedRecords.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchRecords}
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
                        Records Report
                    </Typography>
                </Box>

                <Box display="flex" gap={2} flexWrap="wrap">
                    <TextField
                        size="small"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ minWidth: 200, flexGrow: 1 }}
                        InputProps={{
                            startAdornment: (
                                <SearchIcon color="action" sx={{ mr: 1 }} />
                            ),
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            {STATUS_OPTIONS.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
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
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'title'}
                                        direction={orderBy === 'title' ? order : 'asc'}
                                        onClick={() => handleSort('title')}
                                    >
                                        Title
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Description</TableCell>
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
                                        active={orderBy === 'date'}
                                        direction={orderBy === 'date' ? order : 'asc'}
                                        onClick={() => handleSort('date')}
                                    >
                                        Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Priority</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedRecords.length > 0 ? (
                                paginatedRecords.map((record) => (
                                    <TableRow key={record.id} hover>
                                        <TableCell>{record.id}</TableCell>
                                        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {record.title}
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {record.description}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={record.status}
                                                color={statusColors[record.status] || 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{record.date}</TableCell>
                                        <TableCell>{record.priority}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        No records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredAndSortedRecords.length}
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
