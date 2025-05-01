import { useState, useEffect } from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation } from '@apollo/client'
import { DateRangePicker } from './components/DateRangePicker'
import { ElectricalBalanceTable } from './components/ElectricalBalanceTable'
import { LoadingOverlay } from './components/LoadingOverlay'
import { ErrorMessage } from './components/ErrorMessage'
import { ThemeToggle } from './components/ThemeToggle'
import { BarChart, RenewableEnergyChart, NonRenewableEnergyChart } from './components/charts'
import { GET_BALANCE_BY_DATE_RANGE, FETCH_BALANCE_BY_DATE_RANGE } from './graphql/queries'
import { ElectricalBalance } from './types'
import { Button } from './components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './components/ui/dialog'

// URI for GraphQL API with environment variable support
const apiUri = import.meta.env.VITE_API_URL || '/graphql';

// Crear cliente Apollo con configuración para credenciales y CORS
const client = new ApolloClient({
  uri: apiUri,
  cache: new InMemoryCache(),
  credentials: 'include', // Para enviar cookies de autenticación si se necesitan
  headers: {
    'Apollo-Require-Preflight': 'true', // Ayuda con la gestión de CORS en algunas configuraciones
  },
})

function Dashboard() {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear() - 5, 0, 1) // 1 de enero de hace 5 años
  )
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [updateMessage, setUpdateMessage] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false)

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
    // Evitar refetch si las fechas no han cambiado realmente
    if (
      start.getTime() === startDate.getTime() &&
      end.getTime() === endDate.getTime()
    ) {
      return;
    }
    
    console.log('Fechas cambiadas por el usuario:', { start, end });
    setStartDate(start);
    setEndDate(end);
    
    // Realizar búsqueda automáticamente cuando se cambia el rango de fechas
    refetch({ startDate: start, endDate: end });
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

  // Calcular totales y convertir de MWh a GWh
  const totalGeneration = balanceData.reduce((acc, item) => acc + item.generation, 0) / 1000;
  const totalDemand = balanceData.reduce((acc, item) => acc + item.demand, 0) / 1000;
  const totalExports = balanceData.reduce((acc, item) => acc + item.exports, 0) / 1000;
  const totalImports = balanceData.reduce((acc, item) => acc + item.imports, 0) / 1000;

  // Last month comparison for generation
  const currentMonth = new Date().getMonth();
  const currentMonthData = balanceData.filter(item => new Date(item.timestamp).getMonth() === currentMonth);
  const lastMonthData = balanceData.filter(item => new Date(item.timestamp).getMonth() === (currentMonth - 1 + 12) % 12);
  
  const currentMonthGeneration = currentMonthData.reduce((acc, item) => acc + item.generation, 0) / 1000;
  const lastMonthGeneration = lastMonthData.reduce((acc, item) => acc + item.generation, 0) / 1000;
  
  const generationChange = lastMonthGeneration ? 
    ((currentMonthGeneration - lastMonthGeneration) / lastMonthGeneration * 100).toFixed(1) : 
    "0.0";

  // Effect para inicializar el tema según la preferencia guardada o del sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    const root = window.document.documentElement;
    
    if (savedTheme === "dark" || (savedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Si no hay tema guardado, establecer a oscuro por defecto
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "dark");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      {/* Side Navigation */}
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed">
          <div className="p-6">
            <h1 className="text-2xl font-bold">Dashboard REE</h1>
          </div>
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Balance Eléctrico
              </a>
              <button 
                onClick={() => setShowAboutModal(true)}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Acerca de
              </button>
            </div>
          </nav>
        </aside>

        {/* About Modal */}
        <Dialog open={showAboutModal} onOpenChange={setShowAboutModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Acerca del Proyecto</DialogTitle>
              <DialogDescription>
                Dashboard para visualización de datos de balance eléctrico de España
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-sm font-semibold">Autor</h3>
                <p>Miguel Soto Baez</p>
              </div>
              <div className="flex flex-col space-y-1.5">
                <h3 className="text-sm font-semibold">Enlaces</h3>
                <div className="flex flex-col space-y-2">
                  <a 
                    href="https://github.com/miguelsotobaez" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub: @miguelsotobaez
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/miguelsotobaez/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn: @miguelsotobaez
                  </a>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold lg:hidden">Balance Eléctrico</h1>
              </div>
              <div className="flex items-center gap-4">
                {/* Botón para cambiar el tema */}
                <ThemeToggle />
              </div>
            </div>
          </header>

          <div className="p-4 md:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Dashboard de Balance Eléctrico</h2>
              <p className="text-muted-foreground text-gray-500 dark:text-gray-400">
                Visualización de datos de la Red Eléctrica de España (REE)
              </p>
            </div>

            {/* Date Range Picker and Update Data Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Date Range Picker Card */}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Rango de Fechas</h3>
                  <div className="space-y-4">
                    <DateRangePicker 
                      onDateRangeChange={handleDateRangeChange} 
                      loading={isLoading} 
                      startDate={startDate}
                      endDate={endDate}
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const now = new Date();
                          const startOfYear = new Date(now.getFullYear(), 0, 1); // 1 de enero del año actual
                          setStartDate(startOfYear);
                          setEndDate(now);
                          refetch({ startDate: startOfYear, endDate: now });
                        }}
                        disabled={isLoading}
                      >
                        YTD
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const now = new Date();
                          const oneYearAgo = new Date(now);
                          oneYearAgo.setFullYear(now.getFullYear() - 1);
                          setStartDate(oneYearAgo);
                          setEndDate(now);
                          refetch({ startDate: oneYearAgo, endDate: now });
                        }}
                        disabled={isLoading}
                      >
                        1 Año
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const now = new Date();
                          const fiveYearsAgo = new Date(now);
                          fiveYearsAgo.setFullYear(now.getFullYear() - 5);
                          setStartDate(fiveYearsAgo);
                          setEndDate(now);
                          refetch({ startDate: fiveYearsAgo, endDate: now });
                        }}
                        disabled={isLoading}
                      >
                        5 Años
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const now = new Date();
                          const tenYearsAgo = new Date(now);
                          tenYearsAgo.setFullYear(now.getFullYear() - 10);
                          setStartDate(tenYearsAgo);
                          setEndDate(now);
                          refetch({ startDate: tenYearsAgo, endDate: now });
                        }}
                        disabled={isLoading}
                      >
                        10 Años
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Update Data Card */}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Actualización de Datos</h3>
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground text-gray-500 dark:text-gray-400">
                      Actualice los datos de la Red Eléctrica Española (REE) para el año seleccionado.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Reemplazar con el contenido de UpdateDataFooter pero adaptado */}
                      <div className="w-full sm:w-auto">
                        <select 
                          value={selectedYear || new Date().getFullYear()}
                          onChange={(e) => setSelectedYear(Number(e.target.value))}
                          className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                          disabled={isLoading}
                        >
                          {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <Button
                        onClick={() => selectedYear && handleUpdateData(selectedYear)}
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2"><path d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69112 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                        Actualizar Datos
                      </Button>
                    </div>
                    <a 
                      href="https://www.ree.es/es/datos/balance/balance-electrico"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-500 hover:underline underline-offset-4 mt-2"
                    >
                      Más información en REE
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification */}
            {updateMessage && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30 p-4 text-green-700 dark:text-green-300">
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  {updateMessage}
                </div>
              </div>
            )}

            {/* Error Message */}
            <ErrorMessage error={error} onRetry={() => refetch()} />

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-6">
                <div className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <h3 className="font-medium tracking-tight text-sm text-gray-500 dark:text-gray-400">Generación Total</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-2xl font-bold">{totalGeneration.toLocaleString(undefined, {maximumFractionDigits: 2})} GWh</div>
                <p className="text-xs text-muted-foreground text-gray-500 dark:text-gray-400">
                  <span className={`${Number(generationChange) >= 0 ? 'text-green-500' : 'text-orange-500'}`}>
                    {Number(generationChange) >= 0 ? '+' : ''}{generationChange}%
                  </span> desde el mes pasado
                </p>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-6">
                <div className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <h3 className="font-medium tracking-tight text-sm text-gray-500 dark:text-gray-400">Demanda Total</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                    <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                    <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold">{totalDemand.toLocaleString(undefined, {maximumFractionDigits: 2})} GWh</div>
                <p className="text-xs text-muted-foreground text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">
                    {balanceData.length} entradas
                  </span>
                </p>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-6">
                <div className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <h3 className="font-medium tracking-tight text-sm text-gray-500 dark:text-gray-400">Exportaciones</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-2xl font-bold">{totalExports.toLocaleString(undefined, {maximumFractionDigits: 2})} GWh</div>
                <p className="text-xs text-muted-foreground text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">
                    {(totalExports / (totalGeneration || 1) * 100).toFixed(1)}% 
                  </span> de la generación
                </p>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-6">
                <div className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <h3 className="font-medium tracking-tight text-sm text-gray-500 dark:text-gray-400">Importaciones</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-2xl font-bold">{totalImports.toLocaleString(undefined, {maximumFractionDigits: 2})} GWh</div>
                <p className="text-xs text-muted-foreground text-gray-500 dark:text-gray-400">
                  <span className={`${(totalImports / (totalDemand || 1) * 100) < 20 ? 'text-green-500' : 'text-orange-500'}`}>
                    {(totalImports / (totalDemand || 1) * 100).toFixed(1)}%
                  </span> de la demanda
                </p>
              </div>
            </div>

            {isLoading && <LoadingOverlay isVisible={isLoading} />}

            {/* Main Content */}
            {!isLoading && !error && balanceData.length > 0 && (
              <>
                <div className="mb-6">
                  {/* Balance Chart */}
                  <BarChart data={balanceData} />
                  
                  {/* Energy Distribution Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <RenewableEnergyChart data={balanceData} />
                    <NonRenewableEnergyChart data={balanceData} />
                  </div>

                  {/* Data Table */}
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-6 mb-6 mt-6">
                    <h3 className="text-lg font-medium mb-4">Datos de Balance Eléctrico</h3>
                    <ElectricalBalanceTable data={balanceData} />
                  </div>
                </div>
              </>
            )}

            {!isLoading && !error && balanceData.length === 0 && (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-6 mb-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No hay datos disponibles</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    No se encontraron datos para el período seleccionado. Intenta modificar el rango de fechas o actualizar los datos.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
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
