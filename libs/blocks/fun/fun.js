"use strict";

var options = {
  startingHue: 110,
  clickLimiter: 6,
  timerInterval: 18,
  showTargets: false,
  rocketSpeed: 2.3,
  rocketAcceleration: 1.1,
  particleFriction: 0.95,
  particleGravity: 1,
  particleMinCount: 40,
  particleMaxCount: 60,
  particleMinRadius: 1,
  particleMaxRadius: 6
};

var fireworks = [];
var particles = [];
var mouse = {down: false, x: 0, y: 0};
var currentHue = options.startingHue;
var clickLimiterTick = 0;
var timerTick = 0;
var cntRocketsLaunched = 0;

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(cb) {
      window.setTimeout(callback, 1000 / 60);
    }
})();

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function calculateDistance(p1x, p1y, p2x, p2y) {
  var xDistance = p1x - p2x;
  var yDistance = p1y - p2y;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

var canvas = document.getElementById('kaboom');
var canvasCtx = canvas.getContext('2d');

var canvasWidth;
if(window.innerWidth > 1024) {
	canvasWidth = window.innerWidth / 1;
}
else {
	canvasWidth = window.innerWidth;
}
var canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

function Firework(sx, sy, tx, ty) {  
  this.x = this.sx = sx;
  this.y = this.sy = sy;
  this.tx = tx; this.ty = ty;
  this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
  this.distanceTraveled = 0;
  this.coordinates = [];
  this.coordinateCount = 4;

  while(this.coordinateCount--) {
    this.coordinates.push([this.x, this.y]);
  }
  
  this.angle = Math.atan2(ty - sy, tx - sx);
  this.speed = options.rocketSpeed;
  this.acceleration = options.rocketAcceleration;
  this.brightness = random(60, 90);
  this.hue = currentHue;
  this.targetRadius = 1;
  this.targetDirection = false;
  cntRocketsLaunched++;
};

Firework.prototype.update = function(index) {
  this.coordinates.pop();
  this.coordinates.unshift([this.x, this.y]);
  if(!this.targetDirection) {
    if(this.targetRadius < 8)
      this.targetRadius += 0.15;
    else
      this.targetDirection = true;  
  } else {
    if(this.targetRadius > 1)
      this.targetRadius -= 0.15;
    else
      this.targetDirection = false;
  }
  this.speed *= this.acceleration;
  var vx = Math.cos(this.angle) * this.speed;
  var vy = Math.sin(this.angle) * this.speed;
  this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);
  if(this.distanceTraveled >= this.distanceToTarget) {
    createParticles(this.tx, this.ty);
    fireworks.splice(index, 1);
  } else {
    this.x += vx;
    this.y += vy;
  }
};

Firework.prototype.draw = function() {
  var lastCoordinate = this.coordinates[this.coordinates.length - 1];
  
  canvasCtx.beginPath();
  canvasCtx.moveTo(lastCoordinate[0], lastCoordinate[1]);
  canvasCtx.lineTo(this.x, this.y);
  canvasCtx.strokeStyle = 'hsl(' + this.hue + ',100%,' + this.brightness + '%)';
  canvasCtx.stroke();
  
  if(options.showTargets) {
    canvasCtx.beginPath();
    canvasCtx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 1);
    canvasCtx.stroke();
  }
};

function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.coordinates = [];
  this.coordinateCount = 5;

  while(this.coordinateCount--) {
    this.coordinates.push([this.x, this.y]);
  }
  
  this.angle = random(0, Math.PI * 2);
  this.speed = random(1, 10);
  
  this.friction = options.particleFriction;
  this.gravity = options.particleGravity;
  this.hue = random(currentHue - 20, currentHue + 20);
  this.brightness = random(60, 90);
  this.alpha = 1;

  this.decay = random(0.01, 0.04);
}

Particle.prototype.update = function(index) {
  this.coordinates.pop();
  this.coordinates.unshift([this.x, this.y]);
  this.speed *= this.friction;
  this.x += Math.cos(this.angle) * this.speed;
  this.y += Math.sin(this.angle) * this.speed + this.gravity;
  
  this.alpha -= this.decay;
  if(this.alpha <= this.decay) {
    particles.splice(index, 1);
  }
}

Particle.prototype.draw = function() {
  var lastCoordinate = this.coordinates[this.coordinates.length - 1];
  var radius = Math.round(random(options.particleMinRadius, options.particleMaxRadius));
  
  var gradient = canvasCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
  gradient.addColorStop(0.0, 'white');
  gradient.addColorStop(0.1, 'white');
  gradient.addColorStop(0.1, 'hsla(' + this.hue + ',100%,' + this.brightness + '%,' + this.alpha + ')');
  gradient.addColorStop(1.0, 'black');

  canvasCtx.beginPath();
  canvasCtx.fillStyle = gradient;
  canvasCtx.arc(this.x, this.y, radius, Math.PI * 2, false);
  canvasCtx.fill();
}

function createParticles(x, y) {
  var particleCount = Math.round(random(options.particleMinCount, options.particleMaxCount));
  while(particleCount--) {
    particles.push(new Particle(x, y));
  }
}

window.addEventListener('resize', function(e) {
	if(window.innerWidth > 1024) {
		 canvas.width = canvasWidth = window.innerWidth/2;
	}
    else {
		canvas.width = canvasWidth = window.innerWidth;
	}
	canvas.height = canvasHeight = window.innerHeight;
});

canvas.addEventListener('mousemove', function(e) {
  e.preventDefault();
  mouse.x = e.pageX - canvas.offsetLeft;
  mouse.y = e.pageY - canvas.offsetTop;
});

canvas.addEventListener('mousedown', function(e) {
  e.preventDefault();
  mouse.down = true;
});

canvas.addEventListener('mouseup', function(e) {
  e.preventDefault();
  mouse.down = false;
});

function gameLoop() {
  requestAnimFrame(gameLoop);
  currentHue += 0.5;
  canvasCtx.globalCompositeOperation = 'destination-out';
  canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
  canvasCtx.globalCompositeOperation = 'lighter';
  
  var i = fireworks.length;
  while(i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }
  var i = particles.length;
  while(i--) {
    particles[i].draw();
    particles[i].update(i);
  }

  if(timerTick >= options.timerInterval) {
    if(!mouse.down) {
      fireworks.push(new Firework(canvasWidth / 2, canvasHeight, random(0, canvasWidth), random(0, canvasHeight / 2)));
      timerTick = 0;
    }
  } else {
    timerTick++;
  }
  
  if(clickLimiterTick >= options.clickLimiter) {
    if(mouse.down) {
      fireworks.push(new Firework(canvasWidth / 2, canvasHeight, mouse.x, mouse.y));
      clickLimiterTick = 0;
    }
  } else {
    clickLimiterTick++;
  }
}

window.onload = gameLoop();


export default function init(el) {
  
}
