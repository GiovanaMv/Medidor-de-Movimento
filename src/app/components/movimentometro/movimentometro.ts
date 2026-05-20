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
  // ⭐ VARIÁVEIS SEPARADAS PARA CADA ATIVIDADE ⭐
  contadorPassos = 0;
  contadorPulos = 0;

  estaAtivo = false;
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

  // Metas diferentes para cada atividade
  metaPassos = 8000;
  metaPulos = 500;
  metaAtingida = false;

  // Getter para mostrar o contador correto na tela
  get contadorAtual(): number {
    return this.tipoAtividade === 'passos' ? this.contadorPassos : this.contadorPulos;
  }

  // Getter para mostrar a meta correta
  get metaAtual(): number {
    return this.tipoAtividade === 'passos' ? this.metaPassos : this.metaPulos;
  }

  // Configuração do sensor
  private sensibilidade = 15;
  private ultimoMovimento = 0;
  private intervaloContagem?: any;
  private deviceMotionHandler: ((event: DeviceMotionEvent) => void) | null = null;

  constructor() {
    this.novaDica();
  }

  ngOnInit() {
    if (!window.DeviceMotionEvent) {
      alert('Seu dispositivo não suporta medição de movimento 😢');
      return;
    }
    this.solicitarPermissao();
  }

  ngOnDestroy() {
    this.pararMedicao();
  }

  // ⭐ TROCAR ATIVIDADE - NÃO RESETA, SÓ MUDA O QUE MOSTRA ⭐
  trocarAtividade(tipo: 'passos' | 'pulos') {
    this.tipoAtividade = tipo;
    // Não reseta nada - mantém os valores de cada atividade
  }

  iniciarMedicao() {
    if (this.estaAtivo) return;

    this.estaAtivo = true;
    this.metaAtingida = false;

    // Cria o handler uma vez
    this.deviceMotionHandler = (event: DeviceMotionEvent) => {
      if (!this.estaAtivo) return;

      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const intensidade = Math.abs(acc.y || 0) + Math.abs(acc.x || 0);
      const agora = Date.now();

      if (intensidade > this.sensibilidade && (agora - this.ultimoMovimento) > 200) {
        this.ultimoMovimento = agora;

        // ⭐ CONTA NA ATIVIDADE CORRETA ⭐
        if (this.tipoAtividade === 'passos') {
          this.contadorPassos++;
        } else {
          this.contadorPulos++;
        }

        this.feedbackVisual();

        // Mensagem motivacional a cada 100 (da atividade atual)
        const valorAtual = this.tipoAtividade === 'passos' ? this.contadorPassos : this.contadorPulos;
        if (valorAtual % 100 === 0 && valorAtual > 0) {
          this.mensagemMotivacional();
        }

        // Verifica se bateu a meta da atividade atual
        if (!this.metaAtingida && this.contadorAtual >= this.metaAtual) {
          this.metaAtingida = true;
          this.parabenizar();
        }
      }
    };

    window.addEventListener('devicemotion', this.deviceMotionHandler);

    // Timer para verificar meta
    this.intervaloContagem = setInterval(() => {
      if (this.estaAtivo && !this.metaAtingida && this.contadorAtual >= this.metaAtual) {
        this.metaAtingida = true;
        this.parabenizar();
      }
    }, 1000);
  }

  private feedbackVisual() {
    const container = document.querySelector('.medidor-container');
    if (container) {
      container.classList.add('pulsar');
      setTimeout(() => container.classList.remove('pulsar'), 200);
    }
  }

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
    const atividade = this.tipoAtividade === 'passos' ? 'passos' : 'pulos';
    this.dicaAtual = `🏆 VOCÊ VENCEU! Meta de ${atividade} alcançada! 🏆`;
    this.estaAtivo = false;
  }

  pararMedicao() {
    this.estaAtivo = false;
    if (this.deviceMotionHandler) {
      window.removeEventListener('devicemotion', this.deviceMotionHandler);
      this.deviceMotionHandler = null;
    }
    if (this.intervaloContagem) {
      clearInterval(this.intervaloContagem);
    }
  }

  resetar() {
    this.pararMedicao();
    // ⭐ RESETA AMBOS OS CONTADORES ⭐
    this.contadorPassos = 0;
    this.contadorPulos = 0;
    this.metaAtingida = false;
    this.novaDica();
  }

  private novaDica() {
    const indice = Math.floor(Math.random() * this.beneficios.length);
    this.dicaAtual = this.beneficios[indice];
  }

  private solicitarPermissao() {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            console.log('Permissão concedida');
          }
        })
        .catch(console.error);
    }
  }
}
