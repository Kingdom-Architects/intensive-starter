import { useState, useEffect } from 'react';
import { Observable } from 'rxjs';
import { AppError } from '../AppError';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noOp = () => {};

function useObservable<T>(observable: Observable<T>, error?: (x: unknown) => void): T | undefined {
  const [state, setState] = useState<T>();
  const [err, setErr] = useState<unknown>();

  useEffect(() => {
    const sub = observable.subscribe(setState, (e) => setErr(e));
    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // the effect only runs once

  useEffect(() => {
    if (err && error) {
      error(err);
    }
  }, [err, error]);

  return state;
}

const useSubscription = <T>(
  observable: Observable<T>,
  next: (x: T) => void,
  error?: (x: unknown) => void,
  complete?: () => void,
): void => {
  useEffect(() => {
    const sub = observable.subscribe(next, error ? error : noOp, complete ? complete : noOp);
    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observable]); // the effect only runs once
};

function useNavHomeOnObservableError<T>(observable: Observable<T>): void {
  useSubscription(observable, noOp, (err) => {
    AppError.unhandledNavToHome(err);
  });
}

export { useObservable, useSubscription, useNavHomeOnObservableError };
