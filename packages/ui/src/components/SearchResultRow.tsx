import AddIcon from '@mui/icons-material/Add';
import ForkIcon from '@mui/icons-material/CallSplit';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/StarBorder';
import { Avatar, Box, Button, Chip, Link, Stack, Typography } from '@mui/material';
import { compactNumber } from '../format';

export interface SearchResultRowProps {
  fullName: string;
  description?: string | null;
  htmlUrl: string;
  avatarUrl?: string;
  stars: number;
  forks: number;
  language?: string | null;
  tracked: boolean;
  onToggleTrack: () => void;
}

export function SearchResultRow({
  fullName,
  description,
  htmlUrl,
  avatarUrl,
  stars,
  forks,
  language,
  tracked,
  onToggleTrack,
}: SearchResultRowProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: 'center',
        px: 2.5,
        py: 1.75,
        '&:not(:last-of-type)': { borderBottom: 1, borderColor: 'divider' },
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Avatar src={avatarUrl} alt="" variant="rounded" sx={{ width: 32, height: 32 }}>
        {fullName.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Link
          href={htmlUrl}
          target="_blank"
          rel="noopener"
          underline="hover"
          color="text.primary"
          sx={{ fontWeight: 600 }}
        >
          {fullName}
        </Link>
        <Typography variant="body2" color="text.secondary" noWrap>
          {description || 'No description.'}
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
          color: 'text.secondary',
          display: { xs: 'none', sm: 'flex' },
        }}
      >
        {language && <Chip label={language} size="small" variant="outlined" />}
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <StarIcon fontSize="small" />
          <Typography variant="body2">{compactNumber(stars)}</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <ForkIcon fontSize="small" />
          <Typography variant="body2">{compactNumber(forks)}</Typography>
        </Stack>
      </Stack>

      <Button
        size="small"
        variant={tracked ? 'outlined' : 'contained'}
        color={tracked ? 'success' : 'primary'}
        startIcon={tracked ? <CheckIcon /> : <AddIcon />}
        onClick={onToggleTrack}
        sx={{ flexShrink: 0, minWidth: 104 }}
      >
        {tracked ? 'Tracking' : 'Track'}
      </Button>
    </Stack>
  );
}
