import { vi } from 'vitest'

// Mock out the browser API
const mockBrowser = {
  runtime: {
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    sendMessage: vi.fn(() => Promise.resolve()),
  },
  storage: {
    local: {
      get: vi.fn(() => Promise.resolve({})),
      set: vi.fn(() => Promise.resolve()),
    },
  },
}

// Mock webextension-polyfill module
vi.mock('webextension-polyfill', () => ({
  default: mockBrowser,
}))

// Also make it available globally for legacy code
window.browser = mockBrowser
global.browser = mockBrowser