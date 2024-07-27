<script setup>
import Modal from '@/components/modals/Modal.vue';
import AuthComponent from '@/components/user/AuthComponent.vue';

const activeAuthModal = ref(false);
const reCalc = ref(false);

const reCalcHeight = (value = true) => {
	reCalc.value = value;
}

const toggleAuthModal = () => {
	activeAuthModal.value = !activeAuthModal.value;
}

</script>

<template>
	<div class="text-center">
		<div>Для доступа в раздел Вам необходимо подтвердить email адрес</div>
 		<button class="btn btn-primary" @click="toggleAuthModal()">
			Подтверждение email адреса
		</button>

		<Modal
				:showOpenModal="activeAuthModal"
				size="small"
				modal-id="auth-modal"
				:re-calc-height="reCalc"
				@setReCalcValue="reCalcHeight"
				@toggleModal="toggleAuthModal"
		>
			<AuthComponent
					title="Подтверждение email адреса"
					@reCalcHeight="reCalcHeight"
					@closeModal="toggleAuthModal"
			/>
		</Modal>
	</div>
</template>
