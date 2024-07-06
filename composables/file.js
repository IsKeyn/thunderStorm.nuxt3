export function file() {
    const imageExt = [
        'gif',
        'jpg',
        'jpeg',
        'png',
        'webp',
    ];

    const videoExt = [
        'mp4',
        'm4v',
    ];

    const audioExt = [
        'mp4',
        'm4v',
    ];

    const getFileType = (fileName) => {
        if (fileName) {
            const fileExt = fileName.match(/\.([^.]+)$|$/)[1];

            if (imageExt.includes(fileExt.toLowerCase())) {
                return 'image';
            } else if (videoExt.includes(fileExt.toLowerCase())) {
                return 'video';
            }
        } else {
            return false;
        }
    }

    return { imageExt, videoExt, audioExt, getFileType };
}
