import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchEventById } from '../store/slices/eventsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import SeatMap from '../components/SeatMap';

// Defina tipos para os dados do mapa de assentos para melhor organização
type Seat = {
  rowLabel: string;
  seatNumber: number;
  columnIndex: number;
  status: 'available' | 'occupied';
};

type Sector = {
  id: number;
  name: string;
  price: number;
  block: 'left' | 'center' | 'right';
  rowIndex: number;
  seats: Seat[];
};

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const event = useAppSelector(state => state.events.selectedEvent);
  const [selectedPerformance, setSelectedPerformance] = useState<number>(0);
  
  // Estado para seleção por quantidade (eventos sem mapa)
  const [selectedTickets, setSelectedTickets] = useState<{ [key: number]: number }>({});
  
  // Novo estado para assentos selecionados (eventos com mapa)
  const [selectedSeats, setSelectedSeats] = useState<{ seat: Seat, sector: Sector }[]>([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(parseInt(id)));
    }
  }, [dispatch, id]);

  // Limpa a seleção ao trocar de data/performance
  useEffect(() => {
    setSelectedTickets({});
    setSelectedSeats([]);
  }, [selectedPerformance]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const performance = event.performances[selectedPerformance];
  const venue = performance?.venue;

  // Função de formatação longa para títulos
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };
  
  // <-- MUDANÇA AQUI: Nova função para datas curtas nos botões -->
  const formatShortDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('pt-BR', {
          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
      }).replace(',', ' ');
  };

  const handleAddToCartByQuantity = (ticketId: number, ticketName: string, price: number) => {
    const quantity = selectedTickets[ticketId] || 1;
    dispatch(addToCart({
      eventId: event.id, eventTitle: event.title, performanceId: performance.id, ticketId,
      ticketName, price, quantity, venue: venue?.name || '', date: formatDate(performance.start_time),
    }));
    toast({ title: "Ingresso adicionado!", description: `${quantity}x ${ticketName} adicionado ao carrinho` });
    setSelectedTickets(prev => ({ ...prev, [ticketId]: 0 }));
  };
  
  const handleAddToCartBySeats = () => {
    selectedSeats.forEach(({ seat, sector }) => {
      dispatch(addToCart({
        eventId: event.id, eventTitle: event.title, performanceId: performance.id,
        ticketId: sector.id,
        ticketName: `${sector.name} (Assento ${seat.rowLabel}${seat.seatNumber})`,
        price: sector.price,
        quantity: 1,
        venue: venue?.name || '',
        date: formatDate(performance.start_time),
      }));
    });
    toast({ title: "Ingressos adicionados!", description: `${selectedSeats.length} assentos adicionados ao carrinho.` });
    setSelectedSeats([]);
  };

  const updateTicketQuantity = (ticketId: number, quantity: number) => {
    setSelectedTickets(prev => ({ ...prev, [ticketId]: Math.max(0, quantity) }));
  };
  
  const handleSeatClick = (seat: Seat, sector: Sector) => {
    if (seat.status === 'occupied') return;

    setSelectedSeats(prevSelected => {
      const isSelected = prevSelected.some(s => s.seat.seatNumber === seat.seatNumber && s.seat.rowLabel === seat.rowLabel);
      if (isSelected) {
        return prevSelected.filter(s => !(s.seat.seatNumber === seat.seatNumber && s.seat.rowLabel === seat.rowLabel));
      } else {
        return [...prevSelected, { seat, sector }];
      }
    });
  };
  
  const calculateTotalPrice = () => {
      return selectedSeats.reduce((total, { sector }) => total + sector.price, 0);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... Imagem do evento, título, etc. (sem alterações) ... */}
      <div className="relative h-96 overflow-hidden">
        <img src={event.img_event || 'https://placedog.net/1200/400'} alt={event.title} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <div className="flex flex-wrap gap-2 mb-4">
            {event.categories.map(category => (
              <Badge key={category.id} className="bg-purple-500">{category.name}</Badge>
            ))}
          </div>
          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
          {venue && (<p className="text-lg">📍 {venue.name}, {venue.city} - {venue.state}</p>)}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
         {event.performances.length > 1 && (
              <Card className="mb-6">
                <CardHeader><CardTitle>Datas Disponíveis</CardTitle></CardHeader>
                <CardContent>
                  {/* <-- MUDANÇA AQUI: Botões menores usando Flexbox e o componente Button --> */}
                  <div className="flex flex-wrap gap-2">
                    {event.performances.map((perf, index) => (
                      <Button
                        key={perf.id}
                        onClick={() => setSelectedPerformance(index)}
                        variant={selectedPerformance === index ? 'default' : 'outline'}
                        size="sm"
                      >
                        {formatShortDate(perf.start_time)}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        
        {/* <-- MUDANÇA AQUI: O grid agora contém apenas a parte de informações e, condicionalmente, a compra por quantidade --> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna de conteúdo principal - se ajusta se o mapa de assentos estiver ativo */}
          <div className={performance.seatingEnabled ? 'lg:col-span-3' : 'lg:col-span-2'}>
            <Card className="mb-6">
              <CardHeader><CardTitle>Sobre o Evento</CardTitle></CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{event.description}</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Política do Evento</h4>
                  <p className="text-yellow-700 text-sm">{event.policy}</p>
                </div>
              </CardContent>
            </Card>
            

           
          </div>
          

          {/* Coluna de ingressos por quantidade - SÓ APARECE SE NÃO TIVER MAPA DE ASSENTOS */}
          
          {!performance.seatingEnabled && (
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Ingressos</CardTitle>
                  <p className="text-sm text-gray-600">{formatDate(performance.start_time)}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performance.tickets.map(ticket => (
                      <div key={ticket.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{ticket.name}</h4>
                            <p className="text-2xl font-bold text-price">R$ {ticket.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => updateTicketQuantity(ticket.id, (selectedTickets[ticket.id] || 0) - 1)}>-</Button>
                            <span className="w-8 text-center">{selectedTickets[ticket.id] || 0}</span>
                            <Button variant="outline" size="sm" onClick={() => updateTicketQuantity(ticket.id, (selectedTickets[ticket.id] || 0) + 1)}>+</Button>
                          </div>
                          <Button
                            className="flex-1 bg-gradient-to-r from-gradientFrom to-gradientTo hover:from-gradientFrom hover:gradientTo trans"
                            onClick={() => handleAddToCartByQuantity(ticket.id, ticket.name, ticket.price)}
                            disabled={!selectedTickets[ticket.id] || selectedTickets[ticket.id] === 0}
                          >
                            Adicionar ao Carrinho
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* <-- MUDANÇA AQUI: Seção do Mapa de Assentos - SÓ APARECE SE TIVER MAPA --> */}
        {/* Renderizado fora e abaixo do grid principal, ocupando a largura total */}
        {performance.seatingEnabled && (
          <div className="mt-6"> {/* Adiciona um espaço acima */}
            <Card> {/* Não é mais 'sticky' */}
              <CardHeader>
                <CardTitle>Escolha seus lugares</CardTitle>
                <p className="text-sm text-gray-600">{formatDate(performance.start_time)}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <SeatMap
                  sectors={performance.sectors as Sector[]}
                  selectedSeats={selectedSeats.map(s => s.seat)}
                  onSeatClick={handleSeatClick}
                />
                {selectedSeats.length > 0 && (
                  <div className="p-4 border rounded-lg mt-4 space-y-3">
                    <h4 className="font-semibold">Assentos Selecionados</h4>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {selectedSeats.map(({seat, sector}) => (
                        <li key={`${seat.rowLabel}${seat.seatNumber}`}>
                          {sector.name}: Assento {seat.rowLabel}{seat.seatNumber} - R$ {sector.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <div className="text-right font-bold text-lg">
                      Total: R$ {calculateTotalPrice().toFixed(2)}
                    </div>
                    <Button
                      className="w-full custom-bg-hover-effect bg-gradient-to-r from-gradientFrom to-gradientTo  hover:from-gradientFrom hover:to-gradientTo "
                      onClick={handleAddToCartBySeats}
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;