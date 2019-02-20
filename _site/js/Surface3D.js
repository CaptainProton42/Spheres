class Surface3D {
    constructor() {
        this.mesh = new THREE.Mesh();
    }

    getMesh() {
        return this.mesh;
    }
}


class DiscSurface3D extends Surface3D {
    constructor(radius, position, normal, color) {
        super();

        var geometry = new THREE.CircleGeometry( radius, 64 );
        var material = new THREE.MeshBasicMaterial( { color: color , opacity: 0.15, transparent: true, side: THREE.DoubleSide } );

        var mesh = new THREE.Mesh( geometry, material );

        var n1 = new THREE.Vector3(0.0, 0.0, 1.0);

        var quaternion = new THREE.Quaternion(); // create one and reuse it

        quaternion.setFromUnitVectors( n1, normal );

        var matrix = new THREE.Matrix4(); // create one and reuse it

        matrix.makeRotationFromQuaternion( quaternion );

        mesh.applyMatrix( matrix );

        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z;

        this.mesh = mesh;
    }
};

class ArcSurface3D extends Surface3D {
    constructor(radius, phi1, phi2, position, normal, color) {
        super();

        var material = new THREE.MeshBasicMaterial( { color: color , opacity: 0.15, transparent: true, side: THREE.DoubleSide } );

        var shape = new THREE.Shape();
        if (phi2 > phi1 ) {
            shape.arc(0.0, 0.0, radius, phi1, phi2, false);
        } else {
            shape.arc(0.0, 0.0, radius, phi1, phi2, true); 
        }
        shape.lineTo(0.0, 0.0);
        shape.lineTo(1.0, 0.0);

        var geometry = new THREE.ShapeGeometry( shape );

        var mesh = new THREE.Mesh( geometry, material );

        var n1 = new THREE.Vector3(0.0, 0.0, 1.0);

        var quaternion = new THREE.Quaternion(); // create one and reuse it

        quaternion.setFromUnitVectors( n1, normal );

        var matrix = new THREE.Matrix4(); // create one and reuse it

        matrix.makeRotationFromQuaternion( quaternion );

        mesh.applyMatrix( matrix );
        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z;

        this.mesh = mesh;
    }
}