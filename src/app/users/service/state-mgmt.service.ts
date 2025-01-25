import { Injectable, signal } from "@angular/core";
import { User } from "../data/user.data";
import { UsersService } from "./users.service";
import { HttpErrorResponse } from "@angular/common/http";
import { AppState } from "../data/app.state";
import { forkJoin, Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
  })
export class StateMgmtService {

    users = signal<User[]>([]);

    user = signal<User>(new User("", "", "", "", "", null,));

    currentAppState = signal<AppState>(AppState.UNKNON_STATE);
    addUserError = signal<string>('');

    constructor(private usersService: UsersService, private router: Router) {
    }

    loadUsers(): void {
        this.usersService.getUsers()?.subscribe({
            next: (resp: User[]) => {
                console.log(">> load users: ", this.users());
                this.users.set(resp);
                this.currentAppState.set(AppState.USERS_LIST_SUCCESS);
            },
            error: (err: HttpErrorResponse) => {
                //
            }
        })
    }

    deleteUsers(toDeleteUserIds: bigint[]): void {
        console.log(">> delete req: ", toDeleteUserIds);
        const deleteUserRes$: Observable<bigint>[] = [];
        toDeleteUserIds.forEach(id => {
            deleteUserRes$.push(this.usersService.deleteUser(id));
            forkJoin(deleteUserRes$)
              .subscribe({
                next: (res) => {
                  // can be ignored
                  this.currentAppState.set(AppState.SELECTED_USERS_DELETE_SUCCESS);
                  this.loadUsers();
                },
                complete: () => { }
              });
          });
    }    

    loadUser(userId: bigint): void {
        const user = this.users().find(u => u.userId === userId);
        if (!user) {
            // TODO
        } else {
            this.currentAppState.set(AppState.USER_SUCCESS);
        }
    }

    createUser(user: User): void {
        this.usersService.createUser(user)?.subscribe({
            next: (res: User) => {
                this.currentAppState.set(AppState.USER_ADD_SUCCESS);
                console.log(">> created user: ", res.userId);
                this.router.navigate(['/users']);
            },
            error: (err: HttpErrorResponse) => {
                if(err.status === 409) {
                    console.log(">> setting 409...");
                    this.currentAppState.set(AppState.USER_ADD_ERROR);
                    this.addUserError.set("User Name " + user.userName + " already exists")
                    this.router.navigate(['/add-user']);
                }
            }
        })
    }

    updateUser(userId: bigint, user: User): void {
        this.usersService.updateUser(userId, user)?.subscribe({
            next: (res: User) => {
                this.currentAppState.set(AppState.SELECTED_USER_UPDATE_SUCCESS);
                this.router.navigate(['/users']);
            },
            error: (err: HttpErrorResponse) => {
                this.currentAppState.set(AppState.SELECTED_USER_UPDATE_ERROR);
                this.router.navigate(['/add-user/:' + userId]);
            }
        })
    }

    toUpdateUser(userId: bigint): void {
        console.log(">> userId: ", this.users() );
        const usr = this.users().find(u => BigInt(u.userId!) === userId);
        if (usr) {
            usr.userId = userId;
            this.user.set(usr);
        } else {
            console.log(">> user not found for userId: ", userId);
        }
    }
}