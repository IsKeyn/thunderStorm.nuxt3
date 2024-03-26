export function math() {
    const mbToByte = (mbCount) => {
        const mbyte = Math.pow(2, 20);
        return mbyte * mbCount;
    }

    const bytesToMb = (byteCount) => {
        const mbyte = Math.pow(2, 20);
        return byteCount / mbyte;
    }

    return { mbToByte, bytesToMb };
}
