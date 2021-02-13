import './style.scss';

import * as THREE from './three/three.module.js'
import {OBJLoader} from './three/OBJLoader.js'
// import oc from 'three-orbit-controls'
// const OrbitControls = oc(THREE)

const scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let width = 10;
let height = width * ( window.innerHeight / window.innerWidth );
const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 200 );
// let orbitControls = new OrbitControls( camera, renderer.domElement );

scene.background = new THREE.Color( 0xeeeeeee );
camera.position.set(60, 51, 61);
camera.rotation.set(-0.696, 0.648, 0.467);

// Light
let topShadowDirectionalLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
topShadowDirectionalLight.castShadow = true;
topShadowDirectionalLight.shadow.radius = 60;
topShadowDirectionalLight.shadow.mapSize.width = 4096;
topShadowDirectionalLight.shadow.mapSize.height = 4096;
scene.add(topShadowDirectionalLight);
//
let sideDirectionalLite = new THREE.DirectionalLight( 0xffffff, 0.25);
sideDirectionalLite.position.set( 1, 0, 0 );
sideDirectionalLite.castShadow = true;
scene.add(sideDirectionalLite);
//
let ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 ); 
scene.add( ambientLight );

// Shadow Plane
let plane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10, 1, 1 ), new THREE.ShadowMaterial({opacity:0.1}));
plane.rotation.x = -Math.PI/2;
plane.position.set( 2, -3, 2 );
plane.receiveShadow = true;
scene.add(plane);

let buvosKocka = new THREE.Object3D();
buvosKocka.name = "buvosKocka";
scene.add(buvosKocka);

const objLoader = new OBJLoader();

objLoader.load(require('@static/models/cube.obj').default, ( cube ) => {
    cube.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = new THREE.MeshPhongMaterial
            ({
                color: 0x555555, 
            });
            child.castShadow = true;
        }
    } );
    objLoader.load(require('@static/models/sticker.obj').default, ( sticker ) => {
        createBuvosKocka( buvosKocka, cube, sticker, { x: 3 , y: 3, z: 3}, [0xffb611, 'yellow', 'green', 0xff0000, 0xffffff, 0x28DAFB ] );
        //TODO: вместо генерации материала для каждого блока генерировать материал только для каждого цвета
    });
});

function createBuvosKocka( target, cubeModel, stickerModel, size, colors){
    console.log(target)
    let sideHelper = new THREE.Mesh(
                        new THREE.BoxGeometry(size.x, size.y, size.z),
                        new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0, transparent:true}),
                    ); 
    sideHelper.name = "sideHelper";
    target.add(sideHelper)

    function createBuvosKockaBlock(position){
        let cube = cubeModel.clone();
        cube.position.set(position.x - size.x/2 + 0.5, position.y - size.y/2 + 0.5, position.z-size.z/2  + 0.5);
        target.add(cube);

        if ( position.x == 0){
            let sticker = stickerModel.clone();
            sticker.position.set(-0.5, 0, 0);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial
                    ({
                        color: colors[0]
                    });
                }
            } );

            cube.add(sticker);
        }
        if ( position.x == size.x-1 ){
            let sticker = stickerModel.clone();
            sticker.position.set(+0.5, 0, 0);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial
                    ({
                        color: colors[1]
                    });
                }
            } );

            cube.add(sticker);
        }
        if ( position.y == 0 ){
            let sticker = stickerModel.clone();
            sticker.rotation.z = Math.PI/2;
            sticker.position.set(0, -0.5, 0);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial
                    ({
                        color: colors[2]
                    });
                }
            } );

            cube.add(sticker);
        }
        if ( position.y == size.y-1 ){
            let sticker = stickerModel.clone();
            sticker.rotation.z = Math.PI/2;
            sticker.position.set(0, +0.5, 0);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial
                    ({
                        color: colors[3]
                    });
                }
            } );

            cube.add(sticker);
        }
        if ( position.z == 0 ){
            let sticker = stickerModel.clone();
            sticker.rotation.y = Math.PI/2;
            sticker.position.set(0, 0, -0.5);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial
                    ({
                        color: colors[4]
                    });
                }
            } );

            cube.add(sticker);
        }
        if ( position.z == size.z-1 ){
            let sticker = stickerModel.clone();
            sticker.rotation.y = Math.PI/2;
            sticker.position.set(0, 0, +0.5);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = new THREE.MeshPhongMaterial
                    ({
                        color: colors[5]
                    });
                }
            } );

            cube.add(sticker);
        }
    }

    for (let x = 0; x < size.x; x++){
        for (let y = 0; y < size.y; y++){
            createBuvosKockaBlock( {x: x, y: y, z: 0} );
            createBuvosKockaBlock( {x: x, y: y, z: size.z-1} );
        }
    }

    for (let x = 0; x < size.x; x++){
        for (let z = 1; z < size.z-1; z++){
            createBuvosKockaBlock( {x: x, y: 0, z: z} );
            createBuvosKockaBlock( {x: x, y: size.y-1, z: z} );
        }
    }

    for (let y = 1; y < size.y-1; y++){
        for (let z = 1; z < size.z-1; z++){
            createBuvosKockaBlock( { x: 0, y: y, z: z } );
            createBuvosKockaBlock( { x: size.x - 1, y: y, z: z } );
        }
    }
}

