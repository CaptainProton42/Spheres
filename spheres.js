// Helpful constants.
DEG_TO_RAD = 2 * Math.PI / 360;

// Simulation parameters.
latitude = 50; /* latitude of observer in degrees */
declination = 20 * DEG_TO_RAD; /* declination of the star */

// Useful values. Do not touch.
angle_to_north_pole = ( 90.0 - latitude ) * DEG_TO_RAD; /* angle between current latitude and north pole. */

// Declare scene.
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
lineStyle4 = new LineStyle3D(0.005, 0xbc5090);
lineStyleLight = new LineStyle3D(0.005, 0x666666);
lineStyleOrbit = new LineStyle3D(0.005, 0xff9b99);
lineStyleArrow = new LineStyle3D(0.007, 0xff6361, true);
lineStyleArrow2 = new LineStyle3D(0.007, 0xbc5090, true);

// 3D curves and lines.
horizon = new Circle3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
meridian = new Circle3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0));
ZN = new Line3D(new THREE.Vector3(0.0, -1.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
NS = new Line3D(new THREE.Vector3(0.0, 0.0, 1.0), new THREE.Vector3(0.0, 0.0, -1.0));
WE = new Line3D(new THREE.Vector3(-1.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0));
equator = new Circle3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
pole = new Line3D(new THREE.Vector3(0.0, 1.1, 0.0), new THREE.Vector3(0.0, 1.5, 0.0));

// 3D surfaces.
horizonDisc = new DiscSurface3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), 0x003f5c);
meridianDisc = new DiscSurface3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0), 0x666666);
equatorDisc = new DiscSurface3D(1, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), 0xbc5090);

// Markers.
S = new DirectionMarker(new THREE.Vector3(0.0, 0.0, 1.1), new THREE.Vector3(0.0, 0.0, 1.0), 0.1, 0x666666);
N = new FlatDot(new THREE.Vector3(0.0, 0.0, -1.1), new THREE.Vector3(0.0, 1.0, 0.0), 0.05, 0x666666);
W = new FlatDot(new THREE.Vector3(1.1, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.05, 0x666666);
E = new FlatDot(new THREE.Vector3(-1.1, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), 0.05, 0x666666);
zenith = new Dot3D(new THREE.Vector3(0.0, 1.0, 0.0), 0.05, 0x666666 );
nadir = new Dot3D(new THREE.Vector3(0.0, -1.0, 0.0), 0.05, 0x666666 );

// Labels.
SLabel = new FlatText(new THREE.Vector3(0.0, 0.0, 1.3), new THREE.Vector3(0.0, 1.0, 0.0), Math.PI, 0.1, "S", 0x666666);
NLabel = new FlatText(new THREE.Vector3(0.0, 0.0, -1.3), new THREE.Vector3(0.0, 1.0, 0.0), 0.0, 0.1, "N", 0x666666);
WLabel = new FlatText(new THREE.Vector3(-1.3, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), Math.PI/2, 0.1, "W", 0x666666);
ELabel = new FlatText(new THREE.Vector3(1.3, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0), -Math.PI/2, 0.1, "E", 0x666666);
zenithLabel = new FlatText(new THREE.Vector3(0.0, 1.2, 0.0), new THREE.Vector3(0.0, 0.0, -1.0), 0.0, 0.1, "Zenith", 0x666666);
nadirLabel = new FlatText(new THREE.Vector3(0.0, -1.2, 0.0), new THREE.Vector3(0.0, 0.0, -1.0), 0.0, 0.1, "Nadir", 0x666666);
poleLabel = new FlatText(new THREE.Vector3(0.0, 1.6, 0.0), new THREE.Vector3(0.0, 0.0, -1.0), 0.0, 0.1, "Celestial North", 0xbc5090);


// Star and its "orbit".
var height = Math.sin(declination);
var radius = Math.cos(declination);
star = new Star(new THREE.Vector3(0.0, height, radius), 0xff6361);
var midpoint = new THREE.Vector3(0.0, height, 0.0);
orbit = new Circle3D(radius, midpoint, new THREE.Vector3(0.0, 1.0, 0.0));

// Vectors in equatorial system.
declinationVector = new Arc3D(1, 0.0, declination, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(-1.0, 0.0, 0.0));
declinationVector.setStyle(lineStyleArrow2);

// Vectors in horizon System.
azimuthVector = new Arc3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
altitudeVector = new Arc3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0));

