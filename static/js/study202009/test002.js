// test002

//画面サイズ
var canvasWidth = 600;
var canvasHeight = 600;

//3Dの設定用value
var renderer, scene, camera, light;

scene = new THREE.Scene();

// パースペクティブ
// new THREE.PerspectiveCamera(画角, アスペクト比, 描画開始距離, 描画終了距離)
camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 10000);
camera.position.set(0, 0, +1000);

renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#test002Canvas"),
});
renderer.setPixelRatio(window.devicePixelRatio);

//3Dモデル用value
var geometry, material, box, time;

//一回だけ呼んで初期化するよー
init();
//毎回呼んでアニメーションするよー
animate();

//初期化用仕掛けちゃん（ファンクションとかメソッドとか）
function init() {
  // box の作成
  geometry = new THREE.BoxGeometry(250, 250, 250);

  uniforms = {
    resolution: {
      type: "v2",
      value: new THREE.Vector2(canvasWidth, canvasHeight),
    },
    time: { type: "f", value: 1.0 },
  };

  //外部からシェーダを読み込む
  var threeVertexShaderText = null,
    fragmentShaderText = null;

  $.ajax({
    async: false,
    url: "../../static/shaders/plane_vertex.vs",
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
    url: "../../static/shaders/fshader.fs",
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

  material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: threeVertexShaderText,
    fragmentShader: fragmentShaderText,
  });

  box = new THREE.Mesh(geometry, material);
  scene.add(box);

  // new THREE.DirectionalLight(色)
  light = new THREE.DirectionalLight(0xffffff);
  light.intensity = 2; // 光の強さを倍に
  // ライトの位置を変更
  light.position.set(1, 1, 1);
  // シーンに追加
  scene.add(light);
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

  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
  //"performance.now()"で時間をゲット！
  time = performance.now();
  //
  material.uniforms.time.value = time;
  renderer.render(scene, camera);
}
