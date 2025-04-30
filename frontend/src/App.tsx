import { useState } from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation } from '@apollo/client'
import { DateRangePicker } from './components/DateRangePicker'
import { ElectricalBalanceChart } from './components/ElectricalBalanceChart'
import { ElectricalBalanceTable } from './components/ElectricalBalanceTable'
import { LoadingOverlay } from './components/LoadingOverlay'
import { ErrorMessage } from './components/ErrorMessage'
import { UpdateDataFooter } from './components/UpdateDataFooter'
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
  const [updateMessage, setUpdateMessage] = useState<string>('')

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
        setUpdateMessage('Datos actualizados correctamente')
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => setUpdateMessage(''), 3000)
      },
    }
  )

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start)
    setEndDate(end)
    refetch({ startDate: start, endDate: end })
  }

  const handleUpdateData = (year: number) => {
    // Actualizar datos para el año seleccionado
    const yearStart = new Date(year, 0, 1) // 1 de enero del año
    const yearEnd = new Date(year, 11, 31) // 31 de diciembre del año
    setUpdateMessage(`Actualizando datos del año ${year}...`)
    fetchBalance({ variables: { startDate: yearStart, endDate: yearEnd } })
  }

  const isLoading = queryLoading || mutationLoading
  const error = queryError || mutationError || null
  const balanceData: ElectricalBalance[] = queryData?.getBalanceByDateRange || []

  return (
    <div className="flex flex-col min-h-screen">
      {/* Contenido principal */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Cabecera */}
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Dashboard de Balance Eléctrico
            </h1>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Visualización de datos de la Red Eléctrica de España (REE)
            </p>
          </header>

          {/* Selector de fechas */}
          <div className="mb-6">
            <DateRangePicker onDateRangeChange={handleDateRangeChange} loading={isLoading} />
          </div>

          {/* Botón para alternar entre gráficos y tabla */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowTable(!showTable)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium shadow-sm bg-white hover:bg-gray-50"
            >
              {showTable ? 'Mostrar Gráficos' : 'Mostrar Tabla'}
            </button>
          </div>

          {/* Mensaje de actualización */}
          {updateMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md text-center">
              {updateMessage}
            </div>
          )}

          {/* Mensaje de error */}
          <ErrorMessage error={error} onRetry={() => refetch()} />

          {/* Contenido: Gráficos o Tabla */}
          <div className="bg-white rounded-md shadow-sm p-4 mb-20 border border-gray-200">
            {!showTable && <ElectricalBalanceChart data={balanceData} />}
            {showTable && <ElectricalBalanceTable data={balanceData} />}
          </div>
        </div>
      </div>

      {/* Footer con actualización de datos */}
      <UpdateDataFooter onUpdateData={handleUpdateData} loading={isLoading} />

      {/* Overlay de carga */}
      <LoadingOverlay isVisible={isLoading} />
    </div>
  )
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Dashboard />
    </ApolloProvider>
  )
}

export default App
