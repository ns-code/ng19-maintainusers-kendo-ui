import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { StateMgmtService } from "../state-mgmt.service";

@Injectable({
    providedIn: 'root'
  })
  export class UpdateUserResolver implements Resolve<any> {
  
    constructor(private appDataStateService: StateMgmtService) {}
  
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
      // Fetch data from your service
      console.log(">> toupdateuser: ", route.params['id']);
      const userId = BigInt(('' + route.params['id']).replace(':', ''));
      this.appDataStateService.toUpdateUser(userId)
    }
  }