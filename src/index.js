import './style.scss';

import * as THREE from './three/three.module.js'
import {OBJLoader} from './three/OBJLoader.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 20;


var dirLight = new THREE.DirectionalLight( 0xffffff );
var dirLight2 = new THREE.DirectionalLight( 0xffffff );
dirLight2.position.set( 10, -30, 10 );
dirLight.position.set( -10, 10, 10 );
scene.add( dirLight , dirLight2);

const objLoader = new OBJLoader();

objLoader.load(require('@static/models/cube.obj').default, (object) => {
    object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            // child.material = new THREE.MeshBasicMaterial({
            //     color: 0xFFFF00, 
            // });
            child.material = new THREE.MeshPhongMaterial({
                color: 0xFFFF00, 
                shiness: 70,
                specular: 0xffffff,});
        }
    } );
    objLoader.load(require('@static/models/sticker.obj').default, (sticker) => {
        sticker.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                // child.material = new THREE.MeshBasicMaterial({
                //     color: 0xFFFF00, 
                // });
                child.material = new THREE.MeshPhongMaterial({
                    color: 0xFF0000, 
                    shiness: 70,
                    specular: 0xffffff,});
            }
        } );
        createBuvosKocka( object, sticker, { x: 3 , y: 3, z: 3} );
    });
});

function createBuvosKocka( cubeModel, stickerModel, size ){
    let buvosKocka = new THREE.Object3D();
    function createBuvosKockaBlock(position){
        let cube = cubeModel.clone();
        cube.position.set(position.x, position.y, position.z);
        buvosKocka.add(cube);

        if ( position.x == 0){
            let sticker = stickerModel.clone();
            sticker.position.set(-0.5, 0, 0);
            cube.add(sticker);
        }
        if ( position.x == size.x-1 ){
            let sticker = stickerModel.clone();
            sticker.position.set(+0.5, 0, 0);
            cube.add(sticker);
        }
        if ( position.y == 0 ){
            let sticker = stickerModel.clone();
            sticker.rotation.z = Math.PI/2;
            sticker.position.set(0, -0.5, 0);
            cube.add(sticker);
        }
        if ( position.y == size.y-1 ){
            let sticker = stickerModel.clone();
            sticker.rotation.z = Math.PI/2;
            sticker.position.set(0, +0.5, 0);
            cube.add(sticker);
        }
        if ( position.z == 0 ){
            let sticker = stickerModel.clone();
            sticker.rotation.y = Math.PI/2;
            sticker.position.set(0, 0, -0.5);
            cube.add(sticker);
        }
        if ( position.z == size.z-1 ){
            let sticker = stickerModel.clone();
            sticker.rotation.y = Math.PI/2;
            sticker.position.set(0, 0, +0.5);
            cube.add(sticker);
        }
    }

    scene.add(buvosKocka); /////////////////////////////////////////////////////
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

const animate = function () {
    requestAnimationFrame( animate );

    scene.rotation.x += 0.01;
    scene.rotation.y += 0.01;

    renderer.render( scene, camera );
};
animate();