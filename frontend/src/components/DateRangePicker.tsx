"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  onDateRangeChange: (start: Date, end: Date) => void;
  loading?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export function DateRangePicker({ onDateRangeChange, loading = false, startDate, endDate }: DateRangePickerProps) {
  // Inicializar con 5 años hacia atrás
  const defaultFrom = new Date();
  defaultFrom.setFullYear(defaultFrom.getFullYear() - 5);
  defaultFrom.setMonth(0); // Enero
  defaultFrom.setDate(1); // Día 1
  
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate || defaultFrom,
    to: endDate || new Date(),
  });
  
  // Referencia para controlar si el cambio viene desde fuera o desde el usuario
  const isExternalUpdate = React.useRef(false);

  // Actualizar el estado local cuando cambien las props de startDate o endDate (cambios externos)
  React.useEffect(() => {
    if (startDate && endDate) {
      // Comprobar si las fechas han cambiado realmente
      if (!date?.from || !date?.to || 
          date.from.getTime() !== startDate.getTime() || 
          date.to.getTime() !== endDate.getTime()) {
        
        isExternalUpdate.current = true;
        setDate({
          from: startDate,
          to: endDate
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  // Sólo notificar al padre cuando el cambio lo hace el usuario (no externo)
  React.useEffect(() => {
    // Solo notificar si tanto from como to están definidos y no es una actualización externa
    if (date?.from && date?.to && !isExternalUpdate.current) {
      onDateRangeChange(date.from, date.to);
    }
    // Resetear la bandera después de aplicar el cambio
    isExternalUpdate.current = false;
  }, [date, onDateRangeChange]);

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full md:w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              loading && "opacity-70 cursor-not-allowed"
            )}
            disabled={loading}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "d/M/yyyy", { locale: es })} - {" "}
                  {format(date.to, "d/M/yyyy", { locale: es })}
                </>
              ) : (
                format(date.from, "d/M/yyyy", { locale: es })
              )
            ) : (
              <span>Seleccionar fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              // Marcar como un cambio del usuario
              isExternalUpdate.current = false;
              setDate(newDate);
            }}
            numberOfMonths={2}
            locale={es}
            disabled={loading}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
