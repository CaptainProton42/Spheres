class Shape3D {
    constructor() {
        this.mesh = new THREE.Mesh();
        this.orientation = new THREE.Vector3(1.0, 0.0, 0.0);
        this.position = new THREE.Vector3();
    }

    getMesh() {
        return this.mesh;
    }
}

class Star extends Shape3D {
    constructor(position, color) {
        super();
        var loader = new THREE.GLTFLoader();
        var parent = this;

        loader.load( 'models/star.glb', function ( gltf ) {

            var geometry =  gltf.scene.children[0].geometry;
            var material = new THREE.MeshBasicMaterial( { color: color, transparent: true, side: THREE.DoubleSide, depthWrite: false } );

            parent.mesh.geometry = geometry;
            parent.mesh.material = material;
            parent.mesh.position.x = position.x;
            parent.mesh.position.y = position.y;
            parent.mesh.position.z = position.z;

        }, undefined, function ( error ) {

            console.error( error );

        } );
    }
}

class Dot3D extends Shape3D {
    constructor(position, size, color) {
        super();
        var geometry = new THREE.SphereGeometry( size, 32, 32 );
        var material = new THREE.MeshBasicMaterial( { color: color, transparent: true, side: THREE.DoubleSide, depthWrite: false } );

        var mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z;

        this.mesh = mesh;
    }
}

class DirectionMarker extends Shape3D {
    constructor(position, orientation, size, color) {
        super();
        this.orientation = orientation;

        var material = new THREE.MeshBasicMaterial( {color: color, transparent: true, side: THREE.DoubleSide, depthWrite: false } );

        var shape = new THREE.Shape();
        shape.moveTo(-size, 0.0);
        shape.lineTo(0.0, size);
        shape.lineTo(size, 0.0);
        shape.lineTo(-size, 0.0);

        var geometry = new THREE.ShapeGeometry( shape );

        var mesh = new THREE.Mesh( geometry, material );

        var n1 = new THREE.Vector3(0.0, 1.0, 0.0);

        var quaternion = new THREE.Quaternion(); // create one and reuse it

        quaternion.setFromUnitVectors( n1, orientation );

        var matrix = new THREE.Matrix4(); // create one and reuse it

        matrix.makeRotationFromQuaternion( quaternion );

        mesh.applyMatrix( matrix );
        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z;

        this.mesh = mesh;
    }
}

class FlatDot extends Shape3D {
    constructor(position, orientation, size, color) {
        super();
        this.orientation = orientation;

        var material = new THREE.MeshBasicMaterial( {color: color, transparent: true, side: THREE.DoubleSide, depthWrite: false } );

        var shape = new THREE.Shape();
        shape.arc(0.0, 0.0, size, 0.0, 2*Math.PI, false);

        var geometry = new THREE.ShapeGeometry( shape );

        var mesh = new THREE.Mesh( geometry, material );

        var n1 = new THREE.Vector3(0.0, 0.0, 1.0);

        var quaternion = new THREE.Quaternion(); // create one and reuse it

        quaternion.setFromUnitVectors( n1, orientation );

        var matrix = new THREE.Matrix4(); // create one and reuse it

        matrix.makeRotationFromQuaternion( quaternion );

        mesh.applyMatrix( matrix );
        
        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z;

        this.mesh = mesh;
    }   
}

class FlatText extends Shape3D {

    constructor(position, orientation, angle, size, text, color) {
        super();
        var loader = new THREE.FontLoader();

        var parent = this;

        loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
        
            var geometry = new THREE.TextGeometry( text, {
                font: font,
                size: size,
                height: 0,
                curveSegments: 12,
                bevelSegments: 5
            } );
            geometry.center();

            var material = new THREE.MeshBasicMaterial( {color: color, transparent: true, side: THREE.DoubleSide, depthWrite: false } );
    
            var n1 = new THREE.Vector3(0.0, 0.0, 1.0);
        
            var quaternion = new THREE.Quaternion(); // create one and reuse it
    
            quaternion.setFromUnitVectors( n1, orientation );
    
            var matrix = new THREE.Matrix4(); // create one and reuse it
    
            matrix.makeRotationFromQuaternion( quaternion );
    
            parent.mesh.applyMatrix( matrix );
            parent.mesh.rotation.z += angle;
            parent.mesh.position.x = position.x;
            parent.mesh.position.y = position.y;
            parent.mesh.position.z = position.z;
            parent.mesh.geometry = geometry;
            parent.mesh.material = material;
        } );
    }
}