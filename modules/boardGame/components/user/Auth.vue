<script setup>
import Modal from '@/components/modals/Modal.vue';
import AuthComponent from '@/components/user/AuthComponent.vue';

import { ref } from "vue";

const route = useRoute();

const props = defineProps({
	message: {
		type: String,
		default: 'Интерфейс доступен для авторизованного пользователя, пожалуйста войдите или зарегистрируйтесь на сайте',
	},
});

const reCalc = ref(false);
const activeAuthModal = ref(false);

const openCloseBoxFunc = () => {
	activeAuthModal.value = !activeAuthModal.value;
};

const reCalcHeight = (value = true) => {
	reCalc.value = value;
}
</script>

<template>
	<span class="user-interface-title">Авторизация</span>
	<div class="text-center">
		<div>{{ message }}</div>
		<button
				class="btn btn-simple"
				@click="openCloseBoxFunc"
		>
			Авторизоваться
		</button>
	</div>
	<Modal
			:showOpenModal="activeAuthModal"
			size="small"
			modal-id="auth-form"
			:re-calc-height="reCalc"
			@setReCalcValue="reCalcHeight"
			@toggleModal="toggleAuthModal"
	>
		<AuthComponent
				:registerOnEventBySlug="route.params.slug"
				@reCalcHeight="reCalcHeight"
				@closeModal="toggleAuthModal"
		/>
	</Modal>
</template>

<style lang="scss" scoped>

</style>
