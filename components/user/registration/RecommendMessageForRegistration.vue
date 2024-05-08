<script setup>
import AuthComponent from '@/components/user/AuthComponent.vue';
import Modal from '@/components/modals/Modal.vue';

const isActiveModal = ref(false);
const reCalc = ref(false);

const props = defineProps({
	modalId: {
		type: String,
		default: 'registration-from-recommend-message',
	},
	message: {
		type: String,
		default: ', чтобы иметь больше функционала'
	},
});

const modalTitle = ref('');
const modalActionType = ref('');

const setAndOpenModal = (type) => {
	if (type === 'registration') {
		modalTitle.value = 'Регистрация';
		modalActionType.value = 'registration';
	}

	if (type === 'login') {
		modalTitle.value = 'Авторизация';
		modalActionType.value = 'login';
	}

	toggleModal();
}

const toggleModal = () => {
	isActiveModal.value = !isActiveModal.value;
}

const reCalcHeight = (value = true) => {
	reCalc.value = value;
}
</script>

<template>
	<div class="w-full mb-2">
		<a
				class="cursor-pointer"
				@click="setAndOpenModal('registration')"
		>
			Зарегистрируйтесь
		</a> или
		<a
				class="cursor-pointer"
				@click="setAndOpenModal('login')"
		>
			войдите в систему
		</a> {{ message }}
	</div>
	<Modal
			:showOpenModal="isActiveModal"
			size="small"
			:modalId="modalId"
			:re-calc-height="reCalc"
			@setReCalcValue="reCalcHeight"
			@toggleModal="toggleModal"
	>
		<AuthComponent
				:title="modalTitle"
				:actionType="modalActionType"
				@reCalcHeight="reCalcHeight"
				@closeModal="toggleModal"
		/>
	</Modal>
</template>
