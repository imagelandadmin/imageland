import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAuthService_Token, IAuthService } from '../../services/auth.service';
import { BaseComponent } from '../base/base.component';
import { LoginComponent } from '../login/login.component';
import { MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent {

  private registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    @Inject(IAuthService_Token) private auth: IAuthService,
    private dialogRef: MatDialogRef<RegisterComponent>,
    private dialog: MatDialog) 
  { 
    super();
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });
  }

  onSubmit() {
    let email = this.registerForm.controls.email.value;
    let pass = this.registerForm.controls.password.value;
    let first = this.registerForm.controls.firstname.value;
    let last = this.registerForm.controls.lastname.value;
    this.auth.register(email, pass, first, last);
  }

  onLogin() {
    this.dialogRef.close();
    this.dialog.open(LoginComponent, {
      disableClose: true,
      closeOnNavigation: true
    });
  }
}
