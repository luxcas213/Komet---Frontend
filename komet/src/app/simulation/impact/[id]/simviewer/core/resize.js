
export function resizeHandler(renderer, camera, composer, bloomPass) {
    window.addEventListener('resize', () => {
        const w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        composer.setSize(w, h);
        bloomPass.setSize(w, h);
    });
}