import { createTheme } from '@mui/material/styles';

/**
 * MUI's default type scale is built for marketing pages — h1 is 6rem, h2
 * 3.75rem. This app is a dense dashboard, so the whole scale comes down to
 * something a data-heavy page can use without per-component overrides.
 */
export const theme = createTheme({
    palette: {
        primary: { main: '#2563eb' },
        background: { default: '#f5f6f8', paper: '#ffffff' },
    },
    shape: { borderRadius: 10 },
    typography: {
        fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        h1: { fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em' },
        h2: { fontSize: '1.5rem', fontWeight: 650, lineHeight: 1.3, letterSpacing: '-0.01em' },
        h3: { fontSize: '1.0625rem', fontWeight: 600, lineHeight: 1.4 },
        h6: { fontSize: '1.0625rem', fontWeight: 650, letterSpacing: '-0.01em' },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
        // Borders read better than shadows on a tinted background, and keep
        // adjacent cards distinct without stacking drop shadows.
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: ({ theme }) => ({ border: `1px solid ${theme.palette.divider}` }),
            },
        },
        MuiAppBar: {
            styleOverrides: { root: { boxShadow: 'none' } },
        },
        MuiTab: {
            styleOverrides: { root: { textTransform: 'none', fontWeight: 600, minHeight: 48 } },
        },
    },
});
