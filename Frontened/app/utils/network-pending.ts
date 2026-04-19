type PendingListener = (pendingCount: number) => void;

let pendingCount = 0;
const listeners = new Set<PendingListener>();

function emitPendingCount() {
  listeners.forEach((listener) => listener(pendingCount));
}

export function beginPendingRequest() {
  pendingCount += 1;
  emitPendingCount();
}

export function finishPendingRequest() {
  pendingCount = Math.max(0, pendingCount - 1);
  emitPendingCount();
}

export function subscribePendingRequests(listener: PendingListener) {
  listeners.add(listener);
  listener(pendingCount);

  return () => {
    listeners.delete(listener);
  };
}
