import './style.scss';

import * as THREE from './three/three.module.js'
import {OBJLoader} from './three/OBJLoader.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 10;


var dirLight = new THREE.DirectionalLight( 0xffffff );
var dirLight2 = new THREE.DirectionalLight( 0xffffff );
dirLight2.position.set( 10, -30, 10 );
dirLight.position.set( -10, 10, 10 );
scene.add( dirLight , dirLight2);

const objLoader = new OBJLoader();
let cube;
objLoader.load(require('@static/models/0.obj').default, (object) => {
    object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material = new THREE.MeshPhongMaterial({
                color: 0xFFFF00, 
                shiness: 70,
                specular: 0xffffff,});

        }

    } );
    scene.add(object);
    cube = object;
});

const animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};
animate();