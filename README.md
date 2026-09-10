# 家長日校園導航系統 Parent Day Map

這是一套家長日校園班級導航系統。家長輸入班級後，系統會依照目前啟用學年度的班級教室配置，自動顯示：正確樓層、導航路線、班級位置、Highlight 與動態班級名稱。

## 目前正式狀態

- 正式學年度：115
- 正式 Branch：main
- 正式年度設定：`activeAcademicYear = '115'`

116 已建立，但目前僅供 development 的配置管理與 Preview 使用；尚未正式啟用。

## 系統核心架構

```text
固定空白底圖
↓
固定 roomId
↓
學年度班級配置
↓
Classroom Resolver
↓
樓層 / Route / Highlight / 動態班級文字
```

### 固定空白底圖

正式底圖位於 `public/maps/`：

```text
floor-1-base.png
floor-1b-base.png
floor-2-base.png
floor-3-base.png
floor-4-base.png
floor-5-base.png
```

底圖不包含會隨學年度變更的班級名稱；班級文字由程式依目前年度配置動態繪製。

### 固定 roomId

固定教室資料位於 `src/data/rooms.js`。`roomId` 代表實體教室位置，例如：

```text
A-2F-01
B-3F-04
C-4F-01
```

**roomId 不是班級號碼。**只要校舍實體位置沒有改變，不要因為換學年度而修改 roomId。

### 年度配置

年度配置位於：

```text
src/data/academicYears/115.js
src/data/academicYears/116.js
```

它們只負責班級到固定教室的對應，例如 `801 → C-2F-01`。

## 重要檔案

| 檔案 | 用途 |
| --- | --- |
| `src/data/rooms.js` | 固定實體教室資料：樓層、棟別、route、Highlight 與 label 位置 |
| `src/data/academicYears/115.js` | 115 學年度班級教室配置 |
| `src/data/academicYears/116.js` | 116 學年度預備配置 |
| `src/data/academicYears/index.js` | 學年度 registry |
| `src/data/activeAcademicYear.js` | 正式啟用學年度 |
| `src/data/classroomResolver.js` | 班級解析 |
| `src/data/routes.js` | 正式導航 route |
| `src/data/floors.js` | 樓層底圖設定 |
| `src/data/academicYearPreview.js` | development-only 草稿與 Preview 邏輯 |
| `src/components/ClassLabelOverlay.jsx` | 動態班級文字圖層 |

`classHighlightPositions.js` 與 `classRouteMap.js` 目前屬於 legacy migration verification source。正式 runtime 已不再直接使用；除非未來確認 migration 驗證不再需要，否則不要任意刪除。

## 115 學年度正式使用

一般正式網站使用者不需要進入管理頁。

```text
輸入班級
→ 系統讀取 115 年度配置
→ 找到 roomId
→ 取得樓層
→ 取得 route
→ 顯示地圖
→ 顯示班級名稱與 Highlight
```

## Development 維護工具

### Class Calibration

開發網址：`/parent-day-map/class-calibration`

用途：

- 校正固定 room Highlight
- 校正動態班級文字 label
- 查看班級與 roomId 對應

這是 development-only 工具，Production 不提供。

### Academic Year Config

開發網址：`/parent-day-map/academic-year-config`

用途：

- 查看 115 正式配置
- 編輯 116 草稿
- 比較 115 / 116
- 篩選已變更班級
- 檢查重複 room、未配置班級與無效 room
- Preview 116
- 匯出配置

116 草稿使用的 localStorage key：

```text
parent-day-map-v2:academic-year-config:116
```

localStorage 僅是目前瀏覽器的草稿，不等於正式寫入 `116.js`。

## 116 學年度 Preview

開發網址形式：`/parent-day-map/?previewAcademicYear=116`

Preview：

- 只在 development 有效
- 不修改 `activeAcademicYear.js`
- 可以使用 localStorage 的 116 草稿
- 畫面會顯示「開發預覽：116 學年度」
- 可以退出並返回正式 115

Production 不支援這個 preview override。

## 明年度更新 SOP

