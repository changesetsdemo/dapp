import produce, { Draft, nothing, freeze } from 'immer';
import { useState, useReducer, useCallback, useMemo, Dispatch } from 'react';

export type Reducer<S = unknown, A = unknown> = (
  draftState: Draft<S>,
  action: A
) => void | (S extends undefined ? typeof nothing : S);
export type DraftFunction<S> = (draft: Draft<S>) => void;
export type Updater<S> = (arg: S | DraftFunction<S>) => void;
export type ImmerHook<S> = [S, Updater<S>];
export function useImmer<S = unknown>(initialValue: S | (() => S)): ImmerHook<S>;

export function useImmer(initialValue: unknown) {
  const [val, updateValue] = useState(() =>
    freeze(typeof initialValue === 'function' ? initialValue() : initialValue, true)
  );
  return [
    val,
    useCallback((updater: any) => {
      if (typeof updater === 'function') updateValue(produce(updater));
      else updateValue(freeze(updater));
    }, []),
  ];
}

export function useImmerReducer<S = unknown, A = unknown>(
  reducer: Reducer<S, A>,
  initialState: S,
  initialAction?: (initial: unknown) => S
): [S, Dispatch<A>];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useImmerReducer(reducer: any, initialState: any, initialAction: any) {
  const cachedReducer = useMemo(() => produce(reducer), [reducer]);
  return useReducer(cachedReducer, initialState as unknown, initialAction);
}
