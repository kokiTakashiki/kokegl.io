// test037

//画面サイズ
var canvasWidth = 600;
var canvasHeight = 600;
const canvas = document.querySelector("#test037Canvas");

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

// 4-2. camera controls
var controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;

renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);

//3Dモデル用value
var kokegeo, material, plane, time;

//一回だけ呼んで初期化するよー
init();
//毎回呼んでアニメーションするよー
animate();

//初期化用仕掛けちゃん（ファンクションとかメソッドとか）
function init() {
  // 画像を読み込む
  loader = new THREE.TextureLoader();
  texture = loader.load("../../static/img/texture/umasgigoke_modoki.png");
  // マテリアルにテクスチャーを設定
  material = new THREE.MeshStandardMaterial({
    map: texture,
    alphaTest: 0.4,
    //transparent: true,
    //depthWrite: true,
    //SwapSphere: false
  });

  var kokehani = new THREE.Vector2(40, 40); //範囲設定　xかけるyで生成数
  var kokemitu = 2;
  var kokemargin = new THREE.Vector2(-10, -10);
  var radius = 20;

  var poslist = [];
  for (var i = 0; i < kokehani.x; i++) {
    for (var j = 0; j < kokehani.y; j++) {
      var cx = i - kokehani.x / 2;
      var cz = j - kokehani.y / 2;
      var dist = Math.sqrt(cx * cx + cz * cz);
      if (dist <= radius) {
        poslist.push(
          new THREE.Vector3(
            i / kokemitu + kokemargin.x,
            0.0,
            j / kokemitu + kokemargin.y,
          ),
        );
      }
    }
  }

  //noise
  var simplexNoise = new SimplexNoise();

  for (i = 0; i < poslist.length; i++) {
    var vertex = poslist[i];
    vertex.y = simplexNoise.noise(vertex.x / 5, vertex.z / 5);
  }

  for (var a = 0; a < poslist.length; a++) {
    var random = Math.ceil(Math.random() * 100) / 100;
    //var material = new THREE.MeshNormalMaterial();
    //material = new THREE.MeshPhongMaterial({color: 0x88FFFF});
    mesh = new THREE.Mesh(this.kokeModel2(poslist[a], random), material);
    mesh.material.side = THREE.DoubleSide;
    scene.add(mesh);

    // ワイヤーフレームのメッシュ作成
    // var wire = new THREE.MeshBasicMaterial({color: 0x69821b, wireframe: true});
    // wireMesh = new THREE.Mesh(this.kokeModel2(poslist[a]), wire);
    // scene.add(wireMesh);
  }

  // GridHelperを作成
  GridHelper = new THREE.GridHelper(25, 10, 0xffffff, 0xffffff);
  //plane.position.y = -1;
  //scene.add(GridHelper);

  //フォグ
  //scene.fog = new THREE.Fog(0x000000, 50, 2000);

  // new THREE.DirectionalLight(色)
  light = new THREE.DirectionalLight(0xffffff);
  light.intensity = 2.5;
  // light3 = new THREE.DirectionalLight(0xffffff);
  // light3.intensity = 0.25;
  ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 0.15;

  // new THREE.SpotLight(色, 光の強さ, 距離, 照射角, ボケ具合, 減衰率)
  spotlight = new THREE.SpotLight(0xffffff, 3.8, 30, Math.PI / 4, 10, 0.25);

  // ライトの位置を変更
  light.position.set(0, 20, 0);
  //light3.position.set(-10, 10, -10);
  spotlight.position.set(0, 15, 0);

  // シーンに追加
  //scene.add(light);
  //scene.add(light3);
  scene.add(ambientLight);
  scene.add(spotlight);
}

