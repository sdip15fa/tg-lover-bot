import {db} from "../common/db";

(async () => {
    await db.raw("TRUNCATE TABLE user_photos");
    await db.raw("TRUNCATE TABLE users");
    await db.raw("TRUNCATE TABLE matches");
})();
