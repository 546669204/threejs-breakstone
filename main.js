import * as THREE from 'https://cdn.skypack.dev/three';
import {
  TTFLoader
} from 'https://cdn.skypack.dev/three/examples/jsm/loaders/TTFLoader.js';
import {
  OrbitControls
} from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
import {
  GUI
} from 'https://cdn.skypack.dev/three/examples/jsm/libs/dat.gui.module.js';
import {
  CSG
} from "https://cdn.skypack.dev/three-csg-ts"

let container;
let camera, scene, renderer;
let group, material;
const size = 70;
let font = null;
const data = {
  text: '魑魅魍魉'
};
init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  // CAMERA
  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
  camera.position.set(0, 400, 700);

  // SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 250, 1400);
  const axesHelper = new THREE.AxesHelper(100);
  scene.add(axesHelper);

  // LIGHTS
  const light = new THREE.AmbientLight(0xffffff); // soft white light
  scene.add(light);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  scene.add(directionalLight);
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true
  });
  group = new THREE.Group();
  group.position.y = 100;
  scene.add(group);
  const loader = new TTFLoader();
  loader.load('WenQuanDengKuanWeiMiHei-1.ttf', function(json) {
    font = new THREE.Font(json);
    createText2();
  });
  // RENDERER
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  // controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.minDistance = 1000;
  controls.maxDistance = 5000;

  const gui = new GUI();


  function generateGeometry() {
    createText2();
  }

  gui.add(data, 'text').onFinishChange(generateGeometry);
  // EVENTS
  container.style.touchAction = 'none';
  window.addEventListener('resize', onWindowResize);
}

function createText2() {
  group.clear();
  var text = data.text;
  var ms = text.split("").map((it, i) => {
      var textGeo = new THREE.TextGeometry(it, {
        font: font,
        size: size,
        height: size * 1.5,
      });
      textGeo.computeBoundingBox();
      textGeo.computeVertexNormals();
      textGeo.center();
      var textMesh1 = new THREE.Mesh(textGeo, material);
      textMesh1.rotateY(Math.PI * i / text.length)
      textMesh1.updateMatrix();
      return textMesh1
    })
    // ms.forEach(it=>{
    //   group.add(it);
    // })
  var breakstone = ms.reduce((acc, it) => {
    if (!acc) return it;
    return CSG.intersect(acc || it, it)
  }, null);
  group.add(breakstone);
}
//
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}