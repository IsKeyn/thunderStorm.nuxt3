<script setup>
import Share from '@/components/actions/Share.vue';

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { api } from '@/composables/api.js';
const { publicUrl } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { media } from '@/composables/media.js'
const { getResizeImg } = media();

const { getSettingFirstValue } = settings();

const lifespan = computed(() => {
	const date = new Date();
	return `(${getSettingFirstValue('created_at_year')} - ${date.getFullYear()} г.)`;
});

const domain = computed(() => {
	return getSettingFirstValue('domain');
});
</script>

<template>
	<footer>
		<div class="footer-block">
      <span>
				<font-awesome-icon :icon="['far', 'copyright']" /> <a :href="`https://${domain}`" rel="first">{{ domain }}</a> {{ lifespan }}
      </span>
			<span>
        Автор и разработчик: {{ getSettingFirstValue('creator') }}
      </span>
		</div>
		<div class="cutting" />
		<div class="menu-block col-span-2">
			<nuxt-link :to="'/e/' + route.params.slug + '/rules'" title="Правила ивента">Правила</nuxt-link>
			<nuxt-link :to="'/e/' + route.params.slug + '/game?tab=game-list'" title="Игры ивента">Игры</nuxt-link>
			<nuxt-link :to="'/e/' + route.params.slug + '/inventory?tab=item-list'" title="Предметы ивента">Предметы</nuxt-link>
			<nuxt-link :to="'/e/' + route.params.slug + '/log-list'" title="Логи ивента">Логи</nuxt-link>
		</div>
		<div class="cutting" />
		<div class="menu-block col-span-2">
			<nuxt-link to="https://t.me/game_events_tr" target="_blank" title="Телеграм канал">Телеграм-канала</nuxt-link>
			<a href="/e/" target="_blank" title="Список событий">Список ивентов</a>
			<nuxt-link to="/article/rule-for-use-site/" target="_blank" title="Правила использования материалов сайта">Правила использования материалов сайта</nuxt-link>
			<a href="/" title="На сайт">На сайт</a>
		</div>
		<div class="cutting" />
		<div class="cutting" />
		<div class="footer-icon-block">
			<Share
					:pageUrl="boardGameStore.boardGameInfo?.slug ? `${publicUrl}/e/${boardGameStore.boardGameInfo?.slug}` : null"
					itemClass="text-[1rem]"
					position="center"
					:title="boardGameStore.boardGameInfo?.name"
					:description="boardGameStore.boardGameInfo?.description"
					:image="getResizeImg(boardGameStore.boardGameInfo?.media, 500)"
			/>
		</div>
	</footer>
</template>

<style lang="scss" scoped>
footer {
	@apply
		pt-[2rem] pr-[var(--main-right-padding)] pb-[2rem] pl-[var(--main-left-padding)]
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

	.menu-block {
		span {
			&.menu-category-title {
				@apply block pb-[1rem] text-[18px] font-semibold uppercase;
			}
		}

		a {
			@apply block text-[16px] mb-[10px];
		}
	}

	.footer-icon-block {
		@apply
			col-span-1
			flex relative
			justify-center lg:justify-end items-center
			min-w-[40px] h-[40px]
			mr-[2px]
			pr-[10px] pl-[10px]
			cursor-pointer
			text-[2.5rem]
		;

		.icon-link-block {
			@apply text-[2.5rem] cursor-pointer;
			transition: 0.2s;

			&:hover {
				@apply text-[3rem];
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
