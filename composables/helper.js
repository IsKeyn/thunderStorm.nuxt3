export function helper() {
    const filterByPairFieldValue = (obj, field, filteredValue) => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value[field] === filteredValue) {
                acc[key] = value;
            }
            return acc;
        }, {});
    }

    return {
        filterByPairFieldValue,
    };
}
