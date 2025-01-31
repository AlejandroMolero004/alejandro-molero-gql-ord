import { MongoClient } from "mongodb";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import {ApolloServer} from "@apollo/server"
import {startStandaloneServer} from "npm:@apollo/server@4.11.3/standalone";
import { restaurantedb } from "./types.ts";
const MONGO_URL=Deno.env.get("MONGO_URL")
if(!MONGO_URL){
  throw Error("Mongo URL not found");
}

const client= new MongoClient(MONGO_URL)
await client.connect()
 
const db=client.db("APIrestaurante")

const coleccionrestaurante=db.collection<restaurantedb>("restaurante")


const server=new ApolloServer({
    typeDefs:schema,resolvers
})

const{url}=await startStandaloneServer(server,{
  context:async()=>(await {
    /*coleccioncomensales,
    coleccioncamareros,
    coleccionmesas*/
    coleccionrestaurante
  }),
    listen:{port:8000},
})

console.log(url)