// Set styles.
horizon.setStyle(lineStyle1);
meridian.setStyle(lineStyleLight);
ZN.setStyle(lineStyleLight);
NS.setStyle(lineStyleLight);
WE.setStyle(lineStyleLight);
orbit.setStyle(lineStyleOrbit);
equator.setStyle(lineStyle4);
pole.setStyle(lineStyleArrow2);
azimuthVector.setStyle(lineStyleArrow)
altitudeVector.setStyle(lineStyleArrow)
rightAscensionVector = new Arc3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
rightAscensionVector.setStyle(lineStyleArrow2);

// Horizon System
var horizonSystem = new THREE.Group();
horizonSystem.name = "Horizon System";
horizonSystem.add(horizon.getMesh());
horizonSystem.add(ZN.getMesh());
horizonSystem.add(horizonDisc.getMesh());
horizonSystem.add(zenith.getMesh());
horizonSystem.add(nadir.getMesh());
horizonSystem.add(zenithLabel.getMesh());
horizonSystem.add(nadirLabel.getMesh());
horizonSystem.add(azimuthVector.getMesh());
horizonSystem.add(altitudeVector.getMesh());
horizonSystem.add(N.getMesh());
horizonSystem.add(SLabel.getMesh());
horizonSystem.add(NLabel.getMesh());

// Equatorial System
var equatorialSystem = new THREE.Group();
equatorialSystem.name = "Equatorial System";
equatorialSystem.add(equator.getMesh());
equatorialSystem.add(equatorDisc.getMesh());
equatorialSystem.add(pole.getMesh());
equatorialSystem.add(poleLabel.getMesh());
equatorialSystem.add(rightAscensionVector.getMesh());
equatorialSystem.add(declinationVector.getMesh());
equatorialSystem.rotation.x = -angle_to_north_pole;

// Star
var starSystem = new THREE.Group();
starSystem.name = "Star System";
starSystem.add(star.getMesh());
starSystem.add(orbit.getMesh());
starSystem.rotation.x = -angle_to_north_pole;

// Reference points that should stay the same in both systems.
var globalReference = new THREE.Group();
globalReference.name = "Global Reference";
globalReference.add(W.getMesh());
globalReference.add(E.getMesh());
globalReference.add(WLabel.getMesh());
globalReference.add(ELabel.getMesh());
globalReference.add(WE.getMesh());
globalReference.add(meridian.getMesh());
globalReference.add(meridianDisc.getMesh());
globalReference.add(S.getMesh());
globalReference.add(NS.getMesh());


// Add meshes to scene.
scene.add(starSystem);
scene.add(equatorialSystem);
scene.add(horizonSystem);
scene.add(globalReference);

// Models.

var loader = new THREE.GLTFLoader();

var observer = new THREE.Object3D();
loader.load( 'models/observer.glb', function ( gltf ) {
    var material = new THREE.MeshBasicMaterial( { color: 0x666666 } );
    gltf.scene.traverse( function (child)
    {
        if ( child instanceof THREE.Mesh )
        {
            child.material = material;
        }
    });
    
    observer = gltf.scene;
    horizonSystem.add(observer);
}, undefined, function ( error ) {
	console.error( error );
} );

var house = new THREE.Object3D();
loader.load( 'models/house.glb', function ( gltf ) {
    var material = new THREE.MeshBasicMaterial( { color: 0x666666 } );
    gltf.scene.traverse( function (child)
    {
        if ( child instanceof THREE.Mesh )
        {
            child.material = material;
        }
    });
    gltf.scene.scale.set(3, 3, 3);
    gltf.scene.position.x = -0.3;
    gltf.scene.position.z = 0.3;

    house = gltf.scene;
    horizonSystem.add(house);

}, undefined, function ( error ) {

	console.error( error );
} );

var tree = new THREE.Object3D();
loader.load( 'models/tree.glb', function ( gltf ) {
    var material = new THREE.MeshBasicMaterial( { color: 0x666666 } );
    gltf.scene.traverse( function (child)
    {
        if ( child instanceof THREE.Mesh )
        {
            child.material = material;
        }
    });
    gltf.scene.scale.set(3, 3, 3);
    gltf.scene.position.x = -0.4;
    gltf.scene.position.z = 0.4;
    tree = gltf.scene;
    horizonSystem.add(tree);

}, undefined, function ( error ) {

	console.error( error );
} );

var rightAscension = 0.0;

