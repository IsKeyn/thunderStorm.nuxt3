<script setup>
const emit = defineEmits(['clickFunc']);

const props = defineProps({
	data: {
		type: Object,
		default: {},
		required: true,
	},
});

const showMessage = ref(true);

const toggleMessage = () => {
	showMessage.value = !showMessage.value;
}
</script>

<template>
	<div class="side-button">
		<nuxt-link
				v-if="data.url"
				:to="data.url"
				target="_blank"
		>
			<button>
				<template v-if="showMessage">{{ data.message }}</template> <font-awesome-icon v-if="data.icon" :icon="data.icon" />
			</button>
		</nuxt-link>
		<button v-else @click="emit('clickFunc')">
			<template v-if="showMessage">{{ data.message }}</template> <font-awesome-icon v-if="data.icon" :icon="data.icon" />
		</button>
	</div>
</template>

<style lang="scss" scoped>
.side-button {
	@apply
		hidden lg:block fixed top-[45%]
		w-[18rem]
		text-center
		bg-[var(--main-bg-color)]
		pt-[0.6rem] pr-0 pb-[0.6rem] pl-0
		whitespace-nowrap
		shadow
	;

	right: calc(-9rem + 1.3rem);
	transform: rotate(-90deg);

	a {
		@apply text-[var(--main-text-color)];

		&:hover {
			@apply text-[var(--main-title-color)];
		}
	}
}
</style>
