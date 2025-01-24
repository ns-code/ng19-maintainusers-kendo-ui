import { Component, OnInit, ViewChild } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { USER_STATUSES, UsersService } from '../service/users.service';
import { User } from '../data/user.data';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { UserFormComponent } from '../user-form/user-form.component';
import { StateMgmtService } from '../service/state-mgmt.service';

@Component({
  standalone: true,
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./../users.component.css', './add-user.component.css'],
  imports: [CommonModule, UserFormComponent, FormsModule, ReactiveFormsModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatInputModule]
})export class AddUserComponent implements OnInit {
  @ViewChild(UserFormComponent) userFormComponent: UserFormComponent | null = null;

  userStatuses = USER_STATUSES;
  forActionVal = "Add";

  constructor(private router: Router, private appDataStateService: StateMgmtService) {
  }

  ngOnInit() {    
  }

  handleFormSubmission(newUser: User) {
    this.appDataStateService.addUserError.set('');
    this.appDataStateService.createUser(newUser!);
  }
}
