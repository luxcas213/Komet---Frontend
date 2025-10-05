
const url = `https://komet-backend-phi.vercel.app/api`;

export async function runSimulation(asteroid) {
    try {
        const res = await fetch(url + "/runsimulation", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                dx: asteroid.pos[0],
                dy: asteroid.pos[1],
                dz: asteroid.pos[2],
                vx: asteroid.vel[0],
                vy: asteroid.vel[1],
                vz: asteroid.vel[2],
                mass: asteroid.mass
            })
        });

        if(!res.ok) throw new Error('Failed to run simulation');

        const data = await res.json();
        return data;
    } 
    catch(error){
        console.error(error);
    }
}

export async function getSimulationData(id){
    try {
        const res = await fetch(url + "/simulationresults?id=" + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(!res.ok) throw new Error('Failed to fetch simulation data');

        const data = await res.json();
        return data.logData;
    } 
    catch(error){
        console.error(error);
    }
}