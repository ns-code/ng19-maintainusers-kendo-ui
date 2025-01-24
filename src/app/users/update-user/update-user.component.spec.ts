import { fakeAsync, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UpdateUserComponent } from './update-user.component';
import { StateMgmtService } from '../service/state-mgmt.service';
import { UsersService } from '../service/users.service';
import { UsersComponent } from '../users.component';
import { UsersResolver } from '../service/resolvers/users.resolver';
import { StateMgmtMockService } from '../service/state-mgmt-mock.service';
import { UpdateUserResolver } from '../service/resolvers/update-user.resolver';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('Test Update User', () => {
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
  {path: 'users/:id', component: UpdateUserComponent, resolve: {
    product: UpdateUserResolver
  }},
      ])],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideAnimations(),
      { provide: UsersService, useClass: UsersService },
      { provide: StateMgmtService, useClass: StateMgmtMockService },
      { provide: UsersResolver, useClass: UsersResolver },
      ],
    });
    TestBed.inject(UsersResolver);
    usersService = TestBed.inject(UsersService);
    appDataStateService = TestBed.inject(StateMgmtService);
    router = TestBed.inject(Router);
  });

  it('should update selected user', fakeAsync(() => {

    const updateUserComponent = TestBed.createComponent(UpdateUserComponent);
    const updateUserComponentInstance = updateUserComponent.componentInstance;

    const usersComponent = TestBed.createComponent(UsersComponent);
    const usersComponentInstance = usersComponent.componentInstance;

    // Given: a selected user
    let toUpdateUser = appDataStateService.users().find(u => u.userName === 'user1')!;

    // When: properties updated and form submitted
    toUpdateUser.email = 'updEmail@TestBed.com';
    updateUserComponentInstance.handleFormSubmission(toUpdateUser);

    // Then: the users list count should have the user with updated properties
    usersComponentInstance.ngOnInit();
    const updatedUser = usersComponentInstance.users().find(u => u.userName === 'user1');
    expect(updatedUser?.email).toEqual('updEmail@TestBed.com');
  }));
});
