import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit';
import type { GitHubRepo, SearchSort } from '@repo-radar/types';
import { searchRepos } from './githubApi';
import type { RootState } from './store';

export interface SearchState {
    query: string;
    sort: SearchSort;
    repos: GitHubRepo[];
    error: string | null;
    busy: boolean;
    requestId: string | null;
}

const initialState: SearchState = {
    query: '',
    sort: 'best-match',
    repos: [],
    error: null,
    busy: false,
    requestId: null,
};

export const runSearch = createAsyncThunk<
    GitHubRepo[],
    void,
    { state: RootState; rejectValue: string }
>('search/run', async (_, { getState, signal, rejectWithValue }) => {
    const { query, sort } = getState().search;
    try {
        return await searchRepos(query.trim(), sort, signal);
    } catch (err) {
        if (signal.aborted) throw err;
        return rejectWithValue(err instanceof Error ? err.message : 'Something went wrong.');
    }
});

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        queryChanged(state, action: PayloadAction<string>) {
            state.query = action.payload;
            // Busy covers the debounce window too, so the spinner appears on
            // the first keystroke rather than 350ms later.
            state.busy = action.payload.trim().length > 0;
            if (!state.busy) {
                state.repos = [];
                state.error = null;
                state.requestId = null;
            }
        },
        sortChanged(state, action: PayloadAction<SearchSort>) {
            state.sort = action.payload;
            state.busy = state.query.trim().length > 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(runSearch.pending, (state, action) => {
                state.busy = true;
                state.error = null;
                state.requestId = action.meta.requestId;
            })
            .addCase(runSearch.fulfilled, (state, action) => {
                if (action.meta.requestId !== state.requestId) return;
                state.repos = action.payload;
                state.error = null;
                state.busy = false;
                state.requestId = null;
            })
            .addCase(runSearch.rejected, (state, action) => {
                if (action.meta.aborted) return;
                if (action.meta.requestId !== state.requestId) return;
                state.repos = [];
                state.error = action.payload ?? 'Something went wrong.';
                state.busy = false;
                state.requestId = null;
            });
    },
});

export const { queryChanged, sortChanged } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;
