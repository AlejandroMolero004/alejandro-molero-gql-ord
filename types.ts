import { ObjectId } from "mongodb";

export type restaurantedb={
    _id?:ObjectId
        nombre:string
        direccion:string
        ciudad:string
        telefono:string
}