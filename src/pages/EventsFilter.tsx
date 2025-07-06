
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchEvents } from '../store/slices/eventsSlice';
import EventCard from '../components/EventCard';
import EventFilters from '../components/EventFilters';

const EventsFilter = () => {
  const dispatch = useAppDispatch();
  const { events, loading, error, filters } = useAppSelector(state => state.events);

  useEffect(() => {
    dispatch(fetchEvents({}));
  }, [dispatch]);

  // Filter events based on search term
  const filteredEvents = events.filter(event => {
    if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Buscar Eventos
          </h1>
          <p className="text-gray-600">
            Use os filtros abaixo para encontrar eventos do seu interesse
          </p>
        </div>

        <EventFilters />
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Resultados da Busca
          </h2>
          <p className="text-gray-600">
            {filteredEvents.length} evento(s) encontrado(s)
          </p>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum evento encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsFilter;
