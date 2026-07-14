<script setup>
import { useCookie } from '#imports';
import { useYandexMetrika } from '@/composables/Analytics/useYandexMetrika';

const { init: initMetrika } = useYandexMetrika();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth } = userFunctions();

/**
 * Уровни принятия кук
 *
 * 0 - отказался
 * 1 - принял
 */

const userUseCookieLvl = useCookie('user-use-cookie-lvl', {
	maxAge: 60 * 60 * 24 * 365,
	path: '/',
	sameSite: 'strict'
});

const closeBlock = ref(false);

const userSolution = (type) => {
	if (type === 'accept') {
		userUseCookieLvl.value = 1;
		initMetrika();
	}

	if (type === 'denied') {
		userUseCookieLvl.value = 0;
	}

	closeBlock.value = true;
}

const show = computed(() => {
	if (isAuth.value) return false;
	if (userUseCookieLvl.value === 1) return false;
	if (closeBlock.value) return false;

	return true;
});
</script>

<template>
	<div
			v-if="show"
			class="use-cookie-block"
	>
		<div class="wrapper">
			<span class="message">
				Мы используем файлы cookie, чтобы сайт работал корректно, а контент был удобнее для вас. Часть cookie используется для аналитики (Яндекс Метрика) и персонализации, с целью улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с обработкой ваших данных в соответствии с <nuxt-link to="/article/consent-of-personal-data">политикой конфиденциальности</nuxt-link>.
			</span>
			<div class="button-block">
				<button class="btn btn-unwanted mr-2" @click="userSolution('denied')">Отказаться</button> <button class="btn btn-simple" @click="userSolution('accept')">Принять</button>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.use-cookie-block {
	@apply
		fixed z-[999] bottom-0
		bg-[var(--main-block-color)]
		w-full
	;

	border-top: 1px solid var(--third-border-color);

	.wrapper {
		@apply lg:flex gap-2 min-[1400px]:w-[var(--main-block-width)] pl-4 min-[1450px]:pl-0 pr-4 min-[1450px]:pr-0 pt-4 pb-4 mx-auto;

		a {
			@apply underline;
		}

		.button-block {
			@apply flex justify-center lg:justify-end min-w-[250px];
		}
	}
}

.street-light-theme {
	.use-cookie-block {
		@apply bg-[var(--second-block-color)] text-[--main-dark-text-color];

		a {
			@apply text-[--main-dark-text-color];
		}
	}
}
</style>
