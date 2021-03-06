// Helpful constants.
DEG_TO_RAD = 2 * Math.PI / 360;

// Simulation parameters.
var latitude = 50 * DEG_TO_RAD; /* latitude of observer in degrees */
var declination = 20 * DEG_TO_RAD; /* declination of the star */
var rightAscension = 50 * DEG_TO_RAD;   /* right ascension of the star */

// Useful values. Do not touch.
var angle_to_north_pole = Math.PI/2 - latitude; /* angle between current latitude and north pole. */

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
var controls = new THREE.OrbitControls( camera, renderer.domElement );
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
equinox = new Dot3D(new THREE.Vector3(0.0, 0.0, 1.0), 0.05, 0x666666 );

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
hourAngleVector = new Arc3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));

// Vectors in horizon System.
altitudeVector = new Arc3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
azimuthVector = new Arc3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0));

// Vectors in the rotating equatorial system.
rightAscensionVector = new Arc3D(1, -Math.PI/2, -Math.PI/2-rightAscension, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
equinoxHourAngleVector = new Arc3D(1, 0.0, 1.0, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
declinationVector = new Arc3D(1, 0.0, declination, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(-1.0, 0.0, 0.0));

// Set styles.
horizon.setStyle(lineStyle1);
meridian.setStyle(lineStyleLight);
ZN.setStyle(lineStyleLight);
NS.setStyle(lineStyleLight);
WE.setStyle(lineStyleLight);
orbit.setStyle(lineStyleOrbit);
equator.setStyle(lineStyle4);
pole.setStyle(lineStyleArrow2);
altitudeVector.setStyle(lineStyleArrow)
azimuthVector.setStyle(lineStyleArrow)
equinoxHourAngleVector.setStyle(lineStyleArrow);
declinationVector.setStyle(lineStyleArrow2);
rightAscensionVector.setStyle(lineStyleArrow2);
hourAngleVector.setStyle(lineStyleArrow2);

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
horizonSystem.add(altitudeVector.getMesh());
horizonSystem.add(azimuthVector.getMesh());
horizonSystem.add(N.getMesh());
horizonSystem.add(SLabel.getMesh());
horizonSystem.add(NLabel.getMesh());

// Resting Equatorial System
var restEquatorialSystem = new THREE.Group();
restEquatorialSystem.name = "Resting Equatorial System";
restEquatorialSystem.add(equator.getMesh());
restEquatorialSystem.add(equatorDisc.getMesh());
restEquatorialSystem.add(pole.getMesh());
restEquatorialSystem.add(poleLabel.getMesh());
restEquatorialSystem.add(hourAngleVector.getMesh());
restEquatorialSystem.rotation.x = -angle_to_north_pole;

// Rotating equatorial System

var rotEquatorialSystem = new THREE.Group();
rotEquatorialSystem.name = "Rotating Equatorial System";
rotEquatorialSystem.add(equinox.getMesh());
rotEquatorialSystem.add(rightAscensionVector.getMesh());
rotEquatorialSystem.add(equinoxHourAngleVector.getMesh());
rotEquatorialSystem.rotation.x = -angle_to_north_pole;

// General equatorial system
var equatorialSystem = new THREE.Group();
equatorialSystem.name = "Equatorial System";
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

// Test group.
cosmos = new THREE.Group();


// Add meshes to scene.
cosmos.add(starSystem);
cosmos.add(restEquatorialSystem);
cosmos.add(horizonSystem);
cosmos.add(globalReference);
cosmos.add(rotEquatorialSystem);
cosmos.add(equatorialSystem);

scene.add(cosmos);

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

rotEquatorialSystem.traverse( function (child)
{
    if ( child instanceof THREE.Mesh )
    {
        child.material.opacity = 0.0;
    }
});

var isRotating = false;
var rotEasing = 0.0;

var horCoords = new HorizontalCoordinates(0.0, 0.0);
var eqCoords = new RestingEquatorialCoordinates(rightAscension, declination);

declinationVector.mesh.rotation.y -= eqCoords.hourAngle;

function animate( time ) {
    requestAnimationFrame( animate );
    TWEEN.update( time );
    controls.update();
    var delta = clock.getDelta();


    var deltatheta = 0.01 * delta / 0.016;

    if (isRotating)
    {
        scene.rotation.y += rotEasing * deltatheta;
    }

    eqCoords.hourAngle += deltatheta;
    while ( eqCoords.hourAngle > 2*Math.PI )
    {
        eqCoords.hourAngle -= 2*Math.PI;
    }

    var equinoxAngle = eqCoords.hourAngle - rightAscension;
    while ( equinoxAngle < 0.0 )
    {
        equinoxAngle += 2*Math.PI;
    }

    horCoords.fromRestingEquatorial(eqCoords, latitude);

    starSystem.rotation.y = -eqCoords.hourAngle;
    rotEquatorialSystem.rotateY(-deltatheta);
    equatorialSystem.rotateY(-deltatheta);

    altitudeVector.update(1, 0.0, horCoords.altitude, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 0.0, 1.0));
    altitudeVector.mesh.rotation.y = Math.PI/2-horCoords.azimuth;
    azimuthVector.update(1, Math.PI, -horCoords.azimuth, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));

    equinoxHourAngleVector.update(1, -Math.PI/2+equinoxAngle, -Math.PI/2, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));
    hourAngleVector.update(1, -Math.PI/2, -Math.PI/2 - eqCoords.hourAngle, new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0));

    renderer.render( scene, camera );
};

