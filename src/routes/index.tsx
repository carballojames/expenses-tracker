
import { useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useExpenses } from "@/hooks/useExpenses"
import ExpenseSummary from "@/components/ExpenseSummary"
import ExpenseList from "@/components/ExpenseList"
import CalendarFilter from "@/components/CalendarFilter"
import AddExpenseModal from "@/components/AddExpenseModal"
import EditExpensesModal from "@/components/EditExpensesModal"

export const Route = createFileRoute("/")({
  component: Dashboard,
})

function Dashboard() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isViewMoreOpen, setIsViewMoreOpen] = useState(false)
  const [viewMoreExpenseId, setViewMoreExpenseId] = useState<string | null>(null)
  
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  // null = no day filter (show whole month)
  const [pickedDate, setPickedDate] = useState<Date | null>(null)

  const {
    addMultipleExpenses,
    deleteExpense,
    updateExpense,
    getExpensesForDay,
    getExpensesForMonth,
    getDayTotal,
    getMonthTotal,
  } = useExpenses()

  const filteredExpenses = useMemo(() => {
    if (pickedDate !== null) return getExpensesForDay(pickedDate)
    return getExpensesForMonth(selectedMonth)
  }, [pickedDate, selectedMonth, getExpensesForDay, getExpensesForMonth])

  const filteredTotal = useMemo(() => {
    if (pickedDate !== null) return getDayTotal(pickedDate)
    return getMonthTotal(selectedMonth)
  }, [pickedDate, selectedMonth, getDayTotal, getMonthTotal])

  const summaryLabel = pickedDate !== null ? "Day Total" : "Month Total"

  const viewMoreExpenses = useMemo(() => {
    if (!viewMoreExpenseId) return []
    const found = filteredExpenses.find((e) => e.id === viewMoreExpenseId)
    return found ? [found] : []
  }, [filteredExpenses, viewMoreExpenseId])

  const monthCount = getExpensesForMonth(selectedMonth).length
  const dayCount = pickedDate ? getExpensesForDay(pickedDate).length : 0

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto mt-4 bg-transparent">
      {/* Hero Section */}
      <ExpenseSummary
        date={pickedDate ?? selectedMonth}
        total={filteredTotal}
        count={filteredExpenses.length}
        label={summaryLabel}
      />

      {/* Calendar + actions (responsive) */}
      <div className="w-full">
        <CalendarFilter
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          selectedDate={pickedDate}
          onDateChange={setPickedDate}
        />

        <div className="mt-4 flex items-center">
          <Button onClick={() => setIsAddOpen(true)} size="sm" variant="default" className="flex items-center justify-center">
            <Plus className="h-5 w-5" />
            Expense
          </Button>
          <span className="text-sm text-primary ml-auto">
            {pickedDate !== null ? dayCount : monthCount} expense{(pickedDate !== null ? dayCount : monthCount) !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Summary below the calendar container */}
      <ExpenseList
        expenses={filteredExpenses}
        onViewMore={(expenseId) => {
          setViewMoreExpenseId(expenseId)
          setIsViewMoreOpen(true)
        }}
      />

      <EditExpensesModal
        isOpen={isViewMoreOpen}
        onClose={() => {
          setIsViewMoreOpen(false)
          setViewMoreExpenseId(null)
        }}
        expenses={viewMoreExpenses}
        onUpdate={updateExpense}
        onDelete={deleteExpense}
      />

      {isAddOpen && (
        <AddExpenseModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAdd={addMultipleExpenses}
          defaultDate={pickedDate ?? new Date()}
        />
      )}
    </div>
  )
}
