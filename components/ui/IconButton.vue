<script setup>
const props = defineProps({
	/* Доступные типы: simple, animated */
	type: {
		type: String,
		default: 'animated',
	},
	// widthClass: {
	// 	type: String,
	// 	default: 'w-[200px]',
	// },
	faIcon: {
		type: Array,
		default: ['fas', 'bell'],
	},
	buttonText: {
		type: String,
		default: 'Название кнопки',
	},
	href: {
		type: String,
		default: 'javascript:void(0);',
	},
	target: {
		type: String,
		default: null,
	},
});
</script>

<template>
	<a
			v-if="href"
			:href="href"
			:target="target"
	>
		<button
				:title="buttonText"
				:class="['btn btn-simple-1', type]"
		>
			<font-awesome-icon :icon="faIcon" /> <span class="button-name">{{ buttonText }}</span>
		</button>
	</a>
	<button
			v-else
			:title="buttonText"
			:class="['btn btn-simple-1', type]"
	>
		<font-awesome-icon :icon="faIcon" /> <span class="button-name">{{ buttonText }}</span>
	</button>
</template>

<style lang="scss" scoped>
.simple {
	.button-name {
		@apply hidden;
	}

	&:hover {
		.button-name {
			@apply inline;
		}
	}
}

.animated {
	@apply w-[60px] whitespace-nowrap overflow-hidden;
	transition: width 0.5s ease; /* Уменьшил время анимации для лучшего UX */

	.button-name {
		@apply hidden whitespace-nowrap overflow-hidden;
		transition: opacity 0.3s ease;
		opacity: 0;
	}

	&:hover {
		@apply lg:w-[240px];

		.button-name {
			@apply lg:inline;
			opacity: 1;
			transition-delay: 0.2s; /* Небольшая задержка для плавного появления */
		}
	}
}
</style>
