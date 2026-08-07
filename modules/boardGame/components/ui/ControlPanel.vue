<script setup>
import FixedControlPanel from '@/components/ui/FixedControlPanel.vue';
import Modal from '@/components/modals/Modal.vue';
import Debug from '@/modules/boardGame/components/debug/Debug.vue';

import { computed, ref } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { getSettingValue } = boardGame();

const props = defineProps({
	requestInProgress: {
		type: Boolean,
		default: false,
	},
});

const hideButton = ref(false);

const enableDebug = computed(() => {
	return getSettingValue('debug_mode');
});

const debugModalOpen = ref(false);
const openCloseDebugModalOpen = () => {
	debugModalOpen.value = !debugModalOpen.value;
};
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
				v-if="!hideButton && enableDebug"
				class="btn btn-simple btn-control"
				title="Дебаг меню"
				@click="openCloseDebugModalOpen"
		>
			<font-awesome-icon v-if="!requestInProgress" :icon="['fa-solid', 'fa-toolbox']" />
			<font-awesome-icon v-else :icon="['fas', 'spinner']" spin-pulse />
		</button>
	</FixedControlPanel>

	<Modal
			v-if="enableDebug"
			:showOpenModal="debugModalOpen"
			size="full-width"
			@toggleModal="openCloseDebugModalOpen"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Панель дебага</h3>
			<div class="link-parent-box">
				<Debug />
			</div>
		</div>
	</Modal>
</template>

<style lang="scss" scoped>
.btn-control {
	@apply block text-[2rem];

	svg {
		@apply max-w-[28px];
	}
}
</style>
