import browser from 'webextension-polyfill'

export async function openSidebar(windowId?: number): Promise<void> {
  // Be careful, browsers are very strict about what counts as a user action.  
  // Even checking in firefox to see if the sidebar is open will cause this to fail.
  if (__BROWSER__ === 'chrome') {
    const wid = windowId ?? (await chrome.windows.getLastFocused({ windowTypes: ['normal'] })).id!
    await chrome.sidePanel.open({ windowId: wid })
  } else {
    await browser.sidebarAction.open()
  }
}
