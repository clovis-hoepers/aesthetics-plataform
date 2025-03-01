import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { pt } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import ErrorBoundary from '../components/ErrorBoundary'; // Import ErrorBoundary component

type AppointmentType = {
  id: string;
  date: Date;
  time: string;
  service: string;
  name: string;
  email: string;
  phone: string;
};

const serviceTypes = [
  { id: "facial1", name: "Limpeza de Pele Profunda", category: "Facial", duration: "60min" },
  { id: "facial2", name: "Tratamento Anti-Idade", category: "Facial", duration: "90min" },
  { id: "facial3", name: "Hidratação Facial", category: "Facial", duration: "45min" },
  { id: "body1", name: "Drenagem Linfática", category: "Corporal", duration: "60min" },
  { id: "body2", name: "Redução de Medidas", category: "Corporal", duration: "75min" },
  { id: "body3", name: "Tratamento para Celulite", category: "Corporal", duration: "60min" },
];

const timeSlots = [
  "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
];

const fetchAppointments = async () => {
  const response = await axios.get('/schedules');
  return response.data;
};

function AppointmentScheduler() {
  const { toast } = useToast();
  const { data: appointments, error, isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: fetchAppointments
  });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const history = useNavigate();

  // Add state for appointments
  const [localAppointments, setAppointments] = useState<AppointmentType[]>([]);

  useEffect(() => {
    if (appointments) {
      setAppointments(appointments);
    }
  }, [appointments]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading appointments</div>;

  // Ensure appointments is an array
  if (!Array.isArray(localAppointments)) {
    return <div>Invalid data format</div>;
  }

  const handleSchedule = async () => {
    if (!date || !time || !service || !name || !email || !phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    // Check if the time slot is already booked
    const isTimeSlotBooked = localAppointments.some(
      app => 
        app.id !== editId && 
        format(app.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
        app.time === time
    );

    if (isTimeSlotBooked) {
      toast({
        title: "Horário indisponível",
        description: "Este horário já está agendado. Por favor, escolha outro.",
        variant: "destructive"
      });
      return;
    }

    if (editId) {
      // Update existing appointment
      setAppointments(localAppointments.map(app => 
        app.id === editId 
          ? { id: editId, date: date, time, service, name, email, phone } 
          : app
      ));
      
      toast({
        title: "Agendamento atualizado",
        description: `Seu agendamento foi atualizado para ${format(date, 'dd/MM/yyyy', { locale: pt })} às ${time}.`,
      });
      
      setEditId(null);
    } else {
      // Create new appointment
      const newAppointment: AppointmentType = {
        id: crypto.randomUUID(),
        date: date,
        time,
        service,
        name,
        email,
        phone
      };
      
      setAppointments([...localAppointments, newAppointment]);
      
      toast({
        title: "Agendamento confirmado",
        description: `Seu agendamento foi marcado para ${format(date, 'dd/MM/yyyy', { locale: pt })} às ${time}.`,
      });
    }

    // Reset form
    setTime("");
    setService("");
    setName("");
    setEmail("");
    setPhone("");
    setActiveTab("myAppointments");
  };

  const handleEdit = (appointment: AppointmentType) => {
    setDate(appointment.date);
    setTime(appointment.time);
    setService(appointment.service);
    setName(appointment.name);
    setEmail(appointment.email);
    setPhone(appointment.phone);
    setEditId(appointment.id);
    setActiveTab("schedule");
  };

  const handleCancel = async (id: string) => {
    try {
      await axios.delete(`/api/appointments/${id}`);
      setAppointments(localAppointments.filter(app => app.id !== id));
      toast({
        title: "Agendamento cancelado",
        description: "Seu agendamento foi cancelado com sucesso.",
      });
    } catch (error) {
      console.error('Failed to delete appointment', error);
    }
  };

  const handleCancelEdit = () => {
    setDate(new Date());
    setTime("");
    setService("");
    setName("");
    setEmail("");
    setPhone("");
    setEditId(null);
  };

  const getServiceById = (id: string) => {
    return serviceTypes.find(s => s.id === id)?.name || id;
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-purple-500 text-center mb-12 animate-fade-up">
          Agende seu horário
        </h2>
        
        <Card className="border-purple-200 shadow-md animate-fade-in">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="font-playfair text-2xl text-purple-500">Agendamento</CardTitle>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="schedule" className="data-[state=active]:bg-purple-300 data-[state=active]:text-white">
                    Agendar
                  </TabsTrigger>
                  <TabsTrigger value="myAppointments" className="data-[state=active]:bg-purple-300 data-[state=active]:text-white">
                    Meus Agendamentos
                  </TabsTrigger>
                </TabsList>
              </div>
              <CardDescription className="text-purple-400">
                {editId ? "Edite seu agendamento preenchendo o formulário abaixo." : "Preencha os campos abaixo para agendar seu atendimento."}
              </CardDescription>
            </CardHeader>
            
            <TabsContent value="schedule">
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-purple-500 mb-2">Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-purple-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-500 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-purple-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-500 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border-purple-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-500 mb-2">Data</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-purple-200 text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-purple-300" />
                        {date ? format(date, 'PPP', { locale: pt }) : <span>Selecione uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-500 mb-2">Horário</label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="w-full border-purple-200">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-300" />
                        <SelectValue placeholder="Selecione um horário" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem 
                          key={slot} 
                          value={slot}
                          disabled={localAppointments.some(
                            app => 
                              app.id !== editId && 
                              date && 
                              format(app.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
                              app.time === slot
                          )}
                        >
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-500 mb-2">Serviço</label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger className="w-full border-purple-200">
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="mb-2">
                        <span className="px-2 py-1 text-xs font-semibold text-purple-500 bg-purple-100 rounded-full">
                          Estética Facial
                        </span>
                      </div>
                      {serviceTypes.filter(s => s.category === "Facial").map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex justify-between w-full">
                            <span>{service.name}</span>
                            <span className="text-xs text-gray-500">{service.duration}</span>
                          </div>
                        </SelectItem>
                      ))}
                      <Separator className="my-2" />
                      <div className="mb-2">
                        <span className="px-2 py-1 text-xs font-semibold text-purple-500 bg-purple-100 rounded-full">
                          Estética Corporal
                        </span>
                      </div>
                      {serviceTypes.filter(s => s.category === "Corporal").map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex justify-between w-full">
                            <span>{service.name}</span>
                            <span className="text-xs text-gray-500">{service.duration}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2 justify-end">
                {editId && (
                  <Button 
                    variant="outline" 
                    className="border-purple-200 text-purple-400 hover:bg-purple-100"
                    onClick={handleCancelEdit}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                )}
                <Button 
                  className="bg-purple-300 hover:bg-purple-400" 
                  onClick={handleSchedule}
                >
                  <Check className="mr-2 h-4 w-4" />
                  {editId ? 'Atualizar' : 'Agendar'}
                </Button>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="myAppointments">
              <CardContent>
                {localAppointments.length === 0 ? (
                  <div className="text-center py-8 text-purple-400">
                    Você não possui agendamentos. Crie um novo agendamento na aba "Agendar".
                  </div>
                ) : (
                  <div className="space-y-4">
                    {localAppointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="border border-purple-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-purple-500">
                              {getServiceById(appointment.service)}
                            </h4>
                            <div className="flex items-center mt-2 text-sm text-purple-400">
                              <CalendarIcon className="mr-1 h-4 w-4" />
                              {format(appointment.date, 'PPP', { locale: pt })}
                              <span className="mx-2">•</span>
                              <Clock className="mr-1 h-4 w-4" />
                              {appointment.time}
                            </div>
                            <div className="mt-2 text-sm text-purple-400">
                              <span className="font-medium">Nome:</span> {appointment.name}
                            </div>
                            <div className="mt-1 text-sm text-purple-400">
                              <span className="font-medium">Email:</span> {appointment.email}
                            </div>
                            <div className="mt-1 text-sm text-purple-400">
                              <span className="font-medium">Telefone:</span> {appointment.phone}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 border-purple-200 hover:bg-purple-100"
                              onClick={() => handleEdit(appointment)}
                            >
                              Editar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleCancel(appointment.id)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="outline" 
                  className="border-purple-200 text-purple-400 hover:bg-purple-100"
                  onClick={() => setActiveTab("schedule")}
                >
                  {localAppointments.length === 0 ? 'Criar agendamento' : 'Novo agendamento'}
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </section>
  );
}

const Agendamentos = () => {
  return (
    <ErrorBoundary>
      <AppointmentScheduler />
    </ErrorBoundary>
  );
};

export default Agendamentos;
