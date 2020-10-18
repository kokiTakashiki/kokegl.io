//test025

precision mediump float;
uniform vec2 resolution;
uniform float time;

//vUvを取得
varying vec2 vUv;

#define S(x,y,z) smoothstep(x,y,z)

float light(vec2 uv, vec2 pos, float size) {
    uv -= pos;
    
    size *= size;
    return size/dot(uv, uv);
}

vec3 origin(vec2 uv, vec2 p, float t, vec3 bCol) {
    
    vec3 col = vec3(0.);
    
    vec3 baseCol = bCol;// + en;
    for(float i=0.; i<1.0; i++) {
        vec3 n = vec3(0.);
        
        vec2 endP = p-vec2(0., t*t*.1);//落ちるような表現のためのゴール地点
        
        float pt = 1.0-pow(t-1., 2.);//t-1.0の2乗
        
        vec2 pos = p;//mix(p, endP, pt);//落ちるような表現を線形補間を使って実装する
        
        // 最初の発火の部分を担う
        // mixの線形補間ではどのあたりのptの変化値の程よい部分を狙う
        // スムーズステップによってptの値をさらに滑らかにしてふわっと光る演出にしている
        float size = mix(.01, .018, S(0., .1, pt)) * pt;
        //size *= S(1., .1, pt);//後の小さくなっていくアニメーションを担う
        
        col += baseCol*light(uv, pos, size);//ベースカラーをlightという関数で塗るエリアを限定加えてぼやける処理も施す
    }
    
    return col;
}

void main(void){
    //uv座標系で、オブジェクトの中心に原点を設定
    vec2 uv = -1.0 + 2.0 * vUv;
    
    float t = time*0.00008;
    float sint = sin(t);
    
    //backbround
    vec3 c = vec3(0.);
    
    vec2 ep = vec2(0.0,0.0);
    
    for(float i=0.; i<5.0; i++) {
        
        //色
        vec3 bColPin = vec3(0.2063,1.0,0.3293);
        
        c = origin(uv, ep, -2.0, bColPin);
        
    }

    gl_FragColor = vec4(c, 1.0);
    
}