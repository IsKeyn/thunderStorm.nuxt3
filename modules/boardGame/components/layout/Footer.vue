<script setup>
const { getSettingFirstValue } = settings();

const lifespan = computed(() => {
	const date = new Date();
	return `(${getSettingFirstValue('created_at_year')} - ${date.getFullYear()} г.)`;
});

const domain = computed(() => {
	return getSettingFirstValue('domain');
});

const arColumnsTypes = ref([
	'footer_column_1',
	'footer_column_2',
	'footer_column_3'
]);

// Модалки
import Modal from '@/components/modals/Modal.vue';

const activeFeedbackModal = ref(false);

const toggleFeedbackModal = () => {
	activeFeedbackModal.value = !activeFeedbackModal.value;
}

const activeSendBugModal = ref(false);

const toggleSendBugModal = () => {
	activeSendBugModal.value = !activeSendBugModal.value;
}
</script>

<template>
	<footer>
		<div class="footer-block">
      <span>
				<font-awesome-icon :icon="['far', 'copyright']" /> <a :href="`https://${domain}`" rel="first">{{ domain }}</a> {{ lifespan }}
      </span>
			<span>
        Автор и разработчик: <a href="#" title="Написать письмо администратору сайта" @click.prevent="toggleFeedbackModal()">{{ getSettingFirstValue('creator') }}</a>
      </span>
			<!--			<span class="mt-4">-->
			<!--				<a href="#" title="Написать письмо администратору сайта" @click.prevent="toggleFeedbackModal()">Обратная связь</a>-->
			<!--			</span>-->
			<!--			<span>-->
			<!--				<a href="#" title="Сообщить администрации об ошибке на сайте" @click.prevent="toggleSendBugModal()">Сообщить об ошибке</a>-->
			<!--			</span>-->
		</div>
		<div class="cutting" />
		<div>
			<a href="/e/" title="Список событий">Список событий</a>
		</div>
		<div class="cutting" />
		<MenuByTypes
				:arColumnsTypes="arColumnsTypes"
				parentClass="menu-block col-span-2"
		/>
		<div class="cutting" />
		<div class="footer-icon-block">
			<router-link to="/site_map" class="site-map"><font-awesome-icon :icon="['fas', 'map']" /></router-link>
		</div>
	</footer>
	<Modal
			:showOpenModal="activeFeedbackModal"
			size="small"
			modalId="feedback-form"
			@toggleModal="toggleFeedbackModal"
	>
		Форма фидбека
	</Modal>
	<Modal
			:showOpenModal="activeSendBugModal"
			size="small"
			modal-id="send-bug-form"
			@toggleModal="toggleSendBugModal"
	>
		Форма отправки бага
	</Modal>
</template>

<style lang="scss" scoped>
footer {
	@apply
		pt-[25px] pr-[var(--main-right-padding)] pb-[26px] pl-[var(--main-left-padding)]
		bg-[var(--second-block-color)] text-[var(--main-dark-text-color)]
		grid grid-cols-12
	;

	a {
		color: var(--main-dark-text-color);
	}

	.footer-block {
		@apply relative col-span-3;

		span {
			@apply block leading-[30px];
		}
	}

	.cutting {
		@apply relative col-span-1;
	}

	.footer-icon-block {
		@apply relative col-span-1 text-right;

		.site-map {
			@apply text-[35px];
			transition: 0.2s;

			&:hover {
				@apply text-[40px];
			}
		}
	}
}

@media (max-width: 768px) {
	footer {
		display: block;
		text-align: center;
		padding: 25px 10px;

		.footer-block {
			width: 100%;
			margin-bottom: 10px;

			.site-map {
				display: block;
				position: relative;
				margin-top: 15px;
			}
		}
	}
}
</style>


<style lang="scss" scoped>
footer {
	@apply
		pt-[1rem] pb-[1rem] pl-[var(--main-left-padding)] pr-[var(--main-right-padding)]

	;
}
</style>
