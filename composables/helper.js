export function helper() {
    const route = useRoute();
    const router = useRouter();

    const filterByPairFieldValue = (obj, field, filteredValue) => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value[field] === filteredValue) {
                acc[key] = value;
            }
            return acc;
        }, {});
    }

    const cutText = (text, maxLength) => {
        if (!text) return '';
        if (typeof text !== 'string') {
            text = String(text);
        }

        return text.length > maxLength
            ? text.substring(0, maxLength) + '...'
            : text;
    }

    const findElementById = (array, targetId) => {
        return array.find(item => item.id === targetId);
    }

    return {
        route,
        router,
        filterByPairFieldValue,
        cutText,
        findElementById,
    };
}
