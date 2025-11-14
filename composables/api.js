import { computed, ref } from 'vue';
import { hasInjectionContext, useCookie } from '#imports';
import { useLoadStateStore } from '@/stores/loadState';

export function api() {
    const runtimeConfig = useRuntimeConfig();

    const apiUrl = computed(() => `${runtimeConfig.public.apiUrl}/api/`);

    const backendUrl = computed(() => runtimeConfig.public.apiUrl);

    const publicUrl = computed(() => runtimeConfig.public.url);

    const sessionCookieName = computed(() => runtimeConfig.public.sessionCookieName);

    const getCsrfCookie = async () => {
        if (useCookie('XSRF-TOKEN').value) {
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

    const errorHandler = async (e) => {
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
                    error('Серверная ошибка', 3000);
                    break;
                case 401:
                    error('Для выполенния запроса необходимо авторизоваться', 3000);
                    break;
                case 404:
                    error('Ошибка 404', 3000);
                    break;
                case 405:
                    error('Ошибка 405', 3000);
                    break;
                default:
                    error('Повтори попытку', 3000);
                    break;
            }

            if (e.response._data?.message) {
                error(e.response._data?.message, 5000);
            }
        } else {
            console.log(e);
        }

        return errors;
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
        lazy = false
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

            const request = `${apiUrl.value}${url}`;
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

            responseErrors.value = errorHandler(e)
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
        preparedRequestBody,
        handleBackendUrl
    };
}
