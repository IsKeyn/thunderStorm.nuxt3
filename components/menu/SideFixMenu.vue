<script setup>
import SvgIcon from '@/components/additional/SvgIcon.vue';
import MobileContentBox from '@/components/mobile/MobileContentBox.vue';

import { api } from '@/composables/api.js'

const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

const fetchedData = ref([]);
const requestInProgress = ref(false);

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}menu/get`;

			const query = { arTypes: JSON.stringify(['side_bar_menu']), };

			const sessionCookie = useCookie(sessionCookieName.value);
			requestInProgress.value = true;

			try {
				await $fetch(
						request,
						{
							method: 'GET',
							credentials: 'include',
							headers: {
								Accept: 'application/json',
								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
								Referer: publicUrl.value,
							},
							query,
							onResponse({response}) {
								if (response.status === 200) {
									fetchedData.value = fetchedData.value.concat(response._data.data);
								} else {
									// TODO Возвращаем ошибку
								}

								requestInProgress.value = false;
							}
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
			}
		}
);

const icon = ['fas', 'link'];
</script>


<template>
	<MobileContentBox :icon="icon">
		<div class="modal-parent">
			<h3 class="modal-title">Ссылки</h3>
			<div class="link-parent-box">
				<template
						v-for="(element, index) in fetchedData[0].elements"
						:key="index"
				>
					<template v-if="element.link_type === 'router'">
						<router-link
								:to="element.url"
								:target="(element.target === 'blank' ? '_blank' : '_self')"
								class="svg-block"
						>
							<SvgIcon
									:icon-name="element.icon"
									:title="element.name"
									stroke="currentColor"
							/>
							<span>{{ element.name }}</span>
						</router-link>
					</template>
					<template v-else>
						<a
								:href="element.url"
								:target="( element.target === 'blank' ? '_blank' : '_self' )"
								class="svg-block"
						>
							<SvgIcon
									:icon-name="element.icon"
									:title="element.name"
									stroke="currentColor"
							/>
							<span>{{ element.name }}</span>
						</a>
					</template>
				</template>
			</div>
		</div>
	</MobileContentBox>

	<div class="side-fixed-menu" v-if="fetchedData  && fetchedData[0] && fetchedData[0].elements">
		<template
				v-for="(element, index) in fetchedData[0].elements"
				:key="index"
		>
			<template v-if="element.link_type === 'router'">
				<router-link
						:to="element.url"
						:target="(element.target === 'blank' ? '_blank' : '_self')"
						class="svg-block"
				>
					<SvgIcon
							:icon-name="element.icon"
							:title="element.name"
					/>
				</router-link>
			</template>
			<template v-else>
				<a
						:href="element.url"
						:target="( element.target === 'blank' ? '_blank' : '_self' )"
						class="svg-block"
				>
					<SvgIcon
							:icon-name="element.icon"
							:title="element.name"
					/>
				</a>
			</template>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.side-fixed-menu {
	@apply
		fixed top-[115px]
		w-[60px]
		text-center
		bg-[var(--main-bg-color)]
		whitespace-nowrap
		bg-[var(--main-bg-color)]
		pt-[20px]
		hidden min-[1400px]:block
	;

	right: calc((100% - var(--main-block-width)) / 2 - 60px);

	.svg-block {
		@apply block h-[48px];

		&:last-child {
			@apply mb-0;
		}

		svg {
			@apply inline scale-[1.5] stroke-[var(--main-text-color)];

			&:hover {
				@apply stroke-[var(--main-title-color)];
			}
		}
	}
}

.modal-parent {
		@apply
		w-[100%] sm:w-[var(--modal-small-width)]
		pt-[var(--mod-pt)] pr-[var(--mod-pr)] pb-[var(--mod-pb)] pl-[var(--mod-pl)]
		md:mr-[60px]
		;
}

.link-parent-box {
	@apply flex flex-col space-y-4;

	a {
		@apply
			flex
			items-center
			space-x-2
			text-[var(--main-text-color)]
			transition-colors
		;

		&:hover {
			@apply text-[var(--main-title-color)];
		}

		svg {
			@apply w-6 h-6;
		}
	}
}
</style>
