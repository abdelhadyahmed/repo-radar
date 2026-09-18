import { CardGrid, compactNumber, EmptyState, Panel, RepoBarChart, StatTile, TrackedRepoCard } from "@repo-radar/ui";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router";

import {
  selectStarsData,
  refreshAll,
  refreshRepo,
  selectSummary,
  selectTrackedRepos,
  untrack,
  useAppDispatch,
  useAppSelector,
  type TrackedRepo,
} from "@repo-radar/store";
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import IssueIcon from '@mui/icons-material/AdjustOutlined';
import RadarIcon from '@mui/icons-material/Inventory2Outlined';
import StarIcon from '@mui/icons-material/StarBorder';
import WarningIcon from '@mui/icons-material/WarningAmberOutlined';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const tracked = useAppSelector(selectTrackedRepos);
  const summary = useAppSelector(selectSummary);
  const starsData = useAppSelector(selectStarsData);

  if (tracked.length === 0) {
    return (
      <Panel flush>
        <EmptyState
          icon={<RadarIcon fontSize="inherit" />}
          title="Nothing tracked yet"
          description="Search for a repository and track it to start watching its stars, open issues and commits."
          action={
            <Button component={Link} to="/search" variant="contained">
              Search repositories
            </Button>
          }
        />
      </Panel>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h1">Tracked repositories</Typography>
          <Typography variant="body2" color="text.secondary">
            {summary.loading > 0
              ? `Refreshing ${summary.loading} of ${summary.total}…`
              : `${summary.total} ${summary.total === 1 ? 'repository' : 'repositories'}`}
          </Typography>
        </Box>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
        >
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => dispatch(refreshAll())}
              disabled={summary.loading > 0}
            >
              {summary.loading > 0 ? 'Refreshing…' : 'Refresh all'}
            </Button>
            <Button component={Link} to="/search" variant="contained" startIcon={<AddIcon />}>
              Track another
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          // The failed tile only exists some of the time, so the column count
          // follows the number of tiles actually rendered.
          gridTemplateColumns: {
            xs: '1fr 1fr',
            md: summary.failed > 0 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
          },
        }}
      >
        <StatTile label="Tracked" value={summary.total} icon={<RadarIcon />} />
        <StatTile label="Total stars" value={compactNumber(summary.stars)} icon={<StarIcon />} />
        <StatTile
          label="Open issues"
          value={compactNumber(summary.openIssues)}
          icon={<IssueIcon />}
        />
        {summary.failed > 0 && (
          <StatTile label="Failed" value={summary.failed} icon={<WarningIcon />} />
        )}
      </Box>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        <Panel title="Stars per repository">
          <RepoBarChart data={starsData} />
        </Panel>
      </Box>

      <CardGrid>
        {tracked.map((repo: TrackedRepo) => (
          <TrackedRepoCard
            key={repo.id}
            fullName={repo.repository?.fullName ?? repo.id}
            description={repo.repository?.description}
            htmlUrl={repo.repository?.htmlUrl}
            avatarUrl={repo.repository?.ownerAvatarUrl}
            language={repo.repository?.language}
            archived={repo.repository?.isArchived}
            stars={repo.repository?.stars ?? null}
            openIssues={repo.repository?.openIssues ?? null}
            // pushedAt is the last push; createdAt would date the repository,
            // not its latest commit, and read as a wildly stale "last commit".
            lastCommitAt={repo.lastCommit?.date ?? repo.repository?.pushedAt ?? null}
            lastCommitMessage={repo.lastCommit?.message}
            lastCommitSha={repo.lastCommit?.shortSha}
            lastCommitUrl={repo.lastCommit?.htmlUrl}
            status={repo.status}
            error={repo.error}
            refreshedAt={repo.refreshedAt}
            onRefresh={() => dispatch(refreshRepo(repo.id))}
            onUntrack={() => dispatch(untrack(repo.id))}
          />
        ))}
      </CardGrid>
    </Stack>
  );
}
