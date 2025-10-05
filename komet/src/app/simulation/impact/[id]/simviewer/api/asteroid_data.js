
export async function getData(id){
    const url = `http://localhost:4000/api/asteroidsimdata/${id}`
    try {
        const res = await fetch(url);
        if(!res.ok) throw new Error('Failed to fetch asteroid data');

        const data = await res.json(); 
        return data;
    } 
    catch(error){
        console.error(error);
    }
}