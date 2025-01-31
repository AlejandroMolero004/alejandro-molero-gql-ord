import { GraphQLError } from "graphql";
import { restaurantedb } from "./types.ts";
import { getlatitudelongitude, gettimezone } from "./apiunctions.ts";
import { Collection,ObjectId } from "mongodb";
import { gettcountry } from "./apiunctions.ts";

type context={
    coleccionrestaurante:Collection<restaurantedb>
}
export const resolvers={
    Query:{
        getprueba:(_:unknown,__:unknown):string=>{
            return "prueba"
        },
        getRestaurant:async(_:unknown,args:{id:string},ctx:context):Promise<restaurantedb|null>=>{
            const restaurante=await ctx.coleccionrestaurante.findOne({_id:new ObjectId(args.id)})
            if(!restaurante) return null
            return restaurante
        },
        getRestaurants:async(_:unknown,args:{id:string},ctx:context):Promise<restaurantedb[]|null>=>{
            const restaurante=await ctx.coleccionrestaurante.find().toArray()
            if(!restaurante) return null
            return restaurante
        }
    },
    Mutation:{
        addrestaurant:async(_:unknown,args:{nombre:string,direccion:string,ciudad:string,telefono:string},ctx:context):Promise<restaurantedb|null>=>{
            const telefono_valid=await gettimezone(args.telefono)
            console.log("hola")
            if(!telefono_valid) return null
            console.log("adios")
            const restaurante=await ctx.coleccionrestaurante.findOne({telefono:args.telefono})
            if(restaurante) return null
            const{insertedId}=await ctx.coleccionrestaurante.insertOne(
                {
                    nombre:args.nombre,
                    direccion:args.direccion,
                    ciudad:args.ciudad,
                    telefono:args.telefono
                }
            )
            
            return {
                _id:insertedId,
                nombre:args.nombre,
                direccion:args.direccion,
                ciudad:args.ciudad,
                telefono:args.telefono
            }
        }
    },
    restaurante:{
        _id:(parent:restaurantedb):string=>parent._id!.toString(),
        direccion:async(parent:restaurantedb):Promise<string>=>{
            const API_KEY=Deno.env.get("API_NINJA")
            if(!API_KEY){
                throw Error("Api key not found");
            }
            const url="https://api.api-ninjas.com/v1/validatephone?number="+parent.telefono
            const data=await fetch(url,
                {
                    headers:{
                        'X-Api-Key':API_KEY
                    }
                }
            )
            if(data.status!==200) return "no data"
            const response=await data.json()
            console.log(response.country+","+response.location)
            if(!response.is_valid) return "telefono no valido"

            return response.country+","+response.location
        },
        temperatura:async(parent:restaurantedb):Promise<number|string>=>{
            // & PARA SEPARAR
            console.log("ddentro de temperatura")
            const API_KEY=Deno.env.get("API_NINJA")
            if(!API_KEY){
                throw Error("Api key not found");
            }
            console.log("ddentro de temperatura")
            console.log(parent.ciudad)
            if(!getlatitudelongitude) return "bad"
            const country=await gettcountry(parent.ciudad)
            if(!country) return "bad"
            const longitude=await getlatitudelongitude(parent.ciudad,country)
            console.log("longitude"+longitude)
            const url="https://api.api-ninjas.com/v1/weather?lat="+longitude[0]+"&lon="+longitude[1]
            const data=await fetch(url,
                {
                    headers:{
                        'X-Api-Key':API_KEY
                    }
                }
            )
            console.log("ddentro de temperatura")
            console.log(data.status)
            console.log("status")
           if(data.status!==200) return "status !=200"
            const response=await data.json()
            console.log(response)
            return response.temp
        },
        hora:async(parent:restaurantedb):Promise<string>=>{
            const API_KEY=Deno.env.get("API_NINJA")
            if(!API_KEY){
                throw Error("Api key not found");
            }
            const timezone=await gettimezone(parent.telefono)
            const url="https://api.api-ninjas.com/v1/worldtime?timezone="+timezone
            const data=await fetch(url,
                {
                    headers:{
                        'X-Api-Key':API_KEY
                    }
                }
            )
            if(data.status!==200) return "no data"
            const response=await data.json()
            const hora:string=response.hour+":"+response.minute
            return hora
        }
    }
}