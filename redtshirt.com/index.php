<html>
<head>
  <title>a red t-shirt</title>
  <meta charset="UTF-8">
  <meta name="description" content="a red t shirt">
  <meta name="keywords" content="red, t-shirt, useless">
  <meta name="author" content="bryan">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <script type="text/javascript">
var pattern = new Image();
pattern.src = "red.png";
var ph = pattern.height;

function animate()
{
   setInterval(drawShape, 100);
}

function drawShape()
{
   var canvas = document.getElementById('mycanvas');
   var ctx = canvas.getContext('2d');
   var iw = pattern.width;
   var ih = pattern.height;
   ctx.clearRect(0, 0, 400, 400);

   if(ph <= 0)
   {
      ph = ih;
   }
   else
   {
      ph -= 20;
   }

   for(var x = 0; x < iw; x++)
   {
      // 8 = height of wave, 20 = frequency, 38 = vertical offset
      var y = 8 * Math.sin((x + ph)/20) + 38;
      ctx.drawImage(pattern, x, 0, 1, ih, x, y, 1, ih);
   }
}
</script>

<style>

.center-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
}
</style>

</head>





<body onload="animate();">
<div class="center-screen">
<canvas id="mycanvas" width="400" height="400"></canvas>
</div>
</body>
</html>
