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

// Add clock. Used to retrieve delta time.
clock = new THREE.Clock()
clock.start();

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
var height = Math.sin(declination);
var radius = Math.cos(declination);
star = new Star(new THREE.Vector3(0.0, height, radius), 0xff6361);
var midpoint = new THREE.Vector3(0.0, height, 0.0);
orbit = new Circle3D(radius, midpoint, new THREE.Vector3(0.0, 1.0, 0.0));

// Set styles.
horizon.setStyle(lineStyle1);
meridian.setStyle(lineStyle2);
ZN.setStyle(lineStyleLight);
NS.setStyle(lineStyleLight);
WE.setStyle(lineStyleLight);
orbit.setStyle(lineStyleOrbit);

// Horizon System
var horizonSystem = new THREE.Group();
horizonSystem.add(horizon.getMesh());
horizonSystem.add(meridian.getMesh());
horizonSystem.add(ZN.getMesh());
horizonSystem.add(NS.getMesh());
horizonSystem.add(WE.getMesh());
horizonSystem.add(horizonDisc.getMesh());
horizonSystem.add(meridianDisc.getMesh());
horizonSystem.add(S.getMesh());
horizonSystem.add(N.getMesh());
horizonSystem.add(W.getMesh());
horizonSystem.add(E.getMesh());
horizonSystem.add(zenith.getMesh());
horizonSystem.add(nadir.getMesh());
horizonSystem.add(SLabel.getMesh());
horizonSystem.add(NLabel.getMesh());
horizonSystem.add(WLabel.getMesh());
horizonSystem.add(ELabel.getMesh());
horizonSystem.add(zenithLabel.getMesh());
horizonSystem.add(nadirLabel.getMesh());

// Star
var starSystem = new THREE.Group();
starSystem.add(star.getMesh());
starSystem.add(orbit.getMesh());
starSystem.rotation.x = -angle_to_north_pole;


// Add meshes to scene.
scene.add(titleLabel.getMesh());
scene.add(starSystem)
scene.add(horizonSystem);


// TODO: tydiing up everything below here

arc = new Arc3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
arc2 = new Arc3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0));
arc.setStyle(lineStyleArrow)
arc2.setStyle(lineStyleArrow)
arc_surface = new ArcSurface3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 0.0, 0.0), 0xff6361);


scene.add(arc.mesh)
scene.add(arc2.mesh)
scene.add(arc_surface.mesh)

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
    
    var delta = clock.getDelta();

    var deltatheta = 0.01 * delta / 0.016;
    starSystem.rotateY(-deltatheta);

    var starpos = new THREE.Vector3();
    starSystem.children[0].getWorldPosition(starpos);
    var starpos_kk = new THREE.Spherical(0.0, 0.0, 0.0);
    starpos_kk.setFromCartesianCoords(starpos.x,starpos.y, starpos.z);

    var normalvec = new THREE.Vector3(-Math.cos(starpos_kk.theta), 0.0, Math.sin(starpos_kk.theta));

    scene.remove(arc.mesh);
    scene.remove(arc2.mesh);
    arc.update(1, -Math.PI/2, - starpos_kk.phi, new THREE.Vector3(0.0, 0.0, 0.0), normalvec);
    arc2.update(1, Math.PI, Math.PI + starpos_kk.theta, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
    arc_surface.updateMesh(1, 0.0, Math.PI/2 - starpos_kk.phi, new THREE.Vector3(0.0, 0.0, 0.0), normalvec, 0xff6361);
    scene.add(arc.mesh);
    scene.add(arc2.mesh);
    

    renderer.render( scene, camera );
};

animate();