//marca as coordenadas
function Point(x, y) {
	this.x = x;
	this.y = y;
}
//monta o tamanho
function Size(w, h) {
	this.w = w;
	this.h = h;
}

function Sprite(coord, size, theta, url) {
	this.size  = size  || new Size(50, 50);
	this.coord = coord || new Point(0, 0);
	this.theta = theta || 0;

	this.vel   = {vx: 0, vy: 0};
	this.acel  = {ax: 0, ay: 0};
	this.omega = 0;

	this.image = new Image();

	this.draw = function(ctx) {
		ctx.save();
            ctx.fillStyle = "black";
            ctx.fillRect(this.coord.x, this.coord.y,  this.size.h, this.size.w );
            ctx.strokeStyle = "white";
            ctx.strokeRect(this.coord.x, this.coord.y, this.size.h, this.size.w);
		ctx.restore();
	}


	this.move = function(dt, g) {
		this.coord.y += (this.vel.vy * dt) - g/2 * (dt*dt);
		this.vel.vy -= g * dt;
	}

	//verifica as colisoes
	this.collision = function(pilastraCima , pilastraBaixo)
	{
				//cria as variaveis
        var pilastraCima_EQD = pilastraCima.coord.x,
            pilastraBaixo_EQD = pilastraBaixo.coord.x,
            pilastraCima_DIR = pilastraCima.coord.x + 60,
            pilastraBaixo_DIR = pilastraBaixo.coord.x + 60,
            pilastraCima_BAIXO = pilastraCima.coord.y + 300,
            pilastraBaixo_CIMA = pilastraBaixo.coord.y,
            pilastraCima_CIMA = pilastraCima.coord.y,
            pilastraBaixo_BAIXO = pilastraBaixo.coord.y + 300,
            esq = this.coord.x,
            dir = this.coord.x + this.size.w,
            top = this.coord.y,
            botoom = this.coord.y + this.size.h;

				//filtro de colisao
        //lado superior esquedo do alvo e lado inferior direito do this.
        if(dir > pilastraCima_EQD && pilastraCima_CIMA < botoom && dir < pilastraCima_DIR && pilastraCima_BAIXO > botoom) { return true; }

        //lado superior direito do alvo e lado inferior esquerdo do this.
        if(esq < pilastraCima_DIR && pilastraCima_CIMA < botoom && dir > pilastraCima_EQD && pilastraCima_BAIXO > botoom) { return true; }

         //lado inferior esquero do alvo e lado superior direito do this.
        if(top < pilastraCima_BAIXO && dir > pilastraCima_EQD && dir < pilastraCima_DIR && pilastraCima_BAIXO < botoom) { return true; }

        //lado inferior direito do alvo e lado superior esquerdo do this.
        if(top < pilastraCima_BAIXO && esq < pilastraCima_DIR && esq > pilastraCima_EQD && pilastraCima_BAIXO < botoom) { return true; }


        //lado superior esquedo do alvo e lado inferior direito do this.
        if(dir > pilastraBaixo_EQD && pilastraBaixo_CIMA < botoom && dir < pilastraBaixo_DIR && pilastraBaixo_BAIXO > botoom) { return true; }

        //lado superior direito do alvo e lado inferior esquerdo do this.
        if(esq < pilastraBaixo_DIR && pilastraBaixo_CIMA < botoom && dir > pilastraBaixo_EQD && pilastraBaixo_BAIXO > botoom) { return true; }

         //lado inferior esquero do alvo e lado superior direito do this.
        if(top < pilastraBaixo_BAIXO && dir > pilastraBaixo_EQD && dir < pilastraBaixo_DIR && pilastraBaixo_BAIXO < botoom) { return true; }

        //lado inferior direito do alvo e lado superior esquerdo do this.
        if(top < pilastraBaixo_BAIXO && esq < pilastraBaixo_DIR && esq > pilastraBaixo_EQD && pilastraBaixo_BAIXO < botoom) { return true; }

		return false;
	}
}
//parametros dos obstaculos
function Obstaculo(coord, size, theta, url) {
	this.size  = size  || new Size(50, 50);
	this.coord = coord || new Point(0, 0);
	this.theta = theta || 0;

	this.vel   = -100;
	this.omega = 0;
	this.acel  = 0;

	this.image = new Image();
	//this.image.src = url;
	//desenha os obstaculos
	this.draw = function(ctx) {
		ctx.save();
            ctx.fillStyle = "#009b12";
            ctx.fillRect(this.coord.x, this.coord.y, this.size.h, this.size.w);
            ctx.strokeStyle = "#00f2ff";
            ctx.strokeRect(this.coord.x, this.coord.y, this.size.h, this.size.w);
		ctx.restore();
	}

		this.move = function(dt, g) {
		this.theta = this.theta + this.omega * dt;
		var vx = Math.cos(this.theta) * (this.vel);
		this.coord.x += vx * dt;
	}

	this.colidiu = function(alvo){
        if(this.coord.x > alvo.coord.x+alvo.size.w) return false;
        if(this.coord.x+this.size.w < alvo.coord.x) return false;
        if(this.coord.y > alvo.coord.y+alvo.size.h) return false;
        if(this.coord.y+this.size.h < alvo.coord.y) return false;
        return true;
    };
}
