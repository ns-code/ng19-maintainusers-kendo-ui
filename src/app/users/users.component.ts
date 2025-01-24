import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from './data/user.data';
import { StateMgmtService } from './service/state-mgmt.service';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridDataResult, GridModule, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  standalone: true,
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterLink, MatGridListModule, MatButtonModule, FormsModule, ReactiveFormsModule, GridModule]
})
export class UsersComponent implements OnInit {

  users = signal<User[]>([]);
  myForm: FormGroup;
  toDeleteIds = new Set<bigint>();
  deleteUserRes$: Observable<any>[] = [];

  public pageSize: number = 10;
  public skip: number = 0;
  public sortDescriptor: SortDescriptor[] = [];
  public filterTerm: number | null = null;

  constructor(private appDataStateService: StateMgmtService, private fb: FormBuilder) {

    this.myForm = this.fb.group({
      selectedOptions: this.fb.array([])
    });
    // this.loadUsers();
  }

  ngOnInit(): void {
    this.skip = 0;
    this.loadUsers();
    // users = this.appDataStateService.users
  }

  loadUsers() {
    this.users = this.appDataStateService.users;
    console.log(">> users: ", this.users());
  }

  onCheckboxChange(e: any, userId: bigint): void {
    this.toDeleteIds.add(userId);
  }

  deleteSelectedIds(): void {
    this.appDataStateService.deleteUsers([...this.toDeleteIds]!);
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadUsers();
  }

  public handleSortChange(descriptor: SortDescriptor[]): void {
    this.sortDescriptor = descriptor;
    this.loadUsers();
  }
}
