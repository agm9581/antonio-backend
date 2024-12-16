import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { User } from "../entities/user.entity";
import { HashingService } from "src/auth/hashing/hashing.service";

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface {
    constructor(private readonly dataSource: DataSource, private readonly hashingService: HashingService) {
        dataSource.subscribers.push(this)
    }

    listenTo() {
        return User
    }

    async beforeInsert(event: InsertEvent<any>) {
        const { entity: user } = event

        user.password = await this.hashingService.hash(user.password)
    }

    async beforeUpdate(event: UpdateEvent<any>) {
        const { entity, databaseEntity: databaseUser } = event
        const user = entity as User

        if (user.password !== databaseUser.password) {
            user.password = await this.hashingService.hash(user.password)
        }
    }


}