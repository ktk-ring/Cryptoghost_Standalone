import processing.serial.*;
import processing.video.*;
import processing.sound.*;

int vid = 3;
Movie[] movie = new Movie[vid];

String[] video = {"intro.mov", "slot.mov", "transition.mov"};
  
Serial btnPort;
int val;

//그래픽 제어
int size = 496;
float size2D = 67.5;
float size3D = 187.5;
int stroke = 5;
PImage resultOverlay;
PImage[] font2D = new PImage[9];
PImage[] font3D = new PImage[9];

//시작 및 초기화
int startBtn = 0;
int randomize = 0;
int resetBtn = 0;
int result = 0;
float slotFrame;

//캐릭터 부위
PImage[] output = new PImage[5];
int[] no = new int[5];
int[] ghost = new int[5];
float rare00;
float rare01;
float rare10;

//사운드
SoundFile[] bodySound = new SoundFile[7];
float bodySoundFrame;
int bodySfx = 0;
SoundFile bgm;
SoundFile click;
SoundFile slot;
SoundFile reset;
int bgmSfx = 0;
int clickSfx = 0;
int slotSfx = 0;
int resetSfx = 0;

void setup() {
  fullScreen();
  importMovies();
  btnPort = new Serial(this, Serial.list()[4], 9600);
  resultOverlay = loadImage("resultOverlay.png");
}

void draw() {
  movie[0].loop();
  image(movie[0], 0, 0, width, height);
  bgmSfx++;
  if(randomize == 1) {
    rare00 = 0.0001; //0.01%
    rare01 = 0.0005; //0.05%
    float body = random(1);
    if(body < rare00) {
      no[0] = 0;
    } else if(body < rare00 + rare01) {
      no[0] = 1;
    } else {
      no[0] = int(random(2, 7));
    }
    if(no[0] > 1) {
      rare10 = 0.75; //75%
      float mask = random(1);
      if(mask < rare10) {
        no[1] = 0;
      } else {
        no[1] = int(random(1, 6));
      }
      no[2] = int(random(5));
      no[3] = int(random(7));
      no[4] = int(random(3));
    } else {
      for(int none = 1; none < 5; none++) {
        no[none] = 0;
      }
    }
    randomize++;
  }
  if(randomize == 2){
    for(int font = 0; font < 8; font++) {
      font2D[font] = loadImage("Num_2D_"+font+".png");
      font3D[font] = loadImage("Num_3D_"+font+".png");
    }
    for(int img = 0; img < 5; img++) {
      ghost[img] = img;
      output[img] = loadImage(ghost[img]+"_"+no[img]+".png");
    }
    randomize++;
  }

  if(startBtn > 0) {
    movie[1].play();
    image(movie[1], 0, 0, width, height);
    result++;
  }

  if(result > 0) {
    slotFrame = movie[1].time();
    if(slotFrame >= 8.0) {
      movie[2].play();
      bodySfx++;
      image(movie[2], 0, 0, width, height);
      if(slotFrame >= 8.5) {
        for(int ch = 0; ch < 5; ch++) {
          image(output[ch], 360-size/2, 575-size/2, size, size);
        }
        image(resultOverlay, 0, 0, width, height);
        image(font3D[no[0]], 921-size3D/2, 640-size3D/2);
        image(font3D[no[1]], 1002-size3D/2, 640-size3D/2);
        image(font3D[no[2]], 1087-size3D/2, 640-size3D/2);
        image(font3D[no[3]], 1172-size3D/2, 640-size3D/2);
        image(font3D[no[4]], 1251-size3D/2, 640-size3D/2);
      }
    }
  }
  
  if(btnPort.available() > 0) {
    val = btnPort.read();
    delay(10);
  }
  
  if(val == 1) {
    startBtn++;
    randomize++;
    clickSfx++;
    slotSfx++;
    resetSfx = 0;
  }
  else if(val == 2) {
    startBtn = 0;
    randomize = 0;
    result = 0;
    slotFrame = 0;
    clickSfx = 0;
    click.stop();
    slotSfx = 0;
    slot.stop();
    bodySfx = 0;
    resetSfx++;
    movie[0].loop();
    movie[1].stop();
    movie[2].stop();
    image(movie[0], 0, 0, width, height);
  }
  
  if(bgmSfx == 1) {
    bgm = new SoundFile(this, "bgm.wav");
    bgm.loop();
    bgmSfx++;
  }
  if(clickSfx == 1) {
    click = new SoundFile(this, "click.wav");
    click.play();
    clickSfx++;
  }
  if(slotSfx == 1) {
    slot = new SoundFile(this, "slot.wav");
    slot.play();
    slotSfx++;
  }
  if(bodySfx == 1) {
    for(int i = 0; i < 7; i++) {
      bodySound[i] = new SoundFile(this, "sound_"+i+".wav");
    }
    bodySound[no[0]].play(); 
    bodySfx++;
  }
  if(resetSfx == 1) {
    reset = new SoundFile(this, "reset.wav");
    reset.play();
    resetSfx++;
  }
}

void importMovies() {
  for(int i = 0; i < vid; i++) {
    movie[i] = new Movie(this, video[i]);
  }
}

void movieEvent(Movie m) {
  m.read();
}
