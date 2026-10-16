export interface TeamMember {
  name: string;
  alias?: string;
  role: string;
  tags: string[];
  tone: string;
  telegram: string;
  avatar: string;
}

export const teamRu: TeamMember[] = [
  {
    name: "Sterepando Manda",
    alias: "a.k.a swaga",
    role: "Основатель",
    tags: ["Дизайн", "Разработка", "Ревью", "Продвижение", "Стиль"],
    tone: "tcard--sterepando",
    telegram: "https://t.me/sterepando",
    avatar: "/assets/team/sterepando.png"
  },
  {
    name: "KPuCTaJluK",
    role: "разработчик",
    tags: ["Разработка", "работа с git"],
    tone: "tcard--kpictalluk",
    telegram: "https://t.me/Strateg356",
    avatar: "/assets/team/kpictalluk.png"
  },
  {
    name: "extera.cat.furry",
    role: "разработчик",
    tags: ["Разработка"],
    tone: "tcard--qidok",
    telegram: "https://t.me/qidok",
    avatar: "/assets/team/qidok.png"
  }
];

export const teamEn: TeamMember[] = [
  {
    name: "Sterepando Manda",
    alias: "a.k.a swaga",
    role: "Founder",
    tags: ["Design", "Development", "Review", "Promotion", "Style"],
    tone: "tcard--sterepando",
    telegram: "https://t.me/sterepando",
    avatar: "/assets/team/sterepando.png"
  },
  {
    name: "KPuCTaJluK",
    role: "Developer",
    tags: ["Development", "Git Workflow"],
    tone: "tcard--kpictalluk",
    telegram: "https://t.me/KPuCTaJluK",
    avatar: "/assets/team/kpictalluk.png"
  },
  {
    name: "extera.cat.furry",
    role: "Developer",
    tags: ["Development"],
    tone: "tcard--qidok",
    telegram: "https://t.me/qidok",
    avatar: "/assets/team/qidok.png"
  }
];
