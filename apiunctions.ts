export const gettimezone=async(telefono:string):Promise<string|null>=>{

    const API_KEY=Deno.env.get("API_NINJA")
    if(!API_KEY){
        throw Error("Api key not found");
    }
    const url="https://api.api-ninjas.com/v1/validatephone?number="+telefono
    const data=await fetch(url,
        {
            headers:{
                'X-Api-Key':API_KEY
            }
        }
    )
    if(data.status!==200) return "status !=200"
    const response=await data.json()
    if(!response.is_valid) return null
    //console.log(response.timezones[1])
    return response.timezones[1]
}
export const gettcountry=async(telefono:string):Promise<string|null>=>{

    const API_KEY=Deno.env.get("API_NINJA")
    if(!API_KEY){
        throw Error("Api key not found");
    }
    const url="https://api.api-ninjas.com/v1/validatephone?number="+telefono
    const data=await fetch(url,
        {
            headers:{
                'X-Api-Key':API_KEY
            }
        }
    )
    if(data.status!==200) return "status !=200"
    const response=await data.json()
    if(!response.is_valid) return null
    //console.log(response.timezones[1])
    return response.country
}
export const getlatitudelongitude=async(city:string,country:string):Promise<string[]|string>=>{
    const API_KEY=Deno.env.get("API_NINJA")
    if(!API_KEY){
        throw Error("Api key not found");
    }
    const url="https://api.api-ninjas.com/v1/geocoding?city="+city+"&country="+country
    const data=await fetch(url,
        {
            headers:{
                'X-Api-Key':API_KEY
            }
        }
    )
    if(data.status!==200) return "status !=200"
    const response=await data.json()
    console.log(response)
    console.log(response[0].latitude+"+"+response[1].longitude)
    return[
        response[0].latitude,
        response[0].longitude
    ]
}