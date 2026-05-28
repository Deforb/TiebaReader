import { ipcMain, IpcMainInvokeEvent } from 'electron'
import n_fs from "node:fs"
import threadWindow from '../windows/thread.window'
import container, { rebindDataSourcesDeps } from '../container/container'
import InjectType from '../container/inject_type'
import scrapeDataSourceDirStruct from '../config/scrapeDataSourceDirStruct'
import Result from '../pojo/Result'
import { setLastOpenedDataPath } from '../config/appConfig'
import { getLastOpenedDataPath } from '../config/appConfig'
import type ScrapeInfoService from '../services/ScrapeInfoService'

const isNodeError = (error: unknown): error is NodeJS.ErrnoException => {
    return error instanceof Error
}

export default function appIpcMain() {
    ipcMain.handle('window:createThreadWindow', async (e: IpcMainInvokeEvent, path: string, tid?: number): Promise<Result> => {
        try {
            console.log('[appIpcMain] createThreadWindow called with', { path, tid })
            const stats = await n_fs.promises.lstat(path);

            console.log('[appIpcMain] lstat result for', path, stats)

            if (stats.isFile()) {
                console.warn('[appIpcMain] path is a file, not a directory:', path)
                return Result.error('路径指向的是文件，请选择文件夹')
            }

            // 启动Thread窗口,不加载数据，只是确保这个窗口的数据源是正确的。
            rebindDataSourcesDeps(path, tid)

            // scrape_info.josn 不存在报错：
            const scrapeInfoRes = await container.get<ScrapeInfoService>(InjectType.ScrapeInfoService).get()

            if (scrapeInfoRes.code !== 0) return scrapeInfoRes
            const scrapeInfo = scrapeInfoRes.data as Entity.ScrapeInfo
            if (!tid) tid = scrapeInfo.main_thread

            const threadDir = scrapeDataSourceDirStruct.getThreadsDir(path, tid)
            console.log('[appIpcMain] computed threadDir=', threadDir)
            if (!n_fs.existsSync(threadDir)) {
                console.error('[appIpcMain] threadDir missing:', threadDir)
                return Result.error('数据源损坏')
            }

            console.log('[appIpcMain] creating thread window')
            threadWindow.createWindow({ path, tid })
            try {
                await setLastOpenedDataPath(path)
                console.log('[appIpcMain] saved last opened path:', path)
            } catch (err) {
                console.error('[appIpcMain] failed to save last opened path', err)
            }
            return Result.ok()
        } catch (error: unknown) {
            console.error('[appIpcMain] createThreadWindow error:', error)
            if (isNodeError(error) && error.code === 'ENOENT') {
                return Result.error('路径不存在');
            } else {
                throw error;
            }
        }

    })

    ipcMain.handle('app:getLastOpenedDataPath', async (): Promise<string | undefined> => {
        try {
            const p = await getLastOpenedDataPath()
            console.log('[appIpcMain] app:getLastOpenedDataPath ->', p)
            return p
        } catch (err) {
            console.error('[appIpcMain] app:getLastOpenedDataPath error', err)
            return undefined
        }
    })
} 
