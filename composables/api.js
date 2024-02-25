export function api() {
    const apiUrl = computed(() => {
        const runtimeConfig = useRuntimeConfig();
        return runtimeConfig.public.apiUrl + '/api/';
    });

    const backendUrl = computed(() => {
        const runtimeConfig = useRuntimeConfig();
        return runtimeConfig.public.apiUrl;
    });

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

    return { apiUrl, backendUrl, errorHandler };
}
