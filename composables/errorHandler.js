import { notifications } from '@/composables/notifications.js';

export function errorHandler() {
    const { alert, error } = notifications();

    const show = (response, resultMessage = null, func = null) => {
        // Ошибки из response.errors обрабатываются в sendApiRequest
        if (response === 'throwError') {
            return;
        }

        if (!response) {
            error('Ответ от сервера пуст');
            return;
        }

        if (response.error) {
            error(response.error);
            return;
        }

        if (response?.status === 'error' && response?.status_message) {
            error(response.status_message);
            return;
        }

        if (response.message) {
            alert(response.message, 10000);
        } else if (resultMessage) {
            alert(resultMessage, 10000);
        }

        if (func) {
            func();
        }
    }

    return {
        show
    };
}
