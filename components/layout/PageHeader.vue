<script setup>
import BreadCrumbs from '@/components/menu/BreadCrumbs.vue';

const props = defineProps({
	title: {
		type: String,
		default: null,
	},
	breadCrumbs: {
		type: Array,
		default: [],
	},
	showMainPageInBreadCrumbs: {
		type: Boolean,
		default: true,
	}
});

const breadCrumbsArray = computed(() => {
	const mainPage = [];

	if (props.showMainPageInBreadCrumbs) {
		mainPage.push({
			name: 'Главная',
			href: '/',
		});
	}

	return mainPage.concat(props.breadCrumbs);
});
</script>

<template>
	<div class="mb-2">
		<div class="grid grid-cols-12">
			<div class="col-span-6">
				<h2 class="title">{{ title }}</h2>
			</div>
			<div class="col-span-6 text-right">
				<BreadCrumbs :breadCrumbs="breadCrumbsArray" />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
