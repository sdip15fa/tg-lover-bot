import {UserService} from "../service/UserService";
import {Inject, Singleton} from "typescript-ioc";
import {UserView} from "../../common/view/user/UserView";
import * as uuid from "uuid";
import {Gender} from "../../common/enum/Gender";
import {RandomUtil} from "../../common/util/RandomUtil";
import {GoalRelationship} from "../../common/enum/GoalRelationship";
import {Smoking} from "../../common/enum/Smoking";
import {faker} from "@faker-js/faker";
import {Education} from "../../common/enum/Education";
import {FilterGender} from "../../common/enum/FilterGender";
import {UserPhotoService} from "../service/UserPhotoService";

@Singleton
export class MockUserFactory {
    constructor(
        @Inject
        private userService: UserService,
        @Inject
        private userPhotoService: UserPhotoService
    ) {}

    public async create() {
        const userView = new UserView();
        userView.telegramId = uuid.v4();
        userView.username = faker.internet.userName();
        userView.name = faker.name.firstName();
        userView.agreeTerms = true;
        userView.agreeUsernamePermission = true;
        userView.infoUpdated = true;
        userView.photoUploaded = true;
        userView.filterUpdated = true;
        userView.registered = true;
        userView.gender = RandomUtil.randomPick(Gender);
        userView.age = RandomUtil.randomRange(18, 99);
        userView.height = RandomUtil.randomRange(140, 220);
        userView.goalRelationship = RandomUtil.randomPick(GoalRelationship);
        userView.smoking = RandomUtil.randomPick(Smoking);
        userView.occupation = faker.name.jobTitle();
        userView.salary = RandomUtil.randomRange(20_000, 80_000);
        userView.education = RandomUtil.randomPick(Education);
        userView.selfIntro = [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()];
        userView.relationshipCriteria = [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()];
        userView.filterGender = RandomUtil.randomPick(FilterGender);
        userView.filterAgeLowerBound = 18;
        userView.filterAgeUpperBound = 99;
        userView.filterHeightLowerBound = 140;
        userView.filterHeightUpperBound = 220;

        await this.userService.updateUserData(userView.telegramId, userView);
        await Promise.all([faker.image.avatar(), faker.image.avatar(), faker.image.avatar()].map(url => this.userPhotoService.addPhoto(userView.telegramId, url)));
    }
}
