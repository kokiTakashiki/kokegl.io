// test034

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
camera.position.z = 6;
camera.position.y = 2;

renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#test034Canvas"),
});
renderer.setPixelRatio(window.devicePixelRatio);

//3Dモデル用value
var geometry, material, plane, time;

//一回だけ呼んで初期化するよー
init();
//毎回呼んでアニメーションするよー
animate();

//初期化用仕掛けちゃん（ファンクションとかメソッドとか）
function init() {
  // ジオメトリ生成
  geometry = new THREE.Geometry();

  // 頂点
  //center
  geometry.vertices.push(new THREE.Vector3(0, 0, 0)); //0
  geometry.vertices.push(new THREE.Vector3(0, 2, 0)); //1
  geometry.vertices.push(new THREE.Vector3(0, 4, 0)); //2
  //koke1
  geometry.vertices.push(new THREE.Vector3(1, 0, 0)); //3
  geometry.vertices.push(new THREE.Vector3(1, 2, 0)); //4
  geometry.vertices.push(new THREE.Vector3(1, 4, 0)); //5
  //koke2
  geometry.vertices.push(new THREE.Vector3(-0.5, 0, 0.9)); //6
  geometry.vertices.push(new THREE.Vector3(-0.5, 2, 0.9)); //7
  geometry.vertices.push(new THREE.Vector3(-0.5, 4, 0.9)); //8
  //koke3
  geometry.vertices.push(new THREE.Vector3(-0.5, 0, -0.9)); //9
  geometry.vertices.push(new THREE.Vector3(-0.5, 2, -0.9)); //10
  geometry.vertices.push(new THREE.Vector3(-0.5, 4, -0.9)); //11

  // 面
  //koke1
  geometry.faces.push(new THREE.Face3(3, 4, 0));
  geometry.faces.push(new THREE.Face3(0, 4, 1));
  geometry.faces.push(new THREE.Face3(1, 4, 5));
  geometry.faces.push(new THREE.Face3(5, 2, 1));
  //koke2
  geometry.faces.push(new THREE.Face3(0, 1, 6));
  geometry.faces.push(new THREE.Face3(6, 1, 7));
  geometry.faces.push(new THREE.Face3(1, 2, 7));
  geometry.faces.push(new THREE.Face3(7, 2, 8));
  //koke3
  geometry.faces.push(new THREE.Face3(0, 1, 9));
  geometry.faces.push(new THREE.Face3(9, 1, 10));
  geometry.faces.push(new THREE.Face3(1, 2, 10));
  geometry.faces.push(new THREE.Face3(10, 2, 11));

  // 法線ベクトルの自動計算
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  //koke1
  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(1.0, 0.0),
    new THREE.Vector2(1.0, 0.5),
    new THREE.Vector2(0.5, 0.0),
  ]);
  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(0.5, 0.0),
    new THREE.Vector2(1.0, 0.5),
    new THREE.Vector2(0.5, 0.5),
  ]);
  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(1.0, 0.5),
    new THREE.Vector2(1.0, 1.0),
  ]);
  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(1.0, 1.0),
    new THREE.Vector2(0.5, 1.0),
    new THREE.Vector2(0.5, 0.5),
  ]);

  //koke2
  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(0.5, 0.0),
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(0.0, 0.0),
  ]);
  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(0.0, 0.5),
  ]);
  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(0.5, 1.0),
    new THREE.Vector2(0.0, 0.5),
  ]);
  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 0.5),
    new THREE.Vector2(0.5, 1.0),
    new THREE.Vector2(0.0, 1.0),
  ]);

  //koke3
  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(0.5, 0.0),
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(0.0, 0.0),
  ]);
  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(0.0, 0.5),
  ]);
  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(0.5, 1.0),
    new THREE.Vector2(0.0, 0.5),
  ]);
  geometry.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 0.5),
    new THREE.Vector2(0.5, 1.0),
    new THREE.Vector2(0.0, 1.0),
  ]);

  // 八面体のメッシュ作成
  // 画像を読み込む
  loader = new THREE.TextureLoader();
  texture = loader.load("../../static/img/texture/hari02.png");
  // マテリアルにテクスチャーを設定
  material = new THREE.MeshStandardMaterial({
    map: texture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  //var material = new THREE.MeshNormalMaterial();
  //material = new THREE.MeshPhongMaterial({color: 0x88FFFF});
  mesh = new THREE.Mesh(geometry, material);
  mesh.material.side = THREE.DoubleSide;
  scene.add(mesh);

  // ワイヤーフレームのメッシュ作成
  var wire = new THREE.MeshBasicMaterial({ color: 0x69821b, wireframe: true });
  wireMesh = new THREE.Mesh(geometry, wire);
  scene.add(wireMesh);

  // 地面を作成
  // ground = new THREE.GridHelper(300, 10, 0xffffff, 0xffffff);
  // //plane.position.y = -1;
  // scene.add(ground);

  // new THREE.DirectionalLight(色)
  light = new THREE.DirectionalLight(0xffffff);
  light.intensity = 0.5;
  light2 = new THREE.DirectionalLight(0xffffff);
  light2.intensity = 0.5;
  // ライトの位置を変更
  light.position.set(1, 1, 1);
  light2.position.set(-1, -1, 1);
  //ambientLight = new THREE.AmbientLight(0xffffff);
  // シーンに追加
  scene.add(light);
  scene.add(light2);
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

  mesh.rotation.y += 0.003;
  //mesh.rotation.y += 0.01;
  wireMesh.rotation.y += 0.003;
  //wireMesh.rotation.y += 0.01;

  //plane.rotation.x += 0.01;

  renderer.render(scene, camera);
}
