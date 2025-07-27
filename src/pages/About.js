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
    useMediaQuery,
    styled,
    Button,
} from '@mui/material'
import { School, Group, Code } from '@mui/icons-material' //buton
import { useNavigate } from 'react-router-dom'

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(6, 4),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[10],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    margin: theme.spacing(4, 'auto'),
    maxWidth: '1200px',
    width: '100%',
}))

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[5],
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[10],
    },
}))

const TeamCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    textAlign: 'center',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[5],
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[10],
    },
}))

const teamMembers = [
    { name: 'Gopez, Ralph Louis', role: 'Developer', gitHubAccount: 'sevora' },
    {
        name: 'Robles, Eunice',
        role: 'Developer',
        gitHubAccount: 'EuniceRobles',
    },
    { name: 'Ysais, Carlos Jose', role: 'Developer', gitHubAccount: 'cbysais' },
    {
        name: 'Padilla, Kervin Clyde',
        role: 'Developer',
        gitHubAccount: 'userkace',
    },
    {
        name: 'Palao, Maria Athaliah December',
        role: 'Developer',
        gitHubAccount: 'jupiterhal',
    },
]

const About = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const navigate = useNavigate() //for back button

    return (
        <Container
            maxWidth={false}
            sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                px: { xs: 2, sm: 3, md: 4 },
            }}
        >
            {/* Back Button */}
            <Box width="100%" mb={2} display="flex" justifyContent="flex-start">
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
            </Box>
            <StyledPaper elevation={3}>
                <Box textAlign="center" mb={6} width="100%">
                    <Typography
                        variant={isMobile ? 'h3' : 'h2'}
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                            marginBottom: theme.spacing(3),
                        }}
                    >
                        About Our Project
                    </Typography>
                    <Typography
                        variant={isMobile ? 'h6' : 'h5'}
                        color="textSecondary"
                        paragraph
                        sx={{
                            maxWidth: '800px',
                            margin: '0 auto',
                        }}
                    >
                        A modern, responsive dashboard application built with
                        React, Material-UI, and React Router.
                    </Typography>
                </Box>

                <Grid container spacing={4} mb={6} justifyContent="center">
                    <Grid item xs={12} md={4}>
                        <StyledCard>
                            <Box
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <School
                                    color="primary"
                                    sx={{ fontSize: 60, opacity: 0.9 }}
                                />
                            </Box>
                            <CardContent
                                sx={{ flexGrow: 1, textAlign: 'center' }}
                            >
                                <Typography
                                    variant="h5"
                                    component="h3"
                                    gutterBottom
                                >
                                    Educational Purpose
                                </Typography>
                                <Typography color="textSecondary">
                                    This project was developed as part of our
                                    academic curriculum to showcase our skills
                                    in modern web development.
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <StyledCard>
                            <Box
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Group
                                    color="primary"
                                    sx={{ fontSize: 60, opacity: 0.9 }}
                                />
                            </Box>
                            <CardContent
                                sx={{ flexGrow: 1, textAlign: 'center' }}
                            >
                                <Typography
                                    variant="h5"
                                    component="h3"
                                    gutterBottom
                                >
                                    Team Collaboration
                                </Typography>
                                <Typography color="textSecondary">
                                    A collaborative effort by a team of
                                    dedicated students working together to build
                                    a comprehensive dashboard application.
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <StyledCard>
                            <Box
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Code
                                    color="primary"
                                    sx={{ fontSize: 60, opacity: 0.9 }}
                                />
                            </Box>
                            <CardContent
                                sx={{ flexGrow: 1, textAlign: 'center' }}
                            >
                                <Typography
                                    variant="h5"
                                    component="h3"
                                    gutterBottom
                                >
                                    Modern Tech Stack
                                </Typography>
                                <Typography color="textSecondary">
                                    Built with React, Material-UI, and React
                                    Router to deliver a seamless user experience
                                    across all devices.
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                </Grid>

                <Box
                    mt={8}
                    mb={6}
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <Box maxWidth="800px" width="100%">
                        <Typography
                            variant={isMobile ? 'h4' : 'h3'}
                            component="h2"
                            textAlign="center"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.primary.main,
                                marginBottom: theme.spacing(4),
                            }}
                        >
                            Meet Our Team
                        </Typography>
                        <Divider
                            sx={{
                                mb: 6,
                                mx: 'auto',
                                width: '100px',
                                borderBottomWidth: 3,
                            }}
                        />

                        <Grid
                            container
                            spacing={4}
                            justifyContent="center"
                            maxWidth="1200px"
                            margin="0 auto"
                        >
                            {teamMembers.map((member, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <a
                                        href={`https://github.com/${member.gitHubAccount}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <TeamCard>
                                            <Avatar
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    mb: 3,
                                                    bgcolor:
                                                        theme.palette.primary
                                                            .main,
                                                    fontSize: '2.5rem',
                                                    boxShadow: theme.shadows[3],
                                                }}
                                            >
                                                {member.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
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
                                                color="textSecondary"
                                                variant="body1"
                                                sx={{ fontWeight: 500 }}
                                            >
                                                {member.role}
                                            </Typography>
                                        </TeamCard>
                                    </a>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>

                <Box mt={8} textAlign="center">
                    <Typography variant="body2" color="textSecondary">
                        © {new Date().getFullYear()} 6APSI Badge Exam Project.
                        All rights reserved.
                    </Typography>
                </Box>
            </StyledPaper>
        </Container>
    )
}

export default About
