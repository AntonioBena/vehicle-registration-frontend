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
import { StatisticsService } from '../../service/StatisticsService';

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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  registrationForm: FormGroup;
  vehicleForm: FormGroup;
  name: string = '';
  user: any = {};
  accountId!: string;
  firstName!: string;
  myStatistics!: any;

  displayedColumns: string[] = ['email', 'numberOfVehicles'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  myDataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private toastr: ToastrService,
    private vehicleService: VehicleService,
    private statisticsService: StatisticsService
  ) {
    this.registrationForm = this.fb.group({
      registrationId: ['', [Validators.required]],
    });

    this.vehicleForm = this.fb.group({
      model: [''],
      make: [''],
      registrationId: ['', [Validators.required]],
      receiptDate: ['', Validators.required],
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
    this.name = this.setUserNameOrAccountId(this.user);
  }

  setUserNameOrAccountId(data: any) {
    let user = new UserDto();
    user.accountId = data.email;
    user.firstName = data.firstName;

    return !user.firstName || user.firstName.trim() === ''
      ? user.accountId
      : user.firstName;
  }

  onTabChange(event: any): void {
    this.callMethodBasedOnTab(event.index);
  }

  callMethodBasedOnTab(index: number): void {
    switch (index) {
      case 2:
        this.getMyStatistics();
        break;
      case 3:
        this.getStatisticsForAllAccounts(0, 50); //TODO should be pagination with buttons to change this, and caching
        break;
      default:
        console.log('Invalid tab');
    }
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
          this.vehicleForm.reset();
        });
    }
  }

  async getStatisticsForAllAccounts(page: number, size: number){
    console.log("getting all statistics")
    this.statisticsService
      .getAllStatistics(page, size)
      .pipe(
        catchError((error) => {
          if (error.status === 400 || error.status === 500) {
            this.showToast('error', 'Can not get statistics');
          }
          return throwError(
            () => new Error('Can not get statistics ' + error)
          );
        })
      )
      .subscribe((resp) => {
        console.log('gettered sttistics ', resp);
        this.dataSource = this.formatDataForTable(resp);
      });
  }

  formatDataForTable(responseData: any): any {
    if (responseData && responseData.data) {
      const data = responseData.data;

      if (data.content) {
        console.log("Formatted data from content: ", data.content);
        const formattedData = Object.keys(data.content).map(key => ({
          email: key,
          numberOfVehicles: data.content[key]
        }));

        console.log("Formatted for table: ", formattedData);
        return new MatTableDataSource(formattedData);
      }
      else {
        console.log("Formatted data from key-value pairs: ", data);
        const formattedData = Object.keys(data).map(key => ({
          email: key,
          numberOfVehicles: data[key]
        }));
      }
    }
    console.log("No valid data in: ", responseData);
    return new MatTableDataSource([]);
  }

  async getMyStatistics() {
    this.statisticsService
      .getMyStatistics(this.user.email)
      .pipe(
        catchError((error) => {
          if (error.status === 400) {
            this.showToast('error', 'Statistics by email doesn exist');
          }
          return throwError(
            () => new Error('Statistics by email doesn exist ' + error)
          );
        })
      )
      .subscribe((resp) => {
        console.log('gettered sttistics ', resp);

        const formattedData = Object.keys(resp.data).map(key => ({
          email: key,
          numberOfVehicles: resp.data[key]
        }));

        this.myDataSource = new MatTableDataSource(formattedData);
      });
  }

  async checkRegistered() {
    if (this.registrationForm.valid) {
      this.vehicleService
        .checkRegisteredVehicle(this.registrationForm.value.accountId)
        .pipe(
          catchError((error) => {
            if (error.status === 404) {
              this.showToast('error', 'Vehicle doesnt exist');
            }
            console.error('Error:' + error);
            return throwError(
              () => new Error('Vehicle doesn exist ' + error)
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
