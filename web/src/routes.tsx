import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import TeacherList from "./Pages/TeacherList";
import TeacherForm from "./Pages/TeacherForm";
import Login from "./Pages/Login";
// import { Container } from './styles';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/home" exact component={Landing} />
      <Route path="/study" component={TeacherList} />
      <Route path="/give-classes" component={TeacherForm} />
    </BrowserRouter>
  );
};

export default Routes;
