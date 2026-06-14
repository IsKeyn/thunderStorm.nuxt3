<script setup>
import { computed } from 'vue';
import { media } from '@/composables/media.js';

const { getResizeImg } = media();

const props = defineProps({
	user: {
		type: Object,
		default: () => ({}),
	},
	useLightBox: {
		type: Boolean,
		default: false,
	},
	classes: {
		type: String,
		default: 'w-[100px] h-[100px]',
	},
	/* Доступные значения:
		'purple', 'gold', 'silver', 'bronze', 'ruby', 'azure', 'emerald', 'amethyst-yellow', 'sapphire', 'obsidian', 'rose-gold'
	*/
	borderType: {
		type: String,
		default: '',
	}
});

const wrapperClasses = computed(() => {
	const cls = ['avatar-box'];
	if (props.borderType) {
		cls.push(`border-${props.borderType}`);
	}
	return cls;
});
</script>

<template>
	<div v-if="user" :class="wrapperClasses">
		<template v-if="user.avatar">
			<img
					v-if="useLightBox"
					:class="classes"
					:src="getResizeImg(user.avatar)"
					:alt="user.name"
					:title="user.name"
					:media-id="user.avatar.id"
					:not-for-lb-nav="true"
					class="media-obj"
			>
			<img
					v-else
					:class="classes"
					:src="getResizeImg(user.avatar)"
					:alt="user.name"
					:title="user.name"
			>
		</template>
		<img v-else src="/images/system/no-avatar.png" :class="classes">
	</div>
</template>

<style lang="scss" scoped>
.avatar-box {
	@apply relative flex items-center justify-center;

	img {
		@apply relative z-10 object-cover rounded-full cursor-pointer bg-[var(--third-bg-color)];
	}

	&[class*='border-'] {
		padding: 3px;
		border-radius: 9999px;

		&::before {
			content: '';
			position: absolute;
			top: -3px;
			left: -3px;
			right: -3px;
			bottom: -3px;
			border-radius: 9999px;
			animation: spin 3s linear infinite;
			z-index: 0;
		}
	}

	// Фиолетовый
	&.border-purple::before {
		background: conic-gradient(from 0deg, transparent 0%, #a855f7 25%, #d8b4fe 50%, #a855f7 75%, transparent 100%);
	}

	// Золотой
	&.border-gold::before {
		background: conic-gradient(from 0deg, transparent 0%, #fcd34d 20%, #f59e0b 40%, #fbbf24 60%, #fcd34d 80%, transparent 100%);
	}

	// Серебряный
	&.border-silver::before {
		background: conic-gradient(from 0deg, transparent 0%, #94a3b8 25%, #f1f5f9 50%, #cbd5e1 75%, transparent 100%);
	}

	// Бронзовый
	&.border-bronze::before {
		background: conic-gradient(from 0deg, transparent 0%, #b45309 25%, #fdba74 50%, #78350f 75%, transparent 100%);
	}

	// Рубиново-красный
	&.border-ruby::before {
		background: conic-gradient(from 0deg, transparent 0%, #e11d48 25%, #fda4af 50%, #9f1239 75%, transparent 100%);
	}

	// Лазурно-синий
	&.border-azure::before {
		background: conic-gradient(from 0deg, transparent 0%, #0ea5e9 25%, #7dd3fc 50%, #0284c7 75%, transparent 100%);
	}

	// Изумрудно-зеленый
	&.border-emerald::before {
		background: conic-gradient(from 0deg, transparent 0%, #10b981 25%, #6ee7b7 50%, #047857 75%, transparent 100%);
	}

	// Аметистово-желтый (цитрин/янтарь)
	&.border-amethyst-yellow::before {
		background: conic-gradient(from 0deg, transparent 0%, #f59e0b 25%, #fde68a 50%, #d97706 75%, transparent 100%);
	}

	// --- Дополнительные придуманные цвета ---

	// Сапфировый (глубокий синий с холодным блеском)
	&.border-sapphire::before {
		background: conic-gradient(from 0deg, transparent 0%, #2563eb 25%, #93c5fd 50%, #1d4ed8 75%, transparent 100%);
	}

	// Обсидиановый (темный графит с серебристым переливом)
	&.border-obsidian::before {
		background: conic-gradient(from 0deg, transparent 0%, #334155 25%, #94a3b8 50%, #0f172a 75%, transparent 100%);
	}

	// Розовое золото
	&.border-rose-gold::before {
		background: conic-gradient(from 0deg, transparent 0%, #f43f5e 25%, #fda4af 50%, #be123c 75%, transparent 100%);
	}
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
