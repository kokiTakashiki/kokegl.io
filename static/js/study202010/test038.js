// test038

//画面サイズ
var canvasWidth = 600;
var canvasHeight = 600;
const canvas = document.querySelector("#test038Canvas");

//3Dの設定用value
var renderer, scene, camera;

scene = new THREE.Scene();

// パースペクティブ
// new THREE.PerspectiveCamera(画角, アスペクト比, 描画開始距離, 描画終了距離)
camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 10000);
camera.position.set(0, 0, +1000);
camera.position.z = 6;
camera.position.y = 10;

// 4-2. camera controls
var controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;

renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);

//3Dモデル用value
var geometry, geometry2, material, plane, time;

//一回だけ呼んで初期化するよー
init();
//毎回呼んでアニメーションするよー
animate();

//初期化用仕掛けちゃん（ファンクションとかメソッドとか）
function init() {
  // ジオメトリ生成
  geometry = new THREE.Geometry();

  // 頂点
  geometry.vertices.push(new THREE.Vector3(1, 0, 0));
  geometry.vertices.push(new THREE.Vector3(-1, 0, 0));
  geometry.vertices.push(new THREE.Vector3(1, 2, 0));
  geometry.vertices.push(new THREE.Vector3(-1, 2, 0));
  geometry.vertices.push(new THREE.Vector3(1, 4, 0));
  geometry.vertices.push(new THREE.Vector3(-1, 4, 0));

  // 面
  geometry.faces.push(new THREE.Face3(0, 2, 1));
  geometry.faces.push(new THREE.Face3(3, 1, 2));
  geometry.faces.push(new THREE.Face3(2, 4, 3));
  geometry.faces.push(new THREE.Face3(5, 3, 4));

  // 法線ベクトルの自動計算
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(1.0, 0.0),
    new THREE.Vector2(1.0, 0.5),
    new THREE.Vector2(0.0, 0.0),
  ]);

  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 0.5),
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(1.0, 0.5),
  ]);

  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(1.0, 0.5),
    new THREE.Vector2(1.0, 1.0),
    new THREE.Vector2(0.0, 0.5),
  ]);

  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 1.0),
    new THREE.Vector2(0.0, 0.5),
    new THREE.Vector2(1.0, 1.0),
  ]);

  // ジオメトリ生成
  geometry2 = new THREE.Geometry();

  // 頂点
  geometry2.vertices.push(new THREE.Vector3(1, 3, 1)); //0
  geometry2.vertices.push(new THREE.Vector3(-1, 3, 1)); //1
  geometry2.vertices.push(new THREE.Vector3(1, 3, -1)); //2
  geometry2.vertices.push(new THREE.Vector3(-1, 3, -1)); //3

  // 面
  geometry2.faces.push(new THREE.Face3(2, 1, 0));
  geometry2.faces.push(new THREE.Face3(3, 1, 2));

  // 法線ベクトルの自動計算
  geometry2.computeFaceNormals();
  geometry2.computeVertexNormals();

  geometry2.faceVertexUvs[0].push([
    new THREE.Vector2(1.0, 1.0),
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(1.0, 0.0),
  ]);

  geometry2.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 1.0),
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(1.0, 1.0),
  ]);

  // 八面体のメッシュ作成
  // 画像を読み込む
  loader = new THREE.TextureLoader();
  texture = loader.load("../../static/img/texture/umasugigoke_modoki01.png");
  // マテリアルにテクスチャーを設定
  material = new THREE.MeshStandardMaterial({
    map: texture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  loader2 = new THREE.TextureLoader();
  texture2 = loader2.load("../../static/img/texture/umasugigoke_modoki02.png");
  // マテリアルにテクスチャーを設定
  material2 = new THREE.MeshStandardMaterial({
    map: texture2,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  //var material = new THREE.MeshNormalMaterial();
  //material = new THREE.MeshPhongMaterial({color: 0x88FFFF});
  mesh = new THREE.Mesh(geometry, material);
  mesh.material.side = THREE.DoubleSide;
  scene.add(mesh);
  mesh2 = new THREE.Mesh(geometry2, material2);
  mesh2.material.side = THREE.DoubleSide;
  scene.add(mesh2);

  // ワイヤーフレームのメッシュ作成
  var wire = new THREE.MeshBasicMaterial({ color: 0x69821b, wireframe: true });
  wireMesh = new THREE.Mesh(geometry, wire);
  scene.add(wireMesh);
  wireMesh2 = new THREE.Mesh(geometry2, wire);
  scene.add(wireMesh2);

  // 地面を作成
  // ground = new THREE.GridHelper(300, 10, 0xffffff, 0xffffff);
  // //plane.position.y = -1;
  // scene.add(ground);

  // new THREE.DirectionalLight(色)
  // light = new THREE.DirectionalLight(0xffffff);
  // light.intensity = 0.5;
  // light2 = new THREE.DirectionalLight(0xffffff);
  // light2.intensity = 0.5;

  // new THREE.SpotLight(色, 光の強さ, 距離, 照射角, ボケ具合, 減衰率)
  spotlight = new THREE.SpotLight(0xffffff, 1.8, 30, Math.PI / 4, 10, 0.5);

  // ライトの位置を変更
  // light.position.set(1, 1, 1);
  // light2.position.set(-1, -1, 1);
  spotlight.position.set(0, 15, 0);

  ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 0.9;
  // シーンに追加
  // scene.add(light);
  // scene.add(light2);
  scene.add(ambientLight);
  scene.add(spotlight);
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

  mesh.rotation.y += 0.003;
  wireMesh.rotation.y += 0.003;
  mesh2.rotation.y += 0.003;
  wireMesh2.rotation.y += 0.003;
  //wireMesh.rotation.y += 0.01;

  //plane.rotation.x += 0.01;

  renderer.render(scene, camera);
}
