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
lineStyleArrow = new LineStyle3D(0.005, 0xff6361, true);

// 3D curves and lines.
horizon = new Circle3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
meridian = new Circle3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0));
ZN = new Line3D(new THREE.Vector3(0.0, -1.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
NS = new Line3D(new THREE.Vector3(0.0, 0.0, 1.0), new THREE.Vector3(0.0, 0.0, -1.0));
WE = new Line3D(new THREE.Vector3(-1.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0));

// Set styles.
horizon.setStyle(lineStyle1);
meridian.setStyle(lineStyle2);
ZN.setStyle(lineStyleLight);
NS.setStyle(lineStyleLight);
WE.setStyle(lineStyleLight);

// 3D surfaces.
horizonDisc = new DiscSurface3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), 0x003f5c);
meridianDisc = new DiscSurface3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0), 0xffa600);

// Markers.
S = new DirectionMarker(new THREE.Vector3(0.0, 0.0, 1.1), new THREE.Vector3(0.0, 0.0, 1.0), 0.1, 0x666666);
N = new FlatDot(new THREE.Vector3(0.0, 0.0, -1.1), new THREE.Vector3(0.0, 1.0, 0.0), 0.05, 0x666666);
W = new FlatDot(new THREE.Vector3(1.1, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.05, 0x666666);
E = new FlatDot(new THREE.Vector3(-1.1, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.05, 0x666666);
SLabel = new FlatText(new THREE.Vector3(0.0, 0.0, 1.3), new THREE.Vector3(0.0, 1.0, 0.0), Math.PI, 0.1, "S", 0x666666);
NLabel = new FlatText(new THREE.Vector3(0.0, 0.0, -1.3), new THREE.Vector3(0.0, 1.0, 0.0), 0.0, 0.1, "N", 0x666666);
WLabel = new FlatText(new THREE.Vector3(-1.3, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), Math.PI/2, 0.1, "W", 0x666666);
ELabel = new FlatText(new THREE.Vector3(1.3, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), -Math.PI/2, 0.1, "E", 0x666666);
zenith = new Dot3D(new THREE.Vector3(0.0, 1.0, 0.0), 0.05, 0x666666 );
nadir = new Dot3D(new THREE.Vector3(0.0, -1.0, 0.0), 0.05, 0x666666 );
zenithLabel = new FlatText(new THREE.Vector3(0.0, 1.2, 0.0), new THREE.Vector3(0.0, 0.0, -1.0), 0.0, 0.1, "Zenith", 0x666666);
nadirLabel = new FlatText(new THREE.Vector3(0.0, -1.2, 0.0), new THREE.Vector3(0.0, 0.0, -1.0), 0.0, 0.1, "Nadir", 0x666666);

// Add meshes to scene.
scene.add(horizon.getMesh());
scene.add(meridian.getMesh());
scene.add(ZN.getMesh());
scene.add(NS.getMesh());
scene.add(WE.getMesh());
scene.add(horizonDisc.getMesh());
scene.add(meridianDisc.getMesh());


// TODO: tydiing up everything below here
S = new DirectionMarker(new THREE.Vector3(0.0, 0.0, 1.1), new THREE.Vector3(0.0, 0.0, 1.0), 0.1, 0x666666);

arc = new Arc3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, -Math.PI, Math.PI/2));
arc.setStyle(lineStyleArrow)
arc_surface = new ArcSurface3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 0.0, 0.0), 0xA569BD);

starphi =0.0;
starpos = new THREE.Spherical(1.0, 1.0, 0.0);
star = new Dot3D(new THREE.Vector3(0.0, 0.0,0.0), 0.03, 0xA569BD);

scene.add(arc.mesh)
scene.add(star.mesh)
scene.add(S.mesh)
scene.add(zenith.mesh)
scene.add(W.mesh)
scene.add(E.mesh)
scene.add(S.mesh)
scene.add(N.mesh)
scene.add(nadir.mesh)

var loader = new THREE.GLTFLoader();

loader.load( 'models/observer.glb', function ( gltf ) {

    var geometry =  gltf.scene.children[0].geoemetry;
    var material = new THREE.MeshBasicMaterial( {color: 0x666666 } );
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

}, undefined, function ( error ) {

	console.error( error );

} );

var animate = function () {
    requestAnimationFrame( animate );

    controls.update();

    scene.add(SLabel.mesh) // hacky
    scene.add(NLabel.mesh)
    scene.add(ELabel.mesh)
    scene.add(WLabel.mesh)
    scene.add(zenithLabel.mesh);
    scene.add(nadirLabel.mesh)

    
    starpos.theta -= 0.01;

    var euclidian = new THREE.Vector3();
    euclidian.setFromSpherical(starpos);
    euclidian.applyAxisAngle(new THREE.Vector3(-1.0, 0.0, 0.0), 0.5);

    star.mesh.position.x = euclidian.x;
    star.mesh.position.y = euclidian.y;
    star.mesh.position.z = euclidian.z;

    var starpos_kk = new THREE.Spherical(0.0, 0.0, 0.0);
    starpos_kk.setFromCartesianCoords(euclidian.x,euclidian.y, euclidian.z);

    var arc_new = new Arc3D(1, 0.0, Math.PI/2 - starpos_kk.phi, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(-Math.cos(starpos_kk.theta), 0.0, Math.sin(starpos_kk.theta)));
    arc_new.setStyle(lineStyleArrow)
    arc_surface_new = new ArcSurface3D(1, 0.0, Math.PI/2 - starpos_kk.phi, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(-Math.cos(starpos_kk.theta), 0.0, Math.sin(starpos_kk.theta)), 0xA569BD);

    scene.remove(arc.mesh);
    scene.remove(arc_surface.mesh);
    arc.mesh = arc_new.mesh;
    arc_surface.mesh = arc_surface_new.mesh;
    scene.add(arc.mesh);
    scene.add(arc_surface.mesh);





    renderer.render( scene, camera );
};

animate();