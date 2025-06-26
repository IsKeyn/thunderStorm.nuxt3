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
		<ui-IconButton
				class="ml-[1rem]"
				:faIcon="['fas', 'book-open-reader']"
				buttonText="Правила и описание"
				:alwaysOpened="true"
				@click="openCloseModalFunc"
		/>
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
