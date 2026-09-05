import { helper } from '@/composables/helper.js'

export function pagination(perPageProps) {
    const { route } = helper();

    const page = ref(route.query.page ? Number(route.query.page) : 1);
    const perPage = ref(route.query.perPage ? Number(route.query.perPage) : (perPageProps ? perPageProps : 10));

    // Создаем ref для хранения функции refresh
    const refreshFn = ref(null);

    const scrollAfterLoad = ref(false);

    const setRefresh = (fn) => {
        refreshFn.value = fn;
    }

    const changePage = (p) => {
        page.value = p;
        scrollAfterLoad.value = true;
        refreshFn.value();
    }

    const setPerPage = (count) => {
        perPage.value = count;
        scrollAfterLoad.value = true;
        refreshFn.value();
    }

    return {
        page,
        perPage,
        setRefresh,
        changePage,
        setPerPage,
        scrollAfterLoad,
    };
}
