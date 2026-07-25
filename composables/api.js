import { computed, ref } from 'vue';

import { useRequestHeaders } from '#imports';

import { useCookie } from '#imports';
import { useLoadStateStore } from '@/stores/loadState';

export function api() {
    const runtimeConfig = useRuntimeConfig();

    const apiUrl = computed(() => `${runtimeConfig.public.apiUrl}/api/`);

    const backendUrl = computed(() => runtimeConfig.public.apiUrl);

    const publicUrl = computed(() => runtimeConfig.public.url);

    const sessionCookieName = computed(() => runtimeConfig.public.sessionCookieName);

    const getCsrfCookie = async (updateToken = false) => {
        const xsrfCookie = useCookie('XSRF-TOKEN');

        // Если токен уже есть и нас не просят обновлять - возвращаем его
        if (!updateToken && xsrfCookie.value) {
            // return xsrfCookie.value;
            return xsrfCookie;
        }

        try {
            // На сервере нам нужно передать существующие куки запроса,
            // чтобы Laravel понял, кто мы такие (если сессия уже начата)
            const headers = {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            };

            if (process.server) {
                // Передаем куки текущего запроса пользователя на бэкенд
                headers.Cookie = useRequestHeaders(['cookie']).cookie;
            }

            await $fetch(`${backendUrl.value}/sanctum/csrf-cookie`, {
                method: 'GET',
                credentials: 'include',
                headers: headers,
            });

            // ВАЖНО: После запроса на сервере кука XSRF-TOKEN может не появиться
            // в useCookie автоматически, если она пришла в Set-Cookie заголовке.
            // Однако, Laravel Sanctum обычно требует, чтобы мы сами взяли токен из куки.

            // Повторная проверка куки. Если на сервере useCookie не подхватил Set-Cookie,
            // придется парсить заголовки ответа вручную, но в Nuxt 3 useCookie должен работать,
            // если настроен правильно.

            // return useCookie('XSRF-TOKEN').value;
            return useCookie('XSRF-TOKEN');

        } catch (e) {
            errorHandler(e);
            return null;
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
                    if (showError) {
                        if (e.response?._data?.error) {
                            error(e.response?._data?.error)
                        } else {
                            error('Повтори попытку', 3000);
                        }
                    }
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

            // Если мы на сервере, мы должны передать куки клиента на бэкенд
            if (process.server) {
                const cookies = useRequestHeaders(['cookie']).cookie;
                if (cookies) {
                    headers.Cookie = cookies;
                }
            }

            let csrfToken = null;

            if (method === 'POST' || method === 'DELETE' || method === 'PUT') {
                // Получаем токен. Функция getCsrfCookie должна убедиться, что он есть.
                csrfToken = await getCsrfCookie();
                if (csrfToken) {
                    headers['X-XSRF-TOKEN'] = csrfToken.value;
                }
            } else if (method === 'GET') {
                const sessionCookie = useCookie(sessionCookieName.value);
                headers.Cookie = `${sessionCookieName.value}=${sessionCookie.value};`;
            }

            const opts = {
                method,
                headers,
                credentials: 'include',
            };

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

            responseErrors.value = errorHandler(e, show404page, showError);

            if (showError) {
                return 'throwError';
            }
        }
    }

    const handleBackendUrl = (src, reverse = false) => {
        return reverse ? src.replace(backendUrl.value, '{backend-url}') : src.replace('http://localhost:8000', backendUrl.value).replace('{backend-url}', backendUrl.value);
    }

    const responseHandler = async (
        response,
        from = null,
        successMessage = null,

    ) => {
        const notificationsModule = await import("@/composables/notifications.js");
        const { alert, error } = notificationsModule.notifications();

        if (!response) {
            error(
                'Ответ от сервера пуст',
                null,
                null,
                false,
                from,
                null,
                false,
                null
            );

            return;
        }

        if (response.error) {
            error(
                response.error,
                null,
                null,
                false,
                from,
                null,
                false,
                null
            );

            return;
        }

        if (response.status) {
            error(
                response.status,
                2000,
                '#004d42',
                false,
                from,
                null,
                false,
                null
            );

            return;
        }

        if (response.message) {
            alert(
                response.message,
                10000
            );

            return;
        }

        alert(successMessage);
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
        handleBackendUrl,
        responseHandler,
    };
}
