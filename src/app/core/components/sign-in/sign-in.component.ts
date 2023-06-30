import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { ILoginViewModel } from '../../models/view-model/login-view-model';
import { TokenViewModel } from '../../models/view-model/token-view-model';
import { ErrorTypes } from '../../enums/error-types';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public username: string;
  public password: string;
  public validationMessage: string;

  constructor(private _accountService: AccountService, private _router: Router) {
  }

  ngOnInit(): void {
  }

  public login() {
    this.validationMessage = "";
    const login: ILoginViewModel = {
      nick: this.username,
      password: this.password,
      email: this.username
    }
    this._accountService.getToken(login).subscribe((token: TokenViewModel) => {
      this._accountService.AuthService.setAuthToken(token.token);
      this._router.navigate(["/"]);
    },
      error => {
        switch (error.error.type) {
          case ErrorTypes.Unknown:
            this.validationMessage = "An error occurred on the server. Please, try again later.";
            return;
          case ErrorTypes.NotEmailConfirm:
            this._router.navigate(["/signup"], { queryParams: { nick: this.username }});
            return;
          case ErrorTypes.InvalidAuthorize:
            this.validationMessage = "Incorrect username or password";
          default:
            return;
        }
      });
  }
}
