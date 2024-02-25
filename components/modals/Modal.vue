<script setup>
import { watch } from 'vue'
import { onMounted } from 'vue'

import Overlay from "@/components/layout/Overlay.vue";

import { notifications } from '@/composables/notifications.js';

const { alert, error } = notifications();
const emit = defineEmits(['toggleModal', 'setReCalcValue']);

const props = defineProps({
	showOpenModal: {
		type: Boolean,
		default: false,
	},
	canClose: {
		type: Boolean,
		default: true,
	},
	modalsContainerSelector: {
		type: String,
		default: '#modals',
	},
	modalClass: {
		type: String,
		default: 'modal-window',
	},
	modalId: {
		type: String,
		default: null,
	},
	size: {
		type: String,
		default: 'huge',
	},
	saveModalValue: {
		type: Boolean,
		default: true,
	},
	reCalcHeight: {
		type: Boolean,
		default: false,
	},
});

const id = ref(null);
const modalActive = ref(false);
const checkModalHeightInterval = ref(null);
const wasOpen = ref(false);

watch(() => props.showOpenModal, (newValue) => {
	modalActive.value = newValue;
});

watch(() => props.reCalcHeight, (newValue) => {
	if (newValue) {
		calcHeight();
		emit('setReCalcValue', false);
	}
});

watch(modalActive, (newValue) => {
	// modalActive.value = newValue;

	if (newValue && wasOpen.value === false) {
		init();
	}

	if (props.saveModalValue) {
		if (wasOpen.value === false) {
			wasOpen.value = true;
		}
	} else {
		wasOpen.value = value;
	}
});

const el = ref()

onMounted(() => {
	modalActive.value = props.showOpenModal;
})

const init = () => {
	const modalsContainerDom = document.querySelector(props.modalsContainerSelector);
	const modalsList = modalsContainerDom.querySelectorAll(`.${props.modalClass}`);

	if (props.modalId) {
		/* Проверяем не существует ли модального окна с переданным идентификатором в modalId */
		modalsList.forEach((item) => {
			if (item.id === props.modalId) {
				error(`Модальное окно с ID "${modalId.value}" уже существует, передайте в модальное окно иной modalId`);
			}
		});
		id.value = props.modalId;
	} else {
		if (modalsList && modalsList.length) {
			id.value = 'modal-' + modalsList.length;
		} else {
			id.value = 'modal-0';
		}
	}

	if (id.value) {
		calcHeight();
	} else {
		error('У модального окна отсутствует ID');
	}
}

const calcHeight = (time, timeout = 1) => {
	/*
		TODO Данная функция не учитывает используемый шрифт, считает высоту так как будто сейчас используется стандартный шрифт, возникает погрешность // проверить
	*/

	const modal = document.getElementById(id.value);
	if (modal) {
		setTimeout(() => { // TODO попробовать решить задачу без таймаута
			if (checkModalHeightInterval.value) {
				clearInterval(checkModalHeightInterval.value);
				checkModalHeightInterval.value = null;
			}

			modal.style.marginTop = `-${modal.offsetHeight / 2}px`;
		}, 10);
	} else if (!checkModalHeightInterval.value) {
		time = time ? time : 5000;

		let i	= 0, leadTime	= 0;

		checkModalHeightInterval.value = setInterval(() => {
					i++;
					leadTime = timeout * i;
					calcHeight();
					if (time <= leadTime) {
						clearInterval(checkModalHeightInterval.value);
						checkModalHeightInterval.value = null;
						error('В течении 5 секунд модальное окно не отобразилось');
					}
				}, timeout
		);
	}
}

const openModal = () => {
	modalActive.value = true;
}

const closeModal = () => {
	if (props.canClose) {
		modalActive.value = false;
		emit('toggleModal');
	}
}
</script>

<template>
	<teleport :to="modalsContainerSelector">
		<Overlay
				v-if="modalActive"
				@click="closeModal()"
		/>
		<template v-if="wasOpen">
			<div
					v-show="modalActive"
					:id="id"
					class="modal-outer-wrapper"
					:class="[modalClass, size]"
			>
				<template v-if="canClose">
					<font-awesome-icon
							:icon="['fas', 'xmark']"
							class="close-button"
							@click="closeModal()"
					/>
				</template>
				<div class="modal-inner-wrapper">
					<slot />
				</div>
			</div>
		</template>
	</teleport>
</template>
