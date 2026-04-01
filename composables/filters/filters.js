import { useFiltersStore } from '@/stores/filters';
import { helper } from '@/composables/helper.js'

export function filters() {
    const filtersStore = useFiltersStore();
    const { route, router, unionObjWithoutEmptyElements } = helper();

    const queryParams = [
        {
            name: 'search',
            parse: false,
        },
        {
            name: 'by_first_date',
            parse: false,
        },
        {
            name: 'date_min',
            parse: false,
        },
        {
            name: 'date_max',
            parse: false,
        },
        {
            name: 'gamePlatforms',
            parse: true,
        },
        {
            name: 'genres',
            parse: true,
        },
        {
            name: 'companies',
            parse: true,
        },
        {
            name: 'tags',
            parse: true,
        },
        {
            name: 'sort',
            parse: true,
        },
    ];

    const setFilterName = (prefix, entity = null, id = null) => {
        if (entity) prefix += '_' + entity;
        if (id) prefix += '_' + id;

        return prefix;
    };

    const setFilter = (filter, filterName = 'default') => {
        if (!filtersStore.filters[filterName]) {
            filtersStore.filters[filterName] = {};
        }

        filtersStore.filters[filterName] = unionObjWithoutEmptyElements(filtersStore.filters[filterName], filter);
    }

    const clearFilters = (filterName = 'default', setQueryParams = true) => {
        if (setQueryParams) {
            const query = { ...route.query };

            queryParams.forEach((item) => {
                delete query[item.name];
            });

            router.push({ name: route.name, query });

        }

        filtersStore.filters[filterName] = {};
    }

    const setQueryFilters = (filterName) => {
        // При загрузке страницы проверяем get параметры по списку, который является указателем к фильтрам и устанавливаем значения
        queryParams.forEach((item) => {
            if (item.parse) {
                setFilter({ [item.name]: route.query[item.name] ? JSON.parse(route.query[item.name]) : null }, filterName);
            } else {
                setFilter({ [item.name]: route.query[item.name] ?? null }, filterName);
            }
        });
    }

    // Создаем ref для хранения функции refresh
    const refreshFn = ref(null);

    const setRefreshForFilters = (fn) => {
        refreshFn.value = fn;
    }

    const checkHasFilters = (filterName) => {
        let result = false;

        const checkList = [
            'date_min',
            'date_max',
            'gamePlatforms',
            'genres',
            'companies',
            'tags',
        ];

        if (!filtersStore.filters[filterName]) return result;
        if (filtersStore.filters[filterName] && Object.keys(filtersStore.filters[filterName]).length === 0) return result;

        for (let key in checkList) {
            if (filtersStore.filters[filterName].hasOwnProperty(checkList[key])) {
                result = true;
                break;
            }
        }

        return result;
    }

    return {
        setFilterName,
        setFilter,
        clearFilters,
        setQueryFilters,
        setRefreshForFilters,
        checkHasFilters,
    };
}
