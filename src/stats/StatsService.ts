import {Singleton} from "typescript-ioc";
import {db} from "../common/db";
import {GenderStat} from "./interface/GenderStat";

@Singleton
export class StatsService {
    genderStats = async () => {
        return StatsService.userRepository.select<GenderStat[]>("gender").count().where({registered: true}).andWhereNot("gender", null).groupBy("gender");
    };

    private static get userRepository() {
        return db.table("users");
    }
}
