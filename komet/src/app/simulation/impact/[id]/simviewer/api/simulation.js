
const url = `http://localhost:4000/api`;

export async function runSimulation(dx, dy, dz, vx, vy, vz, mass) {
    try {
        const res = await fetch(url + "/runsimulation", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                dx: dx,
                dy: dy,
                dz: dz,
                vx: vx,
                vy: vy,
                vz: vz,
                mass: mass
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