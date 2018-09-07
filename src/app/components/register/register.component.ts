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
  public registrationErrorMsg: String;

  constructor(
    private formBuilder: FormBuilder, 
    @Inject(IAuthService_Token) private auth: IAuthService,
    private dialogRef: MatDialogRef<RegisterComponent>,
    private dialog: MatDialog) 
  { 
    super();
  }

  ngOnInit() {
    this.registrationErrorMsg = "";
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required,
      Validators.minLength(5)]],
      password: ['', [Validators.required, 
        Validators.minLength(8), 
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });
  }

  onSubmit() {
    if (!this.isValid()) return;
    let email = this.registerForm.controls.email.value;
    let pass = this.registerForm.controls.password.value;
    let first = this.registerForm.controls.firstname.value;
    let last = this.registerForm.controls.lastname.value;
    this.auth.register(email, pass, first, last)
      .then(user => {
        this.dialogRef.close();
      })
      .catch(err => {
        this.registrationErrorMsg = "Registration failed.";
      });
  }

  isValid(): boolean {
    //TODO use angular form capabilities to display message attached to each field.
    this.registrationErrorMsg = "";
    if (!this.registerForm.controls.email.valid) {
      this.registrationErrorMsg = "Must provide a valid email address.";
    }
    else if (!this.registerForm.controls.password.valid) {
      this.registrationErrorMsg = "Password must be 8 characters with uppercase, lowercase, numerical, and special characters.";
    }
    else if (!this.registerForm.controls.firstname.valid) {
      this.registrationErrorMsg = "First name is a required field.";
    }
    else if (!this.registerForm.controls.lastname.valid) {
      this.registrationErrorMsg = "Last name is a required field.";
    }
    return this.registrationErrorMsg.length == 0
  }

  onLogin() {
    this.dialogRef.close();
    this.dialog.open(LoginComponent, {
      disableClose: true,
      closeOnNavigation: true
    });
  }
}
