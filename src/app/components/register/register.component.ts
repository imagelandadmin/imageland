import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAuthService_Token, IAuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, @Inject(IAuthService_Token) private auth: IAuthService) { 
    
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
    var email = this.registerForm.controls.email.value;
    var pass = this.registerForm.controls.password.value;
    var first = this.registerForm.controls.firstname.value;
    var last = this.registerForm.controls.lastname.value;
    this.auth.register(email, pass, first, last);
  }
}
