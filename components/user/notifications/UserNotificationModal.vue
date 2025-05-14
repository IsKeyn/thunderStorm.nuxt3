<script setup>
import Modal from '@/components/modals/Modal.vue';
import UserNotificationList from '@/components/user/notifications/UserNotificationList.vue';

import { ref } from "vue";

const modalOpen = ref(false);

const showModal = () => {
	modalOpen.value = !modalOpen.value;
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
			<h3 class="modal-title">Уведомления</h3>
			<div class="link-parent-box">
				<UserNotificationList />
			</div>
		</div>
	</Modal>
</template>
