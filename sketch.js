let floor = [];
let box;
let ball = [];
let enemySpawnRate = 90;
let map;
let grass;
let joyX = 0, joyY = 0, sw = 0;
let connectButton;
let cleared = false;
let points = 0;
let font;
let clock;
let clock2;
let rule;
let countDown = 0;
let mode = -1;
let clicked = false;
let r = 0, g = 0, b = 0;
let endScore = 15;
let ball2 = [];

let bite;
bite = new Tone.Player("libraries/bite.mp3");
bite.toDestination();

let biteL;
biteL = new Tone.Player("libraries/cracker.mp3");
biteL.toDestination();

let game;
game = new Tone.Player("libraries/game.mp3");
game.toDestination();
game.loop = true;

function preload(){
  grass = loadImage('libraries/brick3.jpg');
  font = loadFont('libraries/PressStart2P-Regular.ttf');
}

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.position(100, 50);
  port = createSerial();
  connectButton = createButton("Connect");
  connectButton.mousePressed(connect);
  textFont(font);
  textSize(20);


  map = new Sprite(width/2, height/2, 1500, 1500, 'n');
  map.color = 'gray';
  map.layer = 0;
  map.draw = () => {
    push();
    rectMode(CENTER);
    grass.resize(map.w, map.h)
    image(grass, 0, 0);
    pop();
  }

  

  floor[0] = new Sprite(map.w/2, 0, map.w, 0, 'k');
  floor[1] = new Sprite(map.w/2, map.h, map.w, 0, 'k');
  floor[2] = new Sprite(0, map.h/2, 0, map.h, 'k');
  floor[3] = new Sprite(map.w, map.h/2, 0, map.h, 'k');
  floor[0].visible = true;
  floor[1].visible = true;
  floor[2].visible = true;
  floor[3].visible = true;



  box = new Sprite(width/2, height/2, 50, 50);
  box.bounciness = 0.5;
  box.mass = 10;
  box.drag = 10
  box.draw = () => {
    push();
    rectMode(CENTER);
    fill(84, 91, 22);
    rect(13, 18, 30, 12);
    rect(13, -18, 30, 12);
    fill(80, 50, 100);
    rect(0, 0, 25, 50);
    fill(24, 26, 11)
    square(0, 0, 30);

    fill(160, 0, 0, 60);
    //square(0, 0, 50)
    pop();
  }

  clock = new Sprite(width/2+90, 30, 180, 40, 'n');
  clock.text = "0";
  clock.update = () => {
    clock.text = "Score: " + str(points);
  }
  clock.color = 'yellow';
  clock.layer = 5;

  clock2 = new Sprite(width/2-90, 30, 180, 40, 'n');
  clock2.text = "0";
  clock2.update = () => {
    clock2.text = "Time: " + str(countDown);
  }
  clock2.color = 'yellow';
  clock2.layer = 5;

  rule = new Sprite(width/2, 70, 300, 34, 'n');
  rule.text = "0";
  rule.update = () => {
    rule.text = "Get 20 Score!";
  }
  rule.color = 'yellow';
  rule.layer = 5;
}





function draw() {
  let str = port.readUntil("\n");
  let values = str.split(",");
  if(cleared == false){
    if(values.length > 2){
      joyX = Number(values[0]);
      joyY = Number(values[1]);
      sw = Number(values[2]);
    }
  }
  cleared = false;

  if(frameCount % 600 == 0){
    port.clear();
    cleared = true;
  }


  if(mode == 0){
    playGame();
  }

  else if(mode == 1){
    endScreen();
    if(clicked == false){
      if(sw == 1){
        clicked = true;
        mode = -1;
      }
    }
  }

  else if(mode == -1){
    if(sw == 0){
      clicked = false;
    }
    startScreen();
  }
}

