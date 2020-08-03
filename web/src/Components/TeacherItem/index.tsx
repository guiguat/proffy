import React from "react";
import whatsappIcon from "../../assets/images/icons/whatsapp.svg";

import "./styles.css";

const TeacherItem: React.FC = () => {
  return (
    <article className="teacher-item">
      <header>
        <img
          src="https://avatars1.githubusercontent.com/u/43298753?s=460&u=eb9341f0144f88c7c43c2dc220b617e81f039a1b&v=4"
          alt="Guilherme Guatura"
        />
        <div>
          <strong>Guilherme Guatura</strong>
          <span>Informática</span>
        </div>
      </header>
      <p>
        Entusiasta das melhores tecnologias do mercado atual
        <br />
        <br />
        Te ensinarei a fazer versionamento de codigo (com Winrar),
        desenvolvimento de aplicativos para Windows Phone e outras técnologias
        atuais.
      </p>
      <footer>
        <p>
          Preço/hora
          <strong>R$80,00</strong>
        </p>
        <button type="button">
          <img src={whatsappIcon} alt="Whatsapp" />
          Entrar em contato
        </button>
      </footer>
    </article>
  );
};

export default TeacherItem;
