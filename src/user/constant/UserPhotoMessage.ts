const ASK_FOR_PHOTOS = "您可以上傳 1-5 張您的個人照片 (如有)，直接在訊息欄上傳則可。";
const USER_PHOTOS_UPDATED = "已為您更新{x}張個人照片😊\n如你想刪除現有照片，您可以使用 /clear_photos 清除所有個人照片，然後再上傳一次。";
const USER_PHOTOS_CLEARED = "您已清除所有個人照片！";
const MAX_UPLOAD_PHOTO_ERROR = "最多只能上傳5張照片\n您可以使用 /clear_photos 清除所有個人照片，並重新上傳。";

const UPLOADING_PHOTOS = "上傳照片中...";
const PROCESSING_PHOTOS = "上傳照片完成，正在處理中...";

export const UserPhotoMessage = Object.freeze({
    ASK_FOR_PHOTOS,
    USER_PHOTOS_UPDATED,
    USER_PHOTOS_CLEARED,
    UPLOADING_PHOTOS,
    PROCESSING_PHOTOS,
    MAX_UPLOAD_PHOTO_ERROR,
});
