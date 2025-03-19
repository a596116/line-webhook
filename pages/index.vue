<template>
  <div class="container">
    <div class="header">
      <h1>LINE BOT Webhook 更新工具</h1>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>LINE BOT 金鑰設定 🔑</h2>
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
        <h2>Webhook 設定 🌐</h2>
      </div>
      <div class="card-content">
        <div class="input-group">
          <label for="webhookUrl">完整 Webhook URL:</label>
          <input
            id="webhookUrl"
            v-model="webhookUrl"
            type="text"
            placeholder="例如: https://example.ngrok-free.app/api/LineLLM"
          />
        </div>
      </div>
    </div>

    <div class="button-group">
      <button class="btn save" @click="saveSettings">儲存設定 💾</button>
      <button
        class="btn delete"
        @click="deleteSelectedKey"
        :disabled="!selectedKey"
      >
        刪除金鑰 🗑️
      </button>
      <button
        class="btn update"
        @click="updateWebhook"
        :disabled="!accessToken || !webhookUrl"
      >
        更新 Webhook URL 🔄
      </button>
      <button
        class="btn check"
        @click="checkWebhookStatus"
        :disabled="!accessToken"
      >
        檢查 Webhook 狀態 🔍
      </button>
    </div>

    <div class="card log-card">
      <div class="card-header">
        <h2>狀態 📊</h2>
      </div>
      <div class="log-content">
        <div v-for="(log, index) in logs" :key="index" class="log-item">
          <div class="log-icon" v-if="log.type === 'success'">✅</div>
          <div class="log-icon" v-else-if="log.type === 'error'">❌</div>
          <div class="log-icon" v-else-if="log.type === 'info'">📝</div>
          <div class="log-message">{{ log.message }}</div>
        </div>
        <div v-if="webhookStatus" class="webhook-status">
          <div>目前 Webhook 狀態:</div>
          <div>URL: {{ webhookStatus.url }}</div>
          <div>
            狀態: {{ webhookStatus.active ? '已啟用 ✅' : '未啟用 ❌' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 狀態管理
const accessToken = ref('')
const webhookUrl = ref('')
const keyName = ref('')
const selectedKey = ref('')
const savedKeys = ref<string[]>([])
const logs = ref<{ type: 'success' | 'error' | 'info'; message: string }[]>([])
const webhookStatus = ref<{ url: string; active: boolean } | null>(null)

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
  } catch (error) {
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
  } catch (error) {
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
}

h1 {
  font-size: 24px;
  color: #333;
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

.save {
  background-color: #4caf50;
  color: white;
}

.delete {
  background-color: #f44336;
  color: white;
}

.update {
  background-color: #2196f3;
  color: white;
}

.check {
  background-color: #ff9800;
  color: white;
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

.webhook-status {
  margin-top: 15px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.key-selector-group {
  display: none;
}

@media (max-width: 640px) {
  .key-management {
    flex-direction: column;
  }
}
</style>
