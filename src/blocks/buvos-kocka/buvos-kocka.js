const BUVOS_KOCKA_SIZE = 3;

import * as THREE from '@modules/three/three.module.js';
import {OBJLoader} from '@modules/three/OBJLoader.js';

let buvosKockaContainer = document.querySelector('.buvos-kocka');
if (buvosKockaContainer){

let renderer = new THREE.WebGLRenderer({ antialias: true });
buvosKockaContainer.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;

let camera = new THREE.OrthographicCamera( -5, 5, 5, -5, 1, 200 );
fitRenderer();
function fitRenderer(){
    renderer.setSize( window.innerWidth, window.innerHeight );
    let width = 4, height = 4;
    width *= BUVOS_KOCKA_SIZE;
    height *= BUVOS_KOCKA_SIZE
    if (window.innerWidth < window.innerHeight){
        height = width * ( window.innerHeight / window.innerWidth );
    }
    else{
        width = height * ( window.innerWidth / window.innerHeight )
    }
    camera.left = width / - 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / - 2;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', fitRenderer);

const scene = new THREE.Scene();

scene.background = new THREE.Color( 0xeeeeeee );
camera.position.set(60, 51, 61);
camera.rotation.set(-0.696, 0.648, 0.467);

// Освещение
let topShadowDirectionalLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
topShadowDirectionalLight.castShadow = true;
topShadowDirectionalLight.shadow.radius = 20 * BUVOS_KOCKA_SIZE;
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
let plane = new THREE.Mesh( new THREE.PlaneGeometry( BUVOS_KOCKA_SIZE+5, BUVOS_KOCKA_SIZE+5, 1, 1 ), new THREE.ShadowMaterial({opacity:0.1}));
plane.rotation.x = -Math.PI/2;
plane.position.set( 0, -BUVOS_KOCKA_SIZE, 0 );
plane.receiveShadow = true;
scene.add(plane);

// Стадия игры
// 0 - Игра не началась
// 1 - Ожидание запуска
// 2 - Игра запущена
// 3 - Игра завершена
let gameMode = 0;

// Разрешено ли вращать кубик
let canRotate = true;

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
        let colors = [0xffb611, 'yellow', 'green', 0xff0000, 0xffffff, 0x28DAFB ];
        let materials = colors.map( (color) => { 
            return new THREE.MeshPhongMaterial({
                color: color
            });
        })
        createBuvosKocka( buvosKocka, cube, sticker, BUVOS_KOCKA_SIZE,  materials);
    });
});

function createBuvosKocka( target, cubeModel, stickerModel, size, materials){
    let sideWrapper = new THREE.Mesh(
                        new THREE.BoxGeometry(size, size, size),
                        new THREE.MeshPhongMaterial({opacity:0, transparent: true, alphaTest: 1})
                    ); 
    sideWrapper.name = "sideWrapper";
    
    target.add(sideWrapper);

    function createBuvosKockaBlock(position){
        let cube = cubeModel.clone();
        cube.position.set(position.x - size/2 + 0.5, position.y - size/2 + 0.5, position.z-size/2  + 0.5);
        sideWrapper.add(cube);

        if ( position.x == 0){
            let sticker = stickerModel.clone();
            sticker.position.set(-0.5, 0, 0);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = materials[0];
                }
            } );

            cube.add(sticker);
        }
        if ( position.x == size-1 ){
            let sticker = stickerModel.clone();
            sticker.position.set(+0.5, 0, 0);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = materials[1];
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
                    child.material = materials[2];
                }
            } );

            cube.add(sticker);
        }
        if ( position.y == size-1 ){
            let sticker = stickerModel.clone();
            sticker.rotation.z = Math.PI/2;
            sticker.position.set(0, +0.5, 0);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = materials[3];
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
                    child.material = materials[4];
                }
            } );

            cube.add(sticker);
        }
        if ( position.z == size-1 ){
            let sticker = stickerModel.clone();
            sticker.rotation.y = Math.PI/2;
            sticker.position.set(0, 0, +0.5);

            sticker.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = materials[5];
                }
            } );

            cube.add(sticker);
        }
    }

    for (let x = 0; x < size; x++){
        for (let y = 0; y < size; y++){
            createBuvosKockaBlock( {x: x, y: y, z: 0} );
            createBuvosKockaBlock( {x: x, y: y, z: size-1} );
        }
    }

    for (let x = 0; x < size; x++){
        for (let z = 1; z < size-1; z++){
            createBuvosKockaBlock( {x: x, y: 0, z: z} );
            createBuvosKockaBlock( {x: x, y: size-1, z: z} );
        }
    }

    for (let y = 1; y < size-1; y++){
        for (let z = 1; z < size-1; z++){
            createBuvosKockaBlock( { x: 0, y: y, z: z } );
            createBuvosKockaBlock( { x: size - 1, y: y, z: z } );
        }
    }

    checkBuvosKocka = _checkBuvosKocka();
}

