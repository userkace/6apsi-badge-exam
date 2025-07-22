import React, { useState, useMemo } from 'react';
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
  IconButton,
  TextField,
  Chip,
  TablePagination,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useRecords } from '../context/RecordsContext';

const statusColors = {
  Active: 'success',
  Pending: 'warning',
  Completed: 'primary',
  Cancelled: 'error',
  'On Hold': 'info',
};

const EditRecords = () => {
  const { records, deleteRecord } = useRecords();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await deleteRecord(id);
    }
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setPage(0);
  };

  const filteredRecords = useMemo(() => {
    const filtered = records.filter(record =>
      (record.name && record.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.category && record.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.status && record.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.description && record.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sort by most recent first
    return [...filtered].sort((a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }, [records, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate paginated records
  const paginatedRecords = useMemo(() => {
    return filteredRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredRecords, page, rowsPerPage]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Typography variant="h5" component="h1">
            Manage Records
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search records..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              sx={{ minWidth: 250 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/dashboard/add')}
            >
              Add New Record
            </Button>
            <IconButton onClick={handleRefresh} title="Reset filters">
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Added</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    {records.length === 0
                      ? 'No records found. Add your first record to get started.'
                      : 'No records match the current search.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{record.name || 'N/A'}</TableCell>
                      <TableCell>{record.category || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.status || 'N/A'}
                          color={statusColors[record.status] || 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {record.createdAt
                          ? new Date(record.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {typeof record.value === 'number'
                          ? `$${record.value.toFixed(2)}`
                          : record.value || 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(record.id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(record.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
          {filteredRecords.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRecords.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default EditRecords;
