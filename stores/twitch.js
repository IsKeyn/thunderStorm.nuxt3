import { defineStore } from 'pinia'

export const useTwitchStore = defineStore('twitch', {
    state: () => {
        return {
            streamersOnline: {},
        }
    },
})
