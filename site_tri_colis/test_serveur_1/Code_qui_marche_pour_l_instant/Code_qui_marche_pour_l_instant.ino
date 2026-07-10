#include <Servo.h>

#define dirPin 2
#define stepPin 3
#define servoPin 5
#define capteur1Pin 12
#define capteur2Pin 13

Servo monServo;

unsigned long dernierPas = 0;
const unsigned long intervalPas = 500;
bool stepEtat = false;

bool capteur1Prec = HIGH;
bool capteur2Prec = HIGH;

void setup() {
  Serial.begin(9600); // Canal de discussion ouvert !

  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
  pinMode(capteur1Pin, INPUT_PULLUP);
  pinMode(capteur2Pin, INPUT_PULLUP);

  digitalWrite(dirPin, HIGH);
  digitalWrite(stepPin, LOW);

  monServo.attach(servoPin);
  monServo.write(0); 
}

void loop() {
  unsigned long maintenant = micros();
  bool capteur1 = digitalRead(capteur1Pin);
  bool capteur2 = digitalRead(capteur2Pin);

  // Moteur pas à pas
  if (capteur2 == HIGH) {
    if (maintenant - dernierPas >= intervalPas) {
      dernierPas = maintenant;
      stepEtat = !stepEtat;
      digitalWrite(stepPin, stepEtat ? HIGH : LOW);
    }
  } else {
    digitalWrite(stepPin, LOW);
    stepEtat = false;
    dernierPas = micros();
  }

  // Franchissement Capteur 1
  if (capteur1 == LOW && capteur1Prec == HIGH) {
    Serial.println("CAPTEUR_1");
    delay(200); 
  }
  capteur1Prec = capteur1;

  // Franchissement Capteur 2
  if (capteur2 == LOW && capteur2Prec == HIGH) {
    Serial.println("CAPTEUR_2");
    delay(200); 
  }
  capteur2Prec = capteur2;

  // Lecture des ordres du Servo envoyés par Python
  if (Serial.available() > 0) {
    String ordre = Serial.readStringUntil('\n');
    ordre.trim(); 

    if (ordre.startsWith("SERVO:")) {
      int angle = ordre.substring(6).toInt(); 
      if (angle >= 0 && angle <= 180) {
        monServo.write(angle); 
      }
    }
  }
} 