<script setup>
import Repeater from '@/components/repeaters/Repeater.vue';

const repeaterComponent = ref(null);

const props = defineProps({
	blockStructure: {
		type: Object,
		default: null,
	},
	/* index блока в массиве, который находится в store */
	blockIndex: {
		type: Number,
		default: null,
	},
	/* режим редактирования */
	previewMode: {
		type: Boolean,
		default: false,
	},
});

const defaultStructure = await import(`./defaultStructure.json`);
</script>

<template>
	<div :class="[
			'elements-list',
			blockStructure.settings.classes.value
	]">
		<Repeater
				ref="repeaterComponent"
				:repeaterItem="defaultStructure.fields.elements[0]"
				v-model="blockStructure.fields.elements"
				#default="{repeaterItems}"
		>
			<div
					v-for="(item, index) in repeaterItems"
					:key="index"
					:class="['elements-item']"
			>
				<input
						v-if="!previewMode"
						v-model="repeaterItems[index].elements[0].entity"
						class="block"
						@input="setVideosData()"
						placeholder="Сущность"
				>
				<input
						v-if="!previewMode"
						v-model="repeaterItems[index].elements[0].type"
						class="block"
						@input="setVideosData()"
						placeholder="Тип"
				>
				<input
						v-if="!previewMode"
						v-model="repeaterItems[index].elements[0].count"
						class="block"
						@input="setVideosData()"
						placeholder="Количество элементов"
				>

				{{ item }}

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
