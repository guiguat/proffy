import React from "react";

import "./styles.css";
import PageHeader from "../../Components/PageHeader";
import TeacherItem from "../../Components/TeacherItem";
import Input from "../../Components/Input";

const TeacherList: React.FC = () => {
  return (
    <div id="page-teacher-list" className="container">
      <PageHeader title="Estes são os proffys disponíveis.">
        <form id="search-teachers">
          <Input label="Matéria" name="subject" />
          <Input label="Dia da semana" name="week_day" />
          <Input type="time" label="Hora" name="time" />
        </form>
      </PageHeader>
      <main>
        <TeacherItem />
        <TeacherItem />
        <TeacherItem />
      </main>
    </div>
  );
};

export default TeacherList;
