import { Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [
    Button,
    Divider,
    InputText,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private formBuilder: FormBuilder = new FormBuilder();

  registerForm: FormGroup = new FormGroup({});

  constructor(private router: Router) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
      authorName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  registerUser(): void {
    if (!this.registerForm?.value) {
      return;
    }
    // TODO: when entering email -> chcek the BE if the user exists and display message. Email needs to be unique
    // TODO: add password validation - complex password + matching passwords
    // TODO: create a notification service for displaying notifications
    // TODO: add login with gmail

    if (this.registerForm.value['password'] !== this.registerForm.value['password2']) {
      // TODO: display notification: Passwords don't match
      return
    }
    const registerUser = User.toDto(this.registerForm.value);
    this.authService.register(registerUser).subscribe({
      next: (): void => {
        this.router.navigate(['/']);
      },
      error: (): void => {
        //   TODO: display notification for Login error
      }
    });
  }

}
