import type { FragmentItem } from '../types'
import { getSeedFragments } from '../data/fragments'

const STORAGE_KEY = 'inspiration-fragments:v1'

/** 从 localStorage 读取灵感墙，首次访问时写入种子数据 */
export function loadFragments(): FragmentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeds = getSeedFragments()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds))
      return seeds
    }
    return JSON.parse(raw) as FragmentItem[]
  } catch {
    return getSeedFragments()
  }
}

/** 保存灵感墙到 localStorage */
export function saveFragments(items: FragmentItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // 存储已满或被禁用时静默失败
  }
}

/** 编码灵感墙为 base64url，用于漂流瓶分享 */
export function encodeFragments(items: FragmentItem[]): string {
  const json = JSON.stringify(items)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** 解码漂流瓶 base64url 字符串 */
export function decodeFragments(encoded: string): FragmentItem[] | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    const data = JSON.parse(json)
    if (!Array.isArray(data)) return null
    return data.filter(
      (item): item is FragmentItem =>
        item && typeof item.id === 'string' && typeof item.content === 'string',
    )
  } catch {
    return null
  }
}
