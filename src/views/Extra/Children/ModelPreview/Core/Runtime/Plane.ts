import * as THREE from 'three'
import { Box } from "./Box"
import { EntityPool } from '../Manager/EntityPool';

class Plane extends Box {
    public constructor() {
        super()
    }

    public override Init() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0x44536d,
            metalness: 0,
            roughness: 1
        })
        this.body = new THREE.Mesh(geometry, material);
        this.body.castShadow = false
        this.body.receiveShadow = false
        this.body.scale.set(30, 0.5, 30)
        EntityPool.Instance.AddToWorld(this)
    }
}

export { Plane }