import { User } from "./user.data"

export class AppData {
    userId: bigint | null = null;
    user: User | null = null;
    users: User[] | null = null;
    userIds: bigint[] | null = null;
}