import { Entity } from "../Objects/Entity"
import * as THREE from 'three'
import { EntityPool } from "../Manager/EntityPool";

class Sphere extends Entity {
    public constructor() { super() }

    public override Init() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0xdd8080, metalness: 0, roughness: 1 });
        this.body = new THREE.Mesh(geometry, material);
        this.body.position.set(-4, 4, 0)
        this.body.castShadow = false
        this.body.receiveShadow = false
        EntityPool.Instance.AddToWorld(this)
    }
}

export { Sphere }