<script setup>
import FixedControlPanel from '@/components/ui/FixedControlPanel.vue';

const emit = defineEmits(['sendForm', 'openBlockList']);

const route = useRoute();

const props = defineProps({
	requestInProgress: {
		type: Boolean,
		default: false,
	},
	useBlockEditor: {
		type: Boolean,
		default: false,
	},
});

const hideButton = ref(false);
</script>

<template>
	<FixedControlPanel
			position="right"
			:showPanel="true"
			:showHeader="false"
			theme="admin-control-panel"
	>
		<button
				class="btn btn-simple btn-control"
				title="Скрыть кнопки"
				@click="hideButton = !hideButton"
		>
			<font-awesome-icon v-if="!hideButton" :icon="['fas', 'angles-right']" fade />
			<font-awesome-icon v-else :icon="['fas', 'angles-left']" fade />
		</button>

		<button
				v-if="!hideButton"
				class="btn btn-simple btn-control"
				title="Сохранить"
				@click="$emit('sendForm', 'save')"
		>
			<font-awesome-icon v-if="!requestInProgress" :icon="['fas', 'floppy-disk']" />
			<font-awesome-icon v-else :icon="['fas', 'spinner']" spin-pulse />
		</button>
		<button
				v-if="!hideButton"
				class="btn btn-simple btn-control"
				title="Сохранить и продолжить"
				@click="$emit('sendForm', 'saveAndContinue')"
		>
			<font-awesome-icon v-if="!requestInProgress":icon="['far', 'floppy-disk']" />
			<font-awesome-icon v-else :icon="['fas', 'spinner']" spin-pulse />
		</button>
		<button
				v-if="route.query?.tab === 'block-editor' && useBlockEditor && !hideButton"
				class="btn btn-simple btn-control"
				title="Добавить блок"
				@click="$emit('openBlockList')"
		>
			<font-awesome-icon :icon="['fas', 'square-plus']" />
		</button>
	</FixedControlPanel>
</template>

<style lang="scss" scoped>
.btn-control {
	@apply block text-[2rem];
}
</style>
