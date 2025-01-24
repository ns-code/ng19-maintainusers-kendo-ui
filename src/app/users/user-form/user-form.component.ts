import { Component, EventEmitter, Input, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormControl} from '@angular/forms';
import { MyErrorStateMatcher, USER_STATUSES, UsersService } from '../service/users.service';
import { User } from '../data/user.data';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { StateMgmtService } from '../service/state-mgmt.service';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_LABEL } from "@progress/kendo-angular-label";
import { KENDO_DROPDOWNS } from "@progress/kendo-angular-dropdowns";

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css', './../users.component.css'],
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatInputModule, KENDO_INPUTS, KENDO_LABEL, KENDO_DROPDOWNS],
  encapsulation: ViewEncapsulation.None,
})
export class UserFormComponent {
  @Input()
  formAction = '';
  @Input()
  errmsg = '';
  @Input()
  userToUpdate: User | undefined;
  @Output()
  formSubmitted = new EventEmitter<User>();
  @Output()
  submittedUser = new EventEmitter<User>();

  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  userStatuses = USER_STATUSES;
  selectedUserStatus = "I";

  constructor(public usersService: UsersService, private router: Router,
    public appDataStateService: StateMgmtService,
    private formBuilder: FormBuilder) {
      this.form = this.formBuilder.group({
        "userName": new FormControl("", [Validators.required, Validators.minLength(3)]),
        "firstName": new FormControl("", [Validators.required, Validators.minLength(3)]),
        "lastName": new FormControl("", [Validators.required, Validators.minLength(3)]),
        "email": new FormControl("", [Validators.required, Validators.email]),
        "userStatus": new FormControl("I"),
        "department": new FormControl("")
      });
    } 

    ngOnChanges(changes: SimpleChanges) {
      for (const inputName in changes) {
        if (this.userToUpdate) {
          this.initUserForm();        }
      }
    }

    initUserForm() {
      this.form.setValue({
        userName: this.userToUpdate?.userName!,
        firstName: this.userToUpdate?.firstName!,
        lastName: this.userToUpdate?.lastName!,
        email: this.userToUpdate?.email!,
        userStatus: this.userToUpdate?.userStatus!,
        department: this.userToUpdate?.department!
      });
      this.selectedUserStatus = this.userToUpdate?.userStatus!;
    }

    ngOnInit() {  
      // if (this.formAction === 'Update') {
      //   this.form.controls['userName'].disable();
      // }
      
      this.form.get('userStatus')?.valueChanges.subscribe(value => {
        console.log(">> userStatus: ", value);
      });
    }

    setUserAction(formAction: string): void {
      this.formAction = formAction;
    }

    onUserFormSubmit() {
      // this.form.markAllAsTouched();
      console.log(">> add user submitted");
      this.formSubmitted.emit(new User(this.form.get("userName")?.value!, 
      this.form.get("firstName")?.value!,
      this.form.get("lastName")?.value!,
      this.form.get("email")?.value!,
      this.selectedUserStatus,
      this.form.get("department")?.value!,));
    }

    resetForm() {
      this.form.reset();
      this.form.controls["userStatus"].setValue("I");      
      if (this.formAction === 'Update') {
        this.form.controls["userName"].setValue(this.userToUpdate?.userName);
      }
    }
}
