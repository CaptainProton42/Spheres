// Helpful constants.
DEG_TO_RAD = 2 * Math.PI / 360;

// Simulation parameters.
latitude = 50; /* latitude of observer in degrees */
declination = 30.0 * DEG_TO_RAD; /* declination of the star */

// Useful values. Do not touch.
angle_to_north_pole = ( 90.0 - latitude ) * DEG_TO_RAD; /* angle between current latitude and north pole. */


// Declare scenbe.
var scene = new THREE.Scene();

// Comnfigure camera.
var frustumSize = 5
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0, 1000 );
camera.position.x = -2;
camera.position.z = -2;
camera.position.y = 1;

// Configure the WebGL renderer.
var renderer = new THREE.WebGLRenderer( { alpha: true, antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild( renderer.domElement );

// Add controls. We want only rotation.
controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableZoom = false;
controls.enableDamping = true;
controls.rotateSpeed = 0.25;

// Line styles. Colors taken from https://learnui.design/tools/data-color-picker.html
lineStyle1 = new LineStyle3D(0.005, 0x003f5c);
lineStyle2 = new LineStyle3D(0.005, 0xffa600);
lineStyle3 = new LineStyle3D(0.005, 0xbc5090);
lineStyleLight = new LineStyle3D(0.005, 0x666666);
lineStyleOrbit = new LineStyle3D(0.005, 0xff9b99);
lineStyleArrow = new LineStyle3D(0.007, 0xff6361, true);

// 3D curves and lines.
horizon = new Circle3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
meridian = new Circle3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0));
ZN = new Line3D(new THREE.Vector3(0.0, -1.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
NS = new Line3D(new THREE.Vector3(0.0, 0.0, 1.0), new THREE.Vector3(0.0, 0.0, -1.0));
WE = new Line3D(new THREE.Vector3(-1.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0));

// 3D surfaces.
horizonDisc = new DiscSurface3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), 0x003f5c);
meridianDisc = new DiscSurface3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0), 0xffa600);

// Markers.
S = new DirectionMarker(new THREE.Vector3(0.0, 0.0, 1.1), new THREE.Vector3(0.0, 0.0, 1.0), 0.1, 0x666666);
N = new FlatDot(new THREE.Vector3(0.0, 0.0, -1.1), new THREE.Vector3(0.0, 1.0, 0.0), 0.05, 0x666666);
W = new FlatDot(new THREE.Vector3(1.1, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.05, 0x666666);
E = new FlatDot(new THREE.Vector3(-1.1, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.05, 0x666666);
zenith = new Dot3D(new THREE.Vector3(0.0, 1.0, 0.0), 0.05, 0x666666 );
nadir = new Dot3D(new THREE.Vector3(0.0, -1.0, 0.0), 0.05, 0x666666 );

// Labels.
titleLabel = new FlatText(new THREE.Vector3(0.0, 2.0, 0.0), new THREE.Vector3(0.0, 0.0, -1.0), 0.0, 0.2, "The Horizontal System", 0xaaaaaa);
SLabel = new FlatText(new THREE.Vector3(0.0, 0.0, 1.3), new THREE.Vector3(0.0, 1.0, 0.0), Math.PI, 0.1, "S", 0x666666);
NLabel = new FlatText(new THREE.Vector3(0.0, 0.0, -1.3), new THREE.Vector3(0.0, 1.0, 0.0), 0.0, 0.1, "N", 0x666666);
WLabel = new FlatText(new THREE.Vector3(-1.3, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), Math.PI/2, 0.1, "W", 0x666666);
ELabel = new FlatText(new THREE.Vector3(1.3, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), -Math.PI/2, 0.1, "E", 0x666666);
zenithLabel = new FlatText(new THREE.Vector3(0.0, 1.2, 0.0), new THREE.Vector3(0.0, 0.0, -1.0), 0.0, 0.1, "Zenith", 0x666666);
nadirLabel = new FlatText(new THREE.Vector3(0.0, -1.2, 0.0), new THREE.Vector3(0.0, 0.0, -1.0), 0.0, 0.1, "Nadir", 0x666666);

// Star and its "orbit".
star = new Star(new THREE.Vector3(0.0, 0.0,0.0), 0xff6361);
var midpoint = new THREE.Vector3(0.0, Math.cos(angle_to_north_pole) * Math.sin(declination), -Math.sin(angle_to_north_pole) * Math.sin(declination));
orbit = new Circle3D(Math.cos(declination), midpoint, new THREE.Vector3(0.0, Math.cos(-angle_to_north_pole), Math.sin(-angle_to_north_pole)));

// Set styles.
horizon.setStyle(lineStyle1);
meridian.setStyle(lineStyle2);
ZN.setStyle(lineStyleLight);
NS.setStyle(lineStyleLight);
WE.setStyle(lineStyleLight);
orbit.setStyle(lineStyleOrbit);

// Add meshes to scene.
scene.add(horizon.getMesh());
scene.add(meridian.getMesh());
scene.add(ZN.getMesh());
scene.add(NS.getMesh());
scene.add(WE.getMesh());
scene.add(horizonDisc.getMesh());
scene.add(meridianDisc.getMesh());
scene.add(S.getMesh());
scene.add(N.getMesh());
scene.add(W.getMesh());
scene.add(E.getMesh());
scene.add(zenith.getMesh());
scene.add(nadir.getMesh());
scene.add(titleLabel.getMesh());
scene.add(SLabel.getMesh());
scene.add(NLabel.getMesh());
scene.add(WLabel.getMesh());
scene.add(ELabel.getMesh());
scene.add(zenithLabel.getMesh());
scene.add(nadirLabel.getMesh());
scene.add(star.getMesh());
scene.add(orbit.getMesh());


// TODO: tydiing up everything below here

arc = new Arc3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, -Math.PI, Math.PI/2));
arc2 = new Arc3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, -Math.PI, Math.PI/2));
arc.setStyle(lineStyleArrow)
arc2.setStyle(lineStyleArrow)
arc_surface = new ArcSurface3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 0.0, 0.0), 0xff6361);

