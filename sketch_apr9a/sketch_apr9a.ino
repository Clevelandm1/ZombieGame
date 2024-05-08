#define VRX_PIN A0
#define VRY_PIN A1
#define SW_PIN 2
const int numReadings = 10;

int xReadings[numReadings];  // the readings from the analog input
int yReadings[numReadings];
int readIndex = 0;          // the index of the current reading
float xTotal, yTotal = 0;              // the running total
float xAverage, yAverage = 0;            // the average
float xStart, yStart;
bool start = false;
unsigned long lastTime = 0;
const int interval = 35;


const int red = 11;
const int green = 10;
const int blue = 9;
int brightness = 0;
char incomingData[4];
bool newData = false;
char endMarker = '\n';

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(SW_PIN, INPUT_PULLUP);

  pinMode(red, OUTPUT);
  pinMode(green, OUTPUT);
  pinMode(blue, OUTPUT);

  for(int i = 0; i < numReadings; i++){
    xReadings[i] = 0;
    yReadings[i] = 0;
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  int x = analogRead(VRX_PIN);
  int y = analogRead(VRY_PIN);
  int sw = digitalRead(SW_PIN);


  xTotal = xTotal - xReadings[readIndex];
  yTotal = yTotal - yReadings[readIndex];
  // read from the sensor:
  xReadings[readIndex] = x;
  yReadings[readIndex] = y;
  // add the reading to the total:
  xTotal = xTotal + x;
  yTotal = yTotal + y;
  // advance to the next position in the array:
  readIndex = readIndex + 1;

  // calculate the average:
  xAverage = xTotal / numReadings;
  yAverage = yTotal / numReadings;

  // if we're at the end of the array...
  if (readIndex >= numReadings) {
    // ...wrap around to the beginning:
    readIndex = 0;
      if(!start){
      xStart = xAverage;
      yStart = yAverage;
      start = true;
    }
  }



  if(start){
    unsigned long now = millis();
    if(now - lastTime > interval){
      Serial.print(map( (yAverage - yStart), 530, -510, -4, 4));
      Serial.print(",");
      Serial.print(map( (xAverage - xStart), -520, 503, -4, 4));
      Serial.print(",");
      Serial.println(!sw);

      lastTime = now;
    }
  }

  while (Serial.available() > 0){
    int r = Serial.parseInt();
    int g = Serial.parseInt();
    int b = Serial.parseInt();

    r = constrain(r, 0, 255);
    g = constrain(g, 0, 255);
    b = constrain(b, 0, 255);
  
    if(Serial.read() == '\n'){
      analogWrite(red, r);
      analogWrite(green, g);
      analogWrite(blue, b);
    }



    // static byte i = 0;
    // char data = Serial.read();
    // if(data != endMarker){
    //   incomingData[i] = data;
    //   i++;
    // }
    // else{
    //   i = 0;
    //   newData = true;
    // }
  }

  // if(newData){
  //   analogWrite(red, r);
  //   analogWrite(green, g);
  //   analogWrite(blue, b);
  //   newData = false;
  // }



    
}



