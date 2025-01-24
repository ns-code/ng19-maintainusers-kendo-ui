import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { USER_STATUSES, UsersService } from '../service/users.service';
import { User } from '../data/user.data';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { UserFormComponent } from '../user-form/user-form.component';
import { StateMgmtService } from '../service/state-mgmt.service';

@Component({
  standalone: true,
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css', './../users.component.css'],
  imports: [CommonModule, UserFormComponent, FormsModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatInputModule]
})
export class UpdateUserComponent implements OnInit {
  @ViewChild(UserFormComponent) userFormComponent: UserFormComponent | null = null;
  
  userStatuses = USER_STATUSES;
  userToUpdate: User;
  userId: bigint | null = null;
  userIdStr = '';

  constructor(private usersService: UsersService, private route: ActivatedRoute,
    private appDataStateService: StateMgmtService,
    private router: Router) {
        this.userToUpdate = appDataStateService.user();
        this.userId = this.userToUpdate.userId!;
  }

  ngOnInit(): void {
  } 

  ngAfterViewInit() {
    this.userFormComponent?.form.controls['userName'].disable();
  }

  handleFormSubmission(updatedUser: any) {
    console.log(">> updatedUser: ");
    this.appDataStateService.updateUser(this.userId!, updatedUser!);
  }
}
