// test020

//画面サイズ
var canvasWidth = 600;
var canvasHeight = 600;
const canvas = document.querySelector("#test020Canvas");

//3Dの設定用value
var renderer, scene, camera;

scene = new THREE.Scene();

// パースペクティブ
// new THREE.PerspectiveCamera(画角, アスペクト比, 描画開始距離, 描画終了距離)
camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 10000);
camera.position.set(0, 0, +1000);
camera.position.z = 19 * 1;
camera.position.y = 15 * 1.5;
camera.position.x = 0;
camera.rotation.x -= 0.4;

// 4-2. camera controls
var controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;

renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);

//3Dモデル用value
var geometry, material, plane, time;

//一回だけ呼んで初期化するよー
init();
//毎回呼んでアニメーションするよー
animate();

//初期化用仕掛けちゃん（ファンクションとかメソッドとか）
function init() {
  // 画像を読み込む
  loader = new THREE.TextureLoader();
  texture = loader.load("../../static/img/texture/kusagoke.png");
  // マテリアルにテクスチャーを設定
  material = new THREE.MeshStandardMaterial({
    map: texture,
    alphaTest: 0.5,
    transparent: true,
    //depthWrite: true,
    //SwapSphere: false
  });

  var poslist = [];
  for (var i = 0; i < 40; i++) {
    for (var j = 0; j < 40; j++) {
      poslist.push(new THREE.Vector3(i / 4 - 5, 0.0, j / 4 - 5));
    }
  }

  //noise
  var simplexNoise = new SimplexNoise();

  for (i = 0; i < poslist.length; i++) {
    var vertex = poslist[i];
    vertex.y = simplexNoise.noise(vertex.x / 5, vertex.z / 5);
  }

  for (var a = 0; a < poslist.length; a++) {
    var random = Math.ceil(Math.random() * 100) / 50;
    //var material = new THREE.MeshNormalMaterial();
    //material = new THREE.MeshPhongMaterial({color: 0x88FFFF});
    mesh = new THREE.Mesh(this.kokeModel(poslist[a], random), material);
    mesh.material.side = THREE.DoubleSide;
    scene.add(mesh);

    // ワイヤーフレームのメッシュ作成
    var wire = new THREE.MeshBasicMaterial({
      color: 0x69821b,
      wireframe: true,
    });
    wireMesh = new THREE.Mesh(this.kokeModel(poslist[a]), wire);
    //scene.add(wireMesh);
  }

  //凸凹テスト
  /* PlaneGeometry
		width — Width along the X axis. Default is 1.
		height — Height along the Y axis. Default is 1.
		widthSegments — Optional. Default is 1.
		heightSegments — Optional. Default is 1. */
  var planegeo = new THREE.PlaneGeometry(10, 10, 16, 16);

  for (i = 0; i < planegeo.vertices.length; i++) {
    var vertex = planegeo.vertices[i];
    vertex.z = simplexNoise.noise(vertex.x / 5, vertex.y / 5);
  }
  var map1 = THREE.ImageUtils.loadTexture(
    "../../static/img/texture/kusagokemat02.jpg",
  );
  //(中略)
  dekobokokoke = new THREE.Mesh(
    planegeo,
    new THREE.MeshBasicMaterial({
      map: map1,
      //wireframe: true
    }),
  );

  dekobokokoke.rotation.x = Math.PI / -2;
  dekobokokoke.position.x += 10;
  scene.add(dekobokokoke);

  // GridHelperを作成
  GridHelper = new THREE.GridHelper(25, 10, 0xffffff, 0xffffff);
  //plane.position.y = -1;
  scene.add(GridHelper);

  // new THREE.DirectionalLight(色)
  light = new THREE.DirectionalLight(0xffffff);
  light.intensity = 2.5;
  // light3 = new THREE.DirectionalLight(0xffffff);
  // light3.intensity = 0.25;
  // ライトの位置を変更
  light.position.set(0, 20, 0);
  //light3.position.set(-10, 10, -10);
  ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 0.25;
  // シーンに追加
  scene.add(light);
  //scene.add(light3);
  scene.add(ambientLight);
}

function kokeModel(baseLocation, random) {
  let p = new THREE.Vector2(baseLocation.x, baseLocation.z);
  let bladeWid = 2;
  let v2d = bladeWid / 2;
  let vmhight = baseLocation.y + 1.8;
  let vthight = baseLocation.y + 3.5;
  let angle = random * Math.PI; //0.5 90
  let angleM = (random + 0.3) * Math.PI;
  let angleT = (random - 0.1 * random) * Math.PI;
  let cosAM = new THREE.Vector2(
    v2d * Math.cos(angleM),
    -v2d * Math.cos(angleM),
  );
  let cosAT = new THREE.Vector2(
    v2d * Math.cos(angleT),
    -v2d * Math.cos(angleT),
  );
  let sinAM = new THREE.Vector2(
    v2d * Math.sin(angleM),
    -v2d * Math.sin(angleM),
  );
  let sinAT = new THREE.Vector2(
    v2d * Math.sin(angleT),
    -v2d * Math.sin(angleT),
  );
  // ジオメトリ生成
  var kokegeo = new THREE.Geometry();
  // 頂点
  //base
  kokegeo.vertices.push(
    new THREE.Vector3(
      v2d * Math.cos(angle) + p.x,
      0.0,
      v2d * Math.sin(angle) + p.y,
    ),
  );
  kokegeo.vertices.push(
    new THREE.Vector3(
      -v2d * Math.cos(angle) + p.x,
      0.0,
      -v2d * Math.sin(angle) + p.y,
    ),
  );
  //mid
  kokegeo.vertices.push(
    new THREE.Vector3(cosAM.x + p.x, vmhight, sinAM.x + p.y),
  );
  kokegeo.vertices.push(
    new THREE.Vector3(cosAM.y + p.x, vmhight, sinAM.y + p.y),
  );
  //top
  kokegeo.vertices.push(
    new THREE.Vector3(cosAT.x + p.x, vthight, sinAT.x + p.y),
  );
  kokegeo.vertices.push(
    new THREE.Vector3(cosAT.y + p.x, vthight, sinAT.y + p.y),
  );

  // 面
  kokegeo.faces.push(new THREE.Face3(0, 2, 1));
  kokegeo.faces.push(new THREE.Face3(3, 1, 2));
  kokegeo.faces.push(new THREE.Face3(2, 4, 3));
  kokegeo.faces.push(new THREE.Face3(5, 3, 4));

  // 法線ベクトルの自動計算
  kokegeo.computeFaceNormals();
  kokegeo.computeVertexNormals();

  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(1.0, 0.0),
    new THREE.Vector2(1.0, 0.5),
    new THREE.Vector2(0.0, 0.0),
  ]);

  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 0.5),
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(1.0, 0.5),
  ]);

  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(1.0, 0.5),
    new THREE.Vector2(1.0, 1.0),
    new THREE.Vector2(0.0, 0.5),
  ]);

  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 1.0),
    new THREE.Vector2(0.0, 0.5),
    new THREE.Vector2(1.0, 1.0),
  ]);

  return kokegeo;
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

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  //mesh.rotation.y += 0.003;
  //mesh.rotation.y += 0.01;
  //wireMesh.rotation.y += 0.003;
  //wireMesh.rotation.y += 0.01;

  //plane.rotation.x += 0.01;

  renderer.render(scene, camera);
}
