import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../data/user.data';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  API_BASE_URL = "http://localhost:8080/api";

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> | null {
    return this.http.get<User[]>(this.API_BASE_URL + '/users');
  }

  createUser(newUser: User): Observable<User> | null {
    return this.http.post<User>(this.API_BASE_URL + '/users', newUser);
  }   

  updateUser(userId: bigint, updatedUser: User): Observable<User> {
    const url = `/users/${userId}`;
    return this.http.put<User>(this.API_BASE_URL + url, updatedUser);
  }   

  deleteUser(userId: bigint): Observable<any> {
    const url = `/users/${userId}`;
    return this.http.delete<any>(this.API_BASE_URL + url);
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

export const USER_STATUSES = [{label: "I - Inactive", value: "I"},
  {label: "A - Active", value: "A"},
  {label: "T - Terminated", value: "T"},
 ];