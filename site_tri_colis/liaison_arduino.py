import serial
import serial.tools.list_ports
import requests
import time

URL_SERVEUR = "http://127.0.0.1:5000"
BAUDRATE = 9600
PORT_DE_SECOURS = "COM7"

# ========================================================
# DÉTECTION AUTOMATIQUE DU PORT ARDUINO
# ========================================================
ports = list(serial.tools.list_ports.comports())
port_detecte = None

for p in ports:
    if any(keyword in p.description for keyword in ["Arduino", "CH340", "USB", "Genuino"]):
        port_detecte = p.device
        break

PORT = port_detecte if port_detecte else PORT_DE_SECOURS

# ========================================================
# OUVERTURE DU PORT SÉRIE
# ========================================================
print(f"🔌 Tentative de connexion série sur le port : {PORT}...")
try:
    arduino = serial.Serial(PORT, BAUDRATE, timeout=1)
    time.sleep(2)  # Laisse l'Arduino respirer au démarrage
    print(f"✅ Connexion établie avec succès sur le port {PORT} !")
except Exception as e:
    print(f"❌ Impossible d'ouvrir le port {PORT} : {e}")
    print("👉 Astuce : Vérifie que le Moniteur Série de l'IDE Arduino est bien FERMÉ.")
    exit()

print("\n🚀 Liaison active ! Passe un objet devant les capteurs physiques...")

# ========================================================
# BOUCLE PRINCIPALE D'ÉCOUTE
# ========================================================
while True:
    try:
        ligne_brute = arduino.readline().decode(errors="ignore").strip()

        if ligne_brute:
            print(f"📥 Arduino dit : '{ligne_brute}'")

            # Nettoyage pour parer aux écarts de syntaxe (espaces, casses...)
            commande_propre = ligne_brute.upper().replace(" ", "").replace("_", "")

            # --- CAS CAPTEUR 1 ---
            if "CAPTEUR1" in commande_propre:
                print("➡️ Envoi serveur : Capteur 1 franchi")
                try:
                    requests.post(f"{URL_SERVEUR}/capteur", json={"message": "Capteur 1 franchi"}, timeout=2)

                    # Gestion du colis suivant
                    response = requests.get(f"{URL_SERVEUR}/prochain-colis", timeout=2)
                    data = response.json()

                    if data.get("status") == "ok":
                        angle = data["angle_servo"]
                        print(f"🔄 Angle reçu de la BDD : {angle}° -> Envoi au servomoteur")
                        arduino.write(f"SERVO:{angle}\n".encode())
                    else:
                        print("ℹ️ Aucun colis en attente dans la liste SQLite.")
                except requests.exceptions.RequestException as req_err:
                    print(f"⚠️ Erreur de communication avec le serveur Flask : {req_err}")

            # --- CAS CAPTEUR 2 ---
            elif "CAPTEUR2" in commande_propre:
                print("➡️ Envoi serveur : Capteur 2 franchi")
                try:
                    requests.post(f"{URL_SERVEUR}/capteur", json={"message": "Capteur 2 franchi"}, timeout=2)
                except requests.exceptions.RequestException as req_err:
                    print(f"⚠️ Erreur de communication avec le serveur Flask : {req_err}")

    except KeyboardInterrupt:
        print("\n👋 Fermeture manuelle de la liaison série.")
        arduino.close()
        break
    except Exception as e:
        print(f"💥 Erreur inattendue dans la boucle : {e}")
        time.sleep(1)