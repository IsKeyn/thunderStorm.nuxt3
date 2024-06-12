export function developerTools() {
    const devErrorLog = (params) => {
        if (params) {
            if (params.name && params.fileName) {
                console.log(`ThunderStorm: ERROR: Message: ${params.name} File: ${params.fileName}`);
            } else {
                console.table(params);
            }
        }
    }

    return { devErrorLog };
}
