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

    const setFilterName = (argList = []) => {
        let name = 'filter';
        if (argList.length > 0) argList.forEach((item) => name += '_' + item );
        return name;
    };

    const storeDefaultFilters = (filterName = 'default', defaultFilter = {}) => {
        filtersStore.filters[filterName + '_defaultFilters'] = defaultFilter;
    }

    const setFilter = (filter, filterName = 'default') => {
        if (!filtersStore.filters[filterName]) {
            filtersStore.filters[filterName] = {};
        }

        filtersStore.filters[filterName] = unionObjWithoutEmptyElements(filtersStore.filters[filterName], filter);
    }

    const unionQueryParamsAndUsedFilter = (usedFilters) => {
        if (usedFilters.length > 0) {
            usedFilters.forEach((item) => {
                if (queryParams.filter((i) => i.name === item.name).length === 0) {
                    queryParams.push({
                        name: item.name,
                        parse: item?.parse ?? false,
                    });
                }
            });
        }
    }

    const clearFilters = (filterName = 'default', usedFilters = [], setQueryParams = true) => {
        unionQueryParamsAndUsedFilter(usedFilters);

        if (setQueryParams) {
            const query = { ...route.query };

            queryParams.forEach((item) => {
                delete query[item.name];
            });

            router.push({ name: route.name, query });

        }

        filtersStore.filters[filterName] = filtersStore.filters[filterName + '_defaultFilters']
            ? filtersStore.filters[filterName + '_defaultFilters']
            : {};
    }

    const setQueryFilters = (filterName, usedFilters = [], defaultFilters = {}) => {
        unionQueryParamsAndUsedFilter(usedFilters);

        // При загрузке страницы проверяем get параметры по списку, который является указателем к фильтрам и устанавливаем значения
        queryParams.forEach((item) => {
            let filter = {};
            filter[item.name] = null;

            if (route.query[item.name]) {
                filter[item.name] = item.parse ? JSON.parse(route.query[item.name]) : route.query[item.name];
            } else if (defaultFilters.hasOwnProperty(item.name)) {
                filter[item.name] = defaultFilters[item.name];
            }

            setFilter(filter, filterName);
        });
    }

    // Создаем ref для хранения функции refresh
    const refreshFn = ref(null);

    const setRefreshForFilters = (fn) => {
        refreshFn.value = fn;
    }

    const checkHasFilters = (filterName, usedFilters = []) => {
        let result = false;

        const checkList = [
            'date_min',
            'date_max',
            'gamePlatforms',
            'genres',
            'companies',
            'tags',
        ];

        if (usedFilters.length > 0) {
            usedFilters.forEach((item) => {
                if (checkList.filter((i) => i === item.name).length === 0 && item.type !== 'hidden') {
                    checkList.push(item.name);
                }
            });
        }

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
        storeDefaultFilters,
        setFilter,
        clearFilters,
        setQueryFilters,
        setRefreshForFilters,
        checkHasFilters,
    };
}
