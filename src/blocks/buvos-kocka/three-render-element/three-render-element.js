import * as THREE from '@modules/three/three.module.js'
import {OBJLoader} from '@modules/three/OBJLoader.js'

let renderer = new THREE.WebGLRenderer({ antialias: true });
document.querySelector('.buvos-kocka').appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );

const scene = new THREE.Scene();

let width = 20;
let height = width * ( window.innerHeight / window.innerWidth );
const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 200 );

scene.background = new THREE.Color( 0xeeeeeee );
camera.position.set(60, 51, 61);
camera.rotation.set(-0.696, 0.648, 0.467);

// Освещение
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

// Плоскость для тени
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
        createBuvosKocka( buvosKocka, cube, sticker, { x: 4, y: 4, z: 4}, [0xffb611, 'yellow', 'green', 0xff0000, 0xffffff, 0x28DAFB ] );
        //TODO: вместо генерации материала для каждого блока генерировать материал только для каждого цвета
    });
});

function createBuvosKocka( target, cubeModel, stickerModel, size, colors){
    let sideWrapper = new THREE.Mesh(
                        new THREE.BoxGeometry(size.x, size.y, size.z),
                        new THREE.MeshPhongMaterial({opacity:0, transparent: true, alphaTest: 1})
                    ); 
    sideWrapper.name = "sideWrapper";
    
    target.add(sideWrapper);

    function createBuvosKockaBlock(position){
        let cube = cubeModel.clone();
        cube.position.set(position.x - size.x/2 + 0.5, position.y - size.y/2 + 0.5, position.z-size.z/2  + 0.5);
        sideWrapper.add(cube);

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

let rotateAroundParentAxis = function(object, axis, radians) {
    let rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    let currentPos = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1);
    let newPos = currentPos.applyMatrix4(rotWorldMatrix);

    rotWorldMatrix.multiply(object.matrix);
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);

    object.position.set(newPos.x, newPos.y, newPos.z);
};

function easeInOutCubic(x){
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}


