import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileService } from 'src/app/core/services/file.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MessageService } from 'src/app/core/services/message-service';
import { MessageEventCodes } from 'src/app/core/enums/message-event-codes';
import { AccountService } from 'src/app/core/services/account-service';
import { UserViewModel } from 'src/app/core/models/view-model/user-view-model';
import { Router } from '@angular/router';
import { AppConfigService } from 'src/app/core/services/app-config.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
  @ViewChild('file', { static: true }) file: ElementRef;
  private _timeout: any;
  public cropperSettings = {
    maintainAspectRatio: true,
    aspectRatio: 1,
    format: 'jpeg',
    resizeToWidth: 200,
    resizeToHeight: 200
  };
  public user: UserViewModel = new UserViewModel();
  // public name: string;
  // public email: string;
  // public avatar: string;
  // public username: string;
  public imageChangedEvent: any = '';
  public croppedImage: string = '';
  public showImageCropper = false;

  constructor(
    private _router: Router,
    private _fileService: FileService, 
    private _messageService: MessageService, 
    private _accountService: AccountService,
    private _appConfigService: AppConfigService) {
  }

  ngOnInit(): void {
    this._accountService.getUser().subscribe((user) => {
      console.log(user);
      // this.avatar = baseUrl + '/' + user.avatar;
      // this.email = user.email;
      // this.name = user.name;
      // this.username = user.nick;
      // this.i
      this.user = user;
      this.user.avatar = this.convertAvatarUrl(user.avatar);
    }, error => {
      if (error.status === 401) {
        this._router.navigate(['/signin']);
      }
    });
  }

  public cancelUpload() {
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.file.nativeElement.value = null;
    this.showImageCropper = false;
  }

  public onClickFileInput() {
    this.file.nativeElement.click();
  }

  public fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this._timeout = setTimeout(() => this.showImageCropper = true, 1500);
  }

  public imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  public imageLoaded() {
    // show cropper
  }
  public cropperReady() {
    // cropper ready
  }
  public loadImageFailed() {
    clearTimeout(this._timeout);
    this.showImageCropper = false;
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.file.nativeElement.value = null;
    this._messageService.publish({ code: MessageEventCodes.error, data: 'Alay error' });
  }

  public saveChanges() {
    const user: UserViewModel = {
      id: this.user.id,
      avatar: this.user.avatar,
      email: this.user.email,
      name: this.user.name,
      nick: this.user.nick
    }
    this._accountService.editUser(user).subscribe(() => {
      debugger;
    })
  }

  public addFile(): void {
    if (!this.croppedImage) {
      return;
    }
    fetch(this.croppedImage)
      .then(res => {
        res.blob()
          .then(blob => {
            this._fileService.addAvatar(blob).subscribe(user => {
              this.user.avatar = this.convertAvatarUrl(user.avatar);
              this.showImageCropper = false;
            }, error => {
              console.log(error);
            });
          });
      });
  }

  private convertAvatarUrl(filePatch: string):string {
    const baseUrl = this._appConfigService.getConfig('backUrl');
    return baseUrl + '/' + filePatch;
  }
}