1. **取得新年度班級教室配置**：先取得學校正式的「班級 → 教室」資料。
2. **開啟年度配置工具**：進入 `/parent-day-map/academic-year-config`。
3. **編輯 116**：以 115 為參考，只修改「班級 → roomId」。除非實體校舍或教室本身變更，否則不要修改 `rooms.js`、Highlight、label、route 或底圖。
4. **檢查 Validation**：確認「未配置：0」、「重複 room：0」及「無效 room：0」。
5. **查看已變更班級**：只查看與 115 不同的班級，逐一人工核對。
6. **Preview 116**：輸入幾個有異動的班級；至少抽查跨棟、跨樓層及 A、B、C 三棟，確認樓層、班級文字、Highlight、Route 均正確。
7. **匯出 116 配置**：完成後匯出 JSON 或 JavaScript 配置，保留人工核對紀錄。
8. **正式寫回**：將確認後的 assignments 寫回 `src/data/academicYears/116.js`。
9. **執行 Validator**：

   ```bash
   pnpm validate:classrooms
   pnpm validate:routes
   pnpm validate:ppt-routes
   pnpm validate:highlights
   pnpm build
   ```

   全部 PASS 才能進下一步。
10. **啟用 116**：最後才修改 `src/data/activeAcademicYear.js`：

    ```js
    export const activeAcademicYear = '115'
    ```

    改為：

    ```js
    export const activeAcademicYear = '116'
    ```

11. **正式網站抽查**：部署後抽查不同樓層、棟別與路線，確認正式網站正常。
12. **Git**：確認後再 commit、push。

## ⚠️ 重要注意事項

### 不要每年重新標定 Highlight

正常換學年度只需要調整「班級 → roomId」。

### 不要把 roomId 當班級

`C-2F-01` 代表固定位置，不代表 801。

### 不要直接改 route 或 Highlight

班級換教室後，route 與 Highlight 都會跟著 roomId 自動改變。

### 不要重新製作年度班級底圖

班級名稱已由程式動態繪製，底圖不應再混入年度班級文字。

### 不要直接用 Preview 當正式年度

Preview 僅供 development 測試；正式年度以 `activeAcademicYear.js` 為準。

## 什麼情況需要修改 rooms.js？

正常換學年度時，**不需要**修改 `rooms.js`。只有下列情況才需要：

- 新增實體教室
- 教室永久取消
- 校舍格局改變
- 教室 Highlight 位置錯誤
- route 對應的實體位置改變

若只是「801 從 C 棟搬到 A 棟」，只修改年度 assignment。

## 路線資料與轉錄原則

正式來源為 `surce/campus-map-source-line.pptx`。13 張投影片的紅色連接線是 PowerPoint connector 物件，座標依投影片尺寸等比換算至 `floors.js` 宣告的 `1672 × 941` 座標系統。

每條路線都必須經校方人工逐段核對後才可寫入 `routes.js`。跨樓層路線須拆成不同 `floorId` 路段並填寫明確 `transition`；元件不得自行尋路、補點或修正路徑。

## Git 重要版本

### 年度班級配置架構

```text
65256e832b8af548487b6eca4dfc53af8f126a82
feat: add academic-year classroom configuration
```

### 年度配置管理與 Preview

```text
1f3eacf8fab035f894d157054305ac278ee4e3b2
feat: add academic year configuration preview
```

這兩個 commit 是年度化功能的重要穩定節點。

## 117 學年度之後

目前先不要預先建立 117。等 116 學年度完整跑過一次「新配置 → Preview → 啟用 → 正式家長日使用」後，再依實際經驗評估是否擴充為通用工具：

```text
新增學年度
→ 複製上一年度
→ 編輯配置
→ Preview
→ 啟用
```

## 常用檢查指令

```bash
pnpm validate:classrooms   # 檢查年度 assignment、room 與 migration
pnpm validate:routes       # 檢查正式 route 資料
pnpm validate:ppt-routes   # 比對 PPT 路線轉錄
pnpm validate:highlights   # 檢查 Highlight 資料
pnpm build                 # 建立 production bundle
git status                 # 檢查工作目錄變更
git diff --check           # 檢查 whitespace error
```
