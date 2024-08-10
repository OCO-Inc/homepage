window.onload = function() {

   var canvas = document.getElementById("canvas");
   var ctx = canvas.getContext("2d");
   
   var centerX, centerY;
   var part_num = 2000;

   var mousedown = false;
   var X, Y;
   var P = [];

   var part = function(x, y, vx, vy, r, red, green, blue, alpha, col, birthTime, dt) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.r = r;
      this.red = red;
      this.green = green;
      this.blue = blue;
      this.alpha = alpha;
      this.col = col;
      this.birthTime = birthTime;
      this.dt = dt;  
   };

   function rand(min, max) {
      return Math.random() * (max - min) + min;
   }

   function size() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      centerX = canvas.width / 2;
      centerY = canvas.height / 2;
   }
   size();
   X = centerX;
   Y = centerY;

   function init() {
      var x, y, vx, vy, r, red, green, blue, alpha, col, birthTime, dt;
      var existingParticles = P.length;
      var particlesToAdd = part_num - existingParticles;
	  var startVelocity = false
	  
      for (var i = 0; i < particlesToAdd; i++) {
         x = rand(0, canvas.width);
         y = rand(0, canvas.height);
		 
		 if (startVelocity) {
           vx = rand(-1, 1);
           vy = rand(-1, 1);
		 } else {
		   vx = 0
		   vy = 0
		 }
         r = rand(0.01, 3);
		 if (r > 2.8) {
		   r = rand(1, 6);
		 }
		 
         red = Math.round(rand(205, 255));
         green = Math.round(rand(235, 255));
         blue = Math.round(rand(235, 255));
         alpha = 1;
         col = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
         birthTime = Date.now();
         dt = rand(10000, 180000);

         P.push(new part(x, y, vx, vy, r, red, green, blue, alpha, col, birthTime, dt));
      }
   }

   function bg() {
      ctx.fillStyle = "rgba(5,5,10,1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
   }

   function bounce(b) {
      if (b.x < b.r) {
         b.x = b.r;
         b.vx *= -1;
      }
      if (b.x > canvas.width - b.r) {
         b.x = canvas.width - b.r;
         b.vx *= -1;
      }

      if (b.y - b.r < 0) {
         b.y = b.r;
         b.vy *= -1;
      }
      if (b.y > canvas.height - b.r) {
         b.y = canvas.height - b.r;
         b.vy *= -1;
      }
   }

   function attract(p) {
         dx = (p.x - X),
         dy = (p.y - Y),
         dist = Math.sqrt(dx * dx + dy * dy),
         angle = Math.atan2(dy, dx);

     if (!mousedown && dist < 200 && dist > 7) {
         p.vx -= (15 / (p.r * dist)) * Math.cos(angle);
         p.vy -= (15 / (p.r * dist)) * Math.sin(angle);
     } else if (mousedown && dist < 100) {
         p.vx += (80 / (p.r * dist)) * Math.cos(angle);
         p.vy += (80 / (p.r * dist)) * Math.sin(angle);
     } else if (!mousedown && dist < 2) {
         p.vx = rand(-0.2, 0.2)
         p.vy = rand(-0.2, 0.2)
     }
   }
   
   function drawCircle(ctx, x, y, radius,) {
     ctx.beginPath()
     ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
     ctx.fill()
   }

   function draw() {
      var p;
      var currentTime = Date.now();
	  
      for (var i = P.length - 1; i >= 0; i--) {
         p = P[i];
         var age = currentTime - p.birthTime;

         if (age > p.dt) {
            P.splice(i, 1);
            continue;
         }
		 
         if (mouseover) attract(p);
         bounce(p);

         p.x += p.vx;
         p.y += p.vy;

         p.vx *= .985;
         p.vy *= .985;

         ctx.fillStyle = p.col;
         drawCircle(ctx, p.x, p.y, p.r)
      }
   }

   function loop() {
      bg();
      draw();
      init();
      window.requestAnimationFrame(loop);
   }

   window.onresize = size;

   window.onmousemove = function(e) {
      X = e.clientX;
      Y = e.clientY;
   }

   window.onmousedown = function() {
      mousedown = true;
   }

   window.onmouseup = function() {
      mousedown = false;
   }

   var mouseover = false;

   window.onmouseover = function() {
      mouseover = true;
   }

   window.onmouseout = function(){
      mouseover = false;
   }

   init();
   loop();

}

/*
Planned customization options:
              --
Total particles
Death time minimum
Death time maximum
Velocity loss speed
Radius Minimum
Radius Maximum
Repel radius
Attract radius
Repel Strength minimum
Repel Strength maximum
Attract strength minimum
Attract strength maximum

Particle color (Hex)
Background color (Hex)

Invert click function (Boolean)
Spawn w/ velocity? (Boolean)
*/