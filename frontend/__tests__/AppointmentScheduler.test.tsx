import { render, screen, fireEvent } from '@testing-library/react';
import AppointmentScheduler from '../src/pages/Agendamentos';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('AppointmentScheduler', () => {
  it('should render the scheduler form', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AppointmentScheduler />
      </QueryClientProvider>
    );

    expect(screen.getByText('Agende seu horário')).toBeInTheDocument();
  });

  it('should show error if required fields are missing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AppointmentScheduler />
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText('Agendar'));

    expect(screen.getByText('Por favor, preencha todos os campos.')).toBeInTheDocument();
  });
});
