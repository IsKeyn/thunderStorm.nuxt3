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
        'mp3',
        'wav',
    ];

    const getFileType = (fileName) => {
        if (fileName) {
            const fileExt = fileName.match(/\.([^.]+)$|$/)[1];

            if (fileExt) {
                if (imageExt.includes(fileExt.toLowerCase())) {
                    return 'image';
                } else if (videoExt.includes(fileExt.toLowerCase())) {
                    return 'video';
                } else if (audioExt.includes(fileExt.toLowerCase())) {
                    return 'audio';
                }
            }
        } else {
            return false;
        }
    }

    return { imageExt, videoExt, audioExt, getFileType };
}