// Управление мышью
const raycaster = new THREE.Raycaster();
//
let mouseDownPosition = new THREE.Vector2();
document.addEventListener('mousedown', function (event) {
    mouseDownPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseDownPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouseDownPosition, camera );
});
//
let mouseUpPosition = new THREE.Vector2();
document.addEventListener('mouseup', function (event) {
    mouseUpPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseUpPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    let mouseDiff = new THREE.Vector2();
    mouseDiff.subVectors(mouseUpPosition, mouseDownPosition);

    let intersect = raycaster.intersectObjects( scene.children, true )

    let block = null;
    let intersectSide = null;
    // Поиск первого элемента на пути луча (кроме sideWrapper)
    intersect.some( function( element ) {
        if (element.object.name != "sideWrapper"){
            block = element.object;
            return true;
        }
        return false;
    });
    // Поиск sideWrapper на пути луча
    intersect.some( function( element ) {
        if (element.object.name == "sideWrapper"){
            intersectSide = element.face.normal;
            return true;
        }
        return false;
    });

    while (block?.parent && block?.parent.name != "sideWrapper")
        block = block.parent;

    if (block && block.parent?.name == "sideWrapper"){
        let duration = 1000;

        let direction = new THREE.Vector3(0,0,0);
        let rotationBlocks = []
        let sideWrapper = buvosKocka.getObjectByName("sideWrapper");
        let startTime = performance.now();
        let step = 0;
        function rotateus( currentTime ){
            let lastStep = step;

            step = easeInOutCubic( ( currentTime - startTime ) / duration );

            if (step < 1) requestAnimationFrame( rotateus ); else step = 1;
            
            rotationBlocks.forEach(element => {
                rotateAroundParentAxis(element, direction, Math.PI/2*(step-lastStep));
            });
        }

        // Вращение в зависимости от выбранной грани
        let inaccuracy = 0.2
        // Верхняя грань
        if (intersectSide.x == 0 && intersectSide.y == 1 && intersectSide.z == 0){
            if (0 < mouseDiff.angle() && mouseDiff.angle() < Math.PI / 2 || Math.PI < mouseDiff.angle() && mouseDiff.angle() < Math.PI * 3 / 2 ){
                sideWrapper.children.forEach(element => {
                    if (Math.abs(element.position.x - block.position.x) < inaccuracy){
                        rotationBlocks.push(element)
                    }
                });
                direction.set(mouseDiff.x > 0? -1 : 1, 0, 0);
            }
            else{
                sideWrapper.children.forEach(element => {
                    if (Math.abs(element.position.z - block.position.z) < inaccuracy){
                        rotationBlocks.push(element)
                    }
                });
                direction.set(0, 0, mouseDiff.x > 0? -1 : 1);
            }
        }
        // Левая грань
        if (intersectSide.x == 0 && intersectSide.y == 0 && intersectSide.z == 1){
            if (Math.PI / 9 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*8/9 || Math.PI*10/9 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*17/9 ){
                sideWrapper.children.forEach(element => {
                    if (Math.abs(element.position.x - block.position.x) < inaccuracy){
                        rotationBlocks.push(element);
                    }
                });
                direction.set( mouseDiff.y > 0? -1: 1, 0, 0);
            }
            else{
                sideWrapper.children.forEach(element => {
                    if (Math.abs(element.position.y - block.position.y) < inaccuracy){
                        rotationBlocks.push(element)
                    }
                });
                direction.set(0, mouseDiff.x > 0? 1: -1, 0);
            }
        }
        // Правая грань
        if (intersectSide.x == 1 && intersectSide.y == 0 && intersectSide.z == 0){
            if (Math.PI / 9 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*8/9 || Math.PI*10/9 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*17/9 ){
                sideWrapper.children.forEach(element => {
                    if (Math.abs(element.position.z - block.position.z) < inaccuracy){
                        rotationBlocks.push(element);
                    }
                });
                direction.set( 0, 0, mouseDiff.y > 0? 1: -1);
            }
            else{
                sideWrapper.children.forEach(element => {
                    if (Math.abs(element.position.y - block.position.y) < inaccuracy){
                        rotationBlocks.push(element)
                    }
                });
                direction.set(0, mouseDiff.x > 0? 1: -1, 0);
            }
        }

        requestAnimationFrame(rotateus);
    }
});


// Управление клавиатурой
// Вращение кубика рубика
//  Q - Влево вверх
//  W - Вправо
//  E - Вправо вверх
//  С зажатым shif - в обратную сторону
document.addEventListener('keydown', function( event ){
    let duration = 1000;

    let startTime = performance.now();
    let step = 0;

    let direction = null;
    let sideWrapper = buvosKocka.getObjectByName("sideWrapper");

    function rotateBuvosKockaAnimation ( currentTime ){
        let lastStep = step;

        step = easeInOutCubic( ( currentTime - startTime ) / duration );
        if (step < 1) requestAnimationFrame( rotateBuvosKockaAnimation ); else step = 1;
 
        sideWrapper.children.forEach( cube => {
            rotateAroundParentAxis(cube, direction, Math.PI / 2 * (step-lastStep));
        });
    }

    if (["KeyQ", "KeyW", "KeyE"].indexOf(event.code) > -1){
        switch( event.code ){
            case 'KeyQ': 
                direction = new THREE.Vector3( 0, 0, event.shiftKey == 1? -1: 1 );
                break;
            case 'KeyW':
                direction = new THREE.Vector3( 0, event.shiftKey == 1? -1: 1, 0 );
                break;
            case 'KeyE':
                direction = new THREE.Vector3( event.shiftKey == 1? 1: -1, 0, 0);
                break;
        }

        requestAnimationFrame( rotateBuvosKockaAnimation );
    }
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