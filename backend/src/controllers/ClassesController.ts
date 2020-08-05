import {
  Request,
  Response
} from 'express';

import convertHourToMinutes from '../utils/convertHourToMinutes';
import db from '../database/connection';


interface IScheduleItem{
  week_day: number,
  from: string,
  to: string
}

export default class ClassesController {

  async index(request:Request, reponse:Response){

  }

  async create(request: Request, response: Response){

    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    } = request.body;

    const trx = await db.transaction();

    try {

      const insertedUsersIds = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio
      });

      const user_id = insertedUsersIds[0];

      const insertedClassesIds = await trx('classes').insert({
        subject,
        cost,
        user_id
      });

      const class_id = insertedClassesIds[0];

      const classSchedule = schedule.map((scheduleItem: IScheduleItem) => {
        return {
          class_id,
          weekday: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
        };
      })

      await trx('class_schedule').insert(classSchedule);

      await trx.commit();

      return response.status(201).send();

    } catch (error) {
      console.log(error)
      await trx.rollback()

      return response.status(400).json({
        error: 'Unexpected error while creating new class'
      })
    }  
  }
}