import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { UpdateUserComponent } from './users/update-user/update-user.component';
import { UsersResolver } from './users/service/resolvers/users.resolver';
import { UpdateUserResolver } from './users/service/resolvers/update-user.resolver';

export const routes: Routes = [
  {path: 'add-user', component: AddUserComponent},
  {path: 'users/:id', component: UpdateUserComponent, resolve: {
    product: UpdateUserResolver
  }},
  {path: 'users', component: UsersComponent, resolve: {
    product: UsersResolver
  }},
  {path: '', redirectTo: 'users', pathMatch: 'full'}
];
