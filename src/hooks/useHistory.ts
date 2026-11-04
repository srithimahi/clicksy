import { useCallback, useState } from "react";

export function useHistory<T>(initialValue: T, limit = 50) {
    const [state, setState] = useState({
        history: [initialValue],
        index: 0,
    });

    const push = useCallback((value: T) => {
        setState((previous) => {
            const next = [
                ...previous.history.slice(0, previous.index + 1),
                value,
            ].slice(-limit);

            return {
                history: next,
                index: next.length - 1,
            };
        });
    }, [limit]);

    const undo = useCallback(() => {
        setState((previous) => ({
            ...previous,
            index: Math.max(0, previous.index - 1),
        }));
    }, []);

    const redo = useCallback(() => {
        setState((previous) => ({
            ...previous,
            index: Math.min(
                previous.history.length - 1,
                previous.index + 1
            ),
        }));
    }, []);

    return {
        current: state.history[state.index],
        push,
        undo,
        redo,
        canUndo: state.index > 0,
        canRedo: state.index < state.history.length - 1,
    }
}