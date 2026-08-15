import { notifications } from '@/composables/notifications.js';

export function errorHandler() {
    const { alert, error } = notifications();

    const show = (response) => {
        if (!response) {
            error('Ответ от сервера пуст');
            return;
        }

        if (response.error) {
            error(response.error);
            return;
        }

        if (response.message) {
            alert(response.message);
            return;
        }

        if (response?.status === 'error' && response?.status_message) {
            error(response.status_message);
            return;
        }
    }

    return {
        show
    };
}
