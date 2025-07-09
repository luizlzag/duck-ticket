import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchEvents } from '../store/slices/eventsSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import EventCard from '../components/EventCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './swiper-custom.css'; 

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { events, loading, error } = useAppSelector(state => state.events);
  const { categories, loading: categoriesLoading } = useAppSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchEvents({}));
    dispatch(fetchCategories({}));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
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
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={2}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 8 },
            768: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 16 },
          }}
          className="w-full"
        >
          {events.map(event => (
            <SwiperSlide key={event.id}>
              <EventCard event={event} />
            </SwiperSlide>
          ))}
        </Swiper>
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
        {/* Seção de Categorias */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Navegue por Categoria</h2>
          {categoriesLoading ? (
            <p className="text-center text-gray-500">Carregando categorias...</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map(category => {
                const svgDataUri = `data:image/svg+xml;base64,${btoa(category.icon_svg)}`;
                return (
                  <Badge
                    key={category.id}
                    onClick={() => navigate(`/events?categoryId=${category.id}`)}
                    className="text-base font-normal py-2 px-4 cursor-pointer hover:bg-purple-100 transition-colors inline-flex items-center gap-2"
                    variant="outline"
                  >
                    {category.icon_svg && (
                      <img
                        src={svgDataUri}
                        alt={`${category.name} icon`}
                        className="h-5 w-5"
                      />
                    )}
                    <span>{category.name}</span>
                  </Badge>
                );
              })}
            </div>
          )}
        </section>

        {/* Seções de Eventos */}
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