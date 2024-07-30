<script setup>
import { onMounted, watch } from "vue";

const emit = defineEmits(['togglePanel']);

const props = defineProps({
	showPanel: {
		type: Boolean,
		default: false,
	},
	showHeader: {
		type: Boolean,
		default: true,
	},
	position: {
		type: String,
		default: 'left',
	},
	title: {
		type: String,
		default: 'Панель',
	},
	theme: {
		type: String,
		default: 'default',
	},
});

const panelActive = ref(false);

watch(() => props.showPanel, (newValue) => {
	panelActive.value = newValue;
});

onMounted(() => {
	panelActive.value = props.showPanel;
});

const closePanel = () => {
	emit('togglePanel');
}
</script>

<template>
	<div
			v-if="panelActive"
			:class="['fixed-panel', position, theme]"
	>
		<div
				v-if="showHeader"
				class="header"
		>
			<span class="title">{{ title }}</span>
			<font-awesome-icon
					:icon="['fas', 'xmark']"
					class="close-button"
					@click="closePanel()"
			/>
		</div>
		<div class="body">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.fixed-panel {

	&.default {
		@apply p-[1rem] overflow-auto bg-[--main-block-color] w-[20rem];

		&.top {
			@apply fixed left-0 top-0 w-full;
		}

		&.right {
			@apply fixed right-0 top-0 h-full;
		}

		&.bottom {
			@apply fixed left-0 bottom-0 w-full;
		}

		&.left {
			@apply fixed left-0 top-0 h-full pr-[1.2rem];

			.header {
				@apply pr-[1.5rem];

				.close-button {
					@apply right-0 top-[0.2rem];
				}
			}
		}
	}

	&.admin-control-panel {
		&.right {
			@apply fixed right-0 top-[40%];
		}
	}

	.header {
		@apply relative;

		.close-button {
			@apply absolute cursor-pointer text-[1.5rem];
		}
	}

	.body {
		@apply pt-[0.6rem];
	}
}
</style>
