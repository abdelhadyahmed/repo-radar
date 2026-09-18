import { Box } from '@mui/material';
import type { ReactNode } from 'react';

/**
 * Responsive card grid. Uses auto-fill rather than fixed breakpoints so cards
 * reflow at whatever width they actually need.
 */
export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(330px, 1fr))' },
      }}
    >
      {children}
    </Box>
  );
}
