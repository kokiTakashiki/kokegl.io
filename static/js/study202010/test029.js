// test029

//画面サイズ
var canvasWidth = 600;
var canvasHeight = 600;
const canvas = document.querySelector("#test029Canvas");

//3Dの設定用value
var renderer, scene, camera;

scene = new THREE.Scene();

// パースペクティブ
// new THREE.PerspectiveCamera(画角, アスペクト比, 描画開始距離, 描画終了距離)
camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 10000);
camera.position.set(0, 0, +1000);
camera.position.z = 19 * 1;
camera.position.y = 35 * 1.5;
camera.position.x = 0;
camera.rotation.x -= 0.4;

// 4-2. camera controls
var controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;

renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);

//3Dモデル用value
var geometry, material, pertmaterial, plane, time;

//L system parm
var ic = 0x1000000;
var random_color = "#0";

function Params() {
  this.iterations = 2;
  this.theta = 18;
  this.thetaRandomness = 0;
  this.angle = 0;
  this.scale = 4;
  this.scaleRandomness = 0;
  this.constantWidth = true;
  this.deltarota = 30;
}
function Colors() {
  this.background = "#000000";
  this.general = "#111faa";
  this.random = true;
  this.alpha = 0.8;
}
function Rules() {
  this.axiom = "F";
  this.mainRule = "FF-[-F+F+F]+[+F-F-F]";
  this.Rule2 = "";
}
var rules = new Rules();
var params = new Params();
var colors = new Colors();

