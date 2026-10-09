import Modal from './Modal'
import { SITE, GA_ID } from '../config/site'

export default function PrivacyModal({ onClose }) {
  return (
    <Modal title="Política de privacidade" labelledBy="priv-title" onClose={onClose} wide>
      <article className="prose-hoog">
        <h2 id="priv-title">Política de Privacidade</h2>
        <p className="muted">Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>

        <h3>Quem somos</h3>
        <p>
          {SITE.legalName}, com sede em {SITE.address.street}, {SITE.address.district}, {SITE.address.city}/{SITE.address.state}. Contato: WhatsApp {SITE.phoneDisplay}.
        </p>

        <h3>Quais dados tratamos</h3>
        <ul>
          <li>
            <strong>Neste site não há cadastro nem formulário que envie dados para nossos servidores.</strong> Pedidos, reservas e orçamentos são montados no seu navegador e enviados por você diretamente pelo WhatsApp, quando você clica no botão.
          </li>
          <li>
            <strong>Armazenamento local:</strong> guardamos no seu navegador a confirmação de maioridade (por 30 dias), sua escolha neste aviso e o pedido em andamento. Esses dados não saem do seu dispositivo.
          </li>
          {GA_ID && (
            <li>
              <strong>Medição de audiência (Google Analytics):</strong> somente se você aceitar. Coleta dados estatísticos de navegação com IP anonimizado.
            </li>
          )}
          <li>
            <strong>Mapa do Google:</strong> só é carregado se você clicar em “Carregar mapa”. Ao carregar, o Google pode tratar dados conforme a política dele.
          </li>
        </ul>

        <h3>WhatsApp</h3>
        <p>As conversas pelo WhatsApp seguem os termos e a política da Meta. Usamos seus dados apenas para atender o pedido, reserva ou orçamento solicitado.</p>

        <h3>Seus direitos</h3>
        <p>Você pode solicitar acesso, correção ou exclusão de dados que tenha nos enviado por mensagem, a qualquer momento, pelo nosso WhatsApp. Para limpar o que está salvo no navegador, basta apagar os dados do site nas configurações dele.</p>

        <p className="muted">Última atualização: outubro de 2026.</p>
      </article>
    </Modal>
  )
}
