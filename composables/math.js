export function math() {
    const mbToByte = (mbCount) => {
        const mbyte = Math.pow(2, 20);
        return mbyte * mbCount;
    }

    return { mbToByte };
}
