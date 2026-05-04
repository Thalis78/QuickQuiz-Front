import React, { useState, useEffect } from "react";
import { BookOpen, Languages, Users, GraduationCap, Star } from "lucide-react";
import { Layout } from "@/components/layout";

export const AboutSection: React.FC = () => {
  const images = [
    "/sobre/ciel/img01.png",
    "/sobre/ciel/img02.png",
    "/sobre/ciel/img03.jpeg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images.length]);

  const highlights = [
    {
      icon: <GraduationCap className="text-[#605BEF]" />,
      title: "Público-alvo",
      desc: "Atendimento completo da Educação Infantil ao Ensino Médio.",
    },
    {
      icon: <BookOpen className="text-[#605BEF]" />,
      title: "Apoio Escolar",
      desc: "Orientação para tarefas de casa e reforço em Matemática e Português.",
    },
    {
      icon: <Star className="text-[#605BEF]" />,
      title: "Alfabetização",
      desc: "Foco especializado no processo de leitura e escrita inicial.",
    },
    {
      icon: <Languages className="text-[#605BEF]" />,
      title: "Idiomas",
      desc: "Inglês para crianças a partir dos 4 anos, dividido por faixa etária.",
    },
    {
      icon: <Users className="text-[#605BEF]" />,
      title: "Metodologia",
      desc: "Atendimento individual ou em pequenos grupos e colônias de férias.",
    },
  ];

  return (
    <Layout>
      <section id="sobre-ciel" className="w-full py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 border-2 border-dashed border-[#605BEF] rounded-full animate-spin-slow opacity-30"></div>

                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gray-200 border-8 border-[#4441AA] overflow-hidden shadow-2xl flex items-center justify-center relative">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Imagem ${index + 1}`}
                      className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex justify-center gap-2 mt-6">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "bg-[#605BEF] w-4"
                          : "bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <h2 className="text-4xl font-bold text-white mb-6 max-sm:text-3xl">
                Sobre o CIEL Cursos
              </h2>
              <p className="text-white text-lg leading-relaxed mb-8">
                Localizado no bairro Dirceu II, em Teresina, o{" "}
                <strong>CIEL Cursos</strong> é um centro de apoio escolar e
                idiomas que foca no suporte pedagógico para crianças e
                adolescentes, auxiliando no desempenho acadêmico e na superação
                de dificuldades escolares.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {highlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-xl transition-colors hover:bg-white/5"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-sm text-white/80">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
