/**
 * Contrôleur AGV — maquette interactive de démonstration (interface locale)
 * Les commandes et la télémétrie sont simulées dans le navigateur, sans lien avec le robot.
 */
class AGVController {
  constructor(options = {}) {
    this.simulation = options.simulation !== false;
    this.selectedAGV = 'agv1';
    this.mode = 'manual';
    this.emergencyActive = false;
    this.listeners = [];

    this.state = {
      agv1: this._defaultState('AGV 1 — Production'),
      agv2: this._defaultState('AGV 2 — Approvisionnement')
    };

    if (this.simulation) {
      this._simInterval = setInterval(() => this._simulateTick(), 2000);
    }
  }

  _defaultState(name) {
    return {
      name,
      status: 'idle',
      battery: 85 + Math.random() * 10,
      speed: 0,
      orientation: 0,
      temperature: 28 + Math.random() * 5,
      lidarOk: true,
      motorOk: true,
      mode: 'manual',
      position: { x: 0, y: 0 }
    };
  }

  selectAGV(id) {
    if (id !== 'agv1' && id !== 'agv2') return;
    this.selectedAGV = id;
    this._notify();
  }

  setMode(mode) {
    this.mode = mode;
    const s = this.state[this.selectedAGV];
    s.mode = mode;
    this._log('info', `Mode ${mode} activé sur ${s.name}`);
    this._notify();
  }

  /**
   * Simule une commande sur la maquette d'interface
   * @param {'forward'|'backward'|'left'|'right'|'stop'|'emergency_stop'} command
   */
  sendCommand(command) {
    const agv = this.state[this.selectedAGV];

    if (command === 'emergency_stop') {
      this.emergencyActive = true;
      agv.status = 'emergency';
      agv.speed = 0;
      this._log('error', `⚠ ARRÊT D'URGENCE — ${agv.name}`);
      this._notify();
      return true;
    }

    if (this.emergencyActive) {
      this._log('warn', 'Commande ignorée — arrêt d\'urgence actif');
      return false;
    }

    if (this.mode === 'auto' && command !== 'stop') {
      this._log('warn', 'Commande ignorée — mode automatique actif');
      return false;
    }

    const speeds = { forward: 0.3, backward: -0.2, left: 0, right: 0, stop: 0 };
    const dirs = { forward: 0, backward: 180, left: -90, right: 90, stop: agv.orientation };

    agv.speed = speeds[command] ?? 0;
    if (command === 'left') agv.orientation -= 15;
    if (command === 'right') agv.orientation += 15;
    if (command === 'forward' || command === 'backward') agv.orientation = dirs[command];
    agv.status = command === 'stop' ? 'idle' : 'moving';

    this._log('cmd', `${agv.name} ← ${command} (démo, v=${agv.speed} m/s)`);

    if (command !== 'stop') {
      setTimeout(() => {
        if (agv.status === 'moving') {
          agv.status = 'idle';
          agv.speed = 0;
          this._notify();
        }
      }, 1500);
    }

    this._notify();
    return true;
  }

  resetEmergency() {
    this.emergencyActive = false;
    Object.values(this.state).forEach(s => {
      if (s.status === 'emergency') s.status = 'idle';
    });
    this._log('info', 'Arrêt d\'urgence réinitialisé');
    this._notify();
  }

  getState(agvId) {
    return this.state[agvId || this.selectedAGV];
  }

  getAllStates() {
    return { ...this.state };
  }

  onChange(callback) {
    this.listeners.push(callback);
    return () => { this.listeners = this.listeners.filter(l => l !== callback); };
  }

  getLogs() { return this._logs.slice(-50); }

  destroy() {
    if (this._simInterval) clearInterval(this._simInterval);
  }

  _logs = [];

  _log(level, msg) {
    this._logs.push({ level, msg, time: new Date().toLocaleTimeString('fr-FR') });
    if (this._logs.length > 100) this._logs.shift();
  }

  _notify() {
    this.listeners.forEach(cb => cb(this));
  }

  _simulateTick() {
    if (this.emergencyActive) return;
    Object.values(this.state).forEach(s => {
      if (s.status === 'moving') return;
      s.battery = Math.max(20, s.battery - 0.05);
      s.temperature = 28 + Math.random() * 8;
    });
    this._notify();
  }
}

window.AGVController = AGVController;
