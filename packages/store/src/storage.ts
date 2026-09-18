import type { TrackedRepo } from './trackedSlice';

const KEY = 'repo-radar.tracked';

export function saveTracked(repos: TrackedRepo[]) {
    try {
        localStorage.setItem(KEY, JSON.stringify(repos));
    } catch {
        console.log("no data")
    }
}

export function loadTracked(): TrackedRepo[] {
    try {
        const items = localStorage.getItem(KEY);
        if (!items) return [];
        const parsed: unknown = JSON.parse(items);
        return Array.isArray(parsed) ? (parsed as TrackedRepo[]) : [];
    } catch {
        return [];
    }
}

