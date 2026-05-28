<template>
    <div id="page">
        <div id="sidebar">
            <div class="sidebar-item" :class="{ active: activeTab === 'home' }" @click="activeTab = 'home'">
                <ui-icon name="home" /> 首页
            </div>
            <div class="sidebar-item" :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">
                <ui-icon name="settings" /> 设置
            </div>
        </div>
        <div id="content">
            <div id="header">
                <div class="nav"> </div>
                <div class="nav">
                    <div class="nav-item">
                        <a class="gb_I"
                           @click.prevent="openInBrowser('https://github.com/Sorceresssis/TiebaReader')">
                            Reader
                        </a>
                    </div>
                    <div class="nav-item">
                        <a class="gb_I"
                           @click.prevent="openInBrowser('https://github.com/Sorceresssis/TiebaScraper')">
                            Scraper
                        </a>
                    </div>
                </div>
            </div>
            <div id="main" v-show="activeTab === 'home'">
                <h1 id="logo">Tieba Reader</h1>
                <div id="drag-dialog">
                    <file-drop type="dir"
                               :multi="false"
                               label="或"
                               @open="handleFileDropOpen" />
                </div>
            </div>
            <div id="main-settings" v-if="activeTab === 'settings'">
                <SettingsView />
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref } from "vue";
import FileDrop from "@/components/FileDrop.vue";
import SettingsView from "@/components/SettingsView.vue";
import UiIcon from "@/components/UiIcon.vue";
import { openInBrowser } from "./api/electronApi";
import { ElMessage } from "element-plus";

const activeTab = ref<'home' | 'settings'>('home')

const handleFileDropOpen = async function (paths: string[]) {
    if (paths[0]) {
        const res = await window.appAPI.createThreadWindow(paths[0]);
        if (res.code === 1) {
            ElMessage.error(res.msg)
        }
    }
}

</script>

<style>
#page {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    background-color: var(--bg-surface);
}

#sidebar {
    width: 200px;
    background-color: var(--bg-color);
    display: flex;
    flex-direction: column;
    padding: 20px 10px;
    box-sizing: border-box;
    gap: 8px;
    border-right: 1px solid var(--border-color);
}

.sidebar-item {
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 12px;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.sidebar-item:hover {
    background-color: var(--bg-hover);
}

.sidebar-item.active {
    background-color: var(--bg-hover);
    border: 1px solid var(--border-color);
    font-weight: 500;
}

#content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

#header {
    display: flex;
    justify-content: space-between;
    padding: 8px 40px;
}

.nav {
    display: flex;
    height: 48px;
    box-sizing: border-box;
    padding: 0 4px;
    line-height: 48px;
}

.nav-item {
    display: inline-block;
    padding-left: 15px;
}

.gb_I {
    display: inline-block;
    line-height: 24px;
    vertical-align: middle;
    color: var(--text-primary);
    font-size: 13px;
    cursor: pointer;
}

.gb_I:hover {
    text-decoration: underline;
}

#main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
}

#main-settings {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 60px;
    flex-grow: 1;
    overflow-y: auto;
}

#logo {
    display: flex;
    width: 500px;
    justify-content: center;
    margin-bottom: 38px;
    font-size: 50px;
    user-select: none;
}

#drag-dialog {
    width: 700px;
    height: 400px;
    padding: 20px;
    border-radius: 25px;
    box-sizing: border-box;
    box-shadow:
        color-mix(in srgb, var(--cr-shadow-color) 30%, transparent) 0 1px 3px 0,
        color-mix(in srgb, var(--cr-shadow-color) 15%, transparent) 0 4px 8px 3px;
}
</style>