import './style.scss';

import * as THREE from './three/three.module.js'
import {OBJLoader} from './three/OBJLoader.js'
import oc from 'three-orbit-controls'
const OrbitControls = oc(THREE)

const scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let width = 25;
let height = width * ( window.innerHeight / window.innerWidth );
const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 200 );
let orbitControls = new OrbitControls( camera, renderer.domElement );

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
        sticker.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material = new THREE.MeshPhongMaterial
                ({
                    color: Math.random()*0xffffff, 
                });
            }
        } );
        createBuvosKocka( buvosKocka, cube, sticker, { x: 3 , y: 3, z: 3} );
    });
});

function createBuvosKocka( target, cubeModel, stickerModel, size ){
    function createBuvosKockaBlock(position){
        let cube = cubeModel.clone();
        cube.position.set(position.x, position.y, position.z);
        target.add(cube);

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
    let time = requestAnimationFrame( animate );

    buvosKockaFly(buvosKockaFly(time));

    renderer.render( scene, camera );
};

function buvosKockaFly( time ){
    if ( time ) {
        buvosKocka.position.y = Math.sin( time * 0.01 ) * 0.2;
        plane.material.opacity = 1 - ( Math.sin( time * 0.01 ) * 0.07 + 0.85);
    }
}
animate();