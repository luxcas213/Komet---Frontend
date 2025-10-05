
export async function getData(id){
    const url = `https://komet-backend-phi.vercel.app/api/asteroids/${id}`
    try {
        const res = await fetch(url);
        if(!res.ok) throw new Error('Failed to fetch asteroid data');

        const data = await res.json(); 
        //transform into v, p, m
        return data;
    } 
    catch(error){
        console.error(error);
    }
}