# 正式路線驗證紀錄

## 固定座標轉換

- PPTX 投影片：12192000 × 6858000 EMU。
- 正式底圖：1672 × 941 px。
- 換算：`mapX = pptX / 12192000 × 1672`，`mapY = pptY / 6858000 × 941`。
- `pnpm validate:routes` 驗證資料結構、目的地、樓層、點位邊界、connector 數量、transition 與班級→route 對應。
- `pnpm validate:ppt-routes` 驗證每段端點精確匹配 PPT connector 候選資料，只允許方向反轉。

## 全部正式路線

| Slide | Route | Floors | Transition | Status |
| ---: | --- | --- | --- | --- |
| 1 | `ppt-start-to-b-wing-1f-access` | 1F | — | PASS |
| 2 | `ppt-start-to-a-wing-2f-access` | 1F, 2F | spiral-stairs → 2F | PASS |
| 3 | `ppt-start-to-b-wing-2f-access` | 1F, 2F | stairs → 2F | PASS |
| 4 | `ppt-start-to-c-wing-2f-access` | 1F, 2F | stairs → 2F | PASS |
| 5 | `ppt-start-to-a-wing-3f-access` | 1F, 3F | spiral-stairs → 3F | PASS |
| 6 | `ppt-start-to-b-wing-3f-access` | 1F, 3F | stairs → 3F | PASS |
| 7 | `ppt-start-to-c-wing-3f-access` | 1F, 3F | stairs → 3F | PASS |
| 8 | `ppt-start-to-a-wing-4f-access` | 1F, 4F | elevator → 4F | PASS |
| 9 | `ppt-start-to-b-wing-4f-access` | 1F, 4F | elevator → 4F | PASS |
| 10 | `ppt-start-to-c-wing-4f-access` | 1F, 4F | elevator → 4F | PASS |
| 11 | `ppt-start-to-a-wing-5f-access` | 1F, 5F | elevator → 5F | PASS |
| 12 | `ppt-start-to-b-wing-5f-access` | 1F, 5F | elevator → 5F | PASS |
| 13 | `ppt-start-to-c-wing-5f-access` | 1F, 5F | elevator → 5F | PASS |
