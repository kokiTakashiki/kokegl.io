// test001

//画面サイズ
var canvasWidth = 600;
var canvasHeight = 600;

//3Dの設定用value
var renderer, scene, camera;

scene = new THREE.Scene();

//正投影図法
// new THREE.OrthographicCamera(left, right, top, bottom, near, far)
camera = new THREE.OrthographicCamera(
  canvasWidth / -2,
  canvasWidth / 2,
  canvasHeight / 2,
  canvasHeight / -2,
  1,
  1000,
);
camera.position.z = 10;

renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#test001Canvas"),
});

//3Dモデル用value
var geometry, material, mesh, time;

//一回だけ呼んで初期化するよー
init();
//毎回呼んでアニメーションするよー
animate();

//初期化用仕掛けちゃん（ファンクションとかメソッドとか）
function init() {
  geometry = new THREE.PlaneBufferGeometry(canvasWidth, canvasHeight);

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

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

//アニメーション用仕掛けちゃん
function animate() {
  window.requestAnimationFrame(animate);
  render();
}

//レンダリング用仕掛けちゃん
function render() {
  //"performance.now()"で時間をゲット！
  time = performance.now();
  //
  material.uniforms.time.value = time;
  renderer.render(scene, camera);
}
