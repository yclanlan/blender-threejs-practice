import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import gsap from 'gsap';

// console.log(gsap);



THREE.ColorManagement.enabled = false


/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
// scene.fog = new THREE.FogExp2( 0x64B4FD, 0.05 );

/*
 * object
 */

// const gridHelper = new THREE.GridHelper( 10, 10 );
// scene.add( gridHelper );



const objectsDistance = 5;

const mesh1= new THREE.Mesh(
    new THREE.BoxGeometry(0,0,0),  
)

const mesh2= new THREE.Mesh(
    new THREE.BoxGeometry(0,0,0),  
)

const mesh3= new THREE.Mesh(
    new THREE.BoxGeometry(0,0,0),
)

 mesh1.position.x = 2
 mesh2.position.x = -2   
 mesh3.position.x = 0

 mesh1.position.y = -objectsDistance * 0
 mesh2.position.y = -objectsDistance * 1.2
 mesh3.position.y = -objectsDistance * 2.8

 mesh1.position.z = -5
 mesh2.position.z = -2   
 mesh3.position.z = -1

scene.add( mesh1, mesh2, mesh3);


    //to check loading progress
    const loadingManager= new THREE.LoadingManager();

    const progressBar=document.getElementById('progress-bar')

    loadingManager.onProgress=function(url,loaded,total){
        progressBar.value = (loaded/total)*100;
    }

    
    const progressBarContainer=document.querySelector('.progress-bar-container');

    loadingManager.onLoad =function (){
        console.log('Finished loading');
        progressBarContainer.style.display="none";
    }

    

    ///////////////////////////////////////////////////////////////
    /* gltf:BURGER */
    const BURtextureloader=new THREE.TextureLoader(loadingManager)
    const BURTexture = BURtextureloader.load('0810bakingwalpha.png');
    BURTexture.flipY =false;
    BURTexture.colorSpace=THREE.SRGBColorSpace;
    // BURTexture.transparent=true;
    
    const BURMaterial=new THREE.MeshBasicMaterial({map:BURTexture})
    BURMaterial.transparent=true;
    BURMaterial.depthWrite=true;
    const gltfloader= new GLTFLoader(loadingManager);

    gltfloader.load('0810hamberger for three.glb',
    ( gltf ) => {

    let model = gltf.scene;
    model.traverse((child)=>{
        child.material=BURMaterial
    })
    
    
    model.scale.set(1.4,1.4,1.4);
    model.position.set(0.1,-0.1,-0.);
    model.rotation.set(0.3,0,0);
    // console.log(model);
    mesh1.add(model)}); 

    ///////////////////////////////////////////////////////////////

    /* gltf:DONUT */
    const DONUTtextureloader=new THREE.TextureLoader()
    const DONUTtexture = DONUTtextureloader.load('donutUVbaking.png');
    DONUTtexture.flipY =false; 
    DONUTtexture.colorSpace=THREE.SRGBColorSpace;

    const DONUTMaterial=new THREE.MeshBasicMaterial({map:DONUTtexture})
    

    const gltfloader2= new GLTFLoader();
    gltfloader2.load('donut for three.glb',
    ( gltf ) => {

        let model = gltf.scene;

        for(var i=2; i< model.length; i++){
        model[i].material.roughness=0.3;
        }
        
        model.children[0].material=DONUTMaterial;
        model.children[1].material.roughness =0.5;

        model.scale.set(30,30,30);
        model.position.set(0.1,-0.1,-0.);
        model.rotation.set(0.3,0,0);
        
        
        mesh2.add(model);
        // console.log(model);
    
    }); 

    ///////////////////////////////////////////////////////////////
    /* gltf:JINJI */

        const gltfloader3= new GLTFLoader();
        gltfloader3.load('jinji for three.glb',
        ( gltf ) => {
    
            let model = gltf.scene;
    
            // model.children[8].castShadow=true;
            model.children[8].material.emissive=new THREE.Color( 0xFF7FA4 );
            model.children[8].material.emissiveIntensity = 0.6
            // o.material.emissive = new THREE.Color( 0x00ffff );
    
            model.scale.set(1,1,1);
            model.position.set(1.4,0.6,-3);
            model.rotation.set(0.3,0,0);
            
            
            mesh3.add(model);
            console.log(model);
        
        }); 

        

