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
    desc: 'Ingeniero en software especializado en AI. Experiencia sólida en aplicaciones full stack potenciadas con LLMs. Obsesión por shippear y convencido de que Ecuador tiene todo para liderar, solo falta construirlo.',
    photo: '/members/luis-velasco.png',
    linkedin: 'https://www.linkedin.com/in/luisvelasco27/',
  },
  {
    name: 'Johannes Carofilis',
    role: 'QA Engineer',
    photo: undefined,
    linkedin: undefined,
  },
  {
    name: 'Byron Serrano',
    role: 'Software Engineer',
    photo: undefined,
    linkedin: undefined,
  },
  {
    name: 'Stiven Guanoquiza',
    role: 'Frontend Engineer',
    photo: undefined,
    linkedin: undefined,
  },
  {
    name: 'Andre Campaña',
    role: 'Estudiante de Software',
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