function animate(time ) {
    requestAnimationFrame( animate );

    TWEEN.update( time );

    controls.update();
    
    var delta = clock.getDelta();


    var deltatheta = 0.01 * delta / 0.016;
    rightAscension += deltatheta;
    if ( rightAscension > 2*Math.PI )
    {
        rightAscension -= 2*Math.PI;
    }

    starSystem.rotateY(-deltatheta);
    declinationVector.getMesh().rotateY(-deltatheta);

    var starpos = new THREE.Vector3();
    starSystem.children[0].getWorldPosition(starpos);
    starpos.applyAxisAngle( new THREE.Vector3(1.0, 0.0, 0.0), -scene.rotation.x);
    var starpos_kk = new THREE.Spherical(0.0, 0.0, 0.0);
    starpos_kk.setFromCartesianCoords(starpos.x,starpos.y, starpos.z);
    if (starpos_kk.theta > 0.0)
    {
        starpos_kk.theta -= 2*Math.PI;
    }

    var normalvec = new THREE.Vector3(-Math.cos(starpos_kk.theta), 0.0, Math.sin(starpos_kk.theta));

    azimuthVector.update(1, -Math.PI/2, - starpos_kk.phi, new THREE.Vector3(0.0, 0.0, 0.0), normalvec);
    altitudeVector.update(1, Math.PI, Math.PI + starpos_kk.theta, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
    //arc_surface.updateMesh(1, 0.0, Math.PI/2 - starpos_kk.phi, new THREE.Vector3(0.0, 0.0, 0.0), normalvec, 0xff6361); // do we really need this?

    rightAscensionVector.update(1, -Math.PI/2, -Math.PI/2-rightAscension, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));

    renderer.render( scene, camera );
};

animate();

// Information box.

var infoBoxHorizontal = document.createElement('div')
infoBoxHorizontal.style.top = "10%";
infoBoxHorizontal.style.left = "70%";
infoBoxHorizontal.style.width = 500;
infoBoxHorizontal.style.height = 8000;
infoBoxHorizontal.style.opacity = 0.0;
infoBoxHorizontal.style.webkitUserSelect = "none";
infoBoxHorizontal.style.msUserSelect = "none";
infoBoxHorizontal.style.mozUserSelect = "none";
document.body.append(infoBoxHorizontal);

var infoTitleHorizontal = document.createElement('div');
infoTitleHorizontal.style.fontFamily = "Helvetica";
infoTitleHorizontal.style.fontSize = "40px";
infoTitleHorizontal.style.color = "#666666";
infoTitleHorizontal.style.position = 'absolute';
infoTitleHorizontal.style.width = 500;
infoTitleHorizontal.style.height = 50;
infoTitleHorizontal.innerHTML = "The Horizontal System";
infoTitleHorizontal.style.top = 10 + '%';
infoTitleHorizontal.style.left = 70 + '%';
infoBoxHorizontal.appendChild(infoTitleHorizontal);

var infoHorizontal = document.createElement('div');
infoHorizontal.style.fontFamily = "Helvetica";
infoHorizontal.style.fontSize = "20px";
infoHorizontal.style.color = "#666666";
infoHorizontal.style.position = 'absolute';
infoHorizontal.style.width = 500;
infoHorizontal.style.height = 800;
infoHorizontal.innerHTML = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\
                 At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\
                 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\
                 At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
infoHorizontal.style.top = 20 + '%';
infoHorizontal.style.left = 70 + '%';
infoBoxHorizontal.appendChild(infoHorizontal);

var infoBoxEquatorial = document.createElement('div')
infoBoxEquatorial.style.top = "10%";
infoBoxEquatorial.style.left = "70%";
infoBoxEquatorial.style.width = 500;
infoBoxEquatorial.style.height = 8000;
infoBoxEquatorial.style.opacity = 0.0;
infoBoxEquatorial.style.webkitUserSelect = "none";
infoBoxEquatorial.style.msUserSelect = "none";
infoBoxEquatorial.style.mozUserSelect = "none";
document.body.append(infoBoxEquatorial);

var infoTitleEquatorial = document.createElement('div');
infoTitleEquatorial.style.fontFamily = "Helvetica";
infoTitleEquatorial.style.fontSize = "40px";
infoTitleEquatorial.style.color = "#666666";
infoTitleEquatorial.style.position = 'absolute';
infoTitleEquatorial.style.width = 500;
infoTitleEquatorial.style.height = 50;
infoTitleEquatorial.innerHTML = "The Equatorial System";
infoTitleEquatorial.style.top = 10 + '%';
infoTitleEquatorial.style.left = 70 + '%';
infoBoxEquatorial.appendChild(infoTitleEquatorial);

