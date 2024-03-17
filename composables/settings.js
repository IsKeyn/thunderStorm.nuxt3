import { useSettingsStore } from '@/stores/settings';

export function settings() {
    const getSettingByCode = (code) => {
        const settingStore = useSettingsStore();

        if (code) {
            return toRaw(settingStore.settings).filter((item) => {
                if (item.code === code) {
                    return true;
                }
            });
        }
    }

    const getSettingFirstValue = (code) => {
        const setting = getSettingByCode(code);

        if (setting && setting.length > 0) {
            return setting[0].value;
        }
    }

    return { getSettingByCode, getSettingFirstValue };
}