function _checkBuvosKocka(){
    let sides = [];

    let sideWrapper = buvosKocka.getObjectByName("sideWrapper");

    let firstBlock = null;
    let secondBlock = null;

    // Выбрать два противоположных угла кубика рубика
    sideWrapper.children.forEach(element => {
        if (firstBlock == null && element.children.length == 4){
            firstBlock = element
        }
        else if (element.children.length == 4){   
            let matchPosition = false;
            for (let i = 0; i < element.children.length; i++) {
                for(let j = 0; j < firstBlock.children.length; j++){
                    if ((Math.abs(firstBlock.position.x - element.position.x) < 0.2)||
                        (Math.abs(firstBlock.position.y - element.position.y) < 0.2)||
                        (Math.abs(firstBlock.position.y - element.position.y) < 0.2)){
                            matchPosition = true;
                            break;
                    }
                }
                if (matchPosition)
                    break;
            }
            if (matchPosition == false){
                secondBlock = element;
            }
        }
    });

    // Выбрать стороны кубика рубка
    for (let i = 0; i < 3; i ++){
        sides.push(selectSimilarPosition(sideWrapper.children, firstBlock.position, i == 0, i == 1, i == 2))
        sides.push(selectSimilarPosition(sideWrapper.children, secondBlock.position, i == 0, i == 1, i == 2))
    }


    return function(){
        let matchRotation = true;
        for (let i = 0; i < sides.length; i++){
            for (let j = 1; j < sides[i].length; j++){
                if (
                    (Math.abs(sides[i][j].rotation._x - sides[i][j-1].rotation._x) > 0.2) ||
                    (Math.abs(sides[i][j].rotation._y - sides[i][j-1].rotation._y) > 0.2) ||
                    (Math.abs(sides[i][j].rotation._z - sides[i][j-1].rotation._z) > 0.2)
                )
                
                {
                    matchRotation = false;
                    break;
                }
            }
            if (!matchRotation)
                break;
        }
        return matchRotation == true;
    }
}
let checkBuvosKocka;

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

function selectSimilarPosition( array, position, isX = true, isY = true, isZ = true, inaccuracy = 0.2 ){
    let similarArray = [];

    array.forEach(element => {
        if ((!isX || (Math.abs(element.position.x - position.x) < inaccuracy))
        && (!isY || (Math.abs(element.position.y - position.y) < inaccuracy))
        && (!isZ || (Math.abs(element.position.z - position.z) < inaccuracy))) {
            similarArray.push(element);
        }
    });


    return similarArray;
}

function easeInOutCubic(x){
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function shuffleBuvosKocka( count, startDuration, endDuration, transitionCount, callback ){
    let currentCount = 0;
    if (!canRotate)
        return;

    let cubes = buvosKocka.getObjectByName("sideWrapper").children;

    function cycle(){
        if ( currentCount > count ){
            canRotate = true;
            callback();
            return;
        }
        canRotate = false;

        let randomNumber = ~~(Math.random() * cubes.length);
        let randomCube = cubes[randomNumber];

        randomNumber = ~~(Math.random()*3);
        let randomSide = selectSimilarPosition( cubes, randomCube.position, randomNumber == 0, randomNumber == 1, randomNumber == 2);
        requestAnimationFrame( 
            rotateObjects(  
                randomSide, 
                new THREE.Vector3(randomNumber == 0, randomNumber == 1, randomNumber == 2),

                endDuration+(1-(currentCount > transitionCount? 1: Math.sqrt(1 - Math.pow(currentCount/transitionCount - 1, 2))))*(startDuration-endDuration),
                cycle
            )
        );
        currentCount++;
    }
    cycle();
}

function rotateObjects( rotationBlocks, direction, duration, afterEnd = null ){
    let startTime = performance.now();
    let step = 0;
    return function rotate( currentTime ){
        let lastStep = step;
        step = easeInOutCubic( ( currentTime - startTime ) / duration );

        if (step < 1) requestAnimationFrame( rotate ); else { step = 1;}
        
        rotationBlocks.forEach(element => {
            rotateAroundParentAxis(element, direction, Math.PI/2*(step-lastStep));
        });

        if (step == 1){
            canRotate = true;
            if (typeof(afterEnd) == 'function')
                afterEnd();
        };
    }
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

    if (!canRotate || gameMode == 0 || gameMode==3)
        return;

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
        gameMode = 2;
        canRotate = false;

        let direction = new THREE.Vector3(0,0,0);
        let rotationBlocks = []
        let sideWrapper = buvosKocka.getObjectByName("sideWrapper");

        // Вращение в зависимости от выбранной грани
        // Верхняя грань
        if (intersectSide.x == 0 && intersectSide.y == 1 && intersectSide.z == 0){
            if (0 < mouseDiff.angle() && mouseDiff.angle() < Math.PI / 2 || Math.PI < mouseDiff.angle() && mouseDiff.angle() < Math.PI * 3 / 2 ){
                rotationBlocks = selectSimilarPosition(sideWrapper.children, block.position, true, false, false)
                direction.set(mouseDiff.x > 0? -1 : 1, 0, 0);
            }
            else{
                rotationBlocks = selectSimilarPosition(sideWrapper.children, block.position, false, false, true)
                direction.set(0, 0, mouseDiff.x > 0? -1 : 1);
            }
        }
        // Левая грань
        if (intersectSide.x == 0 && intersectSide.y == 0 && intersectSide.z == 1){
            if (Math.PI * 5 / 12 < mouseDiff.angle() && mouseDiff.angle() < Math.PI* 7/12 || Math.PI*17/12 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*19/12 ){
                rotationBlocks = selectSimilarPosition(sideWrapper.children, block.position, true, false, false)
                direction.set( mouseDiff.y > 0? -1: 1, 0, 0);
            }
            else{
                rotationBlocks = selectSimilarPosition(sideWrapper.children, block.position, false, true, false)
                direction.set(0, mouseDiff.x > 0? 1: -1, 0);
            }
        }
        // Правая грань
        if (intersectSide.x == 1 && intersectSide.y == 0 && intersectSide.z == 0){
            if (Math.PI * 5 / 12 < mouseDiff.angle() && mouseDiff.angle() < Math.PI* 7/12 || Math.PI*17/12 < mouseDiff.angle() && mouseDiff.angle() < Math.PI*19/12 ){
                rotationBlocks = selectSimilarPosition(sideWrapper.children, block.position, false, false, true)
                direction.set( 0, 0, mouseDiff.y > 0? 1: -1);
            }
            else{
                rotationBlocks = selectSimilarPosition(sideWrapper.children, block.position, false, true, false)
                direction.set(0, mouseDiff.x > 0? 1: -1, 0);
            }
        }

        requestAnimationFrame(rotateObjects( rotationBlocks, direction, 1000, ()=>{if (checkBuvosKocka()) requestAnimationFrame(finishGame);}));
    }
});


