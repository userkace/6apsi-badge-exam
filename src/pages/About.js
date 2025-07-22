import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { School, Group, Code } from '@mui/icons-material';

const teamMembers = [
  { name: 'Gopez, Ralphs Louis', role: 'Developer' },
  { name: 'Palao, Athaliah December', role: 'Developer' },
  { name: 'Padilla, Kervin Clyde', role: 'Developer' },
  { name: 'Robles, Eunice', role: 'Developer' },
  { name: 'Ysais, Carlo Jose', role: 'Developer' },
];

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            About Our Project
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            A modern, responsive dashboard application built with React, Material-UI, and React Router.
          </Typography>
        </Box>

        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <School color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  Educational Purpose
                </Typography>
                <Typography color="textSecondary">
                  This project was developed as part of our academic curriculum to showcase our skills in modern web development.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <Group color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  Team Collaboration
                </Typography>
                <Typography color="textSecondary">
                  A collaborative effort by a team of dedicated students working together to build a comprehensive dashboard application.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <Code color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  Modern Tech Stack
                </Typography>
                <Typography color="textSecondary">
                  Built with React, Material-UI, and React Router to deliver a seamless user experience across all devices.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box mt={6} mb={4}>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
            Meet Our Team
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={3} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                  textAlign: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8]
                  }
                }}>
                  <Avatar 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mb: 2,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '2.5rem'
                    }}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {member.role}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mt={6} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            {new Date().getFullYear()} 6APSI Badge Exam Project. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default About;
