import { NotificationType } from "./NotificationType"
import { Users } from "./Users"

export class Notifications{
    idNotificacion:number=0
    mensaje:string=""
    estado:string=""
    tipoNotificacion: NotificationType=new NotificationType()
    usuarios: Users=new Users()
}