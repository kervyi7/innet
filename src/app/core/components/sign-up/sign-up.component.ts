import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { RegisterUserViewModel } from '../../models/view-model/register-user-view-model';
import { ConfirmViewModel } from '../../models/view-model/confirm-view-model';
import { TokenViewModel } from '../../models/view-model/token-view-model';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorTypes } from '../../enums/error-types';
import { ErrorViewModel } from '../../models/view-model/error-view-model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  private _accountService: AccountService;
  private _router: Router;
  private _queryNick: string;
  public username: string;
  public fullname: string;
  public email: string;
  public password: string;
  public code: string;
  public isViewConfirmationPanel = false;
  public validationMessage: string;

  constructor(accountService: AccountService, router: Router,  private _activatedRoute: ActivatedRoute) {
    this._accountService = accountService;
    this._router = router;
  }

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      this._queryNick = params['nick']
      if (this._queryNick) {
        this.isViewConfirmationPanel = true;
      }
    });
  }

  public register() {
    this.validationMessage = "";
    this.emailValidation();
    this.usernameValidation();
    this.passwordValidation();
    if (this.validationMessage != "") {
      return;
    }
    const user: RegisterUserViewModel = {
      avatar: null,
      email: this.email,
      name: this.fullname,
      nick: this.username,
      password: this.password
    }
    this._accountService.registerUser(user).subscribe(() => {
      this.isViewConfirmationPanel = true;
    },
      error => {
        this.handlerError(error.error);
      });
  }

  public confirm() {
    const email = this.email ?? this._queryNick;
    const confirmCode: ConfirmViewModel = {
      email: email,
      nick: email,
      code: this.code.toString()
    }
    this._accountService.confirmEmail(confirmCode).subscribe((token: TokenViewModel) => {
      this._accountService.AuthService.setAuthToken(token.token);
      this._router.navigate(["/"]);
    },
      error => {
        this.handlerError(error.error);
      });
  }

  public emailValidation() {
    if (this.email.length < 14) {
      this.validationMessage = "Your email very small";
      return;
    }
    this.validationMessage = "";
  }

  public usernameValidation() {
    if (this.username.length < 6) {
      this.validationMessage = "Use 6 characters or more for your username";
      return;
    }
    if (/[^A-Za-z0-9_.]/.test(this.username)) {
      this.validationMessage = "Your username contains invalid characters";
      return;
    }
    this.validationMessage = "";
  }

  public passwordValidation() {
    if (this.password.length < 8) {
      this.validationMessage = "Use 8 characters or more for your password";
      return;
    }
    if (/[^A-Za-z0-9_.]/.test(this.password)) {
      this.validationMessage = "Your password contains invalid characters";
      return;
    }
    if (!(/(?=.*\d)(?=.*[a-z])/.test(this.password))) {
      this.validationMessage = "Use letters and numbers for your password";
      return;
    }
    this.validationMessage = "";
  }

  private handlerError(error: ErrorViewModel) {
    debugger;
    switch (error.type) {
      case ErrorTypes.Unknown:
        this.validationMessage = "An error occurred on the server. Please, try again later.";
        return;
      case ErrorTypes.Required:
        this.validationMessage = "You missed required input.";
        return;
      case ErrorTypes.NotUnique:
        this.handlerObjectError(error.objectName);
      case ErrorTypes.InvalidSendEmail:
        this.validationMessage = "An error occurred on the server. Please, try again later.";
        return;
      case ErrorTypes.Unknown:
        this.validationMessage = "An error occurred on the server. Please, try again later.";
        return;
      case ErrorTypes.InvalidEmailCode:
        this.validationMessage = "Incorrect code";
      default:
        return;
    }
  }

  public handlerObjectError(objectName: string) {
    switch (objectName) {
      case "Nick":
        this.validationMessage = "That username is already taken.";
        return;
      case "Email":
        this.validationMessage = "That email is already taken.";
        return;
      default:
        return;
    }
  }
}
