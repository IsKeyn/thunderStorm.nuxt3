vexport function video() {
    const getVideoData = (videoUrl) => {
        const videoData = {};

        if (videoUrl) {
            const parts = new URL(videoUrl);

            if (parts.host) {
                videoData.serviceUrl = parts.host.replace('www.', '');

                switch (videoData.serviceUrl) {
                    case 'youtube.com':
                    case 'youtu.be':
                        if (parts.search) {
                            const getParams = parts.search.replace('?','')
                                .split('&')
                                .reduce(
                                    function(p,e){
                                        var a = e.split('=');
                                        p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                                        return p;
                                    },
                                    {}
                                );

                            if (getParams.v) {
                                videoData.id = getParams.v;
                            } else {
                                if (getParams.vi) {
                                    videoData.id = getParams.vi;
                                }
                            }
                        }

                        if (!videoData.id && parts.pathname) {
                            if (parts.pathname[parts.pathname.length - 1] === '/') {
                                parts.pathname = parts.pathname.slice(0, -1);
                            }

                            const linkParts = parts.pathname.split('/');
                            videoData.id = linkParts[linkParts.length - 1];
                        }
                        break;

                    case 'rutube.ru':
                        if (parts.pathname[parts.pathname.length - 1] === '/') {
                            parts.pathname = parts.pathname.slice(0, -1);
                        }

                        if (parts.pathname) {
                            const linkParts = parts.pathname.split('/');
                            videoData.id = linkParts[linkParts.length - 1];
                        }
                        break;

                    case 'vimeo.com':
                    case 'player.vimeo.com':
                        const vimeoParseUrlResult = videoUrl.match('#(?:https?://)?(?:www.)?(?:player.)?vimeo.com/(?:[a-z]*/)*([0-9]{6,11})[?]?.*#'); // TODO исправить регулярку

                        if (vimeoParseUrlResult) {
                            videoData.id = vimeoParseUrlResult[1];
                        }
                        break;
                }
            }
        }

        return videoData;
    }

    return { getVideoData };
}