animate();

// Information boxes.
class InfoBox {
    constructor(title = '', text = '') {
        this.html = document.createElement('div')
        this.html.style.top = "10%";
        this.html.style.left = "70%";
        this.html.style.width = '25%';
        this.html.style.opacity = 0.0;
        this.html.style.webkitUserSelect = "none";
        this.html.style.msUserSelect = "none";
        this.html.style.mozUserSelect = "none";
        document.body.append(this.html);

        this.titleElement = document.createElement('div');
        this.titleElement.style.fontFamily = "Helvetica";
        this.titleElement.style.fontSize = "40px";
        this.titleElement.style.color = "#666666";
        this.titleElement.style.position = 'absolute';
        this.titleElement.style.width = '25%';
        this.titleElement.style.height = 50;
        this.titleElement.innerHTML = title;
        this.titleElement.style.top = 10 + '%';
        this.titleElement.style.left = 70 + '%';
        this.html.appendChild(this.titleElement);
        
        this.textElement = document.createElement('div');
        this.textElement.style.fontFamily = "Helvetica";
        this.textElement.style.fontSize = "20px";
        this.textElement.style.color = "#666666";
        this.textElement.style.position = 'absolute';
        this.textElement.style.width = '25%';
        this.textElement.innerHTML = text;
        this.textElement.style.top = 20 + '%';
        this.textElement.style.left = 70 + '%';
        this.html.appendChild(this.textElement);
    }

    set title(title) {
        this.titleElement.innerHTML = title;
    }

    set text(text) {
        this.textElement.innerHTML = text;
    }
}

var infoBoxEquatorial = new InfoBox('The Equatorial System');
infoBoxEquatorial.text = 'In the Equatorial System, the stars position is described by its <font color="#bc5090">hour angle</font> and <font color="#bc5090">declination</font>.\
Like in the horizontal system, the hour angle starts at the south point on the equatorial horizon.<br>\
At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\
At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';

var infoBoxRotEquatorial = new InfoBox('The Rotating Equatorial System');
infoBoxRotEquatorial.text = 'In the Equatorial System, the stars position is described by its <font color="#bc5090">hour angle</font> and <font color="#bc5090">declination</font>.\
Like in the horizontal system, the hour angle starts at the south point on the equatorial horizon.<br>\
At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\
At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';

var infoBoxHorizontal = new InfoBox('The Horizontal System');
infoBoxHorizontal.text = 'In the Equatorial System, the stars position is described by its <font color="#bc5090">hour angle</font> and <font color="#bc5090">declination</font>.\
Like in the horizontal system, the hour angle starts at the south point on the equatorial horizon.<br>\
At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\
At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';

var mouseOnButton;
// Button for toggle between rotational and resting equatorial system.
var toggleEquatorialButton = document.createElement('div'); // semantically suboptimal, but no borders or highlightings
toggleEquatorialButton.style.fontFamily = "Helvetica";
toggleEquatorialButton.style.fontSize = "20px";
toggleEquatorialButton.style.color = "#666666";
toggleEquatorialButton.style.position = 'absolute';
toggleEquatorialButton.style.top = '80%';
toggleEquatorialButton.style.left = '70%';
toggleEquatorialButton.innerHTML = '> Rotating Equatorial System';
toggleEquatorialButton.onmouseenter = function () {
    mouseOnButton = true;
}
toggleEquatorialButton.onmouseout = function() {
    mouseOnButton = false;
}
infoBoxEquatorial.html.appendChild(toggleEquatorialButton);

function onEquatorialButtonClicked() {
    if ( !isRotating ) {
        tweenRotEquatorialFadeIn.start();
        toggleEquatorialButton.innerHTML = '> Resting Equatorial System';
    } else {
        tweenRotEquatorialFadeOut.start();
        toggleEquatorialButton.innerHTML = '> Rotating Equatorial System';
    }
};

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
        hourAngleVector.mesh.material.opacity = opacityEquatorial.path;
        declinationVector.mesh.material.opacity = opacityEquatorial.path;
        equinox.mesh.material.opacity = opacityEquatorial.path;
        equinoxHourAngleVector.mesh.material.opacity = opacityEquatorial.path;
    })
    .onComplete( function () {

    })