starpos = new THREE.Spherical(1.0, Math.PI/2 - declination, 0.0);

midpoint.applyAxisAngle(new THREE.Vector3(-1.0, 0.0, 0.0), 0.5);


scene.add(arc.mesh)

var loader = new THREE.GLTFLoader();

loader.load( 'models/observer.glb', function ( gltf ) {

    var geometry =  gltf.scene.children[0].geometry;
    var material = new THREE.MeshBasicMaterial( { color: 0x666666 } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.x = -Math.PI/2;
    scene.add(mesh);

}, undefined, function ( error ) {

	console.error( error );

} );


var animate = function () {
    requestAnimationFrame( animate );

    controls.update();
    
    starpos.theta -= 0.01;
    var euclidian = new THREE.Vector3();
    euclidian.setFromSpherical(starpos);
    euclidian.applyAxisAngle(new THREE.Vector3(-1.0, 0.0, 0.0), angle_to_north_pole);

    star.mesh.position.x = euclidian.x;
    star.mesh.position.y = euclidian.y;
    star.mesh.position.z = euclidian.z;


    var starpos_kk = new THREE.Spherical(0.0, 0.0, 0.0);
    starpos_kk.setFromCartesianCoords(euclidian.x,euclidian.y, euclidian.z);

    var normalvec = new THREE.Vector3(-Math.cos(starpos_kk.theta), 0.0, Math.sin(starpos_kk.theta));

    var arc_new = new Arc3D(1, 0.0, Math.PI/2 - starpos_kk.phi, new THREE.Vector3(0.0, 0.0, 0.0), normalvec);
    arc_new.setStyle(lineStyleArrow)
    arc_surface_new = new ArcSurface3D(1, 0.0, Math.PI/2 - starpos_kk.phi, new THREE.Vector3(0.0, 0.0, 0.0), normalvec, 0xff6361);


    var arc_new2 = new Arc3D(1, -Math.PI/2, -Math.PI/2 + starpos_kk.theta, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
    arc_new2.setStyle(lineStyleArrow);

    scene.remove(arc.mesh);
    scene.remove(arc_surface.mesh);
    scene.remove(arc2.mesh);
    arc.mesh = arc_new.mesh;
    arc2.mesh = arc_new2.mesh;
    arc_surface.mesh = arc_surface_new.mesh;
    scene.add(arc.mesh);
    scene.add(arc2.mesh)
    scene.add(arc_surface.mesh);

    renderer.render( scene, camera );
};

animate();