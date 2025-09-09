import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
    state: () => {
        return {
            notifications: [],
            currentUserNotificationCount: null,
            currentUserMessagesCount: null,
        }
    },
    actions: {
        setNotifications(value) {
            this.notifications = value;
        },
        addNotification(value) {
            this.notifications.push(value);
        },
        changeNotification(data) {
            const { key, prop, value } = data;

            if (this.notifications[key]) {
                this.notifications[key][prop] = value;
            }
        },
    },
})
