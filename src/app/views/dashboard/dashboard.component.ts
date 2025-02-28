import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { UserDto } from '../../models/UserDto';

import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '../../service/auth/CredentialsService';
import { ToastrService } from '../../service/toastr.service';
import { MatTabsModule } from '@angular/material/tabs';
import { VehicleService } from '../../service/VehicleService';
import { catchError, throwError } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { VehicleDto } from '../../models/VehicleDto';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatToolbarModule,
    MatCard,
    MatCardContent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCard,
    MatCardContent,
    MatTabsModule,
    MatCardActions,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  accountForm: FormGroup;
  vehicleForm: FormGroup;

  name: string = '';
  user: any = {};

  accountId!: string;
  firstName!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private toastr: ToastrService,
    private vehicleService: VehicleService
  ) {
    this.accountForm = this.fb.group({
      accountId: ['', [Validators.required]],
    });

    this.vehicleForm = this.fb.group({
      model: [''],
      make: [''],
      registrationId: ['', [Validators.required]],
      receiptDate: ['', Validators.required]
    });
  }

  getErrors(control: FormControl): string[] {
    if (control.hasError('required')) {
      return ['Date is required'];
    }
    return [];
  }

  ngOnInit(): void {
    this.user = history.state.user;
    console.log('Received user:', this.user);
    this.name = this.setUserNameOrAccountId(this.user);
  }

  async registerNewVehicle() {
    if (this.vehicleForm.valid) {


      let vehicle = new VehicleDto();
      vehicle.registrationId = this.vehicleForm.value.registrationId;
      vehicle.registrationExpirationDate = this.vehicleForm.value.receiptDate;
      vehicle.vehicleMake = this.vehicleForm.value.make;
      vehicle.vehicleModel = this.vehicleForm.value.model;

      this.vehicleService
        .registerNewVehicle(vehicle)
        .pipe(
          catchError((error) => {
            if (error.status === 400) {
              this.showToast('error', 'Vehicle already exists');
            }
            console.error('Error registering vehicle:' + error);
            return throwError(
              () => new Error('Error registering vehicle ' + error)
            );
          })
        )
        .subscribe((resp) => {
          this.showToast('success', 'Vehicle is successfully registered ');
        });
    }
  }

  getMyRegisteredVehicles() {}

  async checkRegistered() {
    if (this.accountForm.valid) {
      this.vehicleService
        .checkRegisteredVehicle(this.accountForm.value.accountId)
        .pipe(
          catchError((error) => {
            if (error.status === 400) {
              this.showToast('error', 'Vehicle by email doesn exist');
            }
            console.error('Login error:' + error);
            return throwError(
              () => new Error('Vehicle by email doesn exist ' + error)
            );
          })
        )
        .subscribe((resp) => {
          console.log('Login ', resp);
          if (resp.message === 'Vehicle registration is valid') {
            this.showToast(
              'success',
              'Vehicle registration is valid until ' + resp.validUntil
            );
          } else {
            this.showToast(
              'warn',
              'Vehicle registration has expired ' + resp.validUntil
            );
          }
        });
    }
  }

  setUserNameOrAccountId(user: UserDto) {
    return !user.firstName ? user.accountId : user.firstName;
  }

  onLogout() {
    this.credentialsService.userCredentials = '';
    console.log('logged off!');
    this.showToast('info', 'Succesfully logged off!');
    this.router.navigate(['']);
  }

  showToast(type: string, message: string) {
    this.toastr.showToast(type, message, 'top-right', true);
  }
}
