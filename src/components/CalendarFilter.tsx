
import { format, startOfMonth, getYear, setMonth, setYear } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const START_YEAR = 2020

interface CalendarFilterProps {
  selectedMonth: Date
  onMonthChange: (date: Date) => void
  selectedDate: Date | null
  onDateChange: (date: Date | null) => void
}

export default function CalendarFilter({
  selectedMonth,
  onMonthChange,
  selectedDate,
  onDateChange,
}: CalendarFilterProps) {
  const currentYear = getYear(new Date())
  // Dynamically includes any year up to the current one
  const years = Array.from({ length: currentYear - START_YEAR + 1 }, (_, i) => currentYear - i)

  const selectedYear = getYear(selectedMonth)
  const selectedMonthIndex = selectedMonth.getMonth()

  const handleYearChange = (year: number) => {
    const next = startOfMonth(setYear(selectedMonth, year))
    onMonthChange(next)
    onDateChange(null)
  }

  const handleMonthChange = (monthIndex: number) => {
    const next = startOfMonth(setMonth(selectedMonth, monthIndex))
    onMonthChange(next)
    onDateChange(null)
  }

  return (
    <div className="w-full">
      <Card className="w-full shadow-sm rounded-xl bg-background">
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center justify-center gap-2">

            {/* Year dropdown */}
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={selectedYear}
              onChange={(e) => handleYearChange(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year} className="bg-background text-foreground">
                  {year}{year === currentYear ? " (Now)" : ""}
                </option>
              ))}
            </select>

            {/* Month dropdown */}
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={selectedMonthIndex}
              onChange={(e) => handleMonthChange(Number(e.target.value))}
            >
              {MONTH_NAMES.map((name, i) => {
                const isCurrent = i === new Date().getMonth() && selectedYear === currentYear
                return (
                  <option key={i} value={i} className="bg-background text-foreground">
                    {name}{isCurrent ? " (Now)" : ""}
                  </option>
                )
              })}
            </select>

            {/* Day picker */}
            <div className="flex items-center gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-10 justify-start text-left font-normal min-w-[160px]">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                    {selectedDate
                      ? format(selectedDate, "MMM d, yyyy")
                      : <span className="text-muted-foreground">Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate ?? undefined}
                    onSelect={(date) => date && onDateChange(date)}
                    defaultMonth={selectedMonth}
                    initialFocus
                  />
                  {selectedDate && (
                    <div className="border-t p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDateChange(null)}
                        className="w-full text-muted-foreground hover:text-foreground"
                      >
                        <X className="mr-2 h-3.5 w-3.5" />
                        Clear date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
