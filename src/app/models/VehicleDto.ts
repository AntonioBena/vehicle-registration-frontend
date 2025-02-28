import { UserDto } from "./UserDto";

export class VehicleDto{
  vehicleId!: number;
  vehicleMake!: string;
  vehicleModel!: string;
  registrationId!: string;
  registrationExpirationDate!: string;
  user!: UserDto;
}
