import { app } from "electron"
import n_fs from "node:fs"
import n_path from "node:path"

type AppConfig = {
    lastOpenedDataPath?: string
}

const CONFIG_FILE_NAME = 'tieba-reader.json'

const isNodeError = (error: unknown): error is NodeJS.ErrnoException => {
    return error instanceof Error
}

const getConfigPath = (): string => {
    return n_path.join(app.getPath('userData'), CONFIG_FILE_NAME)
}

const readConfig = async (): Promise<AppConfig> => {
    try {
        const configPath = getConfigPath()
        console.log('[appConfig] readConfig from', configPath)
        const raw = await n_fs.promises.readFile(configPath, 'utf-8')
        const parsed = JSON.parse(raw) as AppConfig
        if (!parsed || typeof parsed !== 'object') return {}
        return parsed
    } catch (error: unknown) {
        console.warn('[appConfig] readConfig failed:', error)
        if (isNodeError(error) && error.code === 'ENOENT') return {}
        return {}
    }
}

const writeConfig = async (config: AppConfig): Promise<void> => {
    try {
        const configPath = getConfigPath()
        console.log('[appConfig] writeConfig to', configPath, 'content=', config)
        await n_fs.promises.mkdir(n_path.dirname(configPath), { recursive: true })
        const content = JSON.stringify(config, null, 2)
        await n_fs.promises.writeFile(configPath, content, 'utf-8')
    } catch {
        return
    }
}

const normalizePath = (path: string): string | undefined => {
    if (!path) return undefined
    const trimmed = path.trim()
    if (trimmed === '') return undefined
    return n_path.normalize(trimmed)
}

export const getLastOpenedDataPath = async (): Promise<string | undefined> => {
    const config = await readConfig()
    const value = config.lastOpenedDataPath
    if (!value || typeof value !== 'string') return undefined
    return normalizePath(value)
}

export const getLastOpenedDataDir = async (): Promise<string | undefined> => {
    const lastOpenedDataPath = await getLastOpenedDataPath()
    if (!lastOpenedDataPath) return undefined

    try {
        const stats = await n_fs.promises.stat(lastOpenedDataPath)
        if (!stats.isDirectory()) return undefined
        return lastOpenedDataPath
    } catch {
        return undefined
    }
}

export const setLastOpenedDataPath = async (path: string): Promise<void> => {
    const normalizedPath = normalizePath(path)
    if (!normalizedPath) return
    const config = await readConfig()
    config.lastOpenedDataPath = normalizedPath
    await writeConfig(config)
    console.log('[appConfig] setLastOpenedDataPath saved:', normalizedPath)
}
