<template>
  <div class="container">
    <div class="header">
      <h1>
        LINE BOT Webhook 更新工具
        <div class="title-actions">
          <button class="help-btn" @click="toggleHelpPopup">
            <svg class="help-icon" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
              />
            </svg>
          </button>
          <a
            href="https://github.com/a596116/line-webhook"
            target="_blank"
            rel="noopener noreferrer"
            class="github-link"
          >
            <svg class="github-icon" viewBox="0 0 24 24">
              <path
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>
          </a>
        </div>
      </h1>
    </div>

    <!-- 幫助彈窗 -->
    <div v-if="showHelpPopup" class="help-popup">
      <div class="help-popup-content">
        <div class="help-popup-header">
          <h3>如何使用 LINE BOT Webhook 更新工具</h3>
          <button class="close-btn" @click="toggleHelpPopup">
            <svg viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>
        <div class="help-popup-body">
          <h4>設定與保存金鑰</h4>
          <p>1. 在「Channel Access Token」欄位輸入您的 token</p>
          <p>2. 填寫金鑰名稱（如未填寫，系統將自動命名）</p>
          <p>3. 點擊「儲存設定」按鈕保存您的金鑰</p>

          <h4>檢查 Webhook 狀態</h4>
          <p>1. 選擇已保存的金鑰</p>
          <p>2. 點擊「檢查 Webhook 狀態」按鈕</p>

          <h4>更新 Webhook URL</h4>
          <p>1. 在「完整 Webhook URL」欄位輸入新的網址</p>
          <p>2. 點擊「更新 Webhook URL」按鈕</p>
          <p>3. 系統將更新設定並顯示結果</p>

          <h4>資料安全與隱私</h4>
          <p>• 您的所有金鑰設定僅保存在本地瀏覽器中</p>
          <p>• 所有資料都存儲在 localStorage，不會上傳至任何伺服器</p>
          <p>• 您可以放心測試使用，無需擔心金鑰外洩</p>
          <p>• 即使關閉瀏覽器，設定仍會保留在本地裝置上</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>
          <svg class="icon" viewBox="0 0 24 24">
            <path
              d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
            />
          </svg>
          LINE BOT 金鑰設定
        </h2>
      </div>
      <div class="card-content">
        <div class="key-management">
          <div class="select-group">
            <label for="keySelector">選擇已保存的金鑰:</label>
            <select
              id="keySelector"
              v-model="selectedKey"
              @change="loadSelectedKey"
            >
              <option value="">-- 選擇金鑰 --</option>
              <option v-for="key in savedKeys" :key="key" :value="key">
                {{ key }}
              </option>
            </select>
          </div>
          <div class="input-group">
            <label for="keyName">金鑰名稱:</label>
            <input
              id="keyName"
              v-model="keyName"
              type="text"
              placeholder="輸入名稱以保存此金鑰設定"
            />
          </div>
        </div>
        <div class="input-group">
          <label for="accessToken">Channel Access Token:</label>
          <input
            id="accessToken"
            v-model="accessToken"
            type="password"
            placeholder="請輸入您的 Channel Access Token"
          />
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>
          <svg class="icon" viewBox="0 0 24 24">
            <path
              d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.03 8.03 0 0 1 5.08 16zm2.95-8H5.08a8.03 8.03 0 0 1 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"
            />
          </svg>
          Webhook 設定
        </h2>
      </div>
      <div class="card-content">
        <div class="input-group">
          <label for="webhookUrl">完整 Webhook URL:</label>
          <input
            id="webhookUrl"
            v-model="webhookUrl"
            type="text"
            placeholder="例如: https://your-app-name.vercel.app/api/LineWebhook"
          />
        </div>
      </div>
    </div>

    <!-- 將 Webhook 狀態區塊移到這裡 -->
    <div class="card webhook-status-card" v-if="webhookStatus">
      <div class="card-header">
        <h2>
          <svg class="icon" viewBox="0 0 24 24">
            <path
              d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
            />
          </svg>
          Webhook 狀態
        </h2>
      </div>
      <div class="card-content webhook-status-content">
        <div class="webhook-status-item">
          <div class="status-label">URL:</div>
          <div class="status-value">{{ webhookStatus.url }}</div>
        </div>
        <div class="webhook-status-item">
          <div class="status-label">狀態:</div>
          <div class="status-value">
            <span v-if="webhookStatus.active" class="status-active">
              已啟用
              <svg class="status-icon success inline" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </span>
            <span v-else class="status-inactive">
              未啟用
              <svg class="status-icon error inline" viewBox="0 0 24 24">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="button-group">
      <button
        class="btn primary"
        @click="checkWebhookStatus"
        :disabled="!accessToken"
      >
        <svg class="btn-icon" viewBox="0 0 24 24">
          <path
            d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
          />
        </svg>
        檢查Webhook狀態
      </button>
      <button
        class="btn secondary"
        @click="updateWebhook"
        :disabled="!accessToken || !webhookUrl"
      >
        <svg class="btn-icon" viewBox="0 0 24 24">
          <path
            d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
          />
        </svg>
        更新Webhook URL
      </button>
      <button class="btn accent" @click="saveSettings" :disabled="!accessToken">
        <svg class="btn-icon" viewBox="0 0 24 24">
          <path
            d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
          />
        </svg>
        儲存設定
      </button>
      <button
        class="btn delete"
        @click="deleteSelectedKey"
        :disabled="!selectedKey"
      >
        <svg class="btn-icon" viewBox="0 0 24 24">
          <path
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
          />
        </svg>
        刪除金鑰
      </button>
    </div>

    <div class="card log-card">
      <div class="card-header">
        <h2>
          <svg class="icon" viewBox="0 0 24 24">
            <path
              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
            />
          </svg>
          狀態
        </h2>
      </div>
      <div class="log-content">
        <div v-for="(log, index) in logs" :key="index" class="log-item">
          <div class="log-icon" v-if="log.type === 'success'">
            <svg class="status-icon success" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <div class="log-icon" v-else-if="log.type === 'error'">
            <svg class="status-icon error" viewBox="0 0 24 24">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </div>
          <div class="log-icon" v-else-if="log.type === 'info'">
            <svg class="status-icon info" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
              />
            </svg>
          </div>
          <div class="log-message">{{ log.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

useSeoMeta({
  title: 'LINE BOT Webhook 更新工具',
  description: 'LINE BOT Webhook 更新工具',
  ogTitle: 'LINE BOT Webhook 更新工具',
  ogDescription: 'LINE BOT Webhook 更新工具',
  ogImage: '/webhook.png',
  ogUrl: 'https://linewebhook.vercel.app/',
  ogType: 'website',
})

// 狀態管理
const accessToken = ref('')
const webhookUrl = ref('')
const keyName = ref('')
const selectedKey = ref('')
const savedKeys = ref<string[]>([])
const logs = ref<{ type: 'success' | 'error' | 'info'; message: string }[]>([])
const webhookStatus = ref<{ url: string; active: boolean } | null>(null)
const showHelpPopup = ref(false)

// 計算完整的 Webhook URL
const fullWebhookUrl = computed(() => {
  if (!webhookUrl.value) return ''
  return webhookUrl.value
})

// 載入所有保存的金鑰名稱
const loadSavedKeys = () => {
  try {
    const keysJSON = localStorage.getItem('lineBotSavedKeys')
    if (keysJSON) {
      savedKeys.value = JSON.parse(keysJSON)
    }
  } catch (error) {
    console.error('載入金鑰列表時發生錯誤:', error)
  }
}

// 載入選擇的金鑰設定
const loadSelectedKey = () => {
  if (!selectedKey.value) return

  try {
    const keyData = localStorage.getItem(`lineBotKey_${selectedKey.value}`)
    if (keyData) {
      const data = JSON.parse(keyData)
      accessToken.value = data.accessToken || ''
      webhookUrl.value = data.webhookUrl || ''
      keyName.value = selectedKey.value
      addLog('success', `已載入金鑰設定: ${selectedKey.value}`)
    }
  } catch (error) {
    addLog('error', `載入金鑰設定時發生錯誤: ${error}`)
  }
}

// 儲存設定
const saveSettings = () => {
  if (!accessToken.value) {
    addLog('error', '請輸入 Channel Access Token')
    return
  }

  try {
    // 確定保存的金鑰名稱
    let saveName = keyName.value
    if (!saveName) {
      // 生成預設名稱 default1, default2, ...
      const defaultNames = savedKeys.value.filter((k) =>
        k.startsWith('default')
      )
      let maxNum = 0
      defaultNames.forEach((name) => {
        const num = parseInt(name.replace('default', ''))
        if (!isNaN(num) && num > maxNum) maxNum = num
      })
      saveName = `default${maxNum + 1}`
      keyName.value = saveName
    }

    // 保存金鑰設定
    const keyData = {
      accessToken: accessToken.value,
      webhookUrl: webhookUrl.value,
    }
    localStorage.setItem(`lineBotKey_${saveName}`, JSON.stringify(keyData))

    // 更新金鑰列表
    if (!savedKeys.value.includes(saveName)) {
      savedKeys.value.push(saveName)
      localStorage.setItem('lineBotSavedKeys', JSON.stringify(savedKeys.value))
    }

    addLog('success', `金鑰設定已儲存為: ${saveName}`)
  } catch (error) {
    addLog('error', '儲存設定時發生錯誤')
  }
}

// 檢查 Webhook 狀態
const checkWebhookStatus = async () => {
  if (!accessToken.value) {
    addLog('error', '請先輸入 Channel Access Token')
    return
  }

  try {
    addLog('info', '正在檢查 Webhook 狀態...')

    const response = await fetch('/api/line/webhook/status', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '檢查 Webhook 狀態時發生錯誤')
    }

    const data = await response.json()

    webhookStatus.value = {
      url: data.body.url || '尚未設定',
      active: data.body.active,
    }

    // 將獲取到的 webhook URL 填入輸入框
    if (data.body.url) {
      webhookUrl.value = data.body.url
      addLog('info', '已自動填入目前的 Webhook URL')
    }

    addLog('success', '成功檢查 Webhook 狀態')
  } catch (error: any) {
    addLog('error', `檢查 Webhook 狀態時發生錯誤: ${error.message}`)
  }
}

// 更新 Webhook URL
const updateWebhook = async () => {
  if (!accessToken.value) {
    addLog('error', '請先輸入 Channel Access Token')
    return
  }

  if (!webhookUrl.value) {
    addLog('error', '請輸入有效的 Webhook URL')
    return
  }

  try {
    addLog('info', '正在更新 Webhook URL...')

    const response = await fetch('/api/line/webhook/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: webhookUrl.value }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '更新 Webhook URL 時發生錯誤')
    }

    const data = await response.json()

    webhookStatus.value = {
      url: data.body.url,
      active: data.body.active,
    }

    addLog('success', `Webhook URL 已更新為: ${webhookUrl.value}`)
  } catch (error: any) {
    addLog('error', `更新 Webhook URL 時發生錯誤: ${error.message}`)
  }
}

// 添加日誌
const addLog = (type: 'success' | 'error' | 'info', message: string) => {
  logs.value.unshift({ type, message })
  // 最多保留 20 條日誌
  if (logs.value.length > 20) {
    logs.value = logs.value.slice(0, 20)
  }
}

// 刪除選擇的金鑰
const deleteSelectedKey = () => {
  if (!selectedKey.value) {
    addLog('error', '請先選擇要刪除的金鑰')
    return
  }

  try {
    // 從 localStorage 刪除金鑰數據
    localStorage.removeItem(`lineBotKey_${selectedKey.value}`)

    // 從金鑰列表中移除
    const index = savedKeys.value.indexOf(selectedKey.value)
    if (index > -1) {
      savedKeys.value.splice(index, 1)
      localStorage.setItem('lineBotSavedKeys', JSON.stringify(savedKeys.value))
    }

    // 清除選擇和相關表單
    if (keyName.value === selectedKey.value) {
      keyName.value = ''
    }
    selectedKey.value = ''

    addLog('success', `金鑰設定 "${selectedKey.value}" 已刪除`)
  } catch (error) {
    addLog('error', `刪除金鑰設定時發生錯誤: ${error}`)
  }
}

// 初始化
onMounted(() => {
  // 載入金鑰列表
  loadSavedKeys()
})

// 打開/關閉幫助彈窗
const toggleHelpPopup = () => {
  showHelpPopup.value = !showHelpPopup.value
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

h1 {
  font-size: 24px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-actions {
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
}

.help-btn {
  background: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  padding: 0;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-icon {
  width: 24px;
  height: 24px;
  fill: #555;
  transition: fill 0.3s;
}

.help-btn:hover .help-icon {
  fill: #2196f3;
}

.github-link {
  display: inline-flex;
  vertical-align: middle;
  color: #333;
  transition: color 0.3s;
  align-items: center;
}

.github-link:hover {
  color: #2196f3;
}

.github-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
  vertical-align: text-top;
  position: relative;
  top: -1px;
}

.card {
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.card-header {
  background-color: #f0f0f0;
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
  display: flex;
  align-items: center;
}

.card-content {
  padding: 15px;
}

.key-management {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.select-group,
.input-group {
  flex: 1;
  margin-bottom: 15px;
}

.select-group label,
.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.select-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  background-color: white;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.webhook-url {
  padding: 8px;
  background-color: #eee;
  border-radius: 4px;
  word-break: break-all;
  min-height: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  flex: 1;
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary {
  background-color: #4a5d80;
  color: white;
}

.primary:hover {
  background-color: #5a6d90;
}

.secondary {
  background-color: #6a549d;
  color: white;
}

.secondary:hover {
  background-color: #7a64ad;
}

.accent {
  background-color: #2a8c7d;
  color: white;
}

.accent:hover {
  background-color: #3a9c8d;
}

.delete {
  background-color: #d64336;
  color: white;
}

.delete:hover {
  background-color: #e65346;
}

.log-card {
  max-height: 300px;
}

.log-content {
  padding: 15px;
  max-height: 250px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.log-icon {
  margin-right: 10px;
  font-size: 18px;
}

.log-message {
  flex: 1;
}

.webhook-status-card {
  margin-top: 20px;
  background-color: #f5f5f5;
}

.webhook-status-content {
  padding: 15px;
}

.webhook-status-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.status-label {
  font-weight: bold;
  width: 60px;
  flex-shrink: 0;
}

.status-value {
  flex: 1;
  word-break: break-all;
}

.status-active {
  color: #4caf50;
  font-weight: bold;
}

.status-inactive {
  color: #f44336;
  font-weight: bold;
}

/* 確保原有的 webhook-status 類不衝突 */
.log-content .webhook-status {
  display: none;
}

.key-selector-group {
  display: none;
}

@media (max-width: 640px) {
  .key-management {
    flex-direction: column;
  }
}

/* 添加新的圖標相關樣式 */
.icon {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  vertical-align: middle;
  fill: currentColor;
}

.btn-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  fill: currentColor;
  vertical-align: middle;
}

.status-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.status-icon.success {
  fill: #4caf50;
}

.status-icon.error {
  fill: #f44336;
}

.status-icon.info {
  fill: #2196f3;
}

.status-icon.inline {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-bottom: 2px;
}

.help-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.help-popup-content {
  background-color: white;
  width: 90%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.help-popup-header {
  padding: 15px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.help-popup-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.close-btn svg {
  width: 24px;
  height: 24px;
  fill: #555;
}

.help-popup-body {
  padding: 20px;
  overflow-y: auto;
}

.help-popup-body h4 {
  margin-top: 15px;
  margin-bottom: 8px;
  color: #333;
}

.help-popup-body p {
  margin: 5px 0;
  color: #555;
}
</style>
