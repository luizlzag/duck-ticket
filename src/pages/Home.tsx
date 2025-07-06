import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchEvents } from '../store/slices/eventsSlice';
import EventCard from '../components/EventCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { events, loading, error } = useAppSelector(state => state.events);

  useEffect(() => {
    dispatch(fetchEvents({}));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erro ao carregar eventos: {error}</p>
          <button 
            onClick={() => dispatch(fetchEvents({}))}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Simular categorização dos eventos (em uma implementação real, isso viria da API)
  const mostPurchasedEvents = events.slice(0, 6);
  const partiesAndShows = events.filter(event => 
    event.categories.some(cat => 
      cat.name.toLowerCase().includes('música') || 
      cat.name.toLowerCase().includes('show') ||
      cat.name.toLowerCase().includes('festa')
    )
  ).slice(0, 6);
  const corporateEvents = events.filter(event => 
    event.categories.some(cat => 
      cat.name.toLowerCase().includes('corporativo') || 
      cat.name.toLowerCase().includes('conferência') ||
      cat.name.toLowerCase().includes('workshop')
    )
  ).slice(0, 6);

  const EventSection = ({ title, events, description }: { title: string; events: typeof mostPurchasedEvents; description: string }) => (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      
      {events.length > 2 ? (
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {events.map(event => (
              <CarouselItem key={event.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <EventCard event={event} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum evento encontrado nesta categoria</p>
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Descubra Eventos Incríveis
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Encontre e compre ingressos para os melhores shows, teatros, conferências e festivais
          </p>
          <Button 
            onClick={() => navigate('/events')}
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Buscar Eventos
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <EventSection 
          title="Eventos mais comprados nas últimas 24h"
          events={mostPurchasedEvents}
          description="Os eventos que estão fazendo mais sucesso"
        />

        <EventSection 
          title="Festas e Shows"
          events={partiesAndShows.length > 0 ? partiesAndShows : mostPurchasedEvents}
          description="Música, diversão e entretenimento"
        />

        <EventSection 
          title="Eventos Corporativos"
          events={corporateEvents.length > 0 ? corporateEvents : mostPurchasedEvents}
          description="Conferências, workshops e networking"
        />
      </div>
    </div>
  );
};

export default Home;