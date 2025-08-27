export function system() {
    let funcTimeout = null;

    const funcDelay = (func, timeout = 500) => {
        clearTimeout(funcTimeout);

        funcTimeout = setTimeout(() => {
            func();
        }, timeout);
    };

    return {
        funcDelay,
    };
}
