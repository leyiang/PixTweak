import { KeyboardShortcut } from '@/core/KeyboardShortcut'
import { KeyboardState } from '@/core/KeyboardState'
import { defineStore } from 'pinia'

export const useKeyboardStore = defineStore('keyboard-store', {
  state: () => {
    return {
        keyState: new KeyboardState(),
        keyShortcut: new KeyboardShortcut()
    }
  },
})