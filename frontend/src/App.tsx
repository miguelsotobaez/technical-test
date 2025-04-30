import { useState } from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation } from '@apollo/client'
import { DateRangePicker } from './components/DateRangePicker'
import { ElectricalBalanceChart } from './components/ElectricalBalanceChart'
import { ElectricalBalanceTable } from './components/ElectricalBalanceTable'
import { LoadingOverlay } from './components/LoadingOverlay'
import { ErrorMessage } from './components/ErrorMessage'
import { GET_BALANCE_BY_DATE_RANGE, FETCH_BALANCE_BY_DATE_RANGE } from './graphql/queries'
import { ElectricalBalance } from './types'

// Crear cliente Apollo
const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
})

function Dashboard() {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth() - 12, 1)
  )
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [showTable, setShowTable] = useState<boolean>(false)

  // Consulta para obtener datos
  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
    refetch,
  } = useQuery(GET_BALANCE_BY_DATE_RANGE, {
    variables: { startDate, endDate },
  })

  // Mutación para obtener datos frescos desde la API
  const [fetchBalance, { loading: mutationLoading, error: mutationError }] = useMutation(
    FETCH_BALANCE_BY_DATE_RANGE,
    {
      onCompleted: () => {
        refetch() // Recargar datos después de la mutación
      },
    }
  )

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start)
    setEndDate(end)
    refetch({ startDate: start, endDate: end })
  }

  const handleFetchData = () => {
    fetchBalance({ variables: { startDate, endDate } })
  }

  const isLoading = queryLoading || mutationLoading
  const error = queryError || mutationError || null
  const balanceData: ElectricalBalance[] = queryData?.getBalanceByDateRange || []

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Balance Eléctrico</h1>
        <p className="text-gray-600">
          Visualización de datos de la Red Eléctrica de España (REE)
        </p>
      </header>

      <DateRangePicker onDateRangeChange={handleDateRangeChange} loading={isLoading} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <button
            onClick={() => setShowTable(!showTable)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showTable ? 'Mostrar Gráficos' : 'Mostrar Tabla'}
          </button>
        </div>
        <div>
          <button
            onClick={handleFetchData}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
          >
            Actualizar Datos desde REE
          </button>
        </div>
      </div>

      <ErrorMessage error={error} onRetry={() => refetch()} />

      {!showTable && <ElectricalBalanceChart data={balanceData} />}
      {showTable && <ElectricalBalanceTable data={balanceData} />}

      <LoadingOverlay isVisible={isLoading} />
    </div>
  )
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-100">
        <Dashboard />
      </div>
    </ApolloProvider>
  )
}

export default App
