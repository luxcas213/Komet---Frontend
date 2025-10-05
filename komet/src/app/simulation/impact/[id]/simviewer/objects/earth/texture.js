import * as THREE from 'three';

export function createEarthTexture(renderer){
    // Texture(s)
    const texLoader = new THREE.TextureLoader();
    const earthMap = texLoader.load('/textures/earth_diffuse.jpg');
    // three r152+: use colorSpace; older: earthMap.encoding = THREE.sRGBEncoding;
    if ('SRGBColorSpace' in THREE) earthMap.colorSpace = THREE.SRGBColorSpace;
    earthMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return earthMap;
}