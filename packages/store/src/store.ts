import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { searchReducer } from './searchSlice';
import { loadTracked } from './storage';
import { trackedReducer } from './trackedSlice';

const rootReducer = combineReducers({
    search: searchReducer,
    tracked: trackedReducer,
});

/** Deriving this from the reducer rather than the store keeps the slices
 *  and the store free of circular type references. */
export type RootState = ReturnType<typeof rootReducer>;

export function createAppStore(preloadedState?: Partial<RootState>) {
    // Saving lives in the tracked reducers themselves.
    return configureStore({
        reducer: rootReducer,
        preloadedState: (preloadedState ?? {
            tracked: { repos: loadTracked() },
        }) as RootState | undefined,
    });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];
