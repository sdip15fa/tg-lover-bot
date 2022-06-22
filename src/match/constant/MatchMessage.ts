const NO_MATCH = "暫時已經沒有符合您配對條件的對象，請稍後再試，或者您可稍為擴闊您的配對條件🥲";
const LIKE = "💗喜歡";
const DISLIKE = "🙅‍不喜歡";

const MATCHED = "您和 {target_name} 已經配對成功，您可以自行聯絡 @{target_username}，或等待對方回覆🥳";
const MATCHED_PERSON_AS_BElOW = "配對成功的對象如下：";

const RECENT_LIKED_PERSON_AS_BElOW = "您最近喜歡的{x}個對象如下：";
const RECENT_MATCHED_PERSON_AS_BElOW = "您最近成功配對的{x}個對象如下：";

const NO_RECENT_LIKED_USERS = "您目前還沒有喜歡的對象🥲";
const NO_RECENT_MATCHED_USERS = "您目前還沒有成功配對的對象🥲";

export const MatchMessage = Object.freeze({
    NO_MATCH,
    LIKE,
    DISLIKE,
    MATCHED,
    MATCHED_PERSON_AS_BElOW,
    RECENT_LIKED_PERSON_AS_BElOW,
    NO_RECENT_LIKED_USERS,
    NO_RECENT_MATCHED_USERS,
    RECENT_MATCHED_PERSON_AS_BElOW,
});
