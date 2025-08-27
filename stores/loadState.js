import { defineStore } from 'pinia'

export const useLoadStateStore = defineStore('loadState', {
    state: () => {
        return {
            loadList: {},
        }
    },
    actions: {
        setLoadList(value) {
            this.loadList = value;
        },
        addLoadList(value) {
            this.loadList.push(value);
        },
        changeLoadList(data) {
            const { key, prop, value } = data;

            if (this.loadList[key]) {
                this.loadList[key][prop] = value;
            }
        },
    },
})
