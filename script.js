window.onload = function() {

   var canvas = document.getElementById("canvas");
   var ctx = canvas.getContext("2d");

   var pi = Math.PI;

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

   function dist(dx, dy) {
      return Math.sqrt(dx * dx + dy * dy);
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
      
      // Determine how many particles exist
      var existingParticles = P.length;
      
      // Calculate how many more particles are needed to reach part_num (2000)
      var particlesToAdd = part_num - existingParticles;

      // Only add new particles if needed
      for (var i = 0; i < particlesToAdd; i++) {
         x = rand(0, canvas.width);
         y = rand(0, canvas.height);
         vx = rand(-1, 1);
         vy = rand(-1, 1);
         r = rand(1, 3);
         red = Math.round(255);
         green = Math.round(255);
         blue = Math.round(255);
         alpha = 1;
         col = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
         birthTime = Date.now(); // Record the creation time
         dt = rand(10000, 180000); // Set a random death time between 1s and 60s

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
	 var aSpeed = rand(5, 30)
     var rSpeed = rand(50, 200)	 
     var dx = (p.x - X),
         dy = (p.y - Y),
         dist = Math.sqrt(dx * dx + dy * dy),
         angle = Math.atan2(dy, dx);

     if (mousedown && dist < 500) {
         p.vx -= (aSpeed / (p.r * dist)) * Math.cos(angle);
         p.vy -= (aSpeed / (p.r * dist)) * Math.sin(angle);
     } else if (!mousedown && dist < 100) {
         p.vx += (rSpeed / (p.r * dist)) * Math.cos(angle);
         p.vy += (rSpeed / (p.r * dist)) * Math.sin(angle);
     }
   }

   function draw() {
      var p;
      var currentTime = Date.now();

      // Loop backwards to safely remove particles
      for (var i = P.length - 1; i >= 0; i--) {
         p = P[i];

         // Calculate particle's age
         var age = currentTime - p.birthTime;

         // Check if the particle should be removed based on its death time
         if (age > p.dt) {
            P.splice(i, 1);
            continue;
         }

         // Existing particle behavior
         if (mouseover) attract(p);
         bounce(p);

         p.x += p.vx;
         p.y += p.vy;

         p.vx *= .992;
         p.vy *= .992;

         ctx.fillStyle = p.col;
         ctx.fillRect(p.x, p.y, p.r, p.r);
      }

      ctx.strokeStyle = (!mousedown) ? "rgba(255,255,255,1)" : "rgba(255,0,0,1)";

      ctx.beginPath();
      ctx.moveTo(X, Y - 10);
      ctx.lineTo(X, Y + 10);
      ctx.moveTo(X - 10, Y);
      ctx.lineTo(X + 10, Y);
      ctx.stroke();
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
