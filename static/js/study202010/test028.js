// test028

//画面サイズ
var canvasWidth = 600;
var canvasHeight = 600;
const canvas = document.querySelector("#test028Canvas");

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
var geometry, material, pertmaterial, plane, time;

//一回だけ呼んで初期化するよー
init();
//毎回呼んでアニメーションするよー
animate();

//初期化用仕掛けちゃん（ファンクションとかメソッドとか）
function init() {
  var random = Math.round(Math.random() * 1);

  uniforms = {
    time: { type: "f", value: 1.0 },
  };

  // //外部からシェーダを読み込む
  // var threeVertexShaderText = null, fragmentShaderText = null;

  // $.ajax({
  //     async: false,
  //     url: '../../static/shaders/koke_vertex001.vs',
  //     async: false,
  //     cache: false,
  //     error: function(jqxhr, status, exception) {
  //       console.debug('jqxhr', jqxhr);
  //       console.debug('status', status);
  //       console.debug('exception', exception);
  //     }
  // }).done(function(response) {
  //     threeVertexShaderText = response;
  //     //console.log(threeVertexShaderText)
  // }).fail(function () {console.log('error');});

  // $.ajax({
  //     async: false,
  //     url: '../../static/shaders/originlight.fs',
  //     dataType: 'html',
  //     async: false,
  //     cache: false,
  //     error: function(jqxhr, status, exception) {
  //       console.debug('jqxhr', jqxhr);
  //       console.debug('status', status);
  //       console.debug('exception', exception);
  //     }
  // }).done(function(response) {
  //     fragmentShaderText = response;
  //     //console.log(fragmentShaderText)
  // }).fail(function () {console.log('error');});

  // console.log("vert " + threeVertexShaderText);
  // console.log("frag " + fragmentShaderText);

  // material = new THREE.RawShaderMaterial({
  //     uniforms       : uniforms,
  //     vertexShader   : threeVertexShaderText,
  // 	fragmentShader : fragmentShaderText,
  // 	blending: THREE.AdditiveBlending,
  // 	transparent: true,
  // 	depthWrite: false
  // });

  // var poslist = []
  // for(var i = 0;  i < 20;  i++){
  // 	for(var j = 0;  j < 20;  j++){
  // 		poslist.push(new THREE.Vector3(i/2-5,0.0,j/2-5))
  // 	}
  // }

  // for(var a = 0;  a < poslist.length;  a++){
  // 	var random = Math.ceil( Math.random()*100 )/50;
  // 	//var material = new THREE.MeshNormalMaterial();
  // 	//material = new THREE.MeshPhongMaterial({color: 0x88FFFF});
  // 	mesh = new THREE.Mesh(this.kokeModel(poslist[a], random), material);
  // 	mesh.material.side = THREE.DoubleSide;
  // 	scene.add(mesh);
  // }

  pertgeo = new THREE.BufferGeometry();

  // polygon indexes
  // 3 -- 2
  // |    |
  // 0 -- 1
  const index = [];
  const vertices = [];
  const uvs = [];
  const offsets = [];
  const indices = [];
  const sizes = [];
  const colors = [];

  const particleNum = 2000;
  const randomOffsetRange = 22;
  const sizeRange = 1.1;
  const sizeMin = 0.1;

  // 頂点ごとにデータを生成
  for (let i = 0; i < particleNum; i++) {
    // 座標をランダムに生成
    const px = Math.random() * randomOffsetRange - randomOffsetRange * 0.5;
    const py = Math.random() * randomOffsetRange - randomOffsetRange * 0.5;
    const pz = Math.random() * randomOffsetRange - randomOffsetRange * 0.5;

    // 大きさをランダムに生成
    const size = Math.random() * sizeRange + sizeMin;

    // 赤〜黄ぐらいの色をランダムに作成。
    const color = {
      x: Math.random() * 0.4 + 0.6,
      y: Math.random() * 0.4 + 0.4,
      z: Math.random() * 0.2 + 0.2,
    };

    // 頂点ごとにデータを格納
    for (let j = 0; j < 4; j++) {
      index.push(i);
      vertices.push(px, py, pz);
      sizes.push(size, size);
      colors.push(color.x, color.y, color.z);
    }
    uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
    offsets.push(-1, -1, 1, -1, 1, 1, -1, 1);

    // インデックスを貼る
    const vertexIndex = i * 4;
    indices.push(
      vertexIndex + 0,
      vertexIndex + 1,
      vertexIndex + 2,
      vertexIndex + 2,
      vertexIndex + 3,
      vertexIndex + 0,
    );
  }

  pertgeo.setIndex(indices);

  // attributeに登録
  pertgeo.setAttribute("index", new THREE.Uint16BufferAttribute(index, 1));
  pertgeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  pertgeo.setAttribute("uv", new THREE.Uint16BufferAttribute(uvs, 2));
  pertgeo.setAttribute("offset", new THREE.Float32BufferAttribute(offsets, 2));
  pertgeo.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 2));
  pertgeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  //外部からシェーダを読み込む
  var pertVertexShaderText = null,
    pertfragmentShaderText = null;

  $.ajax({
    async: false,
    url: "../../static/shaders/pert_vertex.vs",
    async: false,
    cache: false,
    error: function (jqxhr, status, exception) {
      console.debug("jqxhr", jqxhr);
      console.debug("status", status);
      console.debug("exception", exception);
    },
  })
    .done(function (response) {
      pertVertexShaderText = response;
      //console.log(threeVertexShaderText)
    })
    .fail(function () {
      console.log("error");
    });

  $.ajax({
    async: false,
    url: "../../static/shaders/originlight028.fs",
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
      pertfragmentShaderText = response;
      //console.log(fragmentShaderText)
    })
    .fail(function () {
      console.log("error");
    });

  console.log("vert " + pertVertexShaderText);
  console.log("frag " + pertfragmentShaderText);

  pertmaterial = new THREE.ShaderMaterial({
    vertexShader: pertVertexShaderText,
    fragmentShader: pertfragmentShaderText,
    transparent: true,
    blending: THREE.AdditiveBlending,
    alphaTest: 0.01,
    depthWrite: false,
    uniforms: uniforms,
  });

  billboardParticles = new THREE.Mesh(pertgeo, pertmaterial);
  scene.add(billboardParticles);

  // sprite = new THREE.Sprite(material);
  // scene.add(sprite);

  // 地面を作成
  ground = new THREE.GridHelper(30, 10, 0xffffff, 0xffffff);
  //plane.position.y = -1;
  scene.add(ground);

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

  ///"performance.now()"で時間をゲット！
  time = performance.now();
  //
  pertmaterial.uniforms.time.value = time;

  renderer.render(scene, camera);
}