var infoEquatorial = document.createElement('div');
infoEquatorial.style.fontFamily = "Helvetica";
infoEquatorial.style.fontSize = "20px";
infoEquatorial.style.color = "#666666";
infoEquatorial.style.position = 'absolute';
infoEquatorial.style.width = 500;
infoEquatorial.style.height = 800;
infoEquatorial.innerHTML = 'In the Equatorial System, the stars position is described by its <font color="#bc5090">hour angle</font> and <font color="#bc5090">declination</font>.\
                            Like in the horizontal system, the hour angle starts at the south point on the equatorial horizon.<br>\
                            At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\
                            At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
infoEquatorial.style.top = 20 + '%';
infoEquatorial.style.left = 70 + '%';
infoBoxEquatorial.appendChild(infoEquatorial);

// animations
var opacityEquatorial = { path:1, surface:0.15 }; // start at 1.0
var tweenEquatorialFadeOut = new TWEEN.Tween(opacityEquatorial)
    .to({ path:0.05, surface:0.0 }, 500)  // change in 0.5 seconds
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function() {
        equator.mesh.material.opacity = opacityEquatorial.path;
        equatorDisc.mesh.material.opacity = opacityEquatorial.surface;
        pole.mesh.material.opacity = opacityEquatorial.path;
        poleLabel.mesh.material.opacity = opacityEquatorial.path;
        rightAscensionVector.mesh.material.opacity = opacityEquatorial.path;
        declinationVector.mesh.material.opacity = opacityEquatorial.path;
    })

var tweenEquatorialFadeIn = new TWEEN.Tween(opacityEquatorial)
    .to({ path:1.0, surface:0.15 }, 500)  // change in 0.5 seconds
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(function() {
        equator.mesh.material.opacity = opacityEquatorial.path;
        equatorDisc.mesh.material.opacity = opacityEquatorial.surface;
        pole.mesh.material.opacity = opacityEquatorial.path;
        poleLabel.mesh.material.opacity = opacityEquatorial.path;
        rightAscensionVector.mesh.material.opacity = opacityEquatorial.path;
        declinationVector.mesh.material.opacity = opacityEquatorial.path;
    })

var opacityHorizontal = { path:1, surface:0.15 }; // start at 1.0
var tweenHorizontalFadeOut = new TWEEN.Tween(opacityHorizontal)
    .to({ path:0.05, surface:0.0 }, 500)  // change in 0.5 seconds
    .easing(TWEEN.Easing.Quadratic.Out)
    .onStart(function() {
        house.traverse( function (child)
        {
            if ( child instanceof THREE.Mesh )
            {
                child.material.transparent = true;
                child.material.depthWrite = false;
            }
        });
        tree.traverse( function (child)
        {
            if ( child instanceof THREE.Mesh )
            {
                child.material.transparent = true;
                child.material.depthWrite = false;
            }
        });    
    })
    .onUpdate(function() {
        horizon.mesh.material.opacity = opacityHorizontal.path;
        ZN.mesh.material.opacity = opacityHorizontal.path;
        zenith.mesh.material.opacity = opacityHorizontal.path;
        nadir.mesh.material.opacity = opacityHorizontal.path;
        zenithLabel.mesh.material.opacity = opacityHorizontal.path;
        nadirLabel.mesh.material.opacity = opacityHorizontal.path;
        horizonDisc.mesh.material.opacity = opacityHorizontal.surface;
        azimuthVector.mesh.material.opacity = opacityHorizontal.path;
        altitudeVector.mesh.material.opacity = opacityHorizontal.path;
        SLabel.mesh.material.opacity = opacityHorizontal.path;
        NLabel.mesh.material.opacity = opacityHorizontal.path;
        N.mesh.material.opacity = opacityHorizontal.path;
        house.traverse( function (child)
        {
            if ( child instanceof THREE.Mesh )
            {
                child.material.opacity = opacityHorizontal.path;
            }
        });
        tree.traverse( function (child)
        {
            if ( child instanceof THREE.Mesh )
            {
                child.material.opacity = opacityHorizontal.path;
            }
        });
    })

