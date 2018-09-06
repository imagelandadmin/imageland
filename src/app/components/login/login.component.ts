import { Component, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAuthService_Token, IAuthService } from '../../services/auth.service';
import { BaseComponent } from '../base/base.component';
import { RegisterComponent } from '../register/register.component';
import { MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent {

  loginForm: FormGroup;
  public loginErrorMsg: String;

  constructor(
    private formBuilder: FormBuilder, 
    private dialogRef: MatDialogRef<LoginComponent>,
    private dialog: MatDialog,
    @Inject(IAuthService_Token) private auth: IAuthService) 
  { 
    super();
  }

  ngOnInit() {
    this.loginErrorMsg = "";
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    var email = this.loginForm.controls.email.value;
    var pass = this.loginForm.controls.password.value;
    this.auth.login(email, pass)
      .then(user => {
        this.dialogRef.close();
      })
      .catch(err => {
        this.loginErrorMsg = "Login failed.";
      });
  }

  onRegister() {
    this.dialogRef.close();
    this.dialog.open(RegisterComponent, {
      disableClose: true,
      closeOnNavigation: true
    });
  }
}
