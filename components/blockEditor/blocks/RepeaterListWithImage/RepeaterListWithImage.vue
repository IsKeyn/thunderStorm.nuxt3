<script setup>
import Repeater from '@/components/repeaters/Repeater.vue';
import FragmentMedia from '@/components/blockEditor/editor/blockFragments/FragmentMedia.vue';

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

// Забираю элемент для репитора
const defaultStructure = await import(`./defaultStructure.json`);
</script>

<template>
	<FragmentMedia
			v-model="blockStructure.fields.image"
			:editMode="!previewMode"
			:imageClass="[blockStructure.settings.imagePosition.value, 'p-[8px]']"
	/>
	<div
			:class="[
					'header',
					blockStructure.settings.titlePosition.value,
					blockStructure.settings.marginFromTitle.value,
			]"
	>
		<span class="first-title">
			<template v-if="!previewMode">
				<input v-model="blockStructure.fields.firstTitle">
			</template>
			<template v-else-if="blockStructure.fields.firstTitle">
				{{ blockStructure.fields.firstTitle }}
			</template>
		</span>
		<span class="second-title">
			<template v-if="!previewMode">
				<input v-model="blockStructure.fields.secondTitle">
			</template>
			<template v-else-if="blockStructure.fields.secondTitle">
				{{ blockStructure.fields.secondTitle }}
			</template>
		</span>
	</div>
	<div>
		<Repeater
				ref="repeaterComponent"
				:repeaterItem="defaultStructure.fields.elements[0]"
				v-model="blockStructure.fields.elements"
				#default="{repeaterItems}"
		>
			<div
					v-for="(item, index) in repeaterItems"
					:key="index"
					class="mb-1"
			>
				<span class="field-title">
					<template v-if="!previewMode">
						<input v-model="repeaterItems[index].title">
					</template>
					<template v-else-if="repeaterItems[index].title">
						{{ repeaterItems[index].title }}
					</template>
				</span>
				<template v-if="!previewMode">
					<textarea v-model="repeaterItems[index].description" />
				</template>
				<template v-else-if="repeaterItems[index].description">
					{{ repeaterItems[index].description }}
				</template>
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
.RepeaterListWithImage {
	.header {
		.first-title,
		.second-title {
			@apply block;
		}

		.first-title {
			@apply font-bold text-[1.2rem];

			color: var(--main-title-color);
		}
	}

	.field-title {
		@apply font-bold mr-[0.3rem];
	}
}
</style>
