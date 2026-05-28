<template>
    <svg v-if="useSymbol"
         class="ui-icon"
         :width="size"
         :height="size"
         viewBox="0 0 1024 1024"
         aria-hidden="true">
        <use :href="`#${symbolId}`" />
    </svg>
    <svg v-else
         class="ui-icon"
         :width="size"
         :height="size"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         stroke-width="1.8"
         stroke-linecap="round"
         stroke-linejoin="round"
         aria-hidden="true">
        <path v-for="path in iconPaths"
              :key="path"
              :d="path" />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type IconName = 'home' | 'settings' | 'view' | 'comment' | 'thumbs-up' | 'thumbs-down' | 'share' | 'collapse'

const props = withDefaults(defineProps<{
    name: IconName
    size?: number
}>(), {
    size: 16,
})

const symbolMap: Partial<Record<IconName, string>> = {
    view: 'icon-view1',
    comment: 'icon-pinglun2',
    'thumbs-up': 'icon-thumbs-up',
    'thumbs-down': 'icon-thumbs-down',
    share: 'icon-fenxiang2',
    collapse: 'icon-diandian',
}

const inlinePathsMap: Record<'home' | 'settings', string[]> = {
    home: [
        'M4 10.5L12 4l8 6.5',
        'M6.5 9.5V20h11V9.5',
        'M9.5 20v-6h5v6',
    ],
    settings: [
        'M12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7Z',
        'M12 2.8v2.1M12 19.1v2.1M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5',
    ],
}

const symbolId = computed(() => symbolMap[props.name] ?? '')
const useSymbol = computed(() => Boolean(symbolId.value))
const iconPaths = computed(() => {
    if (props.name === 'home' || props.name === 'settings') {
        return inlinePathsMap[props.name]
    }

    return []
})
</script>

<style>
.ui-icon {
    display: inline-block;
    flex-shrink: 0;
    vertical-align: middle;
}
</style>