function drawLine(x, y, x0, y0, color, width) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x0, y0);
  ctx.strokeStyle = color;
  if (params.constantWidth) ctx.lineWidth = 1;
  else ctx.lineWidth = width;
  ctx.stroke();
}
function getRandomColor() {
  var r = ~~(255 * Math.random());
  var g = ~~(255 * Math.random());
  var b = ~~(255 * Math.random());
  var a = colors.alpha;
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function GetAxiomTree() {
  var Waxiom = rules.axiom;
  var newf = rules.mainRule;
  var newb = "bb";
  var newx = rules.Rule2;
  var level = params.iterations;
  while (level > 0) {
    var m = Waxiom.length;
    var T = "";
    for (var j = 0; j < m; j++) {
      var a = Waxiom[j];
      if (a == "F") {
        T += newf;
      } else if (a == "b") {
        T += newb;
      } else if (a == "X") {
        T += newx;
      } else T += a;
    }
    Waxiom = T;
    level--;
  }
  return Waxiom;
}

function DrawTheTree(geom, x_init, y_init, z_init) {
  var geometry = geom;
  var Wrule = GetAxiomTree();
  var n = Wrule.length;
  var stackX = [];
  var stackY = [];
  var stackZ = [];
  var stackA = [];
  var stackV = [];
  var stackAxis = [];

  var theta = (params.theta * Math.PI) / 180;
  var scale = params.scale;
  var angle = (params.angle * Math.PI) / 180;

  var x0 = x_init;
  var y0 = y_init;
  var z0 = z_init;
  var x;
  var y;
  var z;
  var rota = 0,
    rota2 = 0,
    deltarota = (18 * Math.PI) / 180;
  var newbranch = false;
  var axis_x = new THREE.Vector3(1, 0, 0);
  var axis_y = new THREE.Vector3(0, 1, 0);
  var axis_z = new THREE.Vector3(0, 0, 1);
  var zero = new THREE.Vector3(0, 0, 0);
  var axis_delta = new THREE.Vector3(),
    prev_startpoint = new THREE.Vector3();

  var startpoint = new THREE.Vector3(x0, y0, z0),
    endpoint = new THREE.Vector3();
  var bush_mark;
  var vector_delta = new THREE.Vector3(scale, scale, 0);

  for (var j = 0; j < n; j++) {
    var a = Wrule[j];
    if (a == "+") {
      angle -= theta;
    }
    if (a == "-") {
      angle += theta;
    }
    if (a == "F") {
      var a = vector_delta.clone().applyAxisAngle(axis_y, angle);
      endpoint.addVectors(startpoint, a);

      geometry.vertices.push(startpoint.clone());
      geometry.vertices.push(endpoint.clone());

      prev_startpoint.copy(startpoint);
      startpoint.copy(endpoint);
      axis_delta = new THREE.Vector3().copy(a).normalize();
      rota += deltarota; // + (5.0 - Math.random()*10.0);
    }
    if (a == "L") {
      endpoint.copy(startpoint);
      endpoint.add(new THREE.Vector3(0, scale * 1.5, 0));
      var vector_delta2 = new THREE.Vector3().subVectors(endpoint, startpoint);
      vector_delta2.applyAxisAngle(axis_delta, rota2);
      endpoint.addVectors(startpoint, vector_delta2);

      geometry.vertices.push(startpoint.clone());
      geometry.vertices.push(endpoint.clone());

      rota2 += (45 * Math.PI) / 180;
    }
    if (a == "%") {
    }
    if (a == "[") {
      stackV.push(new THREE.Vector3(startpoint.x, startpoint.y, startpoint.z));
      stackA[stackA.length] = angle;
    }
    if (a == "]") {
      var point = stackV.pop();
      startpoint.copy(new THREE.Vector3(point.x, point.y, point.z));
      angle = stackA.pop();
    }
    bush_mark = a;
  }
  return geometry;
}

function setRules0() {
  rules.axiom = "F";
  //rules.mainRule = "F-F[-F+F[LLLLLLLL]]";//++F[+F[LLLLLLLL]]--F[+F[LLLLLLLL]]";
  rules.mainRule = "F-F[F+F[LLLLLLLL]]"; //++F[+F[LLLLLLLL]]--F[+F[LLLLLLLL]]";
  params.iterations = 2.3;
  params.angle = 0;
  params.theta = 20;
  params.scale = 1;
}

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

  // 画像を読み込む
  loader = new THREE.TextureLoader();
  texture = loader.load("../../static/img/texture/kusagoke.png");
  // マテリアルにテクスチャーを設定
  material = new THREE.MeshStandardMaterial({
    map: texture,
    alphaTest: 0.5,
    //transparent: true,
    //depthWrite: true,
    //SwapSphere: false
  });

  var kokehani = new THREE.Vector2(80, 80); //範囲設定　xかけるyで生成数
  var kokemitu = 4;
  var kokemargin = new THREE.Vector2(-10, -10);
  var radius = 30;

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
    var random = Math.ceil(Math.random() * 100) / 50;
    //var material = new THREE.MeshNormalMaterial();
    //material = new THREE.MeshPhongMaterial({color: 0x88FFFF});
    mesh = new THREE.Mesh(this.kokeModel(poslist[a], random), material);
    mesh.material.side = THREE.DoubleSide;
    scene.add(mesh);

    // ワイヤーフレームのメッシュ作成
    //var wire = new THREE.MeshBasicMaterial({color: 0x69821b, wireframe: true});
    //wireMesh = new THREE.Mesh(this.kokeModel(poslist[a]), wire);
    //scene.add(wireMesh);
  }

  // pertgeo = new THREE.BufferGeometry();

  // // polygon indexes
  // // 3 -- 2
  // // |    |
  // // 0 -- 1
  // const index = [];
  // const vertices = [];
  // const uvs = [];
  // const offsets = [];
  // const indices = [];
  // const sizes = [];
  // const colors = [];

  // const particleNum = 2000;
  // const randomOffsetRange = 22;
  // const sizeRange = 1.1;
  // const sizeMin = 0.1;

  // // 頂点ごとにデータを生成
  // for(let i = 0; i < particleNum; i++) {
  // // 座標をランダムに生成
  // const px = Math.random() * randomOffsetRange - randomOffsetRange * 0.5;
  // const py = Math.random() * randomOffsetRange - randomOffsetRange * 0.5;
  // const pz = Math.random() * randomOffsetRange - randomOffsetRange * 0.5;

  // // 大きさをランダムに生成
  // const size = Math.random() * sizeRange + sizeMin;

  // // 赤〜黄ぐらいの色をランダムに作成。
  // const color = {
  // 	x: Math.random() * .4 + .6,
  // 	y: Math.random() * .4 + .4,
  // 	z: Math.random() * .2 + .2,
  // };

  // // 頂点ごとにデータを格納
  // for(let j = 0; j < 4; j++) {
  // 	index.push(i);
  // 	vertices.push(px, py, pz);
  // 	sizes.push(size, size);
  // 	colors.push(color.x, color.y, color.z);
  // }
  // uvs.push(
  // 	0, 0,
  // 	1, 0,
  // 	1, 1,
  // 	0, 1
  // );
  // offsets.push(
  // 	-1, -1,
  // 	1, -1,
  // 	1, 1,
  // 	-1, 1
  // );

  // // インデックスを貼る
  // const vertexIndex = i * 4;
  // indices.push(
  // 	vertexIndex + 0, vertexIndex + 1, vertexIndex + 2,
  // 	vertexIndex + 2, vertexIndex + 3, vertexIndex + 0
  // );
  // }

  // pertgeo.setIndex(indices);

  // // attributeに登録
  // pertgeo.setAttribute('index', new THREE.Uint16BufferAttribute(index, 1));
  // pertgeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  // pertgeo.setAttribute('uv', new THREE.Uint16BufferAttribute(uvs, 2));
  // pertgeo.setAttribute('offset', new THREE.Float32BufferAttribute(offsets, 2));
  // pertgeo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 2));
  // pertgeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  // //外部からシェーダを読み込む
  // var pertVertexShaderText = null, pertfragmentShaderText = null;

  // $.ajax({
  //     async: false,
  //     url: '../../static/shaders/pert_vertex.vs',
  //     async: false,
  //     cache: false,
  //     error: function(jqxhr, status, exception) {
  //       console.debug('jqxhr', jqxhr);
  //       console.debug('status', status);
  //       console.debug('exception', exception);
  //     }
  // }).done(function(response) {
  //     pertVertexShaderText = response;
  //     //console.log(threeVertexShaderText)
  // }).fail(function () {console.log('error');});

  // $.ajax({
  //     async: false,
  //     url: '../../static/shaders/originlight028.fs',
  //     dataType: 'html',
  //     async: false,
  //     cache: false,
  //     error: function(jqxhr, status, exception) {
  //       console.debug('jqxhr', jqxhr);
  //       console.debug('status', status);
  //       console.debug('exception', exception);
  //     }
  // }).done(function(response) {
  //     pertfragmentShaderText = response;
  //     //console.log(fragmentShaderText)
  // }).fail(function () {console.log('error');});

  // console.log("vert " + pertVertexShaderText);
  // console.log("frag " + pertfragmentShaderText);

  // pertmaterial = new THREE.ShaderMaterial({
  //     vertexShader   : pertVertexShaderText,
  // 	fragmentShader : pertfragmentShaderText,
  // 	transparent: true,
  // 	blending: THREE.AdditiveBlending,
  // 	alphaTest: 0.01,
  // 	depthWrite: false,
  // 	uniforms: uniforms
  // });

  // billboardParticles = new THREE.Mesh(pertgeo, pertmaterial);
  // scene.add(billboardParticles);

  // sprite = new THREE.Sprite(material);
  // scene.add(sprite);

  //L system
  setRules0();

  var materialL = new THREE.LineBasicMaterial({
    color: 0xffffff,
    lineWidth: 20,
  });
  //var materialL = new THREE.MeshBasicMaterial({color: 0x69821b});
  var line_geometry = new THREE.Geometry();
  line_geometry = DrawTheTree(line_geometry, 0, 0, 0);
  //plant = new THREE.Mesh(line_geometry, materialL);
  plant = new THREE.Line(line_geometry, materialL, THREE.LinePieces); //THREE.LineStrip or LinePieces
  scene.add(plant);

  // GridHelperを作成
  GridHelper = new THREE.GridHelper(25, 10, 0xffffff, 0xffffff);
  //plane.position.y = -1;
  scene.add(GridHelper);

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
  spotlight = new THREE.SpotLight(0xffffff, 1.8, 30, Math.PI / 4, 10, 0.5);

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

  ///"performance.now()"で時間をゲット！
  //time = performance.now();
  //
  //pertmaterial.uniforms.time.value = time;

  renderer.render(scene, camera);
}
