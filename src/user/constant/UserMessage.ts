const MUST_REGISTER_BEFORE_USE = "請先完成註冊才能使用 TG Lover 服務😅";

const USER_INFO_SCHEMA = `您可以使用以下 YAML 格式模板重新寫下關於您的自我介紹。您必須以 \\\#自我介紹 作開頭。

\`\`\`yaml
#自我介紹
暱稱: XXX (必填)
性別: 男 | 女 (必填選項)
年齡: 13-99 (必填，必須為數字)
身高: 140-220 (必填，必須為數字)
尋找對象關係: 結婚對象 | 穩定關係 | 短期關係 (必填選項)
是否吸煙: 吸煙 | 間中吸煙 | 不吸煙 (必填選項)
職業: 任意字串 (選填)
月入: 任意數字 (單位 HKD，選填，最少值 0，最大值 100000000)
學歷: 小學 | 中學 | 大專 | 學士 | 碩士 | 博士 (選填選項)

自我介紹:
- 我是。。。
- 我喜歡。。。
- 我的興趣是。。。
(至少一段，最多十段)

尋找對象:
- 樣靚
- 身材正
- 人品好
(至少一項，最多十項)
\`\`\`

以下是自我介紹例子，你可以直接複製再作修改，然後回覆：
`;

const USER_INFO_SAMPLE = `#自我介紹
暱稱: 小強
性別: 男
年齡: 20
身高: 160
尋找對象關係: 穩定關係
是否吸煙: 不吸煙
職業: 高級軟件攻城獅
月入: 100000
學歷: 學士

自我介紹:
- 我是一位IT狗
- 我喜歡狗
- 我的興趣是做狗

尋找對象:
- 樣靚
- 身材正
- 人品好`;

const YOUR_USER_INFO = "您的自我介紹";

const USER_INFO_UPDATED = "您的自我介紹已更新完成😊";

const ASK_FOR_PHOTOS = "您可以上傳 1-5 張您的個人照片 (如有)，直接在訊息欄上傳則可。";

const USER_PHOTOS_UPDATED = "已為您更新{x}張個人照片😊\n如你想刪除現有照片，您可以使用 /clear_photos 清除所有個人照片，然後再上傳一次。";

const USER_PHOTOS_CLEARED = "您已清除所有個人照片！";

const FILTER_SCHEMA = `您可以使用以下 YAML 格式模板重新寫下關於您的配對條件。您必須以 \\\#配對條件 作開頭。`;

const FILTER_SAMPLE = `#配對條件
性別: 異性
年齡: 18-22
身高: 150-160
`;

const YOUR_FILTER = "您的配對條件";
const USER_FILTER_UPDATED = `您的配對條件已更新完成😊`;
const USER_INFO_FORMAT_ERROR = "您輸入的格式有誤，請修正後再重新回覆。";
const USER_INFO_VALIDATION_ERROR = "您的資料有誤，請修正後再重新回覆";

export const UserMessage = Object.freeze({
    USER_INFO_SCHEMA,
    USER_INFO_UPDATED,
    USER_INFO_SAMPLE,
    YOUR_USER_INFO,
    ASK_FOR_PHOTOS,
    USER_PHOTOS_UPDATED,
    USER_PHOTOS_CLEARED,
    FILTER_SCHEMA,
    USER_FILTER_UPDATED,
    USER_INFO_FORMAT_ERROR,
    USER_INFO_VALIDATION_ERROR,
    FILTER_SAMPLE,
    YOUR_FILTER,
    MUST_REGISTER_BEFORE_USE,
});
