import { DonationType } from "./DonationType"
import { Users } from "./Users"

export class Donations{
    idDonation:number=0
    nombre:string=""
    descripcion:string=""
    estado: boolean = false;
    fechaRecojo:Date=new Date()
    montoDonado:number=0
    eliminado:boolean=false
    direccionRecojo:string=""
    users:Users=new Users()
    usersReceptor:Users=new Users()
    donationType:DonationType=new DonationType()
}