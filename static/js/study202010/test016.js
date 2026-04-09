// test016

//画面サイズ
var canvasWidth = 600;
var canvasHeight = 600;
const canvas = document.querySelector("#test016Canvas");

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
  uniforms = {
    time: { type: "f", value: 1.0 },
  };

  //外部からシェーダを読み込む
  var threeVertexShaderText = null,
    fragmentShaderText = null;

  $.ajax({
    async: false,
    url: "../../static/shaders/koke_vertex001.vs",
    async: false,
    cache: false,
    error: function (jqxhr, status, exception) {
      console.debug("jqxhr", jqxhr);
      console.debug("status", status);
      console.debug("exception", exception);
    },
  })
    .done(function (response) {
      threeVertexShaderText = response;
      //console.log(threeVertexShaderText)
    })
    .fail(function () {
      console.log("error");
    });

  $.ajax({
    async: false,
    url: "../../static/shaders/koke_frag001.fs",
    dataType: "html",
    async: false,
    cache: false,
    error: function (jqxhr, status, exception) {
      console.debug("jqxhr", jqxhr);
      console.debug("status", status);
      console.debug("exception", exception);
    },
  })
    .done(function (response) {
      fragmentShaderText = response;
      //console.log(fragmentShaderText)
    })
    .fail(function () {
      console.log("error");
    });

  console.log("vert " + threeVertexShaderText);
  console.log("frag " + fragmentShaderText);

  material = new THREE.RawShaderMaterial({
    uniforms: uniforms,
    vertexShader: threeVertexShaderText,
    fragmentShader: fragmentShaderText,
  });

  var poslist = [];
  for (var i = 0; i < 20; i++) {
    for (var j = 0; j < 20; j++) {
      poslist.push(new THREE.Vector3(i / 2 - 5, 0.0, j / 2 - 5));
    }
  }
  console.log(poslist);

  for (var a = 0; a < poslist.length; a++) {
    var random = Math.ceil(Math.random() * 100) / 50;
    //var material = new THREE.MeshNormalMaterial();
    //material = new THREE.MeshPhongMaterial({color: 0x88FFFF});
    mesh = new THREE.Mesh(this.kokeModel(poslist[a], random), material);
    mesh.material.side = THREE.DoubleSide;
    scene.add(mesh);
  }

  // 地面を作成
  // ground = new THREE.GridHelper(300, 10, 0xffffff, 0xffffff);
  // //plane.position.y = -1;
  // scene.add(ground);

  // new THREE.DirectionalLight(色)
  light = new THREE.DirectionalLight(0xffffff);
  light.intensity = 2.5;
  // light3 = new THREE.DirectionalLight(0xffffff);
  // light3.intensity = 0.25;
  // ライトの位置を変更
  light.position.set(0, 20, 0);
  //light3.position.set(-10, 10, -10);
  //ambientLight = new THREE.AmbientLight(0xffffff);
  // シーンに追加
  scene.add(light);
  //scene.add(light3);
  //scene.add(ambientLight);
}

function kokeModel(baseLocation, random) {
  // ジオメトリ生成
  var kokegeo = new THREE.Geometry();
  // 頂点
  //base
  kokegeo.vertices.push(
    new THREE.Vector3(
      0.25 + baseLocation.x + random,
      0 + baseLocation.y,
      0 + baseLocation.z,
    ),
  );
  kokegeo.vertices.push(
    new THREE.Vector3(
      -0.25 + baseLocation.x + random,
      0 + baseLocation.y,
      0.5 + baseLocation.z,
    ),
  );
  //mid
  kokegeo.vertices.push(
    new THREE.Vector3(
      0.25 + baseLocation.x + random,
      1.8 + baseLocation.y,
      -1.5 + baseLocation.z + random,
    ),
  );
  kokegeo.vertices.push(
    new THREE.Vector3(
      -0.25 + baseLocation.x + random,
      1.8 + baseLocation.y,
      -0.5 + baseLocation.z + random,
    ),
  );
  //top
  kokegeo.vertices.push(
    new THREE.Vector3(
      0.25 + baseLocation.x + random,
      3.5 + baseLocation.y,
      -1.5 + baseLocation.z + random,
    ),
  );
  kokegeo.vertices.push(
    new THREE.Vector3(
      -0.25 + baseLocation.x + random,
      3.5 + baseLocation.y,
      -1.5 + baseLocation.z + random,
    ),
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
