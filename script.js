import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight
)
camera.position.z = 2

var ww = window.innerWidth
var wh = window.innerHeight

var renderer = new THREE.WebGLRenderer()
renderer.setSize(ww, wh)
renderer.setClearColor('black', 0.2)
const animationContainer = document.getElementById('animation-ctn')
animationContainer.appendChild(renderer.domElement)

const vertexShader = `
    uniform float time;
    varying vec2 vUv;

    void main() {
        vec3 newPosition = position;
        float displacement = sin(position.x * 3.0 + time) * 1.5;
        newPosition.z += displacement;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.5);
    }
`
const fragmentShader = `
    uniform float time;
    uniform vec3 gradientColor1;
    uniform vec3 gradientColor2;
    varying vec2 vUv;
    void main() {
        float t = (vUv.y + 1.0) / 2.5;
        vec3 color = mix(gradientColor1, gradientColor2, t);
        float timeVariation = sin(time/2.0);
        color += timeVariation * 0.2; 
        gl_FragColor = vec4(color, 2.0);
    }
`

const geometry = new THREE.SphereGeometry(10, 200, 200)
const customMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        gradientColor1: { value: new THREE.Vector3(1, 0, 1) },
        gradientColor2: { value: new THREE.Vector3(1, 1, 0) },
        time: { value: 1 },
    },
})
const sphere = new THREE.Mesh(geometry, customMaterial)
scene.add(sphere)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
})

const clock = new THREE.Clock()

let animationFinished = false

function animate() {
    requestAnimationFrame(animate)
    customMaterial.uniforms.time.value += 0.1

    const elapsedTime = clock.getElapsedTime()

    renderer.render(scene, camera)

    if (!animationFinished && elapsedTime > 3.14) {
        animationFinished = true

        const animationContainer = document.getElementById('animation-ctn')
        animationContainer.style.opacity = '0'
        animationContainer.style.transition = 'opacity 0.5s'

        const inspo = document.getElementById('inspo')
        inspo.style.opacity = '0'
        inspo.style.transition = 'opacity 2s'

        const textContainer = document.getElementById('text-ctn')
        textContainer.style.opacity = 1
        textContainer.style.pointerEvents = 'auto'
    }

    if (animationFinished && elapsedTime > 10) {
        camera.remove()
        scene.remove(sphere)
        renderer.dispose()
        clock.stop()
    }
}

animate()
