export function debounce(fn, timeout) {
    let timerId = undefined;
    return () => {
        if (timerId)
            window.clearTimeout(timerId);
        timerId = window.setTimeout(() => { fn(); }, timeout);
    };
}
