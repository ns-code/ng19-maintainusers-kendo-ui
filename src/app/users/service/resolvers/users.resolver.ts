import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { StateMgmtService } from "../state-mgmt.service";

@Injectable({
    providedIn: 'root'
  })
  export class UsersResolver implements Resolve<any> {
  
    constructor(private appDataStateService: StateMgmtService) {}
  
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
      // Fetch data from your service
      console.log(">> resolving /users ");
      this.appDataStateService.loadUsers();
    }
  }