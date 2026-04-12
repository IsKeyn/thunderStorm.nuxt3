export function helper() {
    const route = useRoute();
    const router = useRouter();

    const filterByPairFieldValue = (obj, field, filteredValue, singleValue = false) => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value[field] === filteredValue) {
                if (singleValue) {
                    acc = value;
                } else {
                    acc[key] = value;
                }
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

    const unionObjWithoutEmptyElements = (obj1, obj2) => {
        return  Object.entries({ ...obj1, ...obj2 }).reduce((acc, [key, value]) => {
            if (
                value !== ''
                && value !== null
                && value !== undefined
                && (
                    typeof value === 'object'
                        ? (value.hasOwnProperty('length') ? value.length > 0 : Object.keys(value).length > 0)
                        : true
                )
            ) {
                acc[key] = value;
            }
            return acc;
        }, {});
    }

    const setQueryParam = (key, value) => {
        const query = { ...route.query };

        if (value && value !== '' && value !== null && value !== undefined) {
            query[key] = value;
        } else if (query[key]) {
            delete query[key];
        }

        router.push({ name: route.name, query });
    }

    const setQueryParams = (data) => {
        const query = { ...route.query };

        if (data && data.length) {
            data.forEach((item) => {
                if (
                    item.value
                    && item.value !== ''
                    && item.value !== null
                    && item.value !== undefined
                ) {
                    query[item.key] = item.value;
                } else if (query[item.key]) {
                    delete query[item.key];
                }
            });

            router.push({ name: route.name, query });

        }
    }

    return {
        route,
        router,
        filterByPairFieldValue,
        cutText,
        findElementById,
        unionObjWithoutEmptyElements,
        setQueryParam,
        setQueryParams,
    };
}
