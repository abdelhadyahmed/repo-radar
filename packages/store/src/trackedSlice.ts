import {
    createAsyncThunk,
    createSlice,
    current,
    type PayloadAction,
    type ThunkDispatch,
    type UnknownAction,
} from '@reduxjs/toolkit';
import type {
    AsyncStatus,
    CommitSummary,
    GitHubRepo,
    Repository,
    RepositoryId,
    RepositoryRef,
} from '@repo-radar/types';
import { getSnapshot } from './githubApi';
import { saveTracked } from './storage';
import { mapCommit, mapRepo } from './mappers';
import type { RootState } from './store';

export interface TrackedRepo {
    id: RepositoryId;
    ref: RepositoryRef;
    addedAt: number;
    repository: Repository | null;
    lastCommit: CommitSummary | null;
    status: AsyncStatus;
    error: string | null;
    refreshedAt: number | null;
}

interface TrackedState {
    repos: TrackedRepo[];
}

const initialState: TrackedState = { repos: [] };

interface RefreshResult {
    id: RepositoryId;
    repository: Repository;
    lastCommit: CommitSummary | null;
    refreshedAt: number;
}

export const refreshRepo = createAsyncThunk<
    RefreshResult,
    RepositoryId,
    { state: RootState; rejectValue: string }
>('tracked/refresh', async (id, { getState, signal, rejectWithValue }) => {
    const entry = getState().tracked.repos.find((repo) => repo.id === id);
    if (!entry) return rejectWithValue('That repository is no longer tracked.');

    try {
        const snapshot = await getSnapshot(entry.ref, signal);
        return {
            id,
            repository: mapRepo(snapshot.repository),
            lastCommit: snapshot.lastCommit ? mapCommit(snapshot.lastCommit) : null,
            refreshedAt: Date.now(),
        };
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Refresh failed.');
    }
});

const trackedSlice = createSlice({
    name: 'tracked',
    initialState,
    reducers: {
        track: {
            reducer(state, action: PayloadAction<TrackedRepo>) {
                if (state.repos.some((repo) => repo.id === action.payload.id)) return;
                state.repos.push(action.payload);
                persist(state);
            },
            prepare(repository: Repository) {
                return {
                    payload: {
                        id: repository.id,
                        ref: repository.ref,
                        addedAt: Date.now(),
                        repository,
                        lastCommit: null,
                        status: 'idle',
                        error: null,
                        refreshedAt: null,
                    } satisfies TrackedRepo,
                };
            },
        },
        untrack(state, action: PayloadAction<RepositoryId>) {
            state.repos = state.repos.filter((repo) => repo.id !== action.payload);
            persist(state);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(refreshRepo.pending, (state, action) => {
                const entry = findEntry(state, action.meta.arg);
                if (!entry) return;
                entry.status = 'loading';
                entry.error = null;
            })
            .addCase(refreshRepo.fulfilled, (state, action) => {
                const entry = findEntry(state, action.payload.id);
                // Untracked mid-flight: there is nothing left to update.
                if (!entry) return;
                entry.repository = action.payload.repository;
                entry.lastCommit = action.payload.lastCommit;
                entry.refreshedAt = action.payload.refreshedAt;
                entry.status = 'succeeded';
                entry.error = null;
                persist(state);
            })
            .addCase(refreshRepo.rejected, (state, action) => {
                const entry = findEntry(state, action.meta.arg);
                if (!entry) return;
                entry.status = 'failed';
                entry.error = action.payload ?? 'Refresh failed.';
                persist(state);
            });
    },
});

/**
 * Writes the list to localStorage.
 *
 * Reducers run inside Immer, so `state` is a draft proxy — `current` unwraps it
 * to the plain snapshot that JSON.stringify should see.
 */
function persist(state: TrackedState) {
    saveTracked(current(state).repos);
}

function findEntry(state: TrackedState, id: RepositoryId) {
    return state.repos.find((repo) => repo.id === id);
}

export const { track, untrack } = trackedSlice.actions;

/** Tracks a repository straight from a search result. */
export const trackRepo = (repo: GitHubRepo) => track(mapRepo(repo));

type Dispatch = ThunkDispatch<RootState, unknown, UnknownAction>;


export const refreshAll = () => (dispatch: Dispatch, getState: () => RootState) => {
    for (const repo of getState().tracked.repos) {
        dispatch(refreshRepo(repo.id));
    }
};

export const trackedReducer = trackedSlice.reducer;
