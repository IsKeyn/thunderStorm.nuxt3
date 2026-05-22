import { computed, ref } from 'vue';
import { useCookie } from '#imports';
import { useLoadStateStore } from '@/stores/loadState';

export function api() {
    const runtimeConfig = useRuntimeConfig();

    const apiUrl = computed(() => `${runtimeConfig.public.apiUrl}/api/`);

    const backendUrl = computed(() => runtimeConfig.public.apiUrl);

    const publicUrl = computed(() => runtimeConfig.public.url);

    const sessionCookieName = computed(() => runtimeConfig.public.sessionCookieName);

    const getCsrfCookie = async (updateToken = false) => {
        if (!updateToken && useCookie('XSRF-TOKEN').value) {
            return useCookie('XSRF-TOKEN');
        } else {
            try {
                await $fetch(
                    `${backendUrl.value}/sanctum/csrf-cookie`,
                    {
                        withCredentials: true, // Отправлять куки
                        credentials: 'include', // Сохранять куки
                        headers: {
                            Accept: 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    },
                );

                return useCookie('XSRF-TOKEN');
            } catch (e) {
                errorHandler(e)
            }
        }
    };

    const errorHandler = async (e, show404page = false, showError = true) => {
        const notificationsModule = await import("@/composables/notifications.js");
        const { alert, error } = notificationsModule.notifications();

        let errors = {};

        if (e && e.response) {
            switch (e.response.status) {
                case 422:
                    if (e.response._data.errors) {
                        errors = e.response._data.errors;
                    }
                    break;
                case 500:
                    if (showError) error('Серверная ошибка', 3000);
                    break;
                case 401:
                    error('Для выполенния запроса необходимо авторизоваться', 3000);
                    break;
                case 404:
                    if (show404page) {
                        show404pageFunc();
                    } else {
                        if (showError) error('Ошибка 404', 3000);
                    }
                    break;
                case 405:
                    if (showError)  error('Ошибка 405', 3000);
                    break;
                default:
                    if (showError) error('Повтори попытку', 3000);
                    break;
            }

            if (showError) {
                if (e.response._data?.errors && Object.keys(e.response._data?.errors).length) {
                    for (const [key, err] of Object.entries(e.response._data?.errors)) {
                        if (err !== null && typeof err === 'object') {
                            err.forEach((message) => {
                                error(message);
                            });
                        } else {
                            error(err);
                        }
                    }
                } else if (e.response._data?.message) {
                    error(e.response._data?.message);
                }
            }
        } else {
            console.log(e);
        }

        return errors;
    }

    const show404pageFunc = () => {
        if (process.client) {
            showError({statusCode: 404, statusMessage: 'Page Not Found'});
        } else if (process.server) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Page Not Found'
            });
        }
    }

    const preparedRequestBody = (form) => {
        const returnData = {};

        for (const formKey in form) {
            returnData[formKey] = form[formKey].value;
        }

        return returnData;
    };
    const responseErrors = ref({});

    const sendApiRequest = async (
        url,
        method,
        body,
        requestName = null,
        preloaderType = null, // fullscreen, fullscreenTransparent, small
        loadListType = 'useAsyncData',
        lazy = false,
        show404page = false,
        customRequestUrl = null,
        showError = true,
    ) => {
        const loadState = useLoadStateStore();

        responseErrors.value = {};

        try {
            /* Использование loadList */
            if (requestName) {
                loadState.loadList[requestName] = {
                    name: requestName,
                    type: loadListType,
                    preloaderType,
                    status: 'load',
                };
            }

            const request = customRequestUrl ? customRequestUrl : `${apiUrl.value}${url}`;
            const headers = {
                Accept: 'application/json',
                Referer: publicUrl.value,
            };

            if (method === 'POST' || method === 'DELETE' || method === 'PUT') {
                const csrfCookie = await getCsrfCookie();
                headers['X-XSRF-TOKEN'] = csrfCookie.value;
            } else if (method === 'GET') {
                const sessionCookie = useCookie(sessionCookieName.value);
                headers.Cookie = `${sessionCookieName.value}=${sessionCookie.value};`;
            }

            const opts = {
                method,
                credentials: 'include',
                headers,
            };

            /* body - для POST подобных запросов, query - для GET запросов */
            if (method === 'POST' || method === 'DELETE' || method === 'PUT') {
                opts.body = body;
            } else if (method === 'GET') {
                opts.query = body;
            }

            let response = null;

            if (lazy === true) {
                const { pending, data, error } = useLazyFetch(request, opts);
                response = data;
            } else {
                response = await $fetch(request, opts);
            }

            if (response) {
                if (requestName && loadState.loadList[requestName]) {
                    loadState.loadList[requestName].status = 'finish';
                }

                return response;
            } else {
                if (requestName && loadState.loadList[requestName]) {
                    loadState.loadList[requestName].status = 'finish';
                }
            }
        } catch (e) {
            if (requestName && loadState.loadList[requestName]) {
                loadState.loadList[requestName].status = 'error';
            }

            responseErrors.value = errorHandler(e, show404page, showError)
        }
    }

    const handleBackendUrl = (src, reverse = false) => {
        return reverse ? src.replace(backendUrl.value, '{backend-url}') : src.replace('http://localhost:8000', backendUrl.value).replace('{backend-url}', backendUrl.value);
    }

    return {
        apiUrl,
        backendUrl,
        publicUrl,
        sessionCookieName,
        getCsrfCookie,
        sendApiRequest,
        responseErrors,
        errorHandler,
        show404pageFunc,
        preparedRequestBody,
        handleBackendUrl
    };
}
