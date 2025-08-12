<script setup>
const props = defineProps({
	/* Доступные типы: simple, animated */
	type: {
		type: String,
		default: 'animated',
	},
	closeWidthClass: {
		type: String,
		default: 'w-[60px]',
	},
	openType: {
		type: String,
		default: 't240',
	},
	iconType: {
		type: String,
		default: 'fontawesome',
	},
	iconText: {
		type: String,
		default: '',
	},
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
	alwaysOpened: {
		type: Boolean,
		default: false,
	}
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
				:class="[
						'btn btn-simple-1',
						type,
						alwaysOpened ? 'opened' : '',
						type === 'animated' ? closeWidthClass : '',
						openType
				]"
		>
			<font-awesome-icon v-if="iconType === 'fontawesome'" :icon="faIcon" /><span  v-if="iconType === 'text'">{{ iconText }}</span> <span class="button-name">{{ buttonText }}</span>
		</button>
	</a>
	<button
			v-else
			:title="buttonText"
			:class="[
						'btn btn-simple-1',
						type,
						alwaysOpened ? 'opened' : '',
						type === 'animated' ? closeWidthClass : '',
						openType
			]"
	>
		<font-awesome-icon v-if="iconType === 'fontawesome'" :icon="faIcon" /><span  v-if="iconType === 'text'">{{ iconText }}</span> <span class="button-name">{{ buttonText }}</span>
	</button>
</template>

<style lang="scss" scoped>
.simple {
	.button-name {
		@apply hidden;
	}

	&:hover,
	&.opened {
		.button-name {
			@apply inline;
		}
	}
}

.animated {
	@apply whitespace-nowrap overflow-hidden;
	transition: width 0.5s ease; /* Уменьшил время анимации для лучшего UX */

	.button-name {
		@apply hidden whitespace-nowrap overflow-hidden;
		transition: opacity 0.3s ease;
		opacity: 0;
	}

	&:hover,
	&.opened {
		&.t240 {
			@apply lg:w-[240px];
		}

		&.t480 {
			@apply lg:w-[480px];
		}

		.button-name {
			@apply lg:inline;
			opacity: 1;
			transition-delay: 0.2s; /* Небольшая задержка для плавного появления */
		}
	}
}
</style>
