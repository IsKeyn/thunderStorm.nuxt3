<script setup>
import Modal from '@/components/modals/Modal.vue';
import ArticleDetail from '@/components/articles/ArticleDetail.vue';

import { ref } from "vue";

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});

const modalOpen = ref(false);

const openCloseModalFunc = () => {
	modalOpen.value = !modalOpen.value;
};
</script>

<template>
	<div class="text-center">
		<button
				class="btn btn-simple-1 ml-[1rem]"
				@click="openCloseModalFunc"
		>
			<span class="button-text">Правила и описание</span> <font-awesome-icon :icon="['fas', 'book-open-reader']" />
		</button>
	</div>
	<Modal
			:showOpenModal="modalOpen"
			size="full-width"
			@toggleModal="openCloseModalFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Правила и описание</h3>
			<div class="link-parent-box">
				<ArticleDetail
						:entityType="boardGameInfo.entity_type"
						:entityId="boardGameInfo.id"
						:sendFullPath="false"
				/>
			</div>
		</div>
	</Modal>
</template>
