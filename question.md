# 組織圖 (後端)

## 情境

---

目前您任職於一間軟體公司，有間保險業的客戶委託了一個「保戶介紹關係系統」。

## 規則說明

---

介紹關係的規則如下，

1. 保戶的介紹關係是以二元樹的組織方式呈現
2. 每個保戶可介紹的人數不限
3. 由保戶直接介紹的新保戶稱為「直接介紹保戶」
4. 由保戶直接介紹的新保戶再介紹的新保戶稱為「間接介紹保戶」
5. 每次產生介紹新保戶時，會產生在人數最少的節點下，當左右 2 邊人數相同時，會以左邊為優先
6. 每個保戶的基本資訊為「保戶編號」、「保戶姓名」、「加入(介紹)日期」、「介紹人保戶編號」

![367.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/10952dc7-ecbc-4555-9a7f-c8628103dda8/367.jpg)

## 系統需求

---

### 客戶的需求

1. 以 Web 的方式呈現
2. 可以使用「保戶編號」搜尋保戶
3. 搜尋後以該保戶為「主節點」並呈現該保戶 4 階的介紹關係
4. 原搜尋的保戶「主節點」以不同顏色區別
5. 每個子節點以不同顏色區別「直接介紹」& 「間接介紹」客戶
6. 每個子節點點擊後，會以該結點為「主節點」再呈現 4 階的介紹關係

### 畫面草稿圖

![截圖 2023-04-16 下午7.31.29.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/308f5780-4eec-4c37-ae13-4597d515f842/%E6%88%AA%E5%9C%96_2023-04-16_%E4%B8%8B%E5%8D%887.31.29.png)

## API 規格

---

### 保戶查詢

Endpoint： `/api/policyholders`

Method：GET

Query Parameters：

| 名稱 | 必填 | 資料類型 | 說明 | 範例 |
| --- | --- | --- | --- | --- |
| code | Y | string | 保戶編號 |  |

Response type：`application/json`
Response body：

| 名稱 | 資料類型 | 說明 | 範例 |
| --- | --- | --- | --- |
| code | String | 保戶編號 |  |
| name | String | 保戶姓名 |  |
| registration_date | DateTime | 加入日 |  |
| introducer_code | String | 介紹人保戶編號 |  |
| l | List<Object> | 左樹 | `{ 
    code: string,
    name: string,
    registration_date: date,
    introducer_code: string 
}[]` |
| r | List<Object> | 右樹 | `{ 
    code: string,
    name: string,
    registration_date: date,
    introducer_code: string 
}[]` |

### 保戶上層查詢

Endpoint： `/api/policyholders/{code}/top`

Method：GET

Path Parameters：

| 名稱 | 必填 | 資料類型 | 說明 | 範例 |
| --- | --- | --- | --- | --- |
| code | Y | string | 保戶編號 |  |

Response type：`application/json`
Response body：

| 名稱 | 資料類型 | 說明 | 範例 |
| --- | --- | --- | --- |
| code | String | 保戶編號 |  |
| name | String | 保戶姓名 |  |
| registration_date | DateTime | 加入日 |  |
| introducer_code | String | 介紹人保戶編號 |  |
| l | List<Object> | 左樹 | `{ 
    code: string,
    name: string,
    registration_date: date,
    introducer_code: string 
}[]` |
| r | List<Object> | 右樹 | `{ 
    code: string,
    name: string,
    registration_date: date,
    introducer_code: string 
}[]` |

## 任務

---

1. 設計上述使用者介紹關系的相關 table schema，並產生約 10 - 20 筆測試資料。
2. 保戶資料的基本欄位為「保戶編號」、「保戶姓名」、「加入(介紹)日」、「介紹人保戶編號」，其餘可自行擴充。
3. 實作上述 2 個 API Endpoint
    1. 保戶查詢
    2. 保戶上層查詢

請將 Source code 放在個人的 Github 或 Gitlab 上，完成後請通知我們。

謝謝您的參與。