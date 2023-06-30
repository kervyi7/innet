import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account-service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public isOpenMenu = false;
  private _accountService: AccountService;

  constructor(accountService: AccountService) {
    this._accountService = accountService;
  }

  ngOnInit(): void {
    this._accountService.getUser().subscribe((user) => {
      console.log(user);
    });
  }

  public onOpenCloseMenu() {
    this.isOpenMenu = !this.isOpenMenu;
  }
}
