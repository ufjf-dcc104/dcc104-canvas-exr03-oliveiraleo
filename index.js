//valores matemáticos
const PI2     = Math.PI / 2;
const PI4     = Math.PI / 4;
const RAD4DEG = Math.PI / 180;
const DEG4RAD = 180 / Math.PI;

//texto do placar
function Text(font, size, rgb) {
    this.font = font || "Courier";
    this.size = size || 20;
    this.color = rgb || "#2aff00";

	    this.raster = function(ctx, text, x, y) {
	        ctx.font = "" + this.size + "px " + this.font;
	        ctx.fillStyle = this.color;
	        ctx.fillText(text, x, y);
	    }
}
//sons
var audioPonto = new Audio('audio/point.wav');
var musica = new Audio('audio/theme.mp3');
var audioFim = new Audio('audio/gameover.mp3');
var batida = new Audio('audio/hit.wav');
//variaveis globais
var obstaculos = new Array(10);
var pontosBool = new Array(10);
var pause = false;

function aviso(){//espera o inicio do jogo
  //alert("Clique na tela para começar o jogo");
}

function start() {
    //musica
    musica.play();
    musica.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
    });
    //variaveis do jogo
	var canvas = document.getElementById("game");
	var ctx = canvas.getContext("2d");

	const WIDTH = canvas.offsetWidth;
	const HEIGHT = canvas.offsetHeight;

	const FPS = 60;
	const DT = 1/FPS;
	const G = -900;

	var pos = 700;
	var posy = 0;
	var posObj1 = -135;
	var posObj2 = 295;
	for (var i = 0; i < 10 ; i++) {
		posy = Math.floor((Math.random() * 50) + 5);
		if (Math.floor((Math.random() * 10) + 1) <= 5){
			posObj1 -= posy;
			posObj2 -= posy;
		}
		else{
			posObj1 += posy;
			posObj2 += posy;
		}
		pontosBool[i] = true;
		obstaculos[i] = new Obstaculo(new Point(pos, posObj1), new Size(300, 60),0);
		i++;
		pontosBool[i] = true;
		obstaculos[i] = new Obstaculo(new Point(pos, posObj2), new Size(300, 60),0);


		pos += 200;
		posObj1 = -135;
		posObj2 = 295;
	};

	var bird = new Sprite(new Point(WIDTH/2, HEIGHT/2), new Size(25, 25) , 0);

	var obj1 = new Obstaculo(new Point(( WIDTH/2 )+ 15, 295), new Size(300, 50), 0);
	var obj2 = new Obstaculo(new Point(bird.coord.x - bird.size.w/2, 150), new Size(20, 20));
	var passo = false;
	var texto = new Text("Courier", 30, "white");
	var pontos = new Text();
	var score = 0;
  var inicio = false;

	var loop = function() {
    if (inicio && !pause) {

  		ctx.clearRect(0, 0, WIDTH, HEIGHT);
      //movimentacao do bird
  		bird.move(DT, G);
      //verifica se saiu da tela
  		if((bird.coord.y + (bird.size.w/2) >= HEIGHT) || (bird.coord.y - (bird.size.w/2)  <= 0)) {

              audioFim.play();
  			start = false;
  			bird.vel.vy = 0;
  			score = 0;
  			bird.coord.x = WIDTH/2;
  			bird.coord.y = HEIGHT/2;
  			var pos = 700;
  			for (var i = 0; i < 10 ; i++){
  				obstaculos[i].coord.x = pos ;
  				pontosBool[i] = true;
  				i++;
  				obstaculos[i].coord.x = pos ;
  				pontosBool[i] = true;
  				pos += 200;
  			}

  		}

  		if (start){
  			for (var i = 0; i < 10; i++) {

  				posObj1 = -135;
  				posObj2 = 295;

  				if( (obstaculos[i].coord.x < bird.coord.x + bird.size.w)  && (obstaculos[i].coord.x > bird.coord.x - bird.size.w )){
            //verifica colisao
  					if (bird.collision(obstaculos[i] , obstaculos[i+1])){
                          batida.play();
                          audioFim.play();

  						start = false;
  						bird.vel.vy = 0;
  						score = 0;
  						bird.coord.x = WIDTH/2;
  						bird.coord.y = HEIGHT/2;
  						var pos = 700;
  						for (var i = 0; i < 10 ; i++){
  							obstaculos[i].coord.x = pos ;
  							pontosBool[i] = true;
  							i++;
  							obstaculos[i].coord.x = pos ;
  							pontosBool[i] = true;
  							pos += 200;
  						}
  						break;
  					}

            //contabiliza os pontos
  					if (pontosBool[i]){
                          audioPonto.play();
  						score++;
  						pontosBool[i] = false;
  						pontosBool[i+1] = false;
  					}

  				}

  				if (obstaculos[i].coord.x > -100){
  					obstaculos[i].move(DT, G);
  					obstaculos[i].draw(ctx);
  					obstaculos[i+1].move(DT, G);
  					obstaculos[i+1].draw(ctx);
  				}
  				else{
  					posy = Math.floor((Math.random() * 50) + 50);
  					if (Math.floor((Math.random() * 10) + 1) <= 5){
  						posObj1 -= posy;
  						posObj2 -= posy;
  					}
  					else{
  						posObj1 += posy;
  						posObj2 += posy;
  					}
  					obstaculos[i].coord.x = 900 ;
  					obstaculos[i+1].coord.x = 900 ;
  					obstaculos[i].coord.y = posObj1 ;
  					obstaculos[i+1].coord.y = posObj2 ;
  					pontosBool[i] = true;
  					pontosBool[i+1] = true;

  				}
  				i++;
  			};
  		}
  		else{
  			bird.vel.vy = -9;
  		}
      //mostra os pontos na tela
      if (!start){
        texto.raster(ctx,"Aperte ESPAÇO para jogar", WIDTH/3, HEIGHT/3);
      }
  		pontos.raster(ctx, "Pontos: " + score, 10, 25);
  		bird.draw(ctx);
    }else if(!inicio){
      var msg = new Text("Courier", 30, "white");
      canvas.fillStyle = "black";
      canvas.fillRect = (0,0,WIDTH, HEIGHT);
      msg.raster(ctx, "Aperte ENTER para começar", WIDTH/5, HEIGHT/2 );
    }else if(pause){
      var msg = new Text("Courier", 30, "white");
      msg.raster(ctx, "Aperte P para continuar", WIDTH/5, HEIGHT/2 );
    }
	}

	setInterval(loop, 1000/FPS);

	var down = false;
  //movimentacao
	addEventListener("keydown", function(e){
		if(e.keyCode == 32 && !down) {//Espaco
			start = true;
			bird.vel.vy = -10 * Math.sqrt(-G);
			down = true;
      e.preventDefault();
		}
    if(e.keyCode == 80){//P - pause
      pause = !pause;
    }
    if(e.keyCode == 13){ //Enter
      inicio = true;
      start = false;
      e.preventDefault();
    }
	});

	addEventListener("keyup", function(e){
		if(e.keyCode == 32) {
			down = false;
      e.preventDefault();
		}
	});


}
