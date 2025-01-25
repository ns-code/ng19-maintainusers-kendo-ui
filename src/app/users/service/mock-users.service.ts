import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../data/user.data';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class MockUsersService {

  API_BASE_URL = "http://localhost:8080/api";

  users: User[] = [
    { userId: 1n, userName: 'user1', firstName: "fn1", lastName: "ln1", email: "e1@test.com", userStatus: "I", department: "" },
    { userId: 2n, userName: 'user2', firstName: "fn2", lastName: "ln2", email: "e2@test.com", userStatus: "A", department: "" },
    { userId: 3n, userName: 'user3', firstName: "fn3", lastName: "ln3", email: "e3@test.com", userStatus: "T", department: "" },
    { userId: 4n, userName: 'user4', firstName: "fn4", lastName: "ln4", email: "e4@test.com", userStatus: "A", department: "" }
  ];


  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> | null {
    return of(this.users);
  }

  createUser(newUser: User): Observable<User> | null {
    const chkUser = this.users.find(u => u.userName === newUser.userName);
    if (chkUser) {
      const mockErrorResponse = new HttpErrorResponse({
        status: 409
      });
      console.log(">> throwing 409 error");      
      return throwError(() => mockErrorResponse);
    }
    newUser.userId = BigInt(this.users.length + 1);
    this.users.push(newUser);
    return of(newUser);
  }

  updateUser(userId: bigint, updatedUser: User): Observable<User> {
    this.users = this.users.map(u => {
      if (u.userId === userId) {
        updatedUser.userId = userId;
        return updatedUser;
      }
      return u;
    });
    // updatedUser.userId = userId;
    return of(updatedUser);
  }

  deleteUser(userId: bigint): Observable<any> {
    this.users = this.users.filter(u => userId != u.userId!);
    return of("");
  }
}

export enum UserStatuses {
  I = "I", A = "A", T = "T"
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const USER_STATUSES = [{ label: "I - Inactive", value: "I" },
{ label: "A - Active", value: "A" },
{ label: "T - Terminated", value: "T" },
];