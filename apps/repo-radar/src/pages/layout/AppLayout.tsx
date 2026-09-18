import { AppBar, Box, Container, Stack, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link, Outlet, useLocation } from 'react-router';

const TABS = [{ path: "/", label: "Dashboard" }, { path: "/search", label: "Search" }]
export function AppLayout() {
    const { pathname } = useLocation();
    const active = TABS.some((tab) => tab.path === pathname) ? pathname : '/';
    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mr: 1 }}>
                            <Box component="span" aria-hidden sx={{ fontSize: 22 }}>
                                <GitHubIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                            </Box>
                            <Typography variant="h6" component="p">
                                Repo Radar
                            </Typography>
                        </Stack>
                        <Tabs value={active} textColor="inherit" sx={{ flex: 1, minHeight: 48 }}>
                            {TABS.map((tab) => (
                                <Tab key={tab.path} label={tab.label} value={tab.path} to={tab.path} component={Link} />
                            ))}
                        </Tabs>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container maxWidth="xl" component="main" sx={{ py: 3 }}>
                <Outlet />
            </Container>
        </Box>
    )
}
