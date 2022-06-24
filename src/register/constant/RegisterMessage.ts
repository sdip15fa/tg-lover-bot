const TERMS = `<b>歡迎使用 TG Lover</b>

請仔細閱讀以下有關 TG Lover (簡稱：平台) 的使用條款。

1. 您同意平台使用您的個人資料，但您的個人資料只會用作平台內配對用途，並不會對您的數據用作出售 / 轉移 / 其他用途。

2. 您同意您所提供的個人資料絕對真實，並且不會意圖冒充他人 / 使用他人的個人資料。

3. 您可以使用具有粗俗、淫穢或其他低劣品味的個人資料，但必須確保該個人資料不會涉及到任何非法的行為。

4. 平台並不保證您的個人資料的私隠安全性，請盡量不要填寫身份證、地址、電話號碼等敏感個人資料，並且您必須承擔因此而發生的任何損失。

5. 使用本平台並不百分百保證您能成功配對，但平台會盡力為您找到理想對象。

6. 平台不會對用戶收費 / 提供收費服務，<b>課金贊助窮三代IT狗</b>亦不會影響您成功配對的機率。

7. 平台會使用您的 Telegram 帳戶名稱，但只有在成功配對後才會將您的 Telegram 帳戶名稱傳送給對方。

8. 平台擁有人 (窮三代IT狗) 有權以合理理由 (eg. 違反使用條款、濫用) 停用 / 刪除您的帳號，並不會作出任何通知。`;

const USERNAME_PERMISSION_CONFIRM = (username: string) => `TG Lover 已經取得了您的 Telegram 帳戶名稱：
@${username}

是否同意 TG Lover 使用這個 Telegram 帳戶名稱為您進行交友配對？

您的 Telegram 帳戶名稱只會用作成功配對後雙方交換帳戶，並不會用於其他用途。

如您日後更改了 Telegram 帳戶名稱，因為 TG Lover 沒有權限直接存取您的 Telegram 帳戶名稱，您必須透過 /renew 命令通知 TG Lover 更新您用作配對的 Telegram 帳戶名稱。

請注意：如您刻意更改了 Telegram 帳戶名稱而不主動通知 TG Lover，當成功進行配對後對方不能聯絡您，對方有權對您作出檢舉。

(您必須同意才能使用 TG Lover 服務)`;

const AGREE_TERMS = "同意上述條款";
const DISAGREE_TERMS = "不同意上述條款";
const AGREE = "同意";
const DISAGREE = "不同意";
const DISAGREE_TERMS_ERROR = "非常抱歉，因為您不同意上述條款，TG Lover 將不能為您服務😔";
const DISAGREE_USERNAME_PERMISSION_ERROR = "非常抱歉，因為您不同意 TG Lover 使用您的帳戶名稱，TG Lover 將不能為您服務😔";
const SKIP_THIS_STEP = "略過此步驟";
const NEXT_STEP = "下一步";

const ASK_FOR_PHOTOS = "現在可以上傳 1-5 張您的個人照片 (如有)，直接在訊息欄上傳則可，或是按下方按鈕略過。";
const GOTO_NEXT_STEP_IF_UPLOAD_FINISHED = "如果您確定已上傳完成所有個人照片，請按下方「下一步」按鈕。";
const REGISTER_FINISHED = "恭喜您，您已完成註冊，您現在可以用 /match 進行配對。";

export const RegisterMessage = Object.freeze({
    TERMS,
    AGREE,
    DISAGREE,
    AGREE_TERMS,
    DISAGREE_TERMS,
    DISAGREE_TERMS_ERROR,
    USERNAME_PERMISSION_CONFIRM,
    DISAGREE_USERNAME_PERMISSION_ERROR,
    ASK_FOR_PHOTOS,
    SKIP_THIS_STEP,
    NEXT_STEP,
    REGISTER_FINISHED,
    GOTO_NEXT_STEP_IF_UPLOAD_FINISHED,
});
