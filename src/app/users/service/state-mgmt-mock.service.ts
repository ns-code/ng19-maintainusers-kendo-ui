import { Injectable, signal } from "@angular/core";
import { User } from "../data/user.data";
import { UsersService } from "./users.service";
import { AppState } from "../data/app.state";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
  })
export class StateMgmtMockService {

    users = signal<User[]>([]);

    user = signal<User>(new User("", "", "", "", "", "", null));

    currentAppState = signal<AppState>(AppState.UNKNON_STATE);
    addUserError = signal<string>('');

    constructor(private usersService: UsersService, private router: Router) {
        this.users.set([
            { userId: 1n, userName: 'user1', firstName: "fn1", lastName: "ln1", email: "e1@test.com", userStatus: "I", department: "" },
            { userId: 2n, userName: 'user2', firstName: "fn2", lastName: "ln2", email: "e2@test.com", userStatus: "A", department: "" },
            { userId: 3n, userName: 'user3', firstName: "fn3", lastName: "ln3", email: "e3@test.com", userStatus: "T", department: "" },
            { userId: 4n, userName: 'user4', firstName: "fn4", lastName: "ln4", email: "e4@test.com", userStatus: "A", department: "" }
        ]);
    }

    loadUsers(): void {

    }

    deleteUsers(toDeleteUserIds: bigint[]): void {
        this.users.set(this.users().filter(u => !toDeleteUserIds.includes(u.userId!)));
    }    

    createUser(newUser: User): void {
            newUser.userId = BigInt(this.users().length + 1);
            const existingUsers = this.users().map(u => u.userName);
            if (existingUsers.includes(newUser.userName)) {
              this.addUserError.set("User Name " + newUser.userName + " already exists")
            } else {
              const curUsers = this.users();
              curUsers.push(newUser);
              this.users.set(curUsers);
              this.router.navigate(['/users']);
            }
    }

    updateUser(userId: bigint, user: User): void {
        this.users.update(usrs => {
            return usrs.map(u => {
                if (u.userId === userId) {
                    user.userId = userId;
                    return user;
                }
                return u;
            })
        })
    }
}
