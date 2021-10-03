export function debounce(fn: () => void, timeout: number) {
  let timerId: number | undefined = undefined;

  return () => {
    if (timerId) window.clearTimeout(timerId);

    timerId = window.setTimeout(() => { fn(); }, timeout);
  };
}