const sectionMeshes = [ 
    mesh1, 
    mesh2, 
    mesh3 ]



/**
 * Particle
 */

const particlesCount = 200
const position = new Float32Array(particlesCount *3)  

for(let i=0; i<particlesCount;i++){

    position[i*3 +0] = (Math.random()-0.5)*10;
    position[i*3 +1] = objectsDistance*0.5 - Math.random()* objectsDistance * sectionMeshes.length ;
    position[i*3 +2] = (Math.random()-0.7)*10;

}



const particlesGeometry=new THREE.BufferGeometry
particlesGeometry.setAttribute('position',new THREE.BufferAttribute(position,3));
const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    sizeAttenuation: true,
    size:0.05
})

const particles = new THREE.Points(particlesGeometry,particlesMaterial);
scene.add(particles);





/**
 * Light
 */

const rectLight = new THREE.RectAreaLight( 0xffffff, 8,  10, 10 );
rectLight.position.set( 1, 1, 0 );
rectLight.lookAt( 0, -10, 0 );
scene.add( rectLight );


// const rectLight2 = new THREE.RectAreaLight( 0xffffff, 1.2,  10, 10 );
// rectLight2.position.set( -1, -10, 0 );
// rectLight2.lookAt( 0, 0, 0 );
// scene.add( rectLight2 );

// const rectLightHelper = new RectAreaLightHelper( rectLight2 );
// rectLight.add( rectLightHelper );


const pointLight=new THREE.PointLight( 0xff0000, 1, 100 );
pointLight.position.set( 1, -8, 0 );
scene.add(pointLight);

const directioanlLight2=new THREE.DirectionalLight(0xffffff, 2);
directioanlLight2.position.set(-1,-10,0);
scene.add(directioanlLight2);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

const cameraGroup= new THREE.Group();
scene.add(cameraGroup);


// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true,
    antialias:true
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



/**
 * Sroll & Cursor
 */

// have a variable to save the data( for update )
let scrollY = window.scrollY;
let currentSection=0;

window.addEventListener('scroll',()=>{
    
    //the change happened on the "window scrollY"
    //so we need to update it to our variable
    scrollY= window.scrollY
    // console.log(scrollY);

    const newSection= Math.round(scrollY / sizes.height)
    // console.log(newSection)
    
    if (newSection != currentSection){
        currentSection = newSection

        // console.log(sectionMeshes[currentSection])
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration:1.5,
                ease: 'power2.inout',
                x:'+=0',
                y:'+=10',
                z:'+=0'
            })

    }


})

//cursor
const cursor={};
cursor.x=0;
cursor.y=0;

window.addEventListener('mousemove',(e)=>{

    cursor.x= e.clientX / sizes.width -0.5
    cursor.y= e.clientY / sizes.height -0.5   ;

    // console.log(cursor);
})


/**
 * Animate
 */


const clock = new THREE.Clock()
let previousTime=0;

const animate = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime= elapsedTime-previousTime
    previousTime=elapsedTime
    // console.log(deltaTime);

    camera.position.y = -scrollY/ sizes.height * objectsDistance;

    const movingX = cursor.x
    const movingY = -cursor.y

    cameraGroup.position.x+= (movingX-cameraGroup.position.x)*5 * deltaTime
    cameraGroup.position.y+= (movingY-cameraGroup.position.y)*5 * deltaTime


    // rotate mesh
    for( const mesh of sectionMeshes) {
        mesh.rotation.y += deltaTime*0.3;
        mesh.rotation.z += deltaTime*0.03;
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(animate)
}

animate()

