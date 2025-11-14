<script setup>
import Repeater from '@/components/repeaters/Repeater.vue';

import { video } from '@/composables/video.js'
const { getVideoData } = video();

const repeaterComponent = ref(null);

const props = defineProps({
	blockStructure: {
		type: Object,
		default: null,
	},
	blockIndex: { // Index блока в массиве, который находится в store
		type: Number,
		default: null,
	},
	previewMode: { // Режим редактирования
		type: Boolean,
		default: false,
	},
});

const defaultStructure = await import(`./defaultStructure.json`);

const setVideosData = () => {
	props.blockStructure.fields.videos.forEach((repeaterItem) => {
		repeaterItem.sources.forEach((source) => {
			if (source.url) {
				source.videoData = getVideoData(source.url);
			}
		});
	});
}

const setSource = (repeaterKey, sourceKey) => {
	props.blockStructure.fields.videos[repeaterKey].currentSource = sourceKey;
}

// TODO перевести input на formGenerator formGenerator или его дочерние элементы должны уметь работать как обычный Input
</script>

<template>
	<div :class="[
			'video-list',
			sideIndent,
	]">
		<Repeater
				ref="repeaterComponent"
				:repeaterItem="defaultStructure.fields.videos[0]"
				v-model="blockStructure.fields.videos"
				#default="{repeaterItems}"
		>
			<div
					v-for="(item, index) in repeaterItems"
					:key="index"
					:class="['video-item', blockStructure.settings?.rowCount.value]"
			>
				<input
						v-if="!previewMode"
						v-model="repeaterItems[index].sources[0].url"
						class="block"
						@input="setVideosData()"
						placeholder="Ссылка на видео (источник 1)"
				>
				<input
						v-if="!previewMode"
						v-model="repeaterItems[index].sources[1].url"
						class="block"
						@input="setVideosData()"
						placeholder="Ссылка на видео (источник 2)"
				>
				<input
						v-if="!previewMode"
						v-model="repeaterItems[index].sources[2].url"
						class="block"
						@input="setVideosData()"
						placeholder="Ссылка на видео (источник 3)"
				>
				<div class="video">
					<div class="sources-list">
						<template
								v-for="(source, key) in repeaterItems[index].sources"
								:key="key"
						>
							<font-awesome-icon
									v-if="source?.videoData?.serviceUrl && (source.videoData.serviceUrl === 'youtube.com' || source.videoData.serviceUrl === 'youtu.be')"
									:icon="['fab', 'youtube']"
									title="YouTube"
									@click="setSource(index, key)"
							/>
							<font-awesome-icon
									v-if="source?.videoData?.serviceUrl && source.videoData.serviceUrl === 'rutube.ru'"
									:icon="['fas', 'circle-play']"
									title="rutube"
									@click="setSource(index, key)"
							/>
							<font-awesome-icon
									v-if="source?.videoData?.serviceUrl && (source.videoData.serviceUrl === 'vimeo.com' || source.videoData.serviceUrl === 'player.vimeo.com')"
									:icon="['fab', 'vimeo']"
									title="Vimeo"
									@click="setSource(index, key)"
							/>
							<font-awesome-icon
									v-if="source?.videoData?.serviceUrl && (source.videoData.serviceUrl === 'vk.com' || source.videoData.serviceUrl === 'vk.ru'|| source.videoData.serviceUrl === 'm.vk.com'|| source.videoData.serviceUrl === 'vkvideo.ru')"
									:icon="['fa-brands', 'fa-vk']"
									title="VK"
									@click="setSource(index, key)"
							/>
						</template>
					</div>
					<template v-if="repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource] && repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData">
						<iframe
								v-if="repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.serviceUrl === 'youtube.com' || repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.serviceUrl === 'youtu.be'"
								:src="`https://www.youtube.com/embed/${repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.id}`"
								title="YouTube video player"
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								referrerpolicy="strict-origin-when-cross-origin"
								allowfullscreen
						></iframe>
						<iframe
								v-if="repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.serviceUrl === 'rutube.ru'"
								:src="`https://rutube.ru/play/embed/${repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.id}/`"
								frameBorder="0"
								allow="clipboard-write; autoplay"
								webkitAllowFullScreen
								mozallowfullscreen
								allowFullScreen
						></iframe>
						<iframe
								v-if="repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.serviceUrl === 'vimeo.com' || repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.serviceUrl === 'player.vimeo.com'"
								:src="`https://player.vimeo.com/video/${repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.id}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`"
								frameborder="0"
								allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
						></iframe>
						<iframe
								v-if="
								repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.serviceUrl === 'vk.com'
								|| repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.serviceUrl === 'vk.ru'
								|| repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.serviceUrl === 'm.vk.com'
								|| repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.serviceUrl === 'vkvideo.ru'"
								:src="`https://vkvideo.ru/video_ext.php?oid=-${repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.oid}&id=${repeaterItems[index].sources[blockStructure.fields.videos[index].currentSource].videoData.id}&autoplay=0`"
								allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
								frameborder="0"
								asd="asd"
								allowfullscreen></iframe>
					</template>
				</div>

				<button
						v-if="!previewMode && repeaterItems.length > 1"
						class="btn btn-primary"
						@click="repeaterComponent.deleteRepeaterItem(index)"
				>
					<font-awesome-icon :icon="['fas', 'xmark']" />
				</button>
			</div>
			<button
					v-if="!previewMode"
					class="btn btn-primary block"
					@click="repeaterComponent.addRepeaterItem()"
			>
				Добавить
			</button>
		</Repeater>
	</div>
</template>

<style lang="scss">
.video-list {
	@apply grid grid-cols-12 gap-x-[1rem] gap-y-[1rem];

	.video-item {
		@apply relative;

		&:hover button {
			@apply block;
		}

		button {
			@apply absolute top-0 right-0 hidden;
		}

		.video {
			@apply h-0 relative pb-[56.25%];

			&:hover {
				.sources-list {
					@apply block;
				}
			}

			.sources-list {
				@apply
					absolute top-[0.2rem] left-[0.2rem] z-[1]
					pt-[0.1rem] pr-[0.5rem] pb-[0.1rem] pl-[0.5rem]
					text-[1.8rem] hidden
				;

				background: rgba(0, 0, 0, 0.7);

				svg {
					&:not(:last-child) {
						@apply mr-[0.5rem];
					}

					@apply cursor-pointer;

					&:hover {
						@apply text-[var(--main-hover-color)];
					}
				}
			}

			iframe {
				@apply absolute top-0 left-0 w-full h-full;
			}
		}
	}
}
</style>
