import * as THREE from 'three'
import { Box } from "./Box"
import { EntityPool } from '../Manager/EntityPool';


class Plane extends Box {
    public constructor() {
        super()
    }

    public override async Init() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        this.body = new THREE.Mesh(geometry, await this.GetInstanceMaterial(6, THREE.FrontSide));
        this.body.castShadow = false
        this.body.receiveShadow = false
        this.body.scale.set(30, 0.05, 30)
        EntityPool.Instance.AddToWorld(this)
    }

    private async GetInstanceMaterial(repeat: number, side: THREE.Side) {
        const bcT = await Renderer.Resource.GetPathByName('Models/Plane/basecolor.png')
        const basecolor = new THREE.TextureLoader().load(bcT)
        basecolor.wrapS = THREE.RepeatWrapping
        basecolor.wrapT = THREE.RepeatWrapping
        basecolor.repeat.set(repeat, repeat)

        const hT = await Renderer.Resource.GetPathByName('Models/Plane/height.png')
        const height = new THREE.TextureLoader().load(hT)
        height.wrapS = THREE.RepeatWrapping
        height.wrapT = THREE.RepeatWrapping
        height.repeat.set(repeat, repeat)

        const mT = await Renderer.Resource.GetPathByName('Models/Plane/metallic.png')
        const metallic = new THREE.TextureLoader().load(mT)
        metallic.wrapS = THREE.RepeatWrapping
        metallic.wrapT = THREE.RepeatWrapping
        metallic.repeat.set(repeat, repeat)

        const nT = await Renderer.Resource.GetPathByName('Models/Plane/normal.png')
        const normal = new THREE.TextureLoader().load(nT)
        normal.wrapS = THREE.RepeatWrapping
        normal.wrapT = THREE.RepeatWrapping
        normal.repeat.set(repeat, repeat)

        const rT = await Renderer.Resource.GetPathByName('Models/Plane/roughness.png')
        const roughness = new THREE.TextureLoader().load(rT)
        roughness.wrapS = THREE.RepeatWrapping
        roughness.wrapT = THREE.RepeatWrapping
        roughness.repeat.set(repeat, repeat)
        const material = new THREE.MeshStandardMaterial({
            map: basecolor,
            side: side,
            bumpMap: height,
            normalMap: normal,
            metalnessMap: metallic,
            roughnessMap: roughness
        })
        return material
    }

}

export { Plane }