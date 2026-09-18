import { Box, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface PanelProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  flush?: boolean;
}

export function Panel({ title, subtitle, action, children, flush }: PanelProps) {
  return (
    <Paper sx={{ overflow: 'hidden' }}>
      {(title || action) && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 1.75,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h3" component="h2" noWrap>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Stack>
      )}
      <Box sx={{ p: flush ? 0 : 2.5 }}>{children}</Box>
    </Paper>
  );
}
