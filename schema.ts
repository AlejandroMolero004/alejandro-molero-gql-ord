export const schema=`#graphql
    type restaurante{
        _id:ID!
        nombre:String!
        direccion:String!
        ciudad:String!
        telefono:String!
        temperatura:Int!
        hora:String!
    }
    type Query{
        getprueba:String
        getRestaurant(id:ID!):restaurante
        getRestaurants:[restaurante!]!
    }
    type Mutation{
        addrestaurant(nombre:String!,direccion:String!,ciudad:String!,telefono:String!):restaurante
        addprueba:String
    }

`