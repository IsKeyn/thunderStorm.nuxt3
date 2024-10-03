<script setup>
const props = defineProps({
	title: {
		type: String,
		default: 'Боковая кнопка',
	},
	url: {
		type: String,
		default: null,
	},
});

const goTo = (url) => {
	if (url) {
		window.location = url;
	}
}
</script>

<template>
	<div class="side-button">
		<a v-if="url" :href="url" target="_blank">
			<button>
				{{ title }} <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" />
			</button>
		</a>
		<button v-else>
			{{ title }}
		</button>
	</div>
</template>

<style lang="scss" scoped>
.side-button {
	@apply
		fixed top-[45%]
		w-[16rem]
		text-center
		bg-[var(--main-bg-color)]
		pt-[0.6rem] pr-0 pb-[0.6rem] pl-0
		whitespace-nowrap
	;

	left: calc(50% - var(--main-block-width)/2 - 8rem - 1.3rem);
	transform: rotate(-90deg);

	a {
		@apply text-[var(--main-text-color)];

		&:hover {
			@apply text-[var(--main-title-color)];
		}

		button {

		}
	}
}
</style>
