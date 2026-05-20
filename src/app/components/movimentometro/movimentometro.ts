import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movimentometro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movimentometro.html',
  styleUrls: ['./movimentometro.css']
})
export class MovimentometroComponent implements OnInit, OnDestroy {
  passos = 0;
  estaAtivo = false;
  tipoAtividade: 'passos' | 'pulos' = 'passos';

  // ⭐ ADICIONEI ESSAS VARIÁVEIS QUE ESTAVAM FALTANDO ⭐
  dicaAtual = '🧠 Mexer o corpo libera endorfinas e melhora o humor!';
  metaDiaria = 8000;
  metaAtingida = false;

  private beneficios = [
    '🧠 Melhora a memória e concentração!',
    '😊 Libera endorfinas = felicidade imediata',
    '💪 Fortalece coração e pulmões',
    '🎯 Reduz ansiedade e estresse',
    '🌙 Melhora qualidade do sono'
  ];

  private sensibilidade = 15;
  private ultimoMovimento = 0;
  private deviceMotionHandler: ((event: DeviceMotionEvent) => void) | null = null;

  ngOnInit() {
    this.verificarSuporteSensor();
    this.rotacionarDicas();
  }

  ngOnDestroy() {
    this.pararMedicao();
  }

  private rotacionarDicas() {
    setInterval(() => {
      const indice = Math.floor(Math.random() * this.beneficios.length);
      this.dicaAtual = this.beneficios[indice];
    }, 8000);
  }

  private verificarSuporteSensor() {
    if (!window.DeviceMotionEvent) {
      alert('Seu dispositivo não suporta medição de movimento 😢');
      return;
    }
  }

  async iniciarMedicao() {
    if (this.estaAtivo) return;

    // Para iOS (iPhone)
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          this.ativarSensor();
        }
      } catch (error) {
        console.error('Permissão negada', error);
      }
    } else {
      this.ativarSensor();
    }
  }

  private ativarSensor() {
    if (this.estaAtivo) return;

    this.estaAtivo = true;
    this.passos = 0;
    this.metaAtingida = false;

    this.deviceMotionHandler = (event: DeviceMotionEvent) => {
      if (!this.estaAtivo) return;

      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const intensidade = Math.abs(acc.y || 0) + Math.abs(acc.x || 0);
      const agora = Date.now();

      if (intensidade > this.sensibilidade && (agora - this.ultimoMovimento) > 200) {
        this.ultimoMovimento = agora;
        this.passos++;
        this.feedbackVisual();

        // Verifica se bateu a meta
        if (this.passos >= this.metaDiaria && !this.metaAtingida) {
          this.metaAtingida = true;
          this.dicaAtual = '🏆 PARABÉNS! Você atingiu sua meta diária! 🏆';
        }
      }
    };

    window.addEventListener('devicemotion', this.deviceMotionHandler);
  }

  private feedbackVisual() {
    const container = document.querySelector('.medidor-container');
    if (container) {
      container.classList.add('pulsar');
      setTimeout(() => container.classList.remove('pulsar'), 200);
    }
  }

  pararMedicao() {
    if (this.deviceMotionHandler) {
      window.removeEventListener('devicemotion', this.deviceMotionHandler);
      this.deviceMotionHandler = null;
    }
    this.estaAtivo = false;
  }

  resetar() {
    this.pararMedicao();
    this.passos = 0;
    this.metaAtingida = false;
  }
}
