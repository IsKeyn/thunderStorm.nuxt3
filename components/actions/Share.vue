<script setup>
import Tooltip from '@/components/ui/Tooltip.vue';

import { api } from '@/composables/api.js';
const { publicUrl } = api();

const route = useRoute();

const props = defineProps({
	title: {
		type: String,
		default: '',
	},
	description: {
		type: String,
		default: '',
	},
	image: {
		type: String,
		default: '',
	},
});

const share = (serviceName) => {
	let shareUrl = '';

	const pageUrl = `${publicUrl.value}${route.fullPath}`;

	const title = encodeURIComponent(props.title);
	const description = encodeURIComponent(props.description);
	const image = encodeURIComponent(props.image);

	switch (serviceName) {
		case 'vk':
			shareUrl = `https://vk.com/share.php?url=${pageUrl}&title=${description}`;
			if (image) {
				shareUrl += `&image=${image}`;
			}
			break;
		case 'ok':
			shareUrl = `https://connect.ok.ru/offer?url=${pageUrl}&title=${title}&description=${description}`;
			if (image) {
				shareUrl += `&imageUrl=${image}`;
			}
			break;
		case 'tg':
			shareUrl = `https://t.me/share/url?url=${pageUrl}&text=${description}`;
			break;
	}

	window.open(shareUrl, '', 'toolbar=0,status=0,scrollbars=1,width=626,height=436');
}
</script>

<template>
	<Tooltip position="left">
		<div class="action-panel">
			<div
					class="square-box"
					@click="share('vk')"
			>
				<font-awesome-icon :icon="['fab', 'vk']" />
			</div>
			<div
					class="square-box"
					@click="share('ok')"
			>
				<font-awesome-icon :icon="['fas', 'share']" />
			</div>
			<div
					class="square-box"
					@click="share('tg')"
			>
				<font-awesome-icon :icon="['fab', 'telegram']" />
			</div>
		</div>
	</Tooltip>
	<font-awesome-icon :icon="['fas', 'share']"/>
</template>

<style lang="scss" scoped>
.action-panel {
	@apply
		flex justify-end
		pb-[2px]
	;

	.square-box {
		@apply
			flex relative
			justify-center items-center
			min-w-[40px] h-[40px]
			pr-[10px] pl-[10px]
			bg-[var(--second-bg-color)]
			cursor-pointer
		;

		&:hover {
			@apply bg-[var(--second-hover-color)];
		}

		&:not(:last-child) {
			@apply mr-[2px];
		}

		.count {
			@apply mr-[10px];
		}
	}
}
</style>