var tweenEquatorialFadeIn = new TWEEN.Tween(opacityEquatorial)
    .to({ path:1.0, surface:0.15 }, 500)  // change in 0.5 seconds
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(function() {
        equator.mesh.material.opacity = opacityEquatorial.path;
        equatorDisc.mesh.material.opacity = opacityEquatorial.surface;
        pole.mesh.material.opacity = opacityEquatorial.path;
        poleLabel.mesh.material.opacity = opacityEquatorial.path;
        hourAngleVector.mesh.material.opacity = opacityEquatorial.path;
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
        altitudeVector.mesh.material.opacity = opacityHorizontal.path;
        azimuthVector.mesh.material.opacity = opacityHorizontal.path;
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

        altitudeVector.mesh.material.opacity = opacityHorizontal.path;
        azimuthVector.mesh.material.opacity = opacityHorizontal.path;
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

function fadeOutBox(box) {
    var opacity = { value: box.style.opacity };
    var tween = new TWEEN.Tween(opacity)
        .to( {value: 0.0 }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function() {
            box.style.opacity = opacity.value;
        });
    tween.start();
}

function fadeInBox(box) {
    var opacity = { value: box.style.opacity };
    var tween = new TWEEN.Tween(opacity)
        .to( {value: 1.0 }, 500)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(function() {
            box.style.opacity = opacity.value;
        });
    tween.start();    
}

var worldRotation = { value: 0.0 };
var tweenRotateToEquator = new TWEEN.Tween(worldRotation)
    .to( { value: angle_to_north_pole }, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function() {
        cosmos.rotation.x = worldRotation.value;
        globalReference.rotation.x = -worldRotation.value;
    })
var tweenRotateToHorizon = new TWEEN.Tween(worldRotation)
    .to( { value: 0.0 }, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function() {
        cosmos.rotation.x = worldRotation.value;
        globalReference.rotation.x = -worldRotation.value;
    })

var opacityRotEquatorial = { value: 0.0 };
var tweenRotEquatorialFadeIn = new TWEEN.Tween(opacityRotEquatorial)
    .to( { value: 1.0 }, 500)
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(function () {
        rotEasing = opacityRotEquatorial.value;
        equinox.mesh.material.opacity = opacityRotEquatorial.value;
        equinoxHourAngleVector.mesh.material.opacity = opacityRotEquatorial.value;
        rightAscensionVector.mesh.material.opacity = opacityRotEquatorial.value; // fade out hour angle
    })
    .onStart(function () {
        isRotating = true;
        toggleEquatorialButton.innerHTML = '> Resting Equatorial System';
    })
var tweenRotEquatorialFadeOut = new TWEEN.Tween(opacityRotEquatorial)
    .to( { value: 0.0 }, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function () {
        rotEasing = opacityRotEquatorial.value;
        equinox.mesh.material.opacity = opacityRotEquatorial.value;
        equinoxHourAngleVector.mesh.material.opacity = opacityRotEquatorial.value;
        rightAscensionVector.mesh.material.opacity = opacityRotEquatorial.value;
    })
    .onStart( function () {
        toggleEquatorialButton.innerHTML = '> Rotating Equatorial System';
    })
    .onComplete(function () {
        isRotating = false;
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

    if (mouseOnButton)  // make sure the user isnt hovering over a button
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
                tweenRotEquatorialFadeOut.start();
                tweenHorizontalFadeIn.start();
                fadeInBox(infoBoxHorizontal.html);
                fadeOutBox(infoBoxEquatorial.html);
                toggleEquatorialButton.removeEventListener( "click", onEquatorialButtonClicked );
                tweenRotateToHorizon.start();
                break;
            case restEquatorialSystem:
                isRotating = false;
                tweenHorizontalFadeOut.start();
                tweenEquatorialFadeIn.start();
                fadeInBox(infoBoxEquatorial.html);
                fadeOutBox(infoBoxHorizontal.html);
                toggleEquatorialButton.addEventListener( "click", onEquatorialButtonClicked );
                tweenRotateToEquator.start();
                break;
        }
    }
    else    // fade everything back in
    {
        isRotating = false;
        tweenRotEquatorialFadeOut.start();
        tweenEquatorialFadeIn.start();
        tweenHorizontalFadeIn.start();
        fadeOutBox(infoBoxHorizontal.html);
        fadeOutBox(infoBoxEquatorial.html);
        toggleEquatorialButton.removeEventListener( "click", onEquatorialButtonClicked );
        tweenRotateToHorizon.start();
    }
}
addEventListener( 'mousedown', onMouseDown, false );
addEventListener( 'mouseup', onMouseUp, false );