var tweenHorizontalFadeIn = new TWEEN.Tween(opacityHorizontal)
    .to({ path:1.0, surface:0.15 }, 500)  // change in 0.5 seconds
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(function() {
        horizon.mesh.material.opacity = opacityHorizontal.path;
        ZN.mesh.material.opacity = opacityHorizontal.path;
        zenith.mesh.material.opacity = opacityHorizontal.path;
        nadir.mesh.material.opacity = opacityHorizontal.path;
        zenithLabel.mesh.material.opacity = opacityHorizontal.path;
        nadirLabel.mesh.material.opacity = opacityHorizontal.path;
        horizonDisc.mesh.material.opacity = opacityHorizontal.surface;
        SLabel.mesh.material.opacity = opacityHorizontal.path;
        NLabel.mesh.material.opacity = opacityHorizontal.path;
        N.mesh.material.opacity = opacityHorizontal.path;

        azimuthVector.mesh.material.opacity = opacityHorizontal.path;
        altitudeVector.mesh.material.opacity = opacityHorizontal.path;
        house.traverse( function (child)
        {
            if ( child instanceof THREE.Mesh )
            {
                child.material.opacity = opacityHorizontal.path;
            }
        });
        tree.traverse( function (child)
        {
            if ( child instanceof THREE.Mesh )
            {
                child.material.opacity = opacityHorizontal.path;
            }
        });
    })
    .onComplete(function() {
        house.traverse( function (child)
        {
            if ( child instanceof THREE.Mesh )
            {
                child.material.transparent = false;
                child.material.depthWrite = true;
            }
        });
        tree.traverse( function (child)
        {
            if ( child instanceof THREE.Mesh )
            {
                child.material.transparent = false;
                child.material.depthWrite = true;
            }
        });   
    })

var opacityInfoBoxHorizontal = { value: 0.0 };
var tweenInfoBoxHorizontalFadeOut = new TWEEN.Tween(opacityInfoBoxHorizontal)
    .to( { value: 0.0 }, 500 )
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function() {
        infoBoxHorizontal.style.opacity = opacityInfoBoxHorizontal.value;
    })
var tweenInfoBoxHorizontalFadeIn = new TWEEN.Tween(opacityInfoBoxHorizontal)
    .to( { value: 1.0 }, 500 )
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(function() {
        infoBoxHorizontal.style.opacity = opacityInfoBoxHorizontal.value;
    })

var opacityInfoBoxEquatorial = { value: 0.0 };
var tweenInfoBoxEquatorialFadeOut = new TWEEN.Tween(opacityInfoBoxEquatorial)
    .to( { value: 0.0 }, 500 )
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function() {
        infoBoxEquatorial.style.opacity = opacityInfoBoxEquatorial.value;
    })
var tweenInfoBoxEquatorialFadeIn = new TWEEN.Tween(opacityInfoBoxEquatorial)
    .to( { value: 1.0 }, 500 )
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(function() {
        infoBoxEquatorial.style.opacity = opacityInfoBoxEquatorial.value;
    })

var worldRotation = { value: 0.0 };
var tweenRotateToEquator = new TWEEN.Tween(worldRotation)
    .to( { value: angle_to_north_pole }, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function() {
        scene.rotation.x = worldRotation.value;
        globalReference.rotation.x = -worldRotation.value;
    })
var tweenRotateToHorizon = new TWEEN.Tween(worldRotation)
    .to( { value: 0.0 }, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function() {
        scene.rotation.x = worldRotation.value;
        globalReference.rotation.x = -worldRotation.value;
    })

// Setup raycasting (taken directly from the three.js documentation).
var raycaster = new THREE.Raycaster();
var mouse_down = new THREE.Vector2();
var mouse = new THREE.Vector2();

function onMouseDown( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse_down.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse_down.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onMouseUp( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    if (mouse.x != mouse_down.x ||mouse.y != mouse_down.y)  // make sure the user didn't just pan
    {
        return;
    }
    
    // Raycasting.

    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( scene.children, true );

    if (intersects.length)
    {
        switch ( intersects[0].object.parent ) {
            case horizonSystem:
                tweenEquatorialFadeOut.start();
                tweenHorizontalFadeIn.start();
                tweenInfoBoxHorizontalFadeIn.start();
                tweenInfoBoxEquatorialFadeOut.start();
                tweenRotateToHorizon.start();
                break;
            case equatorialSystem:
                tweenHorizontalFadeOut.start();
                tweenEquatorialFadeIn.start();
                tweenInfoBoxEquatorialFadeIn.start();
                tweenInfoBoxHorizontalFadeOut.start();
                tweenRotateToEquator.start();
                break;
        }
    }
    else    // fade everything back in
    {
        tweenEquatorialFadeIn.start();
        tweenHorizontalFadeIn.start();
        tweenInfoBoxHorizontalFadeOut.start();
        tweenInfoBoxEquatorialFadeOut.start();
        tweenRotateToHorizon.start();
    }
}
addEventListener( 'mousedown', onMouseDown, false );
addEventListener( 'mouseup', onMouseUp, false );