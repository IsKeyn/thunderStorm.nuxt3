<script setup>
const route = useRoute();
const router = useRouter();

const redirectList = ref([
	{
		url: 'test',
		redirectUrl: '/test2',
	}
]);


for (let key in redirectList.value) {
	let preparedUrl = route.fullPath;

	if (preparedUrl[0] === '/') {
		preparedUrl = preparedUrl.slice(1);
	}

	if (preparedUrl[preparedUrl.length - 1] === '/') {
		preparedUrl = preparedUrl.slice(0, -1);
	}

	if (redirectList.value[key].url === preparedUrl) {
		router.push({ path: redirectList.value[key].redirectUrl });
		break;
	}
}

// TODO Перенаправление на 404
</script>

<template>
</template>
