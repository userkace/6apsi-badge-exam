import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecords } from '../context/RecordsContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

// Mock categories and statuses for record generation
const categories = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'];
const statuses = ['Active', 'Pending', 'Completed', 'Cancelled', 'On Hold'];

const AddRecord = ({ editMode: editModeProp = false }) => {
  const { id } = useParams();
  const { records, addRecord: addRecordContext, updateRecord: updateRecordContext } = useRecords();
  const editMode = editModeProp || Boolean(id);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(editMode);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    status: 'Active',
    value: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Load record data if in edit mode
  useEffect(() => {
    if (!editMode) return;

    setIsLoading(true);
    const recordToEdit = records.find(record => record.id === Number(id));

    if (recordToEdit) {
      setFormData(recordToEdit);
    } else {
      console.error('Record not found');
      alert('Record not found. Redirecting to dashboard.');
      navigate('/dashboard');
    }
    setIsLoading(false);
  }, [id, editMode, navigate, records]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editMode && id) {
        // Update existing record
        updateRecordContext(Number(id), formData);
      } else {
        // Add new record
        addRecordContext(formData);
      }

      // Show success message
      alert(editMode ? 'Record updated successfully!' : 'Record added successfully!');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving record:', error);
      alert('An error occurred while saving the record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      flexGrow: 1,
      p: { xs: 2, sm: 3 },
      maxWidth: '1200px',
      mx: 'auto',
      width: '100%',
      opacity: isLoading ? 0.7 : 1,
      transition: 'opacity 0.3s ease-in-out',
      pointerEvents: isLoading ? 'none' : 'auto'
    }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Dashboard
      </Button>

      <Paper sx={{
        p: { xs: 2, sm: 4 },
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          {editMode ? 'Edit Record' : 'Add New Record'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Record Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                  required
                  sx={{
                    borderRadius: 1,
                    '& .MuiSelect-select': {
                      padding: '14px 14px',
                    },
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  sx={{
                    borderRadius: 1,
                    '& .MuiSelect-select': {
                      padding: '14px 14px',
                    },
                  }}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Value"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: '$',
                  sx: {
                    borderRadius: 1,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                  '& .MuiInputBase-multiline': {
                    padding: '8px 14px',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 3, py: 1.5, borderRadius: 1 }}
              >
                {editMode ?
                  (isSubmitting ? 'Updating...' : 'Update Record') :
                  (isSubmitting ? 'Saving...' : 'Save Record')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddRecord;
