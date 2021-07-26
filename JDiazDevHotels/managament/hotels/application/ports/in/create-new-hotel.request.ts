import { CreateHotelCommand } from './create-hotel.command';
import { Hotel } from '../../../infraestucture/out/persistence/hotel.model';

//include owner
export interface CreateNewHotelRequest {
    createNewHotel(command: CreateHotelCommand, clientId: any, id: number): Promise<Hotel | any>
}