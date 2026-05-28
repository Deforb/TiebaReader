<template>
    <div class="settings-view">
        <h2 class="settings-title">基础设置</h2>
        <div class="settings-card">
            <div class="setting-item">
                <div class="setting-info">
                    <div class="setting-name">上次打开的路径</div>
                    <div class="setting-desc" v-if="lastPath">{{ lastPath }}</div>
                    <div class="setting-desc empty" v-else>暂无记录</div>
                </div>
                <div class="setting-actions" v-if="lastPath">
                    <el-button @click="handleOpenPath">打开文件夹</el-button>
                    <el-button type="danger" @click="handleClearPath">清除记录</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const lastPath = ref<string | undefined>(undefined)

const fetchLastPath = async () => {
    lastPath.value = await window.appAPI.getLastOpenedDataPath()
}

onMounted(() => {
    fetchLastPath()
})

const handleClearPath = async () => {
    await window.appAPI.clearLastOpenedDataPath()
    await fetchLastPath()
    ElMessage.success('历史记录已清除')
}

const handleOpenPath = () => {
    if (lastPath.value) {
        window.electronAPI.openInExplorer(lastPath.value, 'openPath')
    }
}
</script>

<style scoped>
.settings-view {
    width: 600px;
    padding: 20px 40px;
    box-sizing: border-box;
}

.settings-title {
    font-size: 24px;
    margin-bottom: 24px;
    font-weight: 500;
}

.settings-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.setting-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
}

.setting-name {
    font-size: 16px;
    color: #333;
}

.setting-desc {
    font-size: 13px;
    color: #666;
    word-break: break-all;
}

.setting-desc.empty {
    color: #999;
}

.setting-actions {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
    margin-left: 20px;
}
</style>