import React, { useState, useEffect } from 'react';
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
  Tooltip,
  TextField,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Generate a larger set of mock data with more variety
const generateMockRecords = (count = 50) => {
  const categories = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'];
  const statuses = ['Active', 'Pending', 'Completed', 'Cancelled', 'On Hold'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Record ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    value: (Math.random() * 10000).toFixed(2),
    date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }));
};

const mockRecords = generateMockRecords(50); // Generate 50 mock records

const statusColors = {
  Active: 'success',
  Pending: 'warning',
  Completed: 'primary',
  Cancelled: 'error',
};

const EditRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Load records
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setRecords(mockRecords);
      setLoading(false);
    };

    fetchRecords();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (id) => {
    // Ensure the ID is a number for consistency
    const recordId = Number(id);
    navigate(`/dashboard/edit/${recordId}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      // In a real app, this would be an API call
      setRecords(prev => prev.filter(record => record.id !== id));
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const filteredRecords = records.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading records...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h5">Manage Records</Typography>

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
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard/add')}
          >
            Add New Record
          </Button>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow hover key={record.id}>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.category}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={statusColors[record.status] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>${record.value}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(record.id)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(record.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
      </Paper>
    </Box>
  );
};

export default EditRecords;
