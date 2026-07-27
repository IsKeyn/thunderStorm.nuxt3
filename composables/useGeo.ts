import { api } from '@/composables/api.js';

export const useGeo = () => {
    const { sendApiRequest } = api();

    const country = useState<string | null>('userCountry', () => null);
    const hasError = useState<boolean>('geoError', () => false);

    const fetchCountry = async () => {
        if (country.value !== null) return;

        try {
            const data = await sendApiRequest('user/country', 'GET');
            country.value = data.country;
        } catch (e) {
            console.error('Geo fetch error', e);
            hasError.value = true;
        }
    };

    const isRussia = computed(() => country.value === 'RU' || hasError.value);
    const isUnknown = computed(() => country.value === null && !hasError.value);

    return { country, isRussia, isUnknown, hasError, fetchCountry };
};
