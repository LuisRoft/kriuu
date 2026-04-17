export type Member = {
  name: string;
  role?: string;
  desc?: string;
  photo?: string;
  linkedin?: string;
};

export const MEMBERS: Member[] = [
  {
    name: 'Luis Velasco',
    role: 'AI Engineer',
    desc: 'Ingeniero en software especializado en AI. Experiencia sólida en aplicaciones full stack potenciadas con LLMs. Convencido de que Ecuador tiene todo para liderar, solo falta construirlo.',
    photo: '/members/luis-velasco.png',
    linkedin: 'https://www.linkedin.com/in/luisvelasco27/',
  },
  {
    name: 'Johannes Carofilis Veliz',
    role: 'Software Engineer | QA | AI & Tech Community Builder',
    desc: 'Ingeniero en Software (PUCE Manabí) con experiencia en desarrollo fullstack, QA y liderazgo tecnológico. Campus Director de Hult Prize y fundador de comunidades de desarrollo en Manabí. Combina tecnología, filosofía y emprendimiento con foco en IA, ética tecnológica e impacto social.',
    photo: '/members/johannes-carofilis.png',
    linkedin: 'https://www.linkedin.com/in/johannes-carofilis-a38b49288/',
  },
  {
    name: 'Andrea Campaña',
    role: 'Estudiante de Software',
    desc: 'Estudiante de Software en la PUCE Manabí, orientada al desarrollo frontend con enfoque en UI/UX. Integro ilustración digital y conceptual en la creación de experiencias con identidad, comprometida con el desarrollo de soluciones con impacto social y enfoque humano. Siempre dispuesta a contar una historia.',
    photo: '/members/andrea-campana.webp',
    linkedin: undefined,
  },
  {
    name: 'Byron Serrano',
    role: 'Software Engineer / Full Stack Developer',
    desc: 'Desarrollador Full Stack con una marcada predilección por la Ingeniería de Datos, mi diferencial técnico actual se centra en la Inteligencia Artificial, no solo consumo modelos, los integro.',
    photo: '/members/byron-serrano.webp',
    linkedin: undefined,
  },
  {
    name: 'Stiven Guanoquiza',
    role: 'Frontend Engineer',
    photo: undefined,
    linkedin: undefined,
  },
  {
    name: 'Valentina Cajas',
    photo: undefined,
    linkedin: undefined,
  },
  {
    name: 'Vanessa',
    photo: undefined,
    linkedin: undefined,
  },
];
