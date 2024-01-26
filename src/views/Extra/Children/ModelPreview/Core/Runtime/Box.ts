import { Entity } from "../Objects/Entity"
import * as THREE from 'three'
import { EntityPool } from "../Manager/EntityPool";

class Box extends Entity {
    public constructor() { super() }

    public override Init() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xdd8080, metalness: 0, roughness: 1 });
        this.body = new THREE.Mesh(geometry, material);
        this.body.castShadow = false
        this.body.receiveShadow = false
        this.body.position.set(4, 4, 0)
        EntityPool.Instance.AddToWorld(this)
    }
}

export { Box }