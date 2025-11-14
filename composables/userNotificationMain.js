import { ref } from "vue";

import { notifications } from '@/composables/notifications.js';

import { api } from '@/composables/api.js';

import { useNotificationsStore } from '@/stores/notifications';

export function userNotificationMain() {
    const { sendApiRequest } = api();
    const useNotifications = useNotificationsStore();
    const userNotificationModalRef = ref(null);
    const userMessagesModalRef = ref(null);
    const { error } = notifications();

    const getAllNotifications = async () => {
        const response = await sendApiRequest('auth/allNotifications/get', 'GET');
        setUserNotification(response);
    }

    const showNotificationModal = () => {
        userNotificationModalRef.value.showModal();
    }

    const showUserMessagesModal = () => {
        userMessagesModalRef.value.showModal();
    }

    const setUserNotification = (data) => {
        if (data?.notification_count) {
            const notificationsCount = sessionStorage.getItem('notificationsCount');
            useNotifications.currentUserNotificationCount = data.notification_count;

            if (notificationsCount === null) {
                sessionStorage.setItem('notificationsCount', data.notification_count);
            }

            if (data.notification_count > 0 && notificationsCount < data.notification_count) {
                sessionStorage.setItem('notificationsCount', data.notification_count);

                let text = '';

                if (data.notification_count === 1) {
                    text = 'У вас одно не прочитанное уведомление';
                } else {
                    text = 'У вас ' + data.notification_count + ' не прочитанных уведомлений';
                }

                const func = showNotificationModal;

                error(text, 60000, '#004d42', false, null, null, true, func);
            }
        }

        if (data?.message_count) {
            const sessionStorageName = 'messagesCount';

            const messagesCount = sessionStorage.getItem(sessionStorageName);
            useNotifications.currentUserMessagesCount = data.message_count;

            if (messagesCount === null) {
                sessionStorage.setItem(sessionStorageName, data.message_count);
            }

            if (data.message_count > 0 && messagesCount < data.message_count) {
                sessionStorage.setItem(sessionStorageName, data.message_count);

                let text = '';

                if (data.message_count === 1) {
                    text = 'У вас одно не прочитанное сообщение';
                } else {
                    text = 'У вас ' + data.message_count + ' не прочитанных сообщений';
                }

                const func = showUserMessagesModal;

                error(text, 60000, '#004d42', false, null, null, true, func);
            }
        }
    }

    return {
        useNotifications,
        userNotificationModalRef,
        userMessagesModalRef,
        getAllNotifications,
        showNotificationModal,
        showUserMessagesModal,
        setUserNotification,
    };
}
