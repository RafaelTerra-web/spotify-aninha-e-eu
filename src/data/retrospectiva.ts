export interface SlideData {
  id: number;
  type:
    | 'start'
    | 'story'
    | 'video'
    | 'vibe'
    | 'timeline'
    | 'ranking'
    | 'stats'
    | 'artists'
    | 'mood'
    | 'gallery'
    | 'horror'
    | 'space_movie'
    | 'cinematic_text'
    | 'transition'
    | 'movie'
    | 'letter'
    | 'elogios'
    | 'childhood'
    | 'ending';
  title?: string;
  subtitle?: string;
  text?: string;
  image?: string;
  gradient?: string;
}

export const slides: SlideData[] = [
  {
    id: 1,
    type: 'start',
  },
  {
    id: 2,
    type: 'story',
    title: 'Nossa trilha sonora começou aqui',
    text: 'Em agosto de 2025, o "play" foi apertado e a nossa música começou a tocar. Sem saber que viraria o meu álbum favorito.',
    image: '/images/Ana.jpeg',
    gradient: 'gradient-bg',
  },
  {
    id: 3,
    type: 'vibe',
    title: 'A Nossa Personalidade Sonora',
    subtitle: 'Nossa Vibe: Conexão Total',
    text: 'Criamos um ritmo próprio que ninguém mais consegue seguir. Uma sintonia que não precisa de explicação.',
  },
  {
    id: 41,
    type: 'story',
    title: 'Como tudo começou...',
    text: 'A nossa primeira ida ao shopping. Um passeio simples que já mostrava o quanto a gente se divertia com pouco.',
    image: '/images/Nossa primeira ida ao shopping.jpeg',
    gradient: 'gradient-bg',
  },
  {
    id: 4101,
    type: 'story',
    title: 'Aquelas conversas infinitas',
    text: 'Logo percebi que a melhor parte do meu dia era quando o meu celular brilhava com uma notificação sua.',
    image: '/images/Ana Sorrindo.jpeg',
    gradient: 'gradient-purple',
  },
  {
    id: 4103,
    type: 'story',
    title: 'A companhia perfeita',
    text: 'Com você, até os momentos mais normais se transformam em memórias que eu não quero esquecer.',
    image: '/images/Nós 3.jpeg',
    gradient: 'gradient-bg',
  },
  {
    id: 411,
    type: 'transition',
    text: 'O tempo foi passando...',
  },
  {
    id: 412,
    type: 'cinematic_text',
    text: 'Agosto...',
  },
  {
    id: 413,
    type: 'cinematic_text',
    text: 'Setembro...',
  },
  {
    id: 414,
    type: 'cinematic_text',
    text: 'Cada encontro passou a ser a melhor parte da minha semana.',
  },
  {
    id: 415,
    type: 'cinematic_text',
    text: 'E então: Outubro, o pedido de namoro.',
  },
  {
    id: 42,
    type: 'story',
    title: 'O Primeiro Jantar',
    text: 'Nossa primeira ida a um restaurante. O nervosismo misturado com a felicidade de estar ali com você.',
    image: '/images/NossaPrimeiraIdaAoRestaurante.jpeg',
    gradient: 'gradient-purple',
  },
  {
    id: 5,
    type: 'stats',
  },
  {
    id: 51,
    type: 'artists',
  },
  {
    id: 52,
    type: 'mood',
  },
  {
    id: 6,
    type: 'ranking',
  },
  {
    id: 7,
    type: 'elogios',
  },
  {
    id: 8,
    type: 'gallery',
  },
  {
    id: 815,
    type: 'cinematic_text',
    text: 'Amor da minha vida...',
  },
  {
    id: 82,
    type: 'childhood',
  },
  {
    id: 825,
    type: 'cinematic_text',
    text: 'Nossos destinos foram traçados desde à maternidade',
  },
  {
    id: 85,
    type: 'transition',
    text: 'Nossas idas ao cinema...',
  },
  {
    id: 86,
    type: 'story',
    title: 'Mais que apenas ingressos',
    text: 'Eu nunca vou esquecer o cuidado que você teve ao garantir nossos ingressos na estreia. Eu provavelmente teria esquecido, mas você me trouxe essa atenção e esse carinho que eu guardo no fundo do meu coração.',
    image: '/images/NósNoPrimeiroFilmeJuntos.jpeg',
    gradient: 'gradient-bg',
  },
  {
    id: 80,
    type: 'horror',
  },
  {
    id: 81,
    type: 'space_movie',
  },
  {
    id: 9,
    type: 'movie',
  },
  {
    id: 91,
    type: 'transition',
    text: 'Confessa, você achou que a gente ia dançar igual a ele né?',
  },
  {
    id: 10,
    type: 'story',
    title: 'Nosso próprio ritmo',
    text: 'Eu juro que tentei fazer os bonequinhos dançarem igual ao Michael, mas a habilidade de desenvolvedor não colaborou... O que vale é a intenção e o quanto a gente se diverte tentando!',
    image: '/images/Nós 2.jpeg',
    gradient: 'gradient-bg',
  },
  {
    id: 100,
    type: 'timeline',
  },
  {
    id: 101,
    type: 'video',
    title: 'Invencível com você',
    text: 'Me sinto invencível quando você está por perto. Nada parece impossível ao seu lado.',
    image: '/images/Me sinto invencivel quando ela está por perto.mp4',
    gradient: 'gradient-bg',
  },
  {
    id: 102,
    type: 'video',
    title: 'Nossa essência',
    text: 'O nosso lado criança, a nossa brincadeira... É isso que faz a gente ser a gente.',
    image: '/images/Nósbrincando juntos.mp4',
    gradient: 'gradient-purple',
  },
  {
    id: 103,
    type: 'story',
    title: 'Refúgio em Teresópolis',
    text: 'Dias de paz, frio e muito amor em Teresópolis. Um dos nossos momentos favoritos.',
    image: '/images/Nós_em_Teresópolis.jpeg',
    gradient: 'gradient-bg',
  },
  {
    id: 11,
    type: 'letter',
  },
  {
    id: 12,
    type: 'ending',
  },
];

