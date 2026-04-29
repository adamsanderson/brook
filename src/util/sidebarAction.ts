import browser from 'webextension-polyfill'

export async function openSidebar(windowId?: number): Promise<void> {
  if (__BROWSER__ === 'chrome') {
    const wid = windowId ?? (await chrome.windows.getLastFocused({ windowTypes: ['normal'] })).id!
    await chrome.sidePanel.open({ windowId: wid })
  } else {
    await browser.sidebarAction.open()
  }
}

export async function closeSidebar(windowId?: number): Promise<void> {
  if (__BROWSER__ === 'chrome') {
    // chrome.sidePanel.close() requires Chrome 141+
    if (chrome.sidePanel.close) {
      const wid = windowId ?? (await chrome.windows.getLastFocused({ windowTypes: ['normal'] })).id!
      await chrome.sidePanel.close({ windowId: wid })
    }
  } else {
    await browser.sidebarAction.close()
  }
}