function playGame(){
  background(100);
  if(frameCount%enemySpawnRate == 0){
    for(let i=0; i<4; i++){
      ball.push(new Sprite(random(box.x - 230, box.x + 230), random(box.y - 230, box.y + 230), 22, 50));
    }
    ball2.push(new Sprite(random(box.x - 230, box.x + 230), random(box.y - 230, box.y + 230), 22, 50));
    enemySpawnRate-=2;
    if(enemySpawnRate <= 45){
      enemySpawnRate = 45;
    };
  }

  if(kb.pressing('a')){
    constrain(box.vel.x--, -3, 3);
    constrain(map.vel.x++, -3, 3);
  }

  if(kb.pressing('d')){
    constrain(box.vel.x++, -3, 3);
    constrain(map.vel.x--, -3, 3);
  }

  if(kb.pressing('w')){
    constrain(box.vel.y--, -3, 3);
    constrain(map.vel.y++, -3, 3);
  }

  if(kb.pressing('s')){
    constrain(box.vel.y++, -3, 3);
    constrain(map.vel.y--, -3, 3);
  }
  

  if(keyIsPressed === false){
    box.vel.x += joyX;
    box.vel.y += joyY;
    map.vel.x += -joyX;
    map.vel.y += -joyY;
  }

  box.x = constrain(box.x, 100, width-100);
  box.y = constrain(box.y, 100, height-100);

  if(box.vel.x != 0 || box.vel.y != 0){
    box.rotation = box.vel.heading();
  }

  if((keyIsPressed === false)&&(joyX == 0)&&(joyY == 0)){
    map.vel.set();
  }

  box.vel.limit(4);

  if(box.x <= 100){
    map.vel.limit(5);
  }
  else if(box.x >= width - 100){
    map.vel.limit(5);
  }
  else if(box.y <= 100){
    map.vel.limit(5);
  }
  else if(box.y >= height - 100){
    map.vel.limit(5);
  }
  else{
    map.vel.limit(4);
  }

  map.x = constrain(map.x, width/2 - map.w/2 + 50, width/2 + map.w/2 - 50);
  map.y = constrain(map.y, height/2 - map.h/2 + 50, width/2 + map.h/2 - 50);

  floor[0].x = map.x;
  floor[0].y = map.y - map.h/2;

  floor[1].x = map.x;
  floor[1].y = map.y + map.h/2;

  floor[2].x = map.x - map.w/2;
  floor[2].y = map.y;

  floor[3].x = map.x + map.w/2;
  floor[3].y = map.y;
  
  if(ball.length > 0){
    for(let i = ball.length-1; i >= 0; i--){
      ball[i].draw = () => {
        fill(50);
        rect(0, 0, 20, 50);
        fill(144, 91, 62);
        square(0, 0, 25);
      }
      ball[i].attractTo(box, -200);
      ball[i].mass = 3
      ball[i].rotation = ball[i].angleTo(box);
      ball[i].drag = 20
      ball[i].bounciness = 0;
      ball[i].layer = 3;
      ball[i].vel.add(p5.Vector.div(map.vel, 3));
      if(ball[i].colliding(box)){
        bite.start();
        r = 255;
        ball[i].remove();
        ball.splice(i, 1);
        points++;

      }
      else if((ball[i].x < map.x - map.w/2 - 20) || (ball[i].x > map.x + map.w/2 + 20) || (ball[i].y < map.y - map.h/2 - 20) || (ball[i].y > map.y + map.h/2 + 20)){
        ball[i].remove();
        ball.splice(i, 1);
      }
    }
  }

  if(ball2.length > 0){
    for(let i = ball2.length-1; i >= 0; i--){
      ball2[i].draw = () => {
        fill(90);
        rect(0, 0, 20*1.5, 50*1.5);
        fill(164, 91, 62);
        square(0, 0, 25*1.5);
      }
      ball2[i].attractTo(box, -280);
      ball2[i].mass = 3
      ball2[i].rotation = ball2[i].angleTo(box);
      ball2[i].drag = 20
      ball2[i].bounciness = 0;
      ball2[i].layer = 3;
      ball2[i].scale = 1.5
      ball2[i].vel.add(p5.Vector.div(map.vel, 3));
      if(ball2[i].colliding(box)){
        biteL.start();
        r = 205;
        g = 235;
        ball2[i].remove();
        ball2.splice(i, 1);
        points+=2;

      }
      else if((ball2[i].x < map.x - map.w/2 - 20) || (ball2[i].x > map.x + map.w/2 + 20) || (ball2[i].y < map.y - map.h/2 - 20) || (ball2[i].y > map.y + map.h/2 + 20)){
        ball2[i].remove();
        ball2.splice(i, 1);
      }
    }
  }

  if(frameCount%60 == 0){
      countDown++;
   }
  
   if(points >= 20){
    game.stop();
    allSprites.visible = false;
    allSprites.autoUpdate = false;
    mode++;
   }

    let message = `${int(r)} ${int(g)} ${int(b)}\n`;
    port.write(message);
    r*=.9;
    g*=.85;
    
}

function connect() {
  if (!port.opened()) {
    port.open('Arduino', 115200);
  } else {
    port.close();
  }
}

function endScreen(){
  background(100);
  push();
  textAlign(CENTER);
  fill(225);
  textSize(32);
  text("Game Over", width/2, height/2);
  textSize(24);
  text("Score: " + points, width/2, height/2 + 50);
  text("Time: " + countDown, width/2, height/2 + 100);
  textSize(16);
  text("Press Joystick to restart", width/2, height/2 + 150);
  pop();
}

function startScreen(){
  allSprites.autoUpdate = false;
  allSprites.visible = false;
  box.x = width/2;
  box.y = height/2;
  map.x = width/2;
  map.y = height/2;
  background(100);
  push();
  textAlign(CENTER);
  fill(225);
  textSize(32);
  text("Press Joystick to start", width/2, height/2);
  pop();

  if(clicked == false){
    if(sw == 1){
      game.start();
      points = 0;
      countDown = 0;
      mode = 0;
      enemySpawnRate = 90;
      allSprites.visible = true;
      allSprites.autoUpdate = true;
    }
  }
}