// Вращение кубика рубика
//  Q - Влево вверх
//  W - Вправо
//  E - Вправо вверх
//  С зажатым shif - в обратную сторону
let rotateAroundWorldAxis = function(object, axis, radians) {
    let rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    let currentPos = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1);
    let newPos = currentPos.applyMatrix4(rotWorldMatrix);

    rotWorldMatrix.multiply(object.matrix);
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);

    object.position.x = newPos.x;
    object.position.y = newPos.y;
    object.position.z = newPos.z;
};

function easeInOutCubic(x){
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}












const raycaster = new THREE.Raycaster();
// function onMouseMove( event ) {
// 	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
// 	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
// }
// document.addEventListener('mousemove', onMouseMove);
let mouseDownPosition = new THREE.Vector2();
document.addEventListener('mousedown', function (event) {
    mouseDownPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseDownPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouseDownPosition, camera );
});

let mouseUpPosition = new THREE.Vector2();
document.addEventListener('mouseup', function (event) {
    mouseUpPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseUpPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    let mouseDiff = new THREE.Vector2();
    mouseDiff.subVectors(mouseUpPosition, mouseDownPosition);

    let intersect = raycaster.intersectObjects( scene.children, true )
    let block = null;
    let intersectSide = null;
    intersect.some( function( element ) {
        if (element.object.name != "sideHelper"){
            block = element.object;
            return true;
        }
        return false;
    });
    intersect.some( function( element ) {
        if (element.object.name == "sideHelper"){
            intersectSide = element.face.normal;
            return true;
        }
        return false;
    });

    while (block?.parent && block?.parent.name != "buvosKocka")
        block = block.parent;

    if (block && block.parent?.name == "buvosKocka"){
        let arrayus = []
        let direction = new THREE.Vector3(0,0,0)
        let step = 0;
        let startTime = performance.now();
        let duration = 1000;
        function rotateus( currentTime ){
            let lastStep = step;
            step = easeInOutCubic( ( currentTime - startTime ) / duration );
            arrayus.forEach(element => {
                rotateAroundWorldAxis(element, direction, Math.PI/2*(step-lastStep));
            });
            if (step < 1) requestAnimationFrame( rotateus ); else step = 1;
        }


        let inaccuracy = 0.3
        // Верхняя грань
        if (intersectSide.x == 0 && intersectSide.y == 1 && intersectSide.z == 0){
            if (0 < mouseDiff.angle() && mouseDiff.angle() < Math.PI / 2 || Math.PI < mouseDiff.angle() && mouseDiff.angle() < Math.PI * 3 / 2 ){
                buvosKocka.children.forEach(element => {
                    if (Math.abs(element.position.x - block.position.x) < inaccuracy){
                        arrayus.push(element)
                    }
                });
                direction.set(mouseDiff.x > 0? -1 : 1, 0, 0);
            }
            else{
                buvosKocka.children.forEach(element => {
                    if (Math.abs(element.position.z - block.position.z) < inaccuracy){
                        arrayus.push(element)
                    }
                });
                direction.set(0, 0, mouseDiff.x > 0? -1 : 1);
            }
        }

        // Левая грань
        if (intersectSide.x == 0 && intersectSide.y == 0 && intersectSide.z == 1){
            if (Math.PI/9 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*8/9 || Math.PI*10/9 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*17/9 ){
                buvosKocka.children.forEach(element => {
                    if (Math.abs(element.position.x - block.position.x) < inaccuracy){
                        arrayus.push(element);
                    }
                });
                direction.set( mouseDiff.y > 0? -1: 1, 0, 0);
            }
            else{
                buvosKocka.children.forEach(element => {
                    if (Math.abs(element.position.y - block.position.y) < inaccuracy){
                        arrayus.push(element)
                    }
                    direction.set(0, mouseDiff.x > 0? 1: -1, 0);
                });
            }
        }

        // Правая грань
        if (intersectSide.x == 1 && intersectSide.y == 0 && intersectSide.z == 0){
            if (Math.PI / 9 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*8/9 || Math.PI*10/9 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*17/9 ){
                buvosKocka.children.forEach(element => {
                    if (Math.abs(element.position.z - block.position.z) < inaccuracy){
                        arrayus.push(element);
                    }
                });
                direction.set( 0, 0, mouseDiff.y > 0? 1: -1);
            }
            else{
                buvosKocka.children.forEach(element => {
                    if (Math.abs(element.position.y - block.position.y) < inaccuracy){
                        arrayus.push(element)
                    }
                    direction.set(0, mouseDiff.x > 0? 1: -1, 0);
                });
            }
        }

        requestAnimationFrame(rotateus);
    }
});









