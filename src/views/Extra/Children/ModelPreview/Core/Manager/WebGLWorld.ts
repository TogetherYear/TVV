import { EventSystem } from "@/libs/EventSystem";
import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water'
import { GameLoop } from "./Gameloop";
import { Type } from "../Type"

class WebGLWorld extends EventSystem {
    private constructor() { super() }

    private static instance: WebGLWorld = new WebGLWorld()

    public static get Instance() { return WebGLWorld.instance }

    public scene: THREE.Scene | null = null

    public renderer: THREE.WebGLRenderer | null = null

    public camera: THREE.PerspectiveCamera | null = null

    public directionalLight: THREE.DirectionalLight | null = null

    public ambientLight: THREE.AmbientLight | null = null

    public water: Water | null = null

    public Run() {
        this.InitScene()

        this.InitCamera()

        this.InitRenderer()

        this.InitDireLight()

        this.InitAmbientLight()

        this.InitFog()

        this.InitWater()

        this.ListenEvents()
    }

    private InitScene() {
        this.scene = new THREE.Scene()
    }

    private InitCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 5, 18)
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.scene?.add(this.camera)
    }

    private InitRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        })
        this.renderer.shadowMap.enabled = false
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setClearColor(0x333333, 1.0)
        document.getElementById('WebGLWorld')?.appendChild(this.renderer.domElement)
    }

    private InitDireLight() {
        this.directionalLight = new THREE.DirectionalLight(0xcccccc, 1)
        this.directionalLight.position.set(5, 2, 0)
        this.directionalLight.castShadow = false
        this.scene?.add(this.directionalLight)
    }

    private InitAmbientLight() {
        this.ambientLight = new THREE.AmbientLight(0xcccccc, 0.3)
        this.scene?.add(this.ambientLight)
    }

    private InitFog() {
        if (this.scene) {
            this.scene.fog = new THREE.FogExp2(0x333333, 0.05)
        }
    }

    private async InitWater() {
        const nT = await Renderer.Resource.GetPathByName('Models/normal.jpg')
        const waterGeometry = new THREE.PlaneGeometry(1000, 1000)
        const texture = new THREE.TextureLoader().load(nT)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        this.water = new Water(waterGeometry, {
            // 这个宽度和高度越大 水面投影的边缘越光滑 默认512
            textureWidth: 1024,
            textureHeight: 1024,
            waterNormals: texture,
            waterColor: 0x001e0f,
            distortionScale: 0.6,
            fog: this.scene?.fog !== undefined
        })
        this.water.rotation.x = -Math.PI / 2
        this.water.position.y = -3
        this.water.userData = {
            type: 'TWater'
        }
        this.scene?.add(this.water)
    }

    private ListenEvents() {
        GameLoop.Instance.AddListen(Type.GLEvents.Update, this, this.Update)
    }

    private Update() {
        this.UpdateWater()
        this.RenderWorld()
    }

    private UpdateWater() {
        if (this.water != null) {
            this.water.material.uniforms['time'].value += 0.5 / 60.0
        }
    }

    private RenderWorld() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera)
        }
    }
}

export { WebGLWorld }