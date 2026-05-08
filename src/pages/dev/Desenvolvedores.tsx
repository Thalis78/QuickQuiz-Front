import React from "react";
import { Layout } from "@/components/layout";
import { Github, Linkedin, Mail, User } from "lucide-react";

const developers = [
  {
    name: "Desenvolvedor 1",
    role: "Full Stack Developer",
    description: "Responsável pelo desenvolvimento da arquitetura e integração do sistema.",
    email: "dev1@example.com",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Desenvolvedor 2",
    role: "Frontend Developer",
    description: "Especialista em criar interfaces intuitivas e responsivas.",
    email: "dev2@example.com",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Desenvolvedor 3",
    role: "UI/UX Designer",
    description: "Focado na experiência do usuário e na estética visual do projeto.",
    email: "dev3@example.com",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Desenvolvedor 4",
    role: "Backend Developer",
    description: "Responsável pela lógica de negócio e gerenciamento de banco de dados.",
    email: "dev4@example.com",
    github: "#",
    linkedin: "#",
  },
];

const DevCard: React.FC<{ dev: typeof developers[0] }> = ({ dev }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col items-center text-center hover:bg-white/15 transition-all duration-300 group">
      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <User size={48} className="text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{dev.name}</h3>
      <p className="text-purple-200 text-sm font-semibold mb-3">{dev.role}</p>
      <p className="text-white/70 text-sm mb-6 leading-relaxed">
        {dev.description}
      </p>
      
      <div className="flex items-center gap-4 mt-auto">
        <a href={dev.github} className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/30 transition-colors">
          <Github size={20} />
        </a>
        <a href={dev.linkedin} className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/30 transition-colors">
          <Linkedin size={20} />
        </a>
        <a href={`mailto:${dev.email}`} className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/30 transition-colors">
          <Mail size={20} />
        </a>
      </div>
    </div>
  );
};

const Desenvolvedores: React.FC = () => {
  return (
    <Layout>
      <div className="pt-32 pb-20 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            NOSSOS <span className="text-yellow-400">DESENVOLVEDORES</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Conheça a equipe talentosa por trás do QuickQuiz, dedicada a transformar a educação através da tecnologia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {developers.map((dev, index) => (
            <DevCard key={index} dev={dev} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Desenvolvedores;
