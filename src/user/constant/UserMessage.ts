const MUST_REGISTER_BEFORE_USE = "請先完成註冊才能使用 TG Lover 服務😅";
const ASK_FOR_USER_INFO = `您可以按下以下按鈕，更新您的自我介紹🤗`;
const UPDATE_USER_INFO = "更新自我介紹";
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
    ASK_FOR_USER_INFO,
    USER_INFO_UPDATED,
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
    UPDATE_USER_INFO,
});
