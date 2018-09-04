import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAuthService_Token, IAuthService } from '../../services/auth.service';
import { BaseComponent } from '../base/base.component';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent {

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private dialogRef: MatDialogRef<LoginComponent>,
    @Inject(IAuthService_Token) private auth: IAuthService) 
  { 
    super();
  }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
    });
  }

  onSubmit() {
    var email = this.loginForm.controls.email.value
    var pass = this.loginForm.controls.password.value
    this.auth.login(email, pass);
    this.dialogRef.close();
  }
}
