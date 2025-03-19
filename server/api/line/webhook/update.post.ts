import { defineEventHandler, readBody } from 'h3'

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

    // 從請求體讀取新的 Webhook URL
    const body = await readBody(event)
    const { url } = body

    if (!url) {
      return {
        statusCode: 400,
        body: { error: '未提供 Webhook URL' },
      }
    }

    // 呼叫 Line API 更新 Webhook URL
    const response = await fetch(
      'https://api.line.me/v2/bot/channel/webhook/endpoint',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: url }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return {
        statusCode: response.status,
        body: { error: errorData.message || '更新 Webhook URL 時發生錯誤' },
      }
    }

    // 獲取更新後的狀態
    const statusResponse = await fetch(
      'https://api.line.me/v2/bot/channel/webhook/endpoint',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const statusData = await statusResponse.json()

    return {
      statusCode: 200,
      body: {
        url: statusData.endpoint || url,
        active: statusData.active || false,
        message: 'Webhook URL 已成功更新',
      },
    }
  } catch (error) {
    console.error('更新 Webhook URL 時發生錯誤:', error)
    return {
      statusCode: 500,
      body: { error: '處理請求時發生伺服器錯誤' },
    }
  }
})
