import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
    state: () => {
        return {
            settings: [],
        }
    },
    actions: {
        setSettings(value) {
            this.settings = value;
        },
        addsetting(value) {
            this.settings.push(value);
        },
        changeSetting(data) {
            const { key, prop, value } = data;

            if (this.settings[key]) {
                this.settings[key][prop] = value;
            }
        },
    },
})
