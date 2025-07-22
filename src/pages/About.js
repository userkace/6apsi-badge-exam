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
    <Box
      display="flex"
      flexDirection="column"
      minHeight="calc(100vh - 64px)"
      justifyContent="center"
      py={4}
      bgcolor="background.default"
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 2,
            maxWidth: 1200,
            mx: 'auto',
            width: '100%',
          }}
        >
          <Box
            textAlign="center"
            mb={6}
            maxWidth={800}
            mx="auto"
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 700,
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              About Our Project
            </Typography>
            <Typography
              variant="h6"
              color="textSecondary"
              paragraph
              sx={{
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                maxWidth: 800,
                mx: 'auto',
              }}
            >
              A modern, responsive dashboard application built with React, Material-UI, and React Router.
            </Typography>
          </Box>

          <Grid container spacing={4} mb={6} justifyContent="center">
            {[
              {
                icon: <School color="primary" sx={{ fontSize: 60 }} />,
                title: 'Educational Purpose',
                description: 'This project was developed as part of our academic curriculum to showcase our skills in modern web development.'
              },
              {
                icon: <Group color="primary" sx={{ fontSize: 60 }} />,
                title: 'Team Collaboration',
                description: 'A collaborative effort by a team of dedicated students working together to build a comprehensive dashboard application.'
              },
              {
                icon: <Code color="primary" sx={{ fontSize: 60 }} />,
                title: 'Modern Tech Stack',
                description: 'Built with React, Material-UI, and React Router to deliver a seamless user experience across all devices.'
              }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6]
                  }
                }}>
                  <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                    {item.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography color="textSecondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mb={6}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                fontSize: { xs: '1.75rem', md: '2.125rem' },
                fontWeight: 600,
              }}
            >
              Meet Our Team
            </Typography>
            <Divider
              sx={{
                width: 80,
                height: 4,
                backgroundColor: 'primary.main',
                mx: 'auto',
                mb: 4,
              }}
            />

            <Grid
              container
              spacing={3}
              justifyContent="center"
              maxWidth={1200}
              mx="auto"
            >
              {teamMembers.map((member, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      maxWidth: 280,
                      p: 3,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[8],
                        '& .MuiAvatar-root': {
                          transform: 'scale(1.05)',
                        }
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        mb: 3,
                        mx: 'auto',
                        bgcolor: 'primary.main',
                        fontSize: '2.25rem',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      sx={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: 500,
                      }}
                    >
                      {member.role}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box
            mt={8}
            textAlign="center"
            pt={3}
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.9rem',
              }}
            >
              &copy; {new Date().getFullYear()} 6APSI Badge Exam Project. All rights reserved.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;
