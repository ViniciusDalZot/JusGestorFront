import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBr from '@fullcalendar/core/locales/pt-br'
import { EventContentArg } from '@fullcalendar/core'
import { NotificationData } from '~/types' // Importe sua interface de notificação


interface CalendarProps {
  notifications: NotificationData[]
  onDateClick: (date: Date) => void
  onTodayClick?: () => void
}

export const Calendar = ({ notifications, onDateClick, onTodayClick }: CalendarProps) => {
  const transformNotificationsToEvents = () => {
    return notifications.map(notification => ({
      id: notification.id,
      title: `Intimações: ${notification.destinatarios?.length || 0}`,
      start: notification.data_disponibilizacao,
      allDay: true,
      backgroundColor: notification.lida ? '#34D399' : '#F87171',
      borderColor: 'transparent',
      extendedProps: {
        notification
      }
    }))
  }

  const handleDateClick = (arg: any) => {
    onDateClick(arg.date)
  }

  const customEventContent = (eventInfo: EventContentArg) => {
    return (
      <div className="flex flex-col items-center p-1">
        <div className="text-center text-xs font-medium">
          {eventInfo.event.title}
        </div>
        <div className="flex gap-1 mt-1">
          {!eventInfo.event.backgroundColor && (
            <div className="w-2 h-2 rounded-full bg-red-500" />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <FullCalendar
        locale={ptBr}
        height="auto"
        headerToolbar={{
          left: 'prev,today,next',
          center: 'title',
          right: 'dayGridMonth'
        }}
        buttonText={{
          today: 'Hoje',
          month: 'Mês'
        }}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={transformNotificationsToEvents()}
        dateClick={handleDateClick}
        eventContent={customEventContent}
        datesSet={(arg) => {
          if(onTodayClick && arg.view.type === 'dayGridMonth') {
            onTodayClick()
          }
        }}
        dayCellClassNames="hover:bg-gray-50 cursor-pointer"
        eventClassNames="cursor-pointer"
      />
    </div>
  )
}