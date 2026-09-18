import SearchIcon from '@mui/icons-material/Search';
import { Alert, Box, MenuItem, Stack, TextField, Typography } from '@mui/material';
import {
    queryChanged,
    runSearch,
    repoIdFromFullName,
    selectSearchProps,
    sortChanged,
    trackRepo,
    untrack,
    useAppDispatch,
    useAppSelector,
} from '@repo-radar/store';
import type { SearchSort } from '@repo-radar/types';
import { useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { EmptyState, Panel, SearchField, SearchResultRow } from '@repo-radar/ui';

const DEBOUNCE_MS = 350;

const SORTS: { value: SearchSort; label: string }[] = [
    { value: 'best-match', label: 'Best match' },
    { value: 'stars', label: 'Most stars' },
    { value: 'forks', label: 'Most forks' },
    { value: 'updated', label: 'Recently updated' },
];

export default function SearchPage() {
    const dispatch = useAppDispatch();
    const { query, trackedIds, repos, sort, busy, error } = useAppSelector(selectSearchProps);

    const settledQuery = useDebounce(query.trim(), DEBOUNCE_MS);

    // `query` is a dependency so a keystroke tears the previous run down at
    // once, cancelling a superseded request rather than letting it finish. The
    // guard is what holds the new request back until typing has settled; a sort
    // change passes it immediately, since that is a choice rather than typing.
    useEffect(() => {
        if (!settledQuery || settledQuery !== query.trim()) return;
        const request = dispatch(runSearch());
        return () => request.abort();
    }, [settledQuery, query, sort, dispatch]);

    // The error already has its own Alert, so don't also claim "No matches".
    const emptyState = !query.trim()
        ? { title: 'Search for a repository', description: 'Type a name, topic, or owner to see results.' }
        : busy
            ? { title: 'Searching…' }
            : error
                ? { title: 'No results to show' }
                : { title: 'No matches', description: `Nothing on GitHub matches “${query.trim()}”.` };

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h1" gutterBottom>
                    Find repositories
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Search GitHub and add anything worth keeping an eye on.
                </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                    <SearchField
                        value={query}
                        onChange={(value) => dispatch(queryChanged(value))}
                        busy={busy}
                        autoFocus
                    />
                </Box>
                <TextField
                    select
                    size="medium"
                    label="Sort"
                    value={sort}
                    onChange={(event) => dispatch(sortChanged(event.target.value as SearchSort))}
                    sx={{ minWidth: 180 }}
                >
                    {SORTS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Panel
                title="Results"
                subtitle={repos.length ? `${repos.length} repositories` : undefined}
                flush
            >
                {repos.length > 0 ? (
                    repos.map((repo) => {
                        const id = repoIdFromFullName(repo.full_name);
                        const tracked = trackedIds.has(id);
                        return (
                            <SearchResultRow
                                key={repo.id}
                                fullName={repo.full_name}
                                description={repo.description}
                                htmlUrl={repo.html_url}
                                avatarUrl={repo.owner?.avatar_url}
                                stars={repo.stargazers_count}
                                forks={repo.forks_count}
                                language={repo.language}
                                tracked={tracked}
                                onToggleTrack={() =>
                                    dispatch(tracked ? untrack(id) : trackRepo(repo))
                                }
                            />
                        );
                    })
                ) : (
                    <EmptyState icon={<SearchIcon fontSize="inherit" />} {...emptyState} />
                )}
            </Panel>
        </Stack>
    );
}
