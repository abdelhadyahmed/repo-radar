import { useEffect, useState } from 'react';

/**
 * Follows `value`, but only once it has held still for `delayMs`.
 *
 * Each change restarts the timer through the effect cleanup, so a burst of
 * updates settles into a single result.
 */
export function useDebounce<T>(value: T, delayMs: number): T {
    const [settled, setSettled] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setSettled(value), delayMs);
        return () => clearTimeout(timer);
    }, [value, delayMs]);

    return settled;
}
