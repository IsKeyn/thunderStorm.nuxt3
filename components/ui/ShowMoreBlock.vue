<script setup>
const props = defineProps({
	names: {
		type: Object,
		default: {
			showMore: 'Показать больше ',
			showLess: 'Показать меньше ',
		},
	},
});

const showContent = ref(false);

const toggleContent = () => {
	showContent.value = !showContent.value;
}
</script>

<template>
	<slot />
	<div v-show="showContent">
		<slot name="hiddenContent" />
	</div>
	<span
			v-if="$slots.hiddenContent"
			class="block cursor-pointer mt-1"
			@click="toggleContent()"
	>
		<template v-if="!showContent">
			{{ props.names.showMore }}<font-awesome-icon icon="fa-solid fa-angle-down" />
		</template>
		<template v-else>
			{{ props.names.showLess }}<font-awesome-icon icon="fa-solid fa-angle-up" />
		</template>
	</span>
</template>