function kokeModel2(baseLocation, random) {
  let p = new THREE.Vector2(baseLocation.x, baseLocation.z);
  let bladeWid = 2;
  let v2d = bladeWid / 2;
  let vmhight = baseLocation.y + 1.8;
  let vthight = baseLocation.y + 3.5;
  let angle = random * Math.PI; //0.5 90
  let angleM = (random + 0.3) * Math.PI;
  let angleT = (random - 0.1 * random) * Math.PI;
  let cosAF = Math.cos(angle);
  let cosAM = Math.cos(angleM);
  let cosAT = Math.cos(angleT);
  let sinAF = Math.cos(angle);
  let sinAM = Math.sin(angleM);
  let sinAT = Math.sin(angleT);
  // ジオメトリ生成
  var kokegeo = new THREE.Geometry();
  // 頂点
  //center
  kokegeo.vertices.push(new THREE.Vector3(0 * cosAF + p.x, 0, 0 * sinAF + p.y)); //0
  kokegeo.vertices.push(
    new THREE.Vector3(0 * cosAM + p.x, vmhight, 0 * sinAM + p.y),
  ); //1
  kokegeo.vertices.push(
    new THREE.Vector3(0 * cosAT + p.x, vthight, -0.2 * sinAT + p.y),
  ); //2
  //koke1
  kokegeo.vertices.push(new THREE.Vector3(1 * cosAF + p.x, 0, 0 * sinAF + p.y)); //3
  kokegeo.vertices.push(
    new THREE.Vector3(1 * cosAM + p.x, vmhight, 0 * sinAM + p.y),
  ); //4
  kokegeo.vertices.push(
    new THREE.Vector3(0.5 * cosAT + p.x, vthight, -0.9 * sinAT + p.y),
  ); //5
  //koke2
  kokegeo.vertices.push(
    new THREE.Vector3(-0.5 * cosAF + p.x, 0, 0.9 * sinAF + p.y),
  ); //6
  kokegeo.vertices.push(
    new THREE.Vector3(-0.5 * cosAM + p.x, vmhight, 0.9 * sinAM + p.y),
  ); //7
  kokegeo.vertices.push(
    new THREE.Vector3(0.5 * cosAT + p.x, vthight, 0.9 * sinAT + p.y),
  ); //8
  //koke3
  kokegeo.vertices.push(
    new THREE.Vector3(-0.5 * cosAF + p.x, 0, -0.9 * sinAF + p.y),
  ); //9
  kokegeo.vertices.push(
    new THREE.Vector3(-0.5 * cosAM + p.x, vmhight, -0.9 * sinAM + p.y),
  ); //10
  kokegeo.vertices.push(
    new THREE.Vector3(-1 * cosAT + p.x, vthight, 0 * sinAT + p.y),
  ); //11

  // 面
  //koke1
  kokegeo.faces.push(new THREE.Face3(3, 4, 0));
  kokegeo.faces.push(new THREE.Face3(0, 4, 1));
  kokegeo.faces.push(new THREE.Face3(1, 4, 5));
  kokegeo.faces.push(new THREE.Face3(5, 2, 1));
  //koke2
  kokegeo.faces.push(new THREE.Face3(7, 6, 0));
  kokegeo.faces.push(new THREE.Face3(7, 0, 1));
  kokegeo.faces.push(new THREE.Face3(8, 7, 1));
  kokegeo.faces.push(new THREE.Face3(8, 1, 2));
  //koke3
  kokegeo.faces.push(new THREE.Face3(10, 9, 0));
  kokegeo.faces.push(new THREE.Face3(10, 0, 1));
  kokegeo.faces.push(new THREE.Face3(11, 10, 1));
  kokegeo.faces.push(new THREE.Face3(11, 1, 2));

  // 法線ベクトルの自動計算
  kokegeo.computeFaceNormals();
  kokegeo.computeVertexNormals();

  //koke1
  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(1.0, 0.0),
    new THREE.Vector2(1.0, 0.5),
    new THREE.Vector2(0.5, 0.0),
  ]);
  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(0.5, 0.0),
    new THREE.Vector2(1.0, 0.5),
    new THREE.Vector2(0.5, 0.5),
  ]);
  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(1.0, 0.5),
    new THREE.Vector2(1.0, 1.0),
  ]);
  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(1.0, 1.0),
    new THREE.Vector2(0.5, 1.0),
    new THREE.Vector2(0.5, 0.5),
  ]);

  //koke2
  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(0.5, 0.0),
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.5, 0.0),
  ]);
  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 0.5),
    new THREE.Vector2(0.5, 0.0),
    new THREE.Vector2(0.5, 0.5),
  ]);
  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 1.0),
    new THREE.Vector2(0.0, 0.5),
    new THREE.Vector2(0.5, 0.5),
  ]);
  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 1.0),
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(0.5, 1.0),
  ]);

  //koke3
  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(0.5, 0.0),
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.5, 0.0),
  ]);
  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 0.5),
    new THREE.Vector2(0.5, 0.0),
    new THREE.Vector2(0.5, 0.5),
  ]);
  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 1.0),
    new THREE.Vector2(0.0, 0.5),
    new THREE.Vector2(0.5, 0.5),
  ]);
  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 1.0),
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(0.5, 1.0),
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
