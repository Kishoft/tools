#include <WiFi.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

// ======== Configuración Wi-Fi ========
const char* ssid = "Wifi";
const char* password = "aaaassddd";
WiFiServer server(80);

// ======== Configuración BLE ========
int scanTime = 3;  // duración del escaneo BLE en segundos
BLEScan* pBLEScan;

// Nombre que querés detectar (o "" para cualquiera)
const String TARGET_NAME = "";

// Umbral de señal para considerar cercano
const int RSSI_THRESHOLD = -80;

// Estado de presencia y RSSI
bool bleNearby = false;
int bestRSSI = -127;  // valor por defecto (muy lejos)

// Temporizador para escaneos
unsigned long lastScanTime = 0;
const unsigned long SCAN_INTERVAL = 5000;  // 5 s

class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice advertisedDevice) {
    int rssi = advertisedDevice.getRSSI();
    String name = advertisedDevice.getName().c_str();

    // Si TARGET_NAME está vacío o coincide con parte del nombre,
    // y la señal es más fuerte que el umbral:
    if ((TARGET_NAME == "" || name.indexOf(TARGET_NAME) >= 0) && rssi > RSSI_THRESHOLD) {
      bleNearby = true;
      if (rssi > bestRSSI) {
        bestRSSI = rssi;  // guardamos la señal más fuerte
      }
    }
  }
};

void setup() {
  Serial.begin(115200);

  // ======== Wi-Fi ========
  WiFi.begin(ssid, password);
  Serial.print("Conectando a Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("¡Conectado! IP local: ");
  Serial.println(WiFi.localIP());
  server.begin();

  // ======== Configurar BLE ========
  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true);
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);

  lastScanTime = millis();
}

void loop() {
  unsigned long now = millis();

  // Escaneos periódicos no bloqueantes
  if (now - lastScanTime >= SCAN_INTERVAL) {
    lastScanTime = now;
    bleNearby = false;
    bestRSSI = -127;  // reset

    // Hace un scan de scanTime segundos
    BLEScanResults* results = pBLEScan->start(scanTime, false);
    Serial.print("BLE encontrados: ");
    Serial.println(results->getCount());

    pBLEScan->clearResults();
  }

  // ======== Servidor HTTP ========
  WiFiClient client = server.available();
  if (client) {
    // Espera petición
    while (!client.available()) delay(1);
    String request = client.readStringUntil('\r');
    client.flush();

    // Responder JSON con bleNearby y rssi
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: application/json");
    client.println("Connection: close");
    client.println();
    client.print("{\"bleNearby\":");
    client.print(bleNearby ? "true" : "false");
    client.print(",\"rssi\":");
    client.print(bleNearby ? bestRSSI : 0);
    client.print(",\"cerca\":");
    if (bestRSSI > -40) {
      client.print("true");
    } else {
      client.print("false");
    }
    client.println("}");
    client.stop();
  }
}
