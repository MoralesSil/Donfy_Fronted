import { Role } from './Role';

export class Users {
    id : number = 0
    username : string = ""
    password : string = ""
    enabled : boolean = true
    correo : string = ""
    nombre : string = ""
    apellidos : string = ""
    telefono : string = ""
    dni : string = ""
    ruc : string = ""
    direccion : string = ""
    nombreONG : string = ""
    saldo : number = 0
    roles:Role[]= new Array<Role>()
}