document.addEventListener('keydown', function( event ){
    let duration = 1000;

    let startTime = performance.now();
    let step = 0;

    function rotateBuvosKockaAnimation ( currentTime ){
        let lastStep = step;

        step = easeInOutCubic( ( currentTime - startTime ) / duration );
        if (step < 1) requestAnimationFrame( rotateBuvosKockaAnimation ); else step = 1;

        switch( event.code ){
            case 'KeyQ': 
                buvosKocka.rotateOnWorldAxis(new THREE.Vector3( 0, 0, event.shiftKey == 1? -1: 1 ), Math.PI / 2 * (step-lastStep))
                break;
            case 'KeyW':
                buvosKocka.rotateOnWorldAxis(new THREE.Vector3( 0, event.shiftKey == 1? -1: 1, 0 ), Math.PI / 2 * (step-lastStep))
                break;
            case 'KeyE':
                buvosKocka.rotateOnWorldAxis(new THREE.Vector3( event.shiftKey == 1? 1: -1, 0, 0), Math.PI / 2 * (step-lastStep))
                break;
        }
    }

    if (["KeyQ", "KeyW", "KeyE"].indexOf(event.code) > -1)
        requestAnimationFrame( rotateBuvosKockaAnimation );
});


function buvosKockaFly( time ){
    if ( time ) {
        buvosKocka.position.y = Math.sin( time * 0.001 ) * 0.2;
        plane.material.opacity = 1 - ( Math.sin( time * 0.001 ) * 0.07 + 0.9);
    }
}

const animate = function () {
    requestAnimationFrame( animate );
    requestAnimationFrame(buvosKockaFly);
    renderer.render( scene, camera );
};
animate();