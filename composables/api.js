export function api() {
    const apiUrl = computed(() => {
        const runtimeConfig = useRuntimeConfig();
        return runtimeConfig.public.apiUrl + '/api/';
    });

    const backendUrl = computed(() => {
        const runtimeConfig = useRuntimeConfig();
        return runtimeConfig.public.apiUrl;
    });

    const publicUrl = computed(() => {
        const runtimeConfig = useRuntimeConfig();
        return runtimeConfig.public.url;
    });

    const sessionCookieName = computed(() => {
        const runtimeConfig = useRuntimeConfig();
        return runtimeConfig.public.sessionCookieName;
    });

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

    const sendApiRequest = async (url, method, body) => {
        responseErrors.value = {};

        const request = `${apiUrl.value}${url}`;
        const headers = { Accept: 'application/json' };

        if (method === 'POST') {
            const csrfCookie = await getCsrfCookie();
            headers['X-XSRF-TOKEN'] = csrfCookie.value;
        }

        const opts = {
            method,
            credentials: 'include',
            headers,
        };

        if (method === 'POST') {
            opts.body = body;
        }

        try {
            return await $fetch(request, opts);
        } catch (e) {
            responseErrors.value = errorHandler(e)
        }
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
        preparedRequestBody
    };
}
