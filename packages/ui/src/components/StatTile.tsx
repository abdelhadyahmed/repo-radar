import { Paper, Skeleton, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface StatTileProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
}

export function StatTile({ label, value, icon, loading }: StatTileProps) {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        {icon && <Stack sx={{ color: 'text.secondary' }}>{icon}</Stack>}
        <Stack sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" noWrap>
            {label}
          </Typography>
          {loading ? (
            <Skeleton width={64} height={28} />
          ) : (
            <Typography variant="h2" component="p" sx={{ lineHeight: 1.2 }}>
              {value}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
