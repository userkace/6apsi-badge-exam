import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Assessment as AssessmentIcon,
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  List as ListIcon,
} from '@mui/icons-material';
import { useRecords } from '../context/RecordsContext';

const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
    }}
  >
    <Box
      sx={{
        width: 60,
        height: 60,
        borderRadius: '50%',
        bgcolor: `${color}.light`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      <Icon color={color} fontSize="large" />
    </Box>
    <Typography variant="h6" component="div" gutterBottom>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary" align="center">
      {title}
    </Typography>
  </Paper>
);

const DashboardHome = () => {
  const { records, generateSampleData } = useRecords();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Get the 5 most recent records
  const recentRecords = [...records].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, 5);

  const activeRecords = records.filter(record => record.status === 'Active').length;
  const pendingRecords = records.filter(record =>
    ['Pending', 'On Hold'].includes(record.status)
  ).length;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <Box sx={{ mt: 2, mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            const count = generateSampleData().length;
            setSnackbar({
              open: true,
              message: `Added ${count} sample records to your dashboard!`,
              severity: 'success'
            });
          }}
          sx={{ mb: 3 }}
        >
          Load Sample Data
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Records"
            value={records.length.toLocaleString()}
            icon={AssessmentIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Records"
            value={activeRecords.toLocaleString()}
            icon={AddCircleIcon}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Actions"
            value={pendingRecords.toLocaleString()}
            icon={EditIcon}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Records</Typography>
              <Button
                variant="text"
                size="small"
                endIcon={<ListIcon />}
                onClick={() => navigate('/dashboard/edit')}
              >
                View All
              </Button>
            </Box>
            {recentRecords.length > 0 ? (
              <List>
                {recentRecords.map((record, index) => (
                  <React.Fragment key={record.id}>
                    <ListItem
                      button
                      onClick={() => navigate(`/dashboard/edit/${record.id}`)}
                    >
                      <ListItemText
                        primary={record.name}
                        secondary={`${record.category} • ${record.status}`}
                        primaryTypographyProps={{ noWrap: true }}
                        secondaryTypographyProps={{ noWrap: true }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ${record.value}
                      </Typography>
                    </ListItem>
                    {index < recentRecords.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary" gutterBottom>
                  No records found
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                  onClick={() => navigate('/dashboard/add')}
                >
                  Add Your First Record
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <Button
                variant="outlined"
                startIcon={<AddCircleIcon />}
                onClick={() => navigate('/dashboard/add')}
              >
                Add New Record
              </Button>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate('/dashboard/edit')}
              >
                Manage Records
              </Button>
              <Button
                variant="outlined"
                startIcon={<AssessmentIcon />}
                onClick={() => navigate('/dashboard/reports')}
              >
                View Reports
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardHome;
