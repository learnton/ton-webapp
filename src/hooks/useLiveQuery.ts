/* eslint-disable @typescript-eslint/no-unsafe-return */

import { liveQuery, Subscription } from "dexie";
import { useEffect, useRef, useState } from "react";

import { AuthDB, CacheDB, DidDB } from "@/utils";

type ParamDB = DidDB | CacheDB | AuthDB;

export interface LiveQueryFn<T, Param extends ParamDB> {
  (db: Param, ...args: never[]): Promise<T>;
}

type PopFirst<T extends unknown[]> = T extends [ParamDB, ...infer N] ? N : [];

type Awaited<T> = T extends Promise<infer U> ? U : T;

type Tracker<P extends ParamDB, F> = {
  fn: F | null | undefined;
  paramDB: P | null | undefined;
  serialized: string | null;
  subscriber: Subscription | null;
  id: string | null;
};

type TrackerRef<P extends ParamDB, F> = {
  current: Tracker<P, F>;
};

function subscribe<
  T extends Awaited<ReturnType<F>>,
  P extends ParamDB,
  F extends LiveQueryFn<T, P>
>(
  tracker: TrackerRef<P, F>,
  setValue: (value: Awaited<ReturnType<F>>) => void,
  params?: PopFirst<Parameters<F>> | null
) {
  unsubscribe(tracker);

  tracker.current.subscriber = liveQuery(async () => {
    if (tracker.current.fn && tracker.current.paramDB && params) {
      const fn = tracker.current.fn;

      await fn(tracker.current.paramDB, ...params).then(setValue);
    }
  }).subscribe();
}

function unsubscribe<
  T extends Awaited<ReturnType<F>>,
  P extends ParamDB,
  F extends LiveQueryFn<T, P>
>(tracker: TrackerRef<P, F>) {
  if (tracker.current.subscriber) {
    tracker.current.subscriber.unsubscribe();
    tracker.current.subscriber = null;
  }
}

export function useLiveQuery<
  T extends Awaited<ReturnType<F>>,
  P extends ParamDB,
  F extends LiveQueryFn<T, P>
>(
  fn: F,
  paramDB?: P | null,
  params?: PopFirst<Parameters<F>> | null
): Awaited<ReturnType<F>> | undefined {
  const trackerRef = useRef<Tracker<P, F>>({
    fn: null,
    paramDB: null,
    serialized: null,
    subscriber: null,
    id: null,
  });
  const [value, setValue] = useState<Awaited<ReturnType<F>>>();

  useEffect(() => {
    return () => unsubscribe(trackerRef);
  }, []);

  useEffect(() => {
    const serialized = JSON.stringify(params);

    if (
      trackerRef.current.serialized !== serialized ||
      trackerRef.current.fn !== fn ||
      trackerRef.current.paramDB !== paramDB
    ) {
      trackerRef.current.fn = fn;
      trackerRef.current.paramDB = paramDB;
      trackerRef.current.serialized = serialized;

      subscribe(trackerRef, setValue, params);
    }
  }, [fn, paramDB, params]);

  return value;
}