export const timelineData = [
  {
    date: 'Agosto de 2025',
    text: 'A gente começou a sair junto. Sem saber exatamente onde aquilo ia dar, mas já sentindo que tinha algo diferente.',
    image: '/images/Ana.jpeg',
  },
  {
    date: 'Agosto a outubro de 2025',
    text: 'Fomos nos conhecendo aos poucos. Conversas, risadas, momentos simples e aquela sensação de querer estar cada vez mais perto.',
    image: '/images/Nossa primeira ida ao shopping.jpeg',
  },
  {
    date: '18 de outubro de 2025',
    text: 'O dia em que eu pedi a mulher da minha vida em namoro. Foi em uma situação meio caótica, perto de quando ia acontecer uma festa… mas talvez seja isso que deixou tudo ainda mais nosso.',
    image: '/images/Nossa primeira foto se beijando.jpeg',
  },
  {
    date: 'Viagem para Teresópolis',
    text: 'Nosso refúgio particular. Momentos de conexão profunda e muita risada no frio.',
    image: '/images/Nós_em_Teresópolis.jpeg',
  },
  {
    date: 'Hoje',
    text: 'Cada dia ao seu lado tem sido extremamente especial. Você me faz me sentir como uma criança: leve, feliz, bobo e completamente apaixonado.',
    image: '/images/Nós 2.jpeg',
  },
];

export const rankingAmoEmVoce = [
  'Seu jeito de deixar tudo mais leve',
  'Seu sorriso (principalmente aquela risada cantada)',
  'Sua companhia em qualquer lugar',
  'A forma como você me motiva e confia em mim',
  'O jeito que você me faz sentir o homem mais sortudo do mundo',
];

export const rankingMomentos = [
  'O pedido de namoro em 18 de outubro de 2025',
  'Nossa viagem para Teresópolis',
  'A primeira vez que fomos ao shopping juntos',
  'Nosso primeiro jantar romântico',
  'Todos os dias em que a gente brinca e ri à toa',
];

export const statsData = [
  { label: 'Risadas impossíveis de contar', value: '999+', icon: '😂' },
  { label: 'Momentos inesquecíveis', value: 'Infinitos', icon: '✨' },
  { label: 'Chance de eu escolher você de novo', value: '100%', icon: '💯' },
  { label: 'Fotos e vídeos salvos', value: 'Muitos!', icon: '📸' },
  { label: 'Nível de saudade diário', value: 'Absurdo', icon: '💔' },
];

