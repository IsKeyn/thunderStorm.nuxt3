export function helper() {
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

    return {
        filterByPairFieldValue,
        cutText,
    };
}