// Управление клавиатурой
// Вращение кубика рубика
//  Q - Влево вверх
//  W - Вправо
//  E - Вправо вверх
//  С зажатым shif - в обратную сторону
document.addEventListener('keydown', function( event ){
    let direction = new THREE.Vector3(0,0,0);
    let sideWrapper = buvosKocka.getObjectByName("sideWrapper");

    if (["KeyQ", "KeyW", "KeyE"].indexOf(event.code) > -1 && canRotate && (gameMode == 1 || gameMode == 2)){
        gameMode = 2;
        switch( event.code ){
            case 'KeyQ': 
                direction.set( 0, 0, event.shiftKey == 1? -1: 1 );
                break;
            case 'KeyW':
                direction.set( 0, event.shiftKey == 1? -1: 1, 0 );
                break;
            case 'KeyE':
                direction.set( event.shiftKey == 1? 1: -1, 0, 0);
                break;
        }
        canRotate = false;
        requestAnimationFrame(rotateObjects(sideWrapper.children, direction, 1000, ()=>{if (checkBuvosKocka()) gameMode = 3;}));
    }
    if ( event.code == 'Space' && gameMode == 0 ){
        shuffleBuvosKocka(100, 1000, 1, 20, () => { gameMode = 1; });
    }
});

// Куб двигается вверх и вниз
function buvosKockaFly( time ){
    buvosKocka.position.y = Math.sin( time * 0.001 ) * 0.06 * BUVOS_KOCKA_SIZE;
    plane.material.opacity = 1 - ( Math.sin( time * 0.001 ) * 0.04 + 0.93);
    requestAnimationFrame(buvosKockaFly);
}
requestAnimationFrame(buvosKockaFly);

let buvosKockaTimer = document.querySelector('.buvos-kocka__timer');

function stopwatch ( time ){
    if (gameMode == 0 || gameMode == 1){
        requestAnimationFrame(stopwatch);
        return;
    }

    let startTime = time;

    function updateStopwatch( time ){
        buvosKockaTimer.textContent = (~~((time-startTime)/1000/60)).toString().padStart(2, '0') + "." + 
                                    (~~((time-startTime)/1000)%60).toString().padStart(2, '0') + "." +
                                    (~~((time-startTime)/10)%100).toString().padStart(2, '0');
        
        if (gameMode == 2)
            requestAnimationFrame(updateStopwatch);
    }
    if (gameMode == 2)
        requestAnimationFrame(updateStopwatch);
}
requestAnimationFrame(stopwatch);

function finishGame( time ){
    gameMode = 3;
    let duration = 1000;
    let startTime = time;
    let startG = scene.background.g;
    let startB = scene.background.b;
    function _finishGame( time ){
        let step = ( time - startTime ) / duration;
        scene.background.g = step * (1-startG) + startG;
        scene.background.b = step * (0.8-startB) + startB;
        if (scene.background.g < 1)
            requestAnimationFrame(_finishGame)
    }
    requestAnimationFrame(_finishGame);
}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};

animate();

}