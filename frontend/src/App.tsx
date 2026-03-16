import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CalendarDays, Loader2, MoonStar, SunMedium, Trash2 } from "lucide-react";
import { calculateEndDate, createHoliday, deleteHoliday, listHolidays } from "@/lib/api";
import { formatDateToBr } from "@/lib/utils";
import type { CalculationType, Holiday } from "@/types/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Theme = "light" | "dark";

const detectInitialTheme = (): Theme => {
  const storedTheme = localStorage.getItem("theme");

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export default function App() {
  const [theme, setTheme] = useState<Theme>(detectInitialTheme);
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState("1");
  const [calculationType, setCalculationType] = useState<CalculationType>("calendar");
  const [endDate, setEndDate] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isHolidayLoading, setIsHolidayLoading] = useState(false);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayDescription, setHolidayDescription] = useState("");
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const loadHolidays = async (): Promise<void> => {
    setIsHolidayLoading(true);

    try {
      const loadedHolidays = await listHolidays();
      setHolidays(loadedHolidays);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar feriados.";
      setErrorMessage(message);
    } finally {
      setIsHolidayLoading(false);
    }
  };

  useEffect(() => {
    void loadHolidays();
  }, []);

  const calculationModeLabel = useMemo(
    () => (calculationType === "calendar" ? "Dias corridos" : "Dias uteis"),
    [calculationType]
  );

  const handleCalculate = async (): Promise<void> => {
    setErrorMessage(null);

    const parsedDays = Number(days);

    if (!startDate || !Number.isInteger(parsedDays) || parsedDays < 1) {
      setErrorMessage("Preencha data inicial e quantidade de dias valida (inteiro maior que zero).");
      return;
    }

    setIsCalculating(true);

    try {
      const calculatedDate = await calculateEndDate(startDate, parsedDays, calculationType);
      setEndDate(calculatedDate);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao calcular data final.";
      setErrorMessage(message);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleClear = (): void => {
    setStartDate("");
    setDays("1");
    setCalculationType("calendar");
    setEndDate("");
    setErrorMessage(null);
  };

  const handleCreateHoliday = async (): Promise<void> => {
    setErrorMessage(null);

    if (!holidayDate || !holidayDescription.trim()) {
      setErrorMessage("Informe data e descricao do feriado.");
      return;
    }

    try {
      await createHoliday(holidayDate, holidayDescription.trim());
      setHolidayDate("");
      setHolidayDescription("");
      await loadHolidays();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao criar feriado.";
      setErrorMessage(message);
    }
  };

  const handleDeleteHoliday = async (id: number): Promise<void> => {
    setErrorMessage(null);

    try {
      await deleteHoliday(id);
      await loadHolidays();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao remover feriado.";
      setErrorMessage(message);
    }
  };

  return (
    <main className="min-h-screen bg-grid py-8 text-foreground">
      <div className="container space-y-6">
        <header className="fade-up flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/70 p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Sistema</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Calculadora de Dias</h1>
            <p className="mt-1 text-sm text-muted-foreground">Calcule datas por dias corridos ou dias uteis e gerencie feriados.</p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-full border bg-background/60 px-4 py-2">
            <SunMedium className="h-4 w-4" />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Alternar tema"
            />
            <MoonStar className="h-4 w-4" />
          </div>
        </header>

        {errorMessage ? (
          <Alert variant="destructive" className="fade-up">
            <AlertTitle>Erro de operacao</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="fade-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5" />
                Calculo de Data
              </CardTitle>
              <CardDescription>Informe os parametros para calcular a data final.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input id="startDate" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="days">Quantidade de Dias</Label>
                <Input
                  id="days"
                  type="number"
                  min={1}
                  step={1}
                  value={days}
                  onChange={(event) => setDays(event.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label>Tipo de Calculo</Label>
                <RadioGroup value={calculationType} onValueChange={(value) => setCalculationType(value as CalculationType)}>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="calendar" value="calendar" />
                    <Label htmlFor="calendar">Dias corridos</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="business" value="business" />
                    <Label htmlFor="business">Dias uteis</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="result">Resultado ({calculationModeLabel})</Label>
                <Input id="result" type="text" readOnly value={endDate ? formatDateToBr(endDate) : ""} placeholder="dd/mm/aaaa" />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={() => void handleCalculate()} disabled={isCalculating}>
                  {isCalculating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Calcular
                </Button>
                <Button type="button" variant="secondary" onClick={handleClear}>
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="fade-up delay-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Feriados
              </CardTitle>
              <CardDescription>Cadastre e remova feriados usados no calculo de dias uteis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
                <Input type="date" value={holidayDate} onChange={(event) => setHolidayDate(event.target.value)} />
                <Input
                  type="text"
                  placeholder="Descricao do feriado"
                  value={holidayDescription}
                  onChange={(event) => setHolidayDescription(event.target.value)}
                />
                <Button type="button" onClick={() => void handleCreateHoliday()}>
                  Adicionar
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descricao</TableHead>
                    <TableHead className="w-24 text-right">Acao</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isHolidayLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                        Carregando feriados...
                      </TableCell>
                    </TableRow>
                  ) : holidays.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                        Nenhum feriado cadastrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    holidays.map((holiday) => (
                      <TableRow key={holiday.id}>
                        <TableCell>{formatDateToBr(holiday.date.slice(0, 10))}</TableCell>
                        <TableCell>{holiday.description}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => void handleDeleteHoliday(holiday.id)}
                            aria-label={`Excluir feriado ${holiday.description}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
