import IssueIcon from '@mui/icons-material/AdjustOutlined';
import CommitIcon from '@mui/icons-material/Commit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import RefreshIcon from '@mui/icons-material/Refresh';
import StarIcon from '@mui/icons-material/StarBorder';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Link,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import { absoluteDate, compactNumber, fullNumber, relativeTime } from '@repo-radar/format';

export interface TrackedRepoCardProps {
  fullName: string;
  description?: string | null;
  htmlUrl?: string;
  avatarUrl?: string;
  language?: string | null;
  archived?: boolean;
  stars: number | null;
  openIssues: number | null;
  /** ISO date of the last commit, or null if we don't know it yet. */
  lastCommitAt: string | null;
  lastCommitMessage?: string | null;
  lastCommitSha?: string | null;
  lastCommitUrl?: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
  refreshedAt?: number | null;
  onRefresh: () => void;
  onUntrack: () => void;
}

export function TrackedRepoCard({
  fullName,
  description,
  htmlUrl,
  avatarUrl,
  language,
  archived,
  stars,
  openIssues,
  lastCommitAt,
  lastCommitMessage,
  lastCommitSha,
  lastCommitUrl,
  status,
  error,
  refreshedAt,
  onRefresh,
  onUntrack,
}: TrackedRepoCardProps) {
  const loading = status === 'loading';
  // Whatever we last knew stays on screen while refreshing. Only a repo we've
  // never loaded shows skeletons.
  const noDataYet = stars === null;

  return (
    <Paper
      component="article"
      aria-busy={loading}
      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Box sx={{ height: 3 }}>{loading && <LinearProgress sx={{ height: 3 }} />}</Box>

      <Stack spacing={2} sx={{ p: 2.5, pt: 2, flex: 1 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
          <Avatar src={avatarUrl} alt="" variant="rounded" sx={{ width: 36, height: 36 }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
              <Link
                href={htmlUrl}
                target="_blank"
                rel="noopener"
                underline="hover"
                color="text.primary"
                sx={{ fontWeight: 600, minWidth: 0, display: 'inline-flex', alignItems: 'center' }}
              >
                <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {fullName}
                </Box>
                <LaunchIcon sx={{ fontSize: 13, ml: 0.5, opacity: 0.6, flexShrink: 0 }} />
              </Link>
              {archived && <Chip label="Archived" size="small" color="warning" variant="outlined" />}
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.25,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: 40,
              }}
            >
              {description || 'No description.'}
            </Typography>
          </Box>

          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <Tooltip title="Refresh">
              <span>
                <IconButton
                  size="small"
                  onClick={onRefresh}
                  disabled={loading}
                  aria-label={`Refresh ${fullName}`}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Stop tracking">
              <IconButton size="small" onClick={onUntrack} aria-label={`Stop tracking ${fullName}`}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
          <Stat
            icon={<StarIcon fontSize="small" />}
            label="Stars"
            value={stars}
            title={stars === null ? undefined : `${fullNumber(stars)} stars`}
            loading={noDataYet}
          />
          <Stat
            icon={<IssueIcon fontSize="small" />}
            label="Open issues"
            value={openIssues}
            title={openIssues === null ? undefined : `${fullNumber(openIssues)} open issues`}
            loading={noDataYet}
          />
          <Stat
            icon={<CommitIcon fontSize="small" />}
            label="Last commit"
            text={relativeTime(lastCommitAt) ?? '—'}
            title={absoluteDate(lastCommitAt) ?? undefined}
            loading={noDataYet}
          />
        </Stack>

        {language && (
          <Box>
            <Chip label={language} size="small" variant="outlined" />
          </Box>
        )}

        <Box sx={{ mt: 'auto' }}>
          {status === 'failed' && error ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={onRefresh}>
                  Retry
                </Button>
              }
              sx={{ py: 0, alignItems: 'center' }}
            >
              {error}
            </Alert>
          ) : lastCommitMessage ? (
            <Typography variant="caption" color="text.secondary" component="p" noWrap>
              <Link
                href={lastCommitUrl ?? undefined}
                target="_blank"
                rel="noopener"
                underline="hover"
              >
                {lastCommitSha}
              </Link>{' '}
              {lastCommitMessage}
            </Typography>
          ) : (
            <Typography variant="caption" color="text.disabled" component="p">
              {refreshedAt ? `Updated ${relativeTime(refreshedAt)}` : 'Not refreshed yet'}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

interface StatProps {
  icon: ReactNode;
  label: string;
  value?: number | null;
  text?: string;
  title?: string;
  loading?: boolean;
}

function Stat({ icon, label, value, text, title, loading }: StatProps) {
  const display = text ?? (value == null ? '—' : compactNumber(value));

  return (
    <Stack spacing={0.25} sx={{ minWidth: 72 }}>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
        {icon}
        <Typography variant="caption">{label}</Typography>
      </Stack>
      {loading ? (
        <Skeleton width={48} height={22} />
      ) : (
        <Tooltip title={title ?? ''} disableHoverListener={!title}>
          <Typography variant="subtitle2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {display}
          </Typography>
        </Tooltip>
      )}
    </Stack>
  );
}
