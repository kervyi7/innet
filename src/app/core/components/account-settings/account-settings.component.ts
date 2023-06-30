import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  constructor(
    private _router: Router,
    private _authService: AuthService) {

  }

  ngOnInit(): void {
  }

  public logOut() {
    this._authService.removeAuthToken();
    this._router.navigate(['/signin']);
  }
}
