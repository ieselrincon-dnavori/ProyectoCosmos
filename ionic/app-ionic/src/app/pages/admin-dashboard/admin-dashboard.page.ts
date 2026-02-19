import { Component } from '@angular/core';
import { AdminService, Dashboard } from '../../services/admin.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone:false
})
export class AdminDashboardPage {

  dashboard$: Observable<Dashboard>;

  constructor(private adminService: AdminService) {
    this.dashboard$ = this.adminService.getDashboard();
  }

}

