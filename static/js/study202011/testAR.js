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
scene.add(camera);

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
init();

//初期化用仕掛けちゃん（ファンクションとかメソッドとか）
function init() {
  // 画像を読み込む
  loader = new THREE.TextureLoader();
  texture = loader.load("../../static/img/texture/umasugigoke_modoki01.png");
  // マテリアルにテクスチャーを設定
  material = new THREE.MeshPhysicalMaterial({
    map: texture,
    //alphaTest: 0.25,
    blending: THREE.AdditiveBlending,
    roughness: 1.0,
    roughnessMap: texture,
    reflectivity: 1.0,
    //transparent: true,
    depthWrite: false,
  });
  loader2 = new THREE.TextureLoader();
  texture2 = loader2.load("../../static/img/texture/umasugigoke_modoki02.png");
  // マテリアルにテクスチャーを設定
  material2 = new THREE.MeshPhysicalMaterial({
    map: texture2,
    //alphaTest: 0.25,
    blending: THREE.AdditiveBlending,
    roughness: 1.0,
    roughnessMap: texture2,
    reflectivity: 1.0,
    //transparent: true,
    depthWrite: false,
  });

  var kokehani = new THREE.Vector2(20, 20); //範囲設定　xかけるyで生成数
  var kokemitu = 1;
  var kokemargin = new THREE.Vector2(-10, -10);
  var radius = 10;

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
    mesh2 = new THREE.Mesh(this.kokeModel3(poslist[a], random), material2);
    mesh2.material.side = THREE.DoubleSide;
    scene.add(mesh2);

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
  //light = new THREE.DirectionalLight(0xffffff);
  //light.intensity = 2.5;
  // light3 = new THREE.DirectionalLight(0xffffff);
  // light3.intensity = 0.25;
  ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 0.9;

  // new THREE.SpotLight(色, 光の強さ, 距離, 照射角, ボケ具合, 減衰率)
  spotlight = new THREE.SpotLight(0xffffff, 1.8, 30, Math.PI / 4, 10, 0.5);

  // ライトの位置を変更
  //light.position.set(0, 20, 0);
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
function kokeModel3(baseLocation, random) {
  let p = new THREE.Vector2(baseLocation.x, baseLocation.z);
  let bladeWid = 2;
  let v2d = bladeWid / 2;
  let vmhight = baseLocation.y + 1.8;
  let vthight = baseLocation.y + 3.5;
  let hight = baseLocation.y + 2.5;
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
  kokegeo.vertices.push(
    new THREE.Vector3(v2d * cosAM + p.x, hight, v2d * sinAM + p.y),
  ); //0
  kokegeo.vertices.push(
    new THREE.Vector3(-v2d * sinAM + p.x, hight, v2d * cosAM + p.y),
  ); //1
  kokegeo.vertices.push(
    new THREE.Vector3(v2d * cosAM + p.x, hight, -v2d * sinAM + p.y),
  ); //2
  kokegeo.vertices.push(
    new THREE.Vector3(-v2d * sinAM + p.x, hight, -v2d * cosAM + p.y),
  ); //3

  // 面
  kokegeo.faces.push(new THREE.Face3(2, 1, 0));
  kokegeo.faces.push(new THREE.Face3(3, 1, 2));

  // 法線ベクトルの自動計算
  //kokegeo.computeFaceNormals();
  kokegeo.computeVertexNormals();

  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(1.0, 1.0),
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(1.0, 0.0),
  ]);

  kokegeo.faceVertexUvs[0].push([
    new THREE.Vector2(0.0, 1.0),
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(1.0, 1.0),
  ]);

  return kokegeo;
}

//const clock = new THREE.Clock();
requestAnimationFrame(function animate() {
  requestAnimationFrame(animate);
  if (arToolkitSource.ready) {
    arToolkitContext.update(arToolkitSource.domElement);
    scene.visible = camera.visible;
  }
  //const delta = clock.getDelta();
  //mesh.rotation.x += delta * 1.0;
  //mesh.rotation.y += delta * 1.5;
  renderer.render(scene, camera);
});
