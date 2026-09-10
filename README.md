# parent-day-map-v2

第一階段的乾淨基礎專案。正式底圖在 `public/maps/`，導航幾何只會存在於 `src/data/routes.js`。

## 資料責任

- `src/data/floors.js`：底圖、原始尺寸與樓層排序。
- `src/data/destinations.js`：目的地的 ID、名稱、樓層與分類。
- `src/data/routes.js`：人工確認路線的唯一來源。元件不可計算或補正路徑。
- `src/components/CampusMap.jsx`：將指定底圖與 SVG 疊圖放在相同座標系統。
- `src/components/RouteOverlay.jsx`：只繪製傳入的既有點位與轉折提示。

## 路線轉錄流程

來源為 `surce/campus-map-source-line.pptx`。13 張投影片的紅色線條為 PowerPoint 連接線物件，座標可從物件的 `off` 與 `ext` 讀取；將其依投影片尺寸等比轉換到各樓層在 `floors.js` 宣告的 1672 × 941 座標系統。

每一條轉錄後的路線必須由校方人工逐段核對來源投影片，才可新增至 `routes.js`。跨樓層要拆為不同 `floorId` 的路段，並填寫明確的 `transition` 提示；不會以演算法連線或尋路。
