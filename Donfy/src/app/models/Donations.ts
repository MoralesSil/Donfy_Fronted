import { DonationType } from "./DonationType"

export class Donations{
    idDonation:number=0
    nombre:string=""
    descripcion:string=""
    estado:string=""
    fechaRecojo:Date=new Date()
    montoDonado:number=0
    eliminado:boolean=false
    direccionRecojo:string=""
    //Las FK de Usuario
    donationType:DonationType=new DonationType()
}