<template>
    <el-dialog :model-value="modelValue"
               title="搜索帖子"
               width="560px"
               @update:model-value="handleUpdateModelValue"
               @open="handleOpen">
        <div class="search-post-dialog">
            <div class="search-row">
                <el-input v-model="keyword"
                          clearable
                          placeholder="搜索帖子内容、用户或小尾巴"
                          @keyup.enter="handleSearch" />
                <el-button type="primary"
                           @click="handleSearch">
                    搜索
                </el-button>
            </div>
            <div v-loading="isSearching"
                 class="search-results">
                <el-empty v-if="!results.length"
                          :description="emptyText"
                          :image-size="80" />
                <div v-for="result in results"
                     :key="result.post_id"
                     class="search-result"
                     @click="handleSelect(result)">
                    <div class="search-result-head">
                        <span class="search-result-floor">第 {{ result.floor }} 楼</span>
                        <span class="search-result-user">{{ result.user.nickname }}</span>
                        <span class="search-result-field">{{ result.hit_field }}</span>
                    </div>
                    <div class="search-result-text">{{ getHitSnippet(result.hit_text) }}</div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, inject, readonly, ref, toRaw } from 'vue'
import { ElMessage, vLoading } from 'element-plus'

const props = defineProps<{
    modelValue: boolean
    pageSize: number
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'select', value: VO.PostSearchResult): void
}>()

const threadSource = readonly(inject<RP.ThreadSource>('threadSource')!)
const keyword = ref<string>('')
const results = ref<VO.PostSearchResult[]>([])
const isSearching = ref<boolean>(false)
const hasSearched = ref<boolean>(false)

const emptyText = computed(() => hasSearched.value ? '没有搜索结果' : '输入关键词后按回车搜索')

const handleUpdateModelValue = function (value: boolean) {
    emit('update:modelValue', value)
}

const handleOpen = function () {
    hasSearched.value = false
}

const handleSearch = function () {
    const normalizedKeyword = keyword.value.trim()
    hasSearched.value = true
    if (!normalizedKeyword) {
        results.value = []
        return
    }

    isSearching.value = true
    window.dataAPI.searchPost(toRaw(threadSource), {
        keyword: normalizedKeyword,
        rn: props.pageSize,
    }).then((res) => {
        if (res.code !== 0) {
            ElMessage.error(`搜索帖子失败: ${res.msg}`)
            return
        }

        results.value = res.data.results
    }).finally(() => {
        isSearching.value = false
    })
}

const handleSelect = function (result: VO.PostSearchResult) {
    emit('select', result)
}

const getHitSnippet = function (text: string): string {
    const normalizedText = text.trim()
    if (normalizedText.length <= 120) return normalizedText

    return `${normalizedText.slice(0, 120)}...`
}
</script>

<style scoped>
.search-post-dialog {
    min-height: 320px;
}

.search-row {
    display: flex;
    gap: 8px;
}

.search-results {
    min-height: 260px;
    max-height: 420px;
    margin-top: 12px;
    overflow-y: auto;
}

.search-result {
    padding: 10px 0;
    border-bottom: 1px solid #ebeef5;
    cursor: pointer;
}

.search-result:hover {
    background-color: #f7f8fa;
}

.search-result-head {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
}

.search-result-floor {
    color: var(--el-color-primary);
}

.search-result-user {
    color: #303133;
    font-weight: 600;
}

.search-result-field {
    color: #909399;
}

.search-result-text {
    margin-top: 6px;
    color: #606266;
    font-size: 13px;
    line-height: 1.5;
    overflow-wrap: anywhere;
}
</style>
