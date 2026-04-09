// test033

//画面サイズ
var canvasWidth = 600;
var canvasHeight = 600;

//3Dの設定用value
var renderer, scene, camera;

scene = new THREE.Scene();

// パースペクティブ
// new THREE.PerspectiveCamera(画角, アスペクト比, 描画開始距離, 描画終了距離)
camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 10000);
camera.position.set(0, 0, +1000);

renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#test033Canvas"),
});
renderer.setPixelRatio(window.devicePixelRatio);

//3Dモデル用value
var geometry, material, sphere, time;

//一回だけ呼んで初期化するよー
init();
//毎回呼んでアニメーションするよー
animate();

//初期化用仕掛けちゃん（ファンクションとかメソッドとか）
function init() {
  // Sphere の作成
  geometry = new THREE.SphereGeometry(250, 250, 250);

  //material = new THREE.MeshStandardMaterial({color: 0xFF0000});

  // 画像を読み込む
  loader = new THREE.TextureLoader();
  texture = loader.load(
    "../../static/img/texture/maybe_umasugigoke/maybe_umasugigoke04.jpeg",
  );
  // マテリアルにテクスチャーを設定
  material = new THREE.MeshStandardMaterial({
    map: texture,
  });

  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // new THREE.DirectionalLight(色)
  light = new THREE.DirectionalLight(0xffffff);
  //light.intensity = 2; // 光の強さを倍に
  // ライトの位置を変更
  light.position.set(1, 1, 1);
  //ambientLight = new THREE.AmbientLight(0xffffff);
  // シーンに追加
  scene.add(light);
  //scene.add(ambientLight);
}

//マテリアル用アニメーション用仕掛けちゃん
function animate() {
  window.requestAnimationFrame(animate);
  render();
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

//レンダリング用仕掛けちゃん
function render() {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  sphere.rotation.x += 0.001;
  sphere.rotation.y += 0.001;

  renderer.render(scene, camera);
}
