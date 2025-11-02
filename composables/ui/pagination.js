export function pagination(perPageProps) {
    const route = useRoute();

    const page = ref(route.query.page ? Number(route.query.page) : 1);
    const perPageCount = ref(route.query.perPage ? Number(route.query.perPage) : (perPageProps ? perPageProps : 10));

    const changePage = async (p) => {
        page.value = p;
        refresh();
    }

    const setPerPage = (count) => {
        perPageCount.value = count;
        refresh();
    }

    return {
        page,
        perPageCount,
        changePage,
        setPerPage,
    };
}
