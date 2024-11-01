import { DonationType } from "./DonationType"
import { Users } from "./Users"

export class Donations{
    idDonation:number=0
    nombre:string=""
    descripcion:string=""
    estado:string=""
    fechaRecojo:Date=new Date()
    montoDonado:number=0
    eliminado:boolean=false
    direccionRecojo:string=""
    user:Users=new Users()
    userReceptor:Users=new Users()
    donationType:DonationType=new DonationType()
}