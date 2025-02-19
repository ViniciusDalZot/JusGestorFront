import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import ptBr from '@fullcalendar/core/locales/pt-br'
import { useState } from 'react'

interface IEvent {
  id: string
  title: string
  start: string
  category: "none"
}

interface ICalendar {
  events: IEvent[]
}

export const Calendar = ({ events }: ICalendar) => {
/*   const handleDateClick = (info) => {
    const title = prompt('Digite o nome do evento:')
    if (title) {
      setEvents([
        ...events,
        { 
          id: String(events.length + 1), 
          title, 
          start: info.dateStr, 
          backgroundColor: 'green', 
          borderColor: 'green' 
        },
      ])
    }
  } */

  return (
    <FullCalendar
      locale={ptBr}
      height="700px"
      headerToolbar={{
        left: 'prev,today,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      }}
      buttonText={{
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        list: 'Lista'
      }}
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      editable={true}
      selectable={true}
      selectMirror={true}
      // dateClick={handleDateClick}
    />
  )
}
