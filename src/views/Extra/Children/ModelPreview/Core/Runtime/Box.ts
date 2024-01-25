import { Entity } from "../Objects/Entity"
import * as THREE from 'three'
import { EntityPool } from "../Manager/EntityPool";

class Box extends Entity {
    public constructor() { super() }

    public override Init() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x212121, emissive: 0x000000, metalness: 1, roughness: 0 });
        this.body = new THREE.Mesh(geometry, material);
        this.body.castShadow = false
        this.body.receiveShadow = false
        EntityPool.Instance.AddToWorld(this)
    }
}

export { Box }