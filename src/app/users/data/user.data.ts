interface IUser {
    userId?: bigint | null;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    userStatus: string;
    department: string | null;
}

export class User implements IUser {
    constructor(
        public userName: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public userStatus: string,
        public department: string | null, public userId?: bigint | null) {
        this.userId = userId;
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userStatus = userStatus;
        this.department = department;
    }
}