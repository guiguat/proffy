import React from "react";

import "./styles.css";
import Input from "../../Components/Input";
import logoImg from "../../assets/images/logo.svg";
import purpleHeartIcon from "../../assets/images/icons/purple-heart.svg";
import Button from "../../Components/Button";

const Login: React.FC = () => {
  return (
    <div className="login-page">
      <header>
        <img src={logoImg} alt="Profy" />
        <h2>Sua plataforma de estudos online</h2>
      </header>
      <main>
        <form id="login-form">
          <fieldset>
            <legend>Fazer Login</legend>
            <Input name="email" label="Email" />
            <Input name="password" label="Senha" />
            <div className="login-extra">
              <div>
                <input name="remember-me" id="remember-me" type="checkbox" />
                <label htmlFor="remember-me">Lembrar-me</label>
              </div>
              <a href="/forgot-password">Esqueci minha senha</a>
            </div>
            <Button>Entrar</Button>
          </fieldset>
        </form>
        <footer>
          <p>
            Não tem conta? <br /> <a href="/sign-up">Cadastre-se</a>
          </p>
          <span>
            É de graça <img src={purpleHeartIcon} alt="coração" />
          </span>
        </footer>
      </main>
    </div>
  );
};

export default Login;
