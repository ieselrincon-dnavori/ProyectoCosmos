import { Component } from '@angular/core';
import { UserStateService } from '../../services/user-state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mi-bono',
  templateUrl: './mi-bono.page.html',
  styleUrls: ['./mi-bono.page.scss'],
  standalone: false
})
export class MiBonoPage {

  bono$: Observable<any>;

  constructor(
    private userState: UserStateService
  ) {
    this.bono$ = this.userState.bono$;
  }

}
