<script setup>
import Modal from '@/components/modals/Modal.vue';
import UserMessagesList from '@/components/user/message/UserMessagesList.vue';

import { ref } from "vue";

const modalOpen = ref(false);
const modalLoading = ref(false);

const showModal = () => {
	modalOpen.value = !modalOpen.value;
	modalLoading.value = true;
}

const loadingToggle = (value = false) => {
	modalLoading.value = value;
}

defineExpose({
	showModal,
});
</script>

<template>
	<Modal
			:showOpenModal="modalOpen"
			:fullCloseModal="true"
			size="full-width"
			@toggleModal="showModal"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Личные сообщения</h3>
			<div class="link-parent-box">
				<ui-BigPreloader v-if="modalLoading" />
				<UserMessagesList
						v-show="!modalLoading"
						@loadingToggle="loadingToggle"
				/>
			</div>
		</div>
	</Modal>
</template>
