import { defineEventHandler, readBody, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // 從請求頭獲取訪問令牌
    const authHeader = event.req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: { error: '未提供有效的授權令牌' },
      }
    }

    const accessToken = authHeader.split(' ')[1]

    // 呼叫 Line API 獲取 Webhook 狀態
    const response = await fetch(
      'https://api.line.me/v2/bot/channel/webhook/endpoint',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return {
        statusCode: response.status,
        body: { error: errorData.message || '檢查 Webhook 狀態時發生錯誤' },
      }
    }

    const data = await response.json()
    return {
      statusCode: 200,
      body: {
        url: data.endpoint || '',
        active: data.active || false,
      },
    }
  } catch (error) {
    console.error('檢查 Webhook 狀態時發生錯誤:', error)
    return {
      statusCode: 500,
      body: { error: '處理請求時發生伺服器錯誤' },
    }
  }
})
