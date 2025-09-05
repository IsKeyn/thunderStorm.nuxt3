import { ref } from "vue";

import { notifications } from '@/composables/notifications.js';

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { useNotificationsStore } from '@/stores/notifications';

export function userNotification() {
    const useNotifications = useNotificationsStore();
    const userNotificationModalRef = ref(null);
    const { error } = notifications();

    const getUserNotifications = async () => {
        const response = await sendApiRequest('auth/notification/getCount', 'GET');
        setUserNotification(response);
    }

    const showNotificationModal = () => {
        userNotificationModalRef.value.showModal();
    }

    const setUserNotification = (count) => {
        const notificationsCount = sessionStorage.getItem('notificationsCount');
        useNotifications.currentUserNotificationCount = count;

        if (notificationsCount === null) {
            sessionStorage.setItem('notificationsCount', count);
        }

        if (count > 0 && notificationsCount < count) {
            sessionStorage.setItem('notificationsCount', count);

            let text = '';

            if (count === 1) {
                text = 'У вас одно не прочитанное уведомление';
            } else {
                text = 'У вас ' + count + ' не прочитанных уведомлений';
            }

            const func = showNotificationModal;

            error(text, 60000, '#004d42', false, null, null, true, func);
        }
    }

    return {
        useNotifications,
        userNotificationModalRef,
        showNotificationModal,
        setUserNotification,
        getUserNotifications,
    };
}
