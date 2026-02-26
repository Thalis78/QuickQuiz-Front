import React from "react";
import { useNavigate } from "react-router-dom";
import { UserTypeCard } from "./UserTypeCard";
import { Layout } from "./layout";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStudentClick = () => {
    navigate("/aluno/entrar");
  };

  const handleTeacherClick = () => {
    navigate("/professor/login");
  };

  return (
    <Layout>
      <main className="flex flex-col items-center px-4 pb-12">
        <section className="flex justify-center mt-[80px] max-md:mt-[60px] max-sm:mt-[80px]">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/02860aef18c993020c6cd55bcab4a7836ad4b4a5?width=604"
            alt="CIEL CURSOS Logo"
            className="w-[302px] h-[278px] max-md:w-[250px] max-md:h-[230px] max-sm:w-[200px] max-sm:h-[184px]"
          />
        </section>

        <section className="flex w-full max-w-[653px] flex-col items-center gap-[50px] mt-[40px] max-md:gap-10 max-md:mt-[30px] max-sm:gap-[30px] max-sm:mt-[20px]">
          <h2 className="text-white text-center text-5xl font-semibold max-md:text-4xl max-sm:text-[28px]">
            Quem é você?
          </h2>

          <div
            className="flex justify-between items-center w-full max-md:flex-col max-md:gap-[30px] max-sm:gap-[25px]"
            role="group"
            aria-label="Selecione seu tipo de usuário"
          >
            <UserTypeCard
              type="student"
              title="Aluno"
              iconSrc="https://api.builder.io/api/v1/image/assets/TEMP/025b9c6df2eac5de10d3c632cc91f2c43fc130c9?width=284"
              iconAlt="Ícone representando um aluno"
              onClick={handleStudentClick}
            />

            <UserTypeCard
              type="teacher"
              title="Professor"
              iconSrc="https://api.builder.io/api/v1/image/assets/TEMP/ef263a52258bbe9a374560e02155169f1fceebf7?width=290"
              iconAlt="Ícone representando um professor"
              onClick={handleTeacherClick}
            />
          </div>
        </section>
      </main>
    </Layout>
  );
};
