import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: theme.spacing(8, 2),
}));

const HeroContent = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
  textAlign: 'center',
  padding: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6, 4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
  maxWidth: 800,
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
}));

const Landing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <CssBaseline />
      <HeroSection>
        <HeroContent maxWidth="md">
          <StyledPaper elevation={3}>
            <Typography
              component="h1"
              variant={isMobile ? 'h3' : 'h2'}
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                marginBottom: theme.spacing(3),
              }}
            >
              Welcome to Our Platform
            </Typography>

            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              color="textSecondary"
              paragraph
              sx={{
                maxWidth: '700px',
                margin: '0 auto',
                marginBottom: theme.spacing(4),
              }}
            >
              Streamline your workflow and manage your records efficiently with our powerful dashboard.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2,
                justifyContent: 'center',
                marginTop: theme.spacing(4),
              }}
            >
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  padding: theme.spacing(1.5, 4),
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Get Started
              </Button>

              <Button
                component={Link}
                to="/about"
                variant="outlined"
                color="primary"
                size="large"
                sx={{
                  padding: theme.spacing(1.5, 4),
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Learn More
              </Button>
            </Box>

            <Box sx={{ marginTop: theme.spacing(6) }}>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginTop: theme.spacing(2) }}
              >
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </StyledPaper>
        </HeroContent>
      </HeroSection>
    </>
  );
};

export default Landing;