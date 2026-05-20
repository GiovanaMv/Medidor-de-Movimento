import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movimentometro',
  standalone: true, // Usando standalone component (Angular 14+)
  imports: [CommonModule],
  templateUrl: './movimentometro.html',
  styleUrls: ['./movimentometro.css']
})
export class MovimentometroComponent implements OnInit, OnDestroy {
  // Variáveis principais
  passos = 0;
  estaAtivo = false;
  estaMedindo = false;
  tipoAtividade: 'passos' | 'pulos' = 'passos';

  // Dicas informativas
  dicaAtual = '';
  beneficios: string[] = [
    '🧠 Melhora a memória e concentração!',
    '😊 Libera endorfinas = felicidade imediata',
    '💪 Fortalece coração e pulmões',
    '🎯 Reduz ansiedade e estresse',
    '🌙 Melhora qualidade do sono'
  ];

  // Metas diárias
  metaDiaria = 8000;
  metaAtingida = false;

  // Configuração do sensor
  private sensibilidade = 15;
  private ultimoMovimento = 0;
  private intervaloContagem?: any;

  constructor() {
    this.novaDica();
  }

  ngOnInit() {
    // Verificar se o dispositivo suporta o sensor
    if (!window.DeviceMotionEvent) {
      alert('Seu dispositivo não suporta medição de movimento 😢');
      return;
    }

    // Solicitar permissão no iOS
    this.solicitarPermissao();
  }

  ngOnDestroy() {
    this.pararMedicao();
  }

  // 🎯 Método principal: Iniciar medição
  iniciarMedicao() {
    if (!this.estaAtivo) {
      this.estaAtivo = true;
      this.passos = 0;
      this.metaAtingida = false;

      // Registrar o evento de movimento
      window.addEventListener('devicemotion', this.detectarMovimento.bind(this));

      // Atualizar contador a cada segundo (apenas visual)
      this.intervaloContagem = setInterval(() => {
        if (this.estaAtivo && this.passos >= this.metaDiaria && !this.metaAtingida) {
          this.metaAtingida = true;
          this.parabenizar();
        }
      }, 1000);
    }
  }

  // 🎯 Detector de movimento (o coração do sistema)
  private detectarMovimento(event: DeviceMotionEvent) {
    if (!this.estaAtivo) return;

    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    // Calcula intensidade do movimento (Y = cima/baixo, X = lado)
    const intensidade = Math.abs(acc.y || 0) + Math.abs(acc.x || 0);

    // Evita múltiplos registros do mesmo movimento
    const agora = Date.now();
    if (intensidade > this.sensibilidade && (agora - this.ultimoMovimento) > 200) {
      this.ultimoMovimento = agora;
      this.passos++;

      // Feedback visual vibrante
      this.feedbackVisual();

      // Mensagem motivacional a cada 100 passos
      if (this.passos % 100 === 0) {
        this.mensagemMotivacional();
      }
    }
  }

  // 🎨 Feedback visual divertido
  private feedbackVisual() {
    const container = document.querySelector('.medidor-container');
    if (container) {
      container.classList.add('pulsar');
      setTimeout(() => container.classList.remove('pulsar'), 200);
    }
  }

  // 🏆 Mensagens motivacionais
  private mensagemMotivacional() {
    const mensagens = [
      '🚀 Voa, campeão!',
      '💪 Tá arrasando!',
      '🔥 Continue assim!',
      '⭐ Você é fera!',
      '🎯 Meta chegando perto!'
    ];
    const msg = mensagens[Math.floor(Math.random() * mensagens.length)];
    this.dicaAtual = msg;
    setTimeout(() => this.novaDica(), 3000);
  }

  private parabenizar() {
    this.dicaAtual = '🏆 VOCÊ VENCEU! Meta diária alcançada! 🏆';
    this.estaAtivo = false;
  }

  pararMedicao() {
    this.estaAtivo = false;
    window.removeEventListener('devicemotion', this.detectarMovimento.bind(this));
    if (this.intervaloContagem) {
      clearInterval(this.intervaloContagem);
    }
  }

  resetar() {
    this.pararMedicao();
    this.passos = 0;
    this.metaAtingida = false;
    this.novaDica();
  }

  private novaDica() {
    const indice = Math.floor(Math.random() * this.beneficios.length);
    this.dicaAtual = this.beneficios[indice];
  }

  private solicitarPermissao() {
    // Para iOS precisa de permissão explícita
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      // Adicione isso para iOS 13+
      document.body.addEventListener('click', () => {
        (DeviceMotionEvent as any).requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              console.log('Permissão concedida');
              window.addEventListener('devicemotion', this.detectarMovimento.bind(this));
            }
          })
          .catch(console.error);
      }, { once: true });
    } else {
      // Para Android e outros
      window.addEventListener('devicemotion', this.detectarMovimento.bind(this));
    }
  }
}
