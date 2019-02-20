function Circle( radius ) {
    THREE.Curve.call( this );

    this.radius = radius;
}

Circle.prototype = Object.create ( THREE.Curve.prototype );
Circle.prototype.constructor = Circle;

Circle.prototype.getPoint = function ( t ) {
    var radians = 2 * Math.PI * t;

    return new THREE.Vector3(this.radius * Math.cos( radians ),
                             this.radius * Math.sin( radians ),
                             0.0);
}


function Arc( radius, theta1, theta2 ) {
    THREE.Curve.call( this );

    this.radius = radius;
    this.theta1 = theta1;
    this.theta2 = theta2;
}

Arc.prototype = Object.create ( THREE.Curve.prototype );
Arc.prototype.constructor = Arc;

Arc.prototype.getPoint = function ( t ) {
    var theta =  this.theta1 + (this.theta2 - this.theta1) * t;

    return new THREE.Vector3(this.radius * Math.cos(theta),
                             this.radius * Math.sin(theta),
                             0.0);
}