export const galleryImages = [
  '/images/Ana.jpeg',
  '/images/Ana Sorrindo.jpeg',
  '/images/Nós.jpeg',
  '/images/Nós 2.jpeg',
  '/images/Nós 3.jpeg',
  '/images/Nossa primeira foto se beijando.jpeg',
  '/images/Nossa primeira ida ao shopping.jpeg',
  '/images/NossaPrimeiraIdaAoRestaurante.jpeg',
  '/images/Ida ao shopping.jpeg',
  '/images/EuAnaePedro.jpeg',
  '/images/Aniversário da Dodi.jpeg',
  '/images/Nós_em_Teresópolis.jpeg',
  '/images/Nós_nos_beijando_em_Teresópolis.jpeg',
  '/images/NósNoPrimeiroFilmeJuntos.jpeg',
  '/images/ShowDeTalentosNoMackenzieQueFomosAssistirALivia.jpeg',
  '/images/EssafotoÉmuitolindaEFofavoceémuitominhaprincesamesmo.PNG',
  '/images/Me sinto invencivel quando ela está por perto.mp4',
  '/images/Nósbrincando juntos.mp4',
];

export const finalLetter = {
  greeting: 'Meu amor,',
  paragraphs: [
    'Lá em agosto, quando nossos caminhos se cruzaram, eu não tinha ideia de que você se tornaria a parte mais bonita da minha rotina. Fomos nos conhecendo entre conversas que duravam horas, risadas que curavam qualquer dia ruim e uma conexão que simplesmente transbordava.',
    'Até que chegou o dia 18 de outubro de 2025. No meio do caos, pouco antes de uma festa, eu fiz o pedido que mudou tudo. E olhando para trás, eu percebo que não precisava de um cenário de filme, porque com você, até o caos é perfeito.',
    'Você desperta a minha melhor versão. Contigo, eu volto a ser criança: leve, espontâneo, bobo e irremediavelmente apaixonado. Você é a minha inspiração diária, a minha paz e o meu porto seguro.',
    'Obrigado por ser exatamente quem você é e por escolher segurar a minha mão todos os dias. Você transforma os momentos mais simples nas memórias que eu quero guardar para a vida inteira.',
    'Eu escolheria você, de novo e de novo, em todas as vidas possíveis.',
  ],
  signoff: 'Sempre seu,',
  name: 'Rafael 💜',
};

export const playlist = [
  { file: '/music/Ed Sheeran - Perfect.mp3', title: 'Perfect', artist: 'Ed Sheeran' },
  { file: '/music/Saudade.mp3', title: 'Aliança', artist: 'Tribalistas' },
  { file: '/music/Exagerado.mp3', title: 'Exagerado', artist: 'Cazuza' },
];

export const elogios = [
  'Amo o jeito que você dá uma risada "cantada" depois de eu te beijar.',
  'Amo seus olhinhos verdes',
  'Amo quando você expõe e confia em mim seus assuntos mais íntimos',
  'Amo a sua determinação e o jeito que você corre atrás dos seus sonhos',
  'Amo o cheiro do seu cabelo',
  'Amo como você me faz sentir em paz mesmo nos dias mais caóticos',
  'Amo a sua inteligência e a forma como você enxerga o mundo',
  'Amo o toque das suas mãos nas minhas',
  'Amo como a gente consegue conversar por horas sem cansar',
  'Amo o seu abraço, que é o meu lugar favorito no mundo',
  'Amo o seu senso de humor e como você me faz rir de coisas bobas',
  'Amo a sua bondade e o carinho que você tem com as pessoas',
  'Amo como você fica linda mesmo quando acaba de acordar',
  'Amo o jeito que você me motiva a ser uma pessoa melhor',
  'Amo a nossa parceria em todos os momentos',
  'Amo o seu beijo, que tem gosto de felicidade',
  'Amo como você entende o meu silêncio',
  'Amo a nossa conexão, que parece de outras vidas',
  'Amo o fato de você ser a minha melhor amiga e o meu amor',
  'Amo planejar o meu futuro com você ao meu lado',
];

export const artistasMaisOuidos = [
  { name: 'Carol Biazin', percentage: 35 },
  { name: 'Tribalistas', percentage: 20 },
  { name: 'Justin Timberlake', percentage: 10 },
  { name: 'Ferrugem', percentage: 10 },
  { name: 'Djavan', percentage: 10 },
  { name: 'Bruno Mars', percentage: 10 },
  { name: 'UM44k', percentage: 5 },
];

export const totalSlides = slides.length;
