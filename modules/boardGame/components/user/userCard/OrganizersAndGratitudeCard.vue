<script setup>
const emit = defineEmits(['showUserMessagesModal']);

import { computed } from "vue";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth } = userFunctions();

import { media } from '@/composables/media.js'
const { getResizeImg } = media();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
});

const isCurrentUser = computed(() => { return isAuth && props.element && userStore.user.id === props.element?.user?.id; });

const sendMessage = (user) => {
	emit('showUserMessagesModal', user);
}
</script>

<template>
	<div
			v-if="element"
			:class="['player-box']"
	>
		<div
				class="first-line"
				:style="[
					`${element?.user?.premium && element.backgroundImage
					? 'background-image: url(' + getResizeImg(element.backgroundImage, 1500) + ');'
					: ''}`,
					`background-size: ${element?.user?.settings?.pave ? 'contain' : 'cover'}`,
					`background-position: ${element?.user?.settings?.backgroundPosition ? element.user.settings.backgroundPosition : ''}`,
					`background-repeat: ${element?.user?.settings?.pave ? 'repeat' : 'no-repeat'}`,
				]"
		>
			<div v-if="!element?.user?.premium" class="bg"/>
			<div v-else class="vein" :style="`background: rgba(0, 0, 0, ${element?.user?.settings?.vein ? element.user.settings.vein : '0.5'})`" />
			<div class="avatar-box-main">
				<UserAvatar
						:user="element?.user"
						classes="w-[90%] aspect-square object-cover"
						:useLightBox="true"
						:canChange="false"
						:borderType="`${ element?.user?.premium && element?.user?.settings?.avatarBorder ? element.user.settings.avatarBorder : '' }`"
						:altImage="element.imageSrc"
				/>
			</div>
			<div class="content line-content">
				<div class="wild-box">
					<div class="field">
						<span class="wrapper default">{{ (element?.user?.public_name ?? element?.user?.name) ?? element?.name }}</span>
						<nuxt-link
								v-if="element?.user"
								class="wrapper default message"
								:to="`/e/${route.params.slug}/player/${element.user.name}`"
								target="_blank"
								title="Перейти в профиль пользователя на ивенте"
						>
							<font-awesome-icon icon="fa-solid fa-user" />
						</nuxt-link>
						<span v-if="isAuth && !isCurrentUser && element?.user" class="wrapper default message" @click.prevent="sendMessage(element?.user)"><font-awesome-icon icon="fa-solid fa-envelope" /></span>
					</div>
					<div
							v-if="element?.user?.premium && element?.user?.settings?.premiumMessage"
							class="field"
					>
							<span class="wrapper default shimmer">
								<font-awesome-icon icon="fa-solid fa-bullhorn" class="inline mr-2" /> {{ element?.user?.settings?.premiumMessage ? element.user.settings.premiumMessage : '' }}
							</span>
					</div>
					<div class="field">
						<span v-if="element.title" class="wrapper default">{{ element.title }}</span>
						<span v-if="element.description" class="wrapper default">{{ element.description }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import url('~/assets/scss/Fragments/profileLine.scss');

.player-box {
	@apply col-span-12 md:col-span-6 2xl:col-span-4 min-[1800px]:col-span-3 min-[2500px]:col-span-2;

	.first-line {
		.avatar-box-main {
			@apply
				xl:top-[2rem]
			 	xl:left-[50%]
				xl:bottom-auto
				xl:-translate-x-1/2
			;
		}

		.content {
			@apply lg:grid-cols-1;

			.wild-box {
				.field {
					@apply xl:text-center;
				}
			}
		}
	}

	.second-line {
		.content {
			@apply lg:grid-cols-12;
		}
	}

	.line-content {
		@apply xl:pt-[15rem] xl:pb-[1rem] xl:pl-[0rem];

		&.second {
			@apply xl:pt-[1rem] xl:pb-[0rem];
		}
	}
}

@keyframes shimmer {
	0% { transform: translateX(-100%); }
	100% { transform: translateX(100%); }
}

.street-light-theme {
	.first-line {
		.bg {
			@apply bg-[var(--third-bg-color)];
		}
	}
}

</style>
