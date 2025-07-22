import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

// Mock data - in a real app, this would come from an API
const mockData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Record ${i + 1}`,
  category: ['Category A', 'Category B', 'Category C'][Math.floor(Math.random() * 3)],
  status: ['Active', 'Pending', 'Completed', 'Cancelled'][Math.floor(Math.random() * 4)],
  date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  value: Math.floor(Math.random() * 10000) / 100,
}));

const Reporting = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      // In a real app, you would fetch data from an API here
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      setData(mockData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    // In a real app, this would refetch data from the API
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // Filter and search logic
  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === 'all' || item.status === filter;

    return matchesSearch && matchesFilter;
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading && data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1">
          Records Report
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search records..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
            }}
          />

          <TextField
            select
            size="small"
            value={filter}
            onChange={handleFilterChange}
            SelectProps={{ native: true }}
            sx={{ minWidth: 150 }}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </TextField>

          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader aria-label="reporting table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor:
                            row.status === 'Active' ? 'success.light' :
                            row.status === 'Pending' ? 'warning.light' :
                            row.status === 'Completed' ? 'info.light' : 'error.light',
                          color: 'common.white',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        {row.status}
                      </Box>
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell align="right">
                      ${row.value.toFixed(2)}
                    </TableCell>
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
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Showing {Math.min(page * rowsPerPage + 1, filteredData.length)}-{
            Math.min((page + 1) * rowsPerPage, filteredData.length)
          } of {filteredData.length} records
        </Typography>
      </Box>
    </Box>
  );
};

export default Reporting;