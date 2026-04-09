const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setClearColor(new THREE.Color(), 0);
renderer.setSize(600, 600);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0px";
renderer.domElement.style.left = "0px";
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.visible = false;
const camera = new THREE.Camera();
//scene.add(camera);

// put the camera on a pole (parent it to an object)
// so we can spin the pole to move the camera around the scene
const cameraPole = new THREE.Object3D();
scene.add(cameraPole);
cameraPole.add(camera);

{
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  camera.add(light);
}

const arToolkitSource = new THREEx.ArToolkitSource({
  sourceType: "webcam",
});

arToolkitSource.init(() => {
  setTimeout(() => {
    onResize();
  }, 2000);
});

addEventListener("resize", () => {
  onResize();
});

function onResize() {
  arToolkitSource.onResizeElement();
  arToolkitSource.copyElementSizeTo(renderer.domElement);
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
  }
}

const arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: "../../static/data/camera_para.dat",
  detectionMode: "mono",
});

arToolkitContext.init(() => {
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

const arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
  type: "pattern",
  //patternUrl: '../../static/data/patt.hiro',
  patternUrl: "../../static/data/pattern-kokeglar.patt",
  changeMatrixMode: "cameraTransformMatrix",
});

// const mesh = new THREE.Mesh(
// 	new THREE.CubeGeometry(1, 1, 1),
// 	new THREE.MeshNormalMaterial(),
// );
// mesh.position.y = 1.0;
// scene.add(mesh);

//一回だけ呼んで初期化するよー
//init();

//初期化用仕掛けちゃん（ファンクションとかメソッドとか）

const boxWidth = 0.1;
const boxHeight = 0.1;
const boxDepth = 0.1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

function rand(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min + (max - min) * Math.random();
}

function randomColor() {
  return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
}

const numObjects = 100;
for (let i = 0; i < numObjects; ++i) {
  const material = new THREE.MeshPhongMaterial({
    color: randomColor(),
  });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.set(rand(-2, 2), rand(0, 4), rand(-2, 2));
  cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
  cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
}

class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera, time) {
    // restore the color if there is a picked object
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }

    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
      // save its color
      this.pickedObjectSavedColor =
        this.pickedObject.material.emissive.getHex();
      // set its emissive color to flashing red/yellow
      this.pickedObject.material.emissive.setHex(
        (time * 8) % 2 > 1 ? 0xffff00 : 0xff0000,
      );
    }
  }
}

const pickPosition = { x: 0, y: 0 };
const pickHelper = new PickHelper();
clearPickPosition();

var time;
//const clock = new THREE.Clock();
requestAnimationFrame(function animate() {
  requestAnimationFrame(animate);
  if (arToolkitSource.ready) {
    arToolkitContext.update(arToolkitSource.domElement);
    scene.visible = camera.visible;
  }

  ///"performance.now()"で時間をゲット！
  time = performance.now() * 0.0001;

  cameraPole.rotation.y = time * 0.1;
  pickHelper.pick(pickPosition, scene, camera, time);
  renderer.render(scene, camera);
});

function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) * canvas.width) / rect.width,
    y: ((event.clientY - rect.top) * canvas.height) / rect.height,
  };
}

function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.width) * 2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1; // note we flip Y
}

function clearPickPosition() {
  // unlike the mouse which always has a position
  // if the user stops touching the screen we want
  // to stop picking. For now we just pick a value
  // unlikely to pick something
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}
//window.addEventListener('mousemove', setPickPosition);
//window.addEventListener('mouseout', clearPickPosition);
//window.addEventListener('mouseleave', clearPickPosition);

window.addEventListener(
  "touchstart",
  (event) => {
    // prevent the window from scrolling
    event.preventDefault();
    setPickPosition(event.touches[0]);
  },
  { passive: false },
);

window.addEventListener("touchmove", (event) => {
  setPickPosition(event.touches[0]);
});

window.addEventListener("touchend", clearPickPosition);
