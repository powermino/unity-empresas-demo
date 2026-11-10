/**
 * Configuração central do site.
 * Todo o conteúdo abaixo foi conferido no site oficial (https://unityempresas.com.br/)
 * em 10/11/2026. Itens marcados com `confirmar: true` têm divergências no próprio
 * site oficial e devem ser validados com a Unity antes da publicação.
 */

const env = import.meta.env
const BASE = env.BASE_URL || '/'
export const asset = (p) => `${BASE}${p.replace(/^\//, '')}`

// Número publicado no site oficial (telefone/WhatsApp 41 3501-6022).
// Pode ser sobrescrito por VITE_WHATSAPP_NUMBER. Confirmar antes de publicar.
const WHATSAPP = (env.VITE_WHATSAPP_NUMBER || '554135016022').replace(/\D/g, '')

export const site = {
  name: 'Unity Empresas',
  legalName: 'MP EMPRESAS LTDA',
  cnpj: '42.045.186/0001-45',
  tagline: 'Um parceiro TIM Empresas',
  slogan: 'Sua linha direta com a melhor operadora do país',
  officialUrl: 'https://unityempresas.com.br/',
  url: env.VITE_SITE_URL || '',
  formEndpoint: env.VITE_FORM_ENDPOINT || '',

  contact: {
    phoneDisplay: '(41) 3501-6022',
    phoneHref: 'tel:+554135016022',
    email: 'contato@unityempresas.com.br',
    address: 'R. Pereira Barreto, 16 — Chácara da Barra, Campinas – SP, CEP 13090-780',
    whatsappNumber: WHATSAPP,
  },

  social: {
    instagram: { handle: '@unityempresas', url: 'https://www.instagram.com/unityempresas/' },
    facebook: { url: 'https://facebook.com/unityempresas' },
  },

  logo: asset('assets/logo-white.png'),
}

export const whatsappLink = (text = 'Olá, vi seu site e gostaria de atendimento') =>
  `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(text)}`

/**
 * Indicadores institucionais — exatamente como publicados no site oficial.
 * `value` null => o contador exibe um marcador editável, sem inventar números.
 */
export const stats = [
  { value: 12, prefix: '+', suffix: '', label: 'anos de mercado', note: 'Atuação desde 2013' },
  { value: 100, prefix: '', suffix: ' mil', label: 'clientes atendidos' },
  {
    // A CONFIRMAR: o site oficial cita "17 unidades" e também "21 escritórios".
    // Preencha `value` (ex.: 17) somente após confirmação da Unity.
    value: null,
    prefix: '',
    suffix: '',
    label: 'unidades',
    confirmar: true,
  },
  {
    // A CONFIRMAR: o site oficial cita "10 estados" e também "12 estados".
    value: null,
    prefix: '',
    suffix: '',
    label: 'estados',
    confirmar: true,
  },
]

export const nav = [
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Atuação', href: '#atuacao' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Parceiros', href: '#parceiros' },
  { label: 'Carreiras', href: '#carreiras' },
  { label: 'Contato', href: '#contato' },
]

/** Soluções e características conforme publicadas no site oficial. */
export const solutions = [
  {
    id: 'tim-black',
    name: 'TIM Black Empresa',
    kind: 'Plano móvel corporativo',
    icon: 'Smartphone',
    summary: 'Plano móvel ilimitado da TIM para maximizar a comunicação da sua empresa.',
    features: [
      'Ligações ilimitadas para todo o Brasil com o código 41 da TIM',
      '800 SMS',
      'Venda facilitada de aparelhos em 24x e aparelhos em comodato',
      'Pós-venda para renovação e atualização de benefícios',
    ],
    highlight: 'Pacotes de até 100GB',
    whatsapp: 'Olá, gostaria de saber mais sobre o TIM Black Empresa',
  },
  {
    id: 'ultrafibra',
    name: 'TIM Ultrafibra',
    kind: 'Internet por fibra óptica',
    icon: 'Cable',
    summary: 'Velocidade e estabilidade para sua casa ou empresa decolar.',
    features: [
      'Ultra velocidade',
      'Conexão estável',
      'Performance para múltiplos usuários',
      'Tecnologia de ponta',
    ],
    highlight: 'Para trabalho remoto, videochamadas e 4K',
    whatsapp: 'Olá, gostaria de saber mais sobre a TIM Ultrafibra',
  },
  {
    id: 'wttx',
    name: 'Internet Empresa WTTX',
    kind: 'Internet sem fio pela rede móvel',
    icon: 'RadioTower',
    summary: 'Conectividade imediata para o seu negócio, sem fios e sem espera.',
    features: [
      'Instalação simplificada: modem Wi-Fi, sem cabos ou visita técnica',
      'Flexibilidade para eventos, canteiros, lojas temporárias e backup',
      'Rede móvel TIM',
      'Planos empresariais com gestão e suporte da Unity',
    ],
    highlight: 'Sem obras, sem espera',
    whatsapp: 'Olá, gostaria de saber mais sobre a Internet Empresa WTTX',
  },
  {
    id: 'm2m',
    name: 'Telemetria M2M',
    kind: 'IoT e conectividade de máquinas',
    icon: 'Cpu',
    summary:
      'Conecte equipamentos, automatize processos e decida com dados em tempo real, com a robustez da rede TIM Empresas.',
    features: [
      'Monitoramento em tempo real de veículos, máquinas e sensores',
      'SIM cards M2M para máquinas de cartão, rastreadores e sensores',
      'Gestão centralizada de linhas de voz e dados M2M',
    ],
    highlight: 'SIM cards M2M para IoT',
    whatsapp: 'Olá, gostaria de saber mais sobre Telemetria M2M',
  },
]

/** Unidades listadas no site oficial (seção “Abrangência Nacional”). */
export const units = [
  { uf: 'PR', state: 'Paraná', cities: ['Curitiba', 'Pinhais', 'Maringá', 'Mal. Cândido Rondon'] },
  { uf: 'SC', state: 'Santa Catarina', cities: ['Joinville'] },
  { uf: 'SP', state: 'São Paulo', cities: ['Campinas'] },
  { uf: 'GO', state: 'Goiás', cities: ['Goiânia'] },
  { uf: 'DF', state: 'Distrito Federal', cities: ['Brasília'] },
  { uf: 'BA', state: 'Bahia', cities: ['Salvador', 'Feira de Santana'] },
  { uf: 'PE', state: 'Pernambuco', cities: ['Recife', 'Caruaru', 'Paulista'] },
  { uf: 'AL', state: 'Alagoas', cities: ['Maceió'] },
  { uf: 'RN', state: 'Rio Grande do Norte', cities: ['Natal'] },
  { uf: 'CE', state: 'Ceará', cities: ['Fortaleza'] },
]

/** Processo comercial (“O nosso trabalho”, site oficial). */
export const process = [
  { title: 'Análise de custos', text: 'Entendemos o cenário atual de comunicação e custos da sua empresa.' },
  { title: 'Definição da melhor solução', text: 'Desenhamos a combinação de soluções TIM Empresas adequada à sua operação.' },
  { title: 'Contratação e fechamento', text: 'Conduzimos a contratação e seguimos ao seu lado no pós-venda.' },
]

/**
 * Miniaturas do Instagram: adicione aqui apenas imagens autorizadas pela Unity,
 * ex.: { src: asset('assets/instagram/01.jpg'), alt: '...', url: 'https://www.instagram.com/p/...' }
 * Vazio => o bloco mostra uma composição visual da marca, sem simular publicações.
 */
export const instagramThumbs = []
