import React, { useState, useMemo } from 'react'
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
} from '@mui/material'
import {
    Search as SearchIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useRecords } from '../context/RecordsContext'

// Constants
const STATUS_OPTIONS = [
    'Active',
    'Pending',
    'Completed',
    'Cancelled',
    'On Hold',
]

const statusColors = {
    Active: 'success',
    Pending: 'warning',
    Completed: 'primary',
    Cancelled: 'error',
    'On Hold': 'info',
}

const Reporting = () => {
    const { records } = useRecords()
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc',
    })

    // Get unique categories from records
    const categories = useMemo(() => {
        const uniqueCategories = new Set()
        records.forEach((record) => {
            if (record.category) {
                uniqueCategories.add(record.category)
            }
        })
        return Array.from(uniqueCategories)
    }, [records])

    // Process and filter data
    const processedData = useMemo(() => {
        let result = [...records]

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(
                (item) =>
                    (item.name && item.name.toLowerCase().includes(term)) ||
                    (item.category &&
                        item.category.toLowerCase().includes(term)) ||
                    (item.status && item.status.toLowerCase().includes(term)) ||
                    (item.description &&
                        item.description.toLowerCase().includes(term))
            )
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter((item) => item.status === statusFilter)
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            result = result.filter((item) => item.category === categoryFilter)
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key] || ''
                const bValue = b[sortConfig.key] || ''

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1
                }
                return 0
            })
        }

        return result
    }, [records, searchTerm, statusFilter, categoryFilter, sortConfig])

    // Handle sort request
    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }))
    }

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // Handle refresh
    const handleRefresh = () => {
        setSearchTerm('')
        setStatusFilter('all')
        setCategoryFilter('all')
        setSortConfig({ key: 'createdAt', direction: 'desc' })
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Typography variant="h5" component="h1">
                    Records Report
                </Typography>

                <Box display="flex" gap={2} mb={2} flexWrap="wrap">
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
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={categoryFilter}
                            label="Category"
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <MenuItem value="all">All Categories</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                        sx={{ ml: 'auto' }}
                    >
                        Reset Filters
                    </Button>
                </Box>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
                    <Table stickyHeader aria-label="reporting table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'id'}
                                        direction={
                                            sortConfig.key === 'id'
                                                ? sortConfig.direction
                                                : 'asc'
                                        }
                                        onClick={() => handleSort('id')}
                                    >
                                        ID
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'name'}
                                        direction={
                                            sortConfig.key === 'name'
                                                ? sortConfig.direction
                                                : 'asc'
                                        }
                                        onClick={() => handleSort('name')}
                                    >
                                        Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'category'}
                                        direction={
                                            sortConfig.key === 'category'
                                                ? sortConfig.direction
                                                : 'asc'
                                        }
                                        onClick={() => handleSort('category')}
                                    >
                                        Category
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'status'}
                                        direction={
                                            sortConfig.key === 'status'
                                                ? sortConfig.direction
                                                : 'asc'
                                        }
                                        onClick={() => handleSort('status')}
                                    >
                                        Status
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'createdAt'}
                                        direction={
                                            sortConfig.key === 'createdAt'
                                                ? sortConfig.direction
                                                : 'desc'
                                        }
                                        onClick={() => handleSort('createdAt')}
                                    >
                                        Date Added
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right">
                                    <TableSortLabel
                                        active={sortConfig.key === 'value'}
                                        direction={
                                            sortConfig.key === 'value'
                                                ? sortConfig.direction
                                                : 'asc'
                                        }
                                        onClick={() => handleSort('value')}
                                    >
                                        Value
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {processedData.length > 0 ? (
                                processedData
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((row) => (
                                        <TableRow hover key={row.id}>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>
                                                {row.category}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.status || 'N/A'}
                                                    color={
                                                        statusColors[
                                                            row.status
                                                        ] || 'default'
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {row.createdAt
                                                    ? new Date(
                                                          row.createdAt
                                                      ).toLocaleDateString()
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell align="right">
                                                {typeof row.value === 'number'
                                                    ? `$${row.value.toFixed(2)}`
                                                    : row.value || 'N/A'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        align="center"
                                        sx={{ py: 4 }}
                                    >
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
                    count={processedData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    )
}

export default Reporting
