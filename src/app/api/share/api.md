## get 
curl "https://api.vika.cn/fusion/v1/datasheets/{DATASHEET_ID}/records?viewId={VIEW_ID}&fieldKey=name" \
  -H "Authorization: Bearer {API_TOKEN}"

### response 
{
  "code": 200,
  "success": true,
  "message": "Request successful",
  "data": {
    "total": 4,
    "pageNum": 1,
    "pageSize": 4,
    "records": [
      {
        "recordId": "rec19ME5hTlrf",
        "fields": {
          "pin": "123456",
          "preset": "21321312312"
        }
      },
      {
        "recordId": "reccno5hAhKH4",
        "fields": {
          "pin": "232132",
          "preset": "22312321321312"
        }
      }
    ]
  }
}


## add

curl -X POST "https://api.vika.cn/fusion/v1/datasheets/{DATASHEET_ID}/records?viewId={VIEW_ID}&fieldKey=name"  \
  -H "Authorization: Bearer {API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
  "records": [
  {
    "fields": {
      "pin": "123456",
      "preset": "21321312312"
    }
  },
  {
    "fields": {
      "pin": "232132",
      "preset": "22312321321312"
    }
  }
],
  "fieldKey": "name"
}'
### response
{
  "code": 200,
  "success": true,
  "message": "Request successful",
  "data": {
    "records": [
      {
        "recordId": "rec19ME5hTlrf",
        "fields": {
          "pin": "123456",
          "preset": "21321312312"
        }
      },
      {
        "recordId": "reccno5hAhKH4",
        "fields": {
          "pin": "232132",
          "preset": "22312321321312"
        }
      }
    ]
  }
}

## delete 

curl -X DELETE "https://api.vika.cn/fusion/v1/datasheets/{DATASHEET_ID}/records?recordIds={RECORD_ID}" \
  -H "Authorization: Bearer {API_TOKEN}"

### response 
{
  "code": 200,
  "success": true,
  "message": "请求成功"
}

## 环境变量说明

请在 `.env.local` 文件中配置以下变量：

- `{API_TOKEN}` - 维格表 API Token，从 VIKA_API_TOKEN 环境变量获取
- `{DATASHEET_ID}` - 维格表数据表 ID，从 VIKA_DATASHEET_ID 环境变量获取  
- `{VIEW_ID}` - 维格表视图 ID，从 VIKA_VIEW_ID 环境变量获取
- `{RECORD_ID}` - 记录 ID，通过查询接口获取
