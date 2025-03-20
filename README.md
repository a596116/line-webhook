# LINE BOT Webhook 更新工具

## 專案簡介

這是一個專為LINE BOT開發者設計的Webhook管理工具，讓您能夠輕鬆管理和更新LINE機器人的Webhook URL設定。無需通過LINE Developer Console，即可快速查看狀態並更新設定。

## 示例展示
![示例截圖](/public/example.png)

## 主要功能

### 🔑 金鑰管理
- 儲存多個LINE BOT的Channel Access Token
- 命名和管理不同的BOT設定
- 一鍵切換在不同的配置之間
- 刪除不需要的金鑰設定

### 🔗 Webhook設定
- 查詢目前的Webhook URL狀態
- 檢查Webhook是否已正確啟用
- 一鍵更新到新的Webhook URL

### 📊 狀態監控
- 即時顯示所有操作結果
- 清晰呈現成功與錯誤訊息
- 操作記錄保留最近20條日誌

## 使用方法

### 設定與保存金鑰
1. 在「Channel Access Token」欄位輸入您的token
2. 填寫金鑰名稱（如未填寫，系統將自動命名）
3. 點擊「儲存設定」按鈕保存您的金鑰
4. 已保存的金鑰將出現在下拉選單中，方便未來使用

### 檢查Webhook狀態
1. 選擇已保存的金鑰
2. 點擊「檢查Webhook狀態」按鈕
3. 系統將顯示目前的Webhook URL和啟用狀態
4. 若已設定，系統會自動填入目前的Webhook URL

### 更新Webhook URL
1. 在「完整Webhook URL」欄位輸入新的網址
2. 點擊「更新Webhook URL」按鈕
3. 系統將更新設定並顯示結果
4. 更新完成後會自動顯示新設定的狀態

## 技術特點

- 使用Vue.js和Nuxt.js開發的單頁應用
- 所有數據存儲在localStorage，不需要後端數據庫
- 安全性設計，敏感資料只儲存在本地
- 響應式布局，適合桌面和行動裝置使用
- 簡潔直觀的使用者介面

## 資料安全與隱私

- **資料本地化儲存：** 所有設定和金鑰僅保存在您的瀏覽器的 localStorage 中
- **零伺服器儲存：** 您的 Channel Access Token 和其他配置不會上傳至任何伺服器
- **API 直接呼叫：** 金鑰僅用於直接與 LINE API 通訊，不經過任何第三方服務
- **安全使用：** 您可以放心在開發和生產環境中使用，不必擔心金鑰外洩
- **數據持久化：** 關閉瀏覽器後，所有設定仍會保留，方便下次使用
- **完全控制：** 隨時可以刪除已保存的金鑰

## 使用情境

- 開發測試過程中頻繁切換Webhook環境
- 管理多個LINE BOT的webhook設定
- 臨時需要更新webhook時快速操作
- 診斷webhook連線問題

此工具可大幅簡化LINE BOT開發流程中webhook管理的工作，讓開發者能更專注於機器人功能的實作。
