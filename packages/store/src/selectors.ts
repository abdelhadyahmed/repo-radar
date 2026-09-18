import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export const selectTrackedRepos = (state: RootState) => state.tracked.repos;

export const selectSearchProps = createSelector(
    [(state: RootState) => state.search, (state: RootState) => state.tracked.repos],
    (search, tracked) => ({
        query: search.query,
        sort: search.sort,
        repos: search.repos,
        error: search.error,
        busy: search.busy,
        trackedIds: new Set(tracked.map((repo) => repo.id)),
    }),
);

export const selectSummary = createSelector([selectTrackedRepos], (repos) => ({
    total: repos.length,
    loading: repos.filter((r) => r.status === 'loading').length,
    failed: repos.filter((r) => r.status === 'failed').length,
    stars: repos.reduce((sum, r) => sum + (r.repository?.stars ?? 0), 0),
    openIssues: repos.reduce((sum, r) => sum + (r.repository?.openIssues ?? 0), 0),
}));

export const selectStarsData = createSelector([selectTrackedRepos], (repos) =>
    repos
        .filter((repo) => repo.repository !== null)
        .map((repo) => ({
            id: repo.id,
            name: repo.ref.name,
            fullName: repo.repository?.fullName ?? repo.id,
            stars: repo.repository?.stars ?? 0,
            openIssues: repo.repository?.openIssues ?? 0,
        }))
        .sort((a, b) => b.stars - a.stars),
);


