import { fakeAsync, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, RouterModule } from '@angular/router';
import { interval, take } from 'rxjs';
import { AddUserComponent } from './add-user.component';
import { StateMgmtService } from '../service/state-mgmt.service';
import { UsersComponent } from '../users.component';
import { UsersService } from '../service/users.service';
import { UsersResolver } from '../service/resolvers/users.resolver';
import { StateMgmtMockService } from '../service/state-mgmt-mock.service';
import { provideAnimations } from '@angular/platform-browser/animations';


export const waitUntil = async (untilTruthy: Function): Promise<boolean> => {
  while (!untilTruthy()) {
    await interval(25).pipe(take(1)).toPromise();
  }
  return Promise.resolve(true);
};

describe('Test Add User', () => {
  // let service: StateMgmtService;
  let router: Router;
  let appDataStateService: StateMgmtService;
  let usersService: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UsersComponent, RouterModule.forRoot([
        {
          path: 'users', component: UsersComponent, resolve: {
            product: UsersResolver
          }
        },
        { path: 'add-user', component: AddUserComponent }
      ])],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideAnimations(),
      { provide: StateMgmtService, useClass: StateMgmtMockService },
      { provide: UsersResolver, useClass: UsersResolver },
      ],
    });
    TestBed.inject(UsersResolver);
    usersService = TestBed.inject(UsersService);
    appDataStateService = TestBed.inject(StateMgmtService);
    router = TestBed.inject(Router);
  });

  it('should add new user to users list', fakeAsync(() => {

    const addUserComponent = TestBed.createComponent(AddUserComponent);
    const addUserComponentInstance = addUserComponent.componentInstance;

    const usersComponent = TestBed.createComponent(UsersComponent);
    const usersComponentInstance = usersComponent.componentInstance;

    // Given: n users in DB
    // appDataStateService.loadUsers();
    // tick(1000);
    let dbUsersCountBefAdd = appDataStateService.users().length;
    console.log(">> dbUsersCountBefAdd: ", dbUsersCountBefAdd)

    // When: handleFormSubmission called on the component
    const newUser = { userId: null, userName: 'user5', firstName: "fn5", lastName: "ln5", email: "e5@test.com", userStatus: "A", department: "" };
    addUserComponentInstance.handleFormSubmission(newUser);

    // Then: the users list count should have n+1
    usersComponentInstance.ngOnInit();
    expect(usersComponentInstance.users().length).toEqual(dbUsersCountBefAdd + 1);
  }));

  it('should return conflict error for adding a new user with existing userName', fakeAsync(() => {

    const addUserComponent = TestBed.createComponent(AddUserComponent);
    const addUserComponentInstance = addUserComponent.componentInstance;

    // Given: a user with userName=user4 in DB
    // When: handleFormSubmission called on the component with a userName=user4
    const newUser = { userId: null, userName: 'user4', firstName: "fn5", lastName: "ln5", email: "e5@test.com", userStatus: "A", department: "" };
    addUserComponentInstance.handleFormSubmission(newUser);

    // Then: the addUserComponent should display conflict error message
    // addUserComponentInstance.ngOnInit();
    expect(appDataStateService.addUserError()).toContain('user4 already exists');
  }));
});
