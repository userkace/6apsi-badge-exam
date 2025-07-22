import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import {
  Assessment as AssessmentIcon,
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

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
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Records"
            value="1,234"
            icon={AssessmentIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Records"
            value="856"
            icon={AddCircleIcon}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Actions"
            value="42"
            icon={EditIcon}
            color="warning"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your dashboard. Use the sidebar to navigate between different sections.
        </Typography>
      </Paper>
    </Box>
  );
};

export default DashboardHome;
