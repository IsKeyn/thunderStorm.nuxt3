export function api() {
    const apiUrl = computed(() => {
        const runtimeConfig = useRuntimeConfig()
        return runtimeConfig.public.apiUrl;
    });
    return { apiUrl };
}
