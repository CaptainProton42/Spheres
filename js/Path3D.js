class LineStyle3D {
    constructor(width = "1", color = 0x000000, arrow = false) {
        this.width = width;
        this.color = color;
        this.arrow = arrow;
    }
}

class Path3D {
    constructor() {
        this.linestyle = new LineStyle3D();
        this.curve = new THREE.Curve();
        this.mesh = new THREE.Mesh();

        this.position = new THREE.Vector3();
        this.normal = new THREE.Vector3();
    };

    setStyle(linestyle) {
        this.linestyle = linestyle;
        this.updateGeometry();
        this.updateMaterial();
    };

    updateMaterial() {
        var material = new THREE.MeshBasicMaterial( {
            color: this.linestyle.color
        });
        this.mesh.material = material;
    }

    updateGeometry() {
        var geometry = new THREE.TubeGeometry(this.curve, 64, this.linestyle.width, 16, false);
        // Create the line material

        if (this.linestyle.arrow) {
            // arrow style
            var arrowwidth = this.linestyle.width * 5;
            var arrowlen = 2 * arrowwidth;

            // create arrow geometry
            var arrow = new THREE.ConeGeometry(arrowwidth, arrowlen, 16);

            // transformation and rotation matrices for arrow placement
            var transform = new THREE.Matrix4();
            var rotation = new THREE.Matrix4();

            // tangent at the end of the curve
            var tangent = this.curve.getTangent(1).normalize();
            var quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0.0, 1.0, 0.0), tangent);
            rotation.makeRotationFromQuaternion(quaternion);

            // place arrow tip on curve end
            var arrow_pos = new THREE.Vector3();
            arrow_pos = geometry.vertices[geometry.vertices.length-1];
            arrow_pos = arrow_pos.add(tangent.multiplyScalar(-arrowlen/2));

            // apply transformations and merge
            arrow.applyMatrix( rotation );
            transform.setPosition(arrow_pos);
            geometry.merge(arrow, transform);
        }

        var yAxis = new THREE.Vector3();
        var xAxis = new THREE.Vector3();
        var zAxis = new THREE.Vector3();
        this.mesh.matrix.extractBasis(xAxis, yAxis, zAxis);

        var n1 = zAxis;

        var quaternion = new THREE.Quaternion(); // create one and reuse it

        quaternion.setFromUnitVectors( n1, this.normal );

        var matrix = new THREE.Matrix4(); // create one and reuse it

        matrix.makeRotationFromQuaternion( quaternion );

        this.mesh.geometry = geometry;

        this.mesh.applyMatrix( matrix );

        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;

    };

    getMesh() {
        return this.mesh;
    }
}

class GeometryPath3D extends Path3D {
    constructor( path ) {
        super();
        this.update(path);
        this.updateMaterial();
    }

    update(path) {
        this.path = path;
        this.updateGeometry();
    }
}

class Circle3D extends Path3D {
    constructor(radius, position, normal) {
        super();
        this.update(radius, position, normal);
        this.updateMaterial();
    }

    update(radius, position, normal) {
        this.curve = new Circle( radius );
        this.position = position;
        this.normal = normal;
        this.updateGeometry();
    }
}

class Arc3D extends Path3D {
    constructor(radius, phi1, phi2, position, normal) {
        super();
        this.update(radius, phi1, phi2, position, normal);
        this.updateMaterial();
    }

    update(radius, phi1, phi2, position, normal) {
        this.curve = new Arc(radius, phi1, phi2); 
        this.position = position;
        this.normal = normal;  
        this.updateGeometry();        
    }
}

class Line3D extends Path3D {
    constructor(x1, x2) {
        super();
        this.curve = new THREE.LineCurve3(x1, x2);
    }
}