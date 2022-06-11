import {Container} from "typescript-ioc";
import {MockUserFactory} from "../user/util/MockUserFactory";

const mockUserFactory = Container.get(MockUserFactory);

(async () => {
    for (let i = 0; i < 100; i++) {
        await mockUserFactory.create();
    }
})();
