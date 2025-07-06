import React from 'react';
import { Event } from '../services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const performance = event.performances[0];
  const venue = performance?.venue;

  const handleCardClick = () => {
    navigate(`/event/${event.id}`);
  };

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={event.img_event || 'https://placedog.net/400/300'}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          {event.categories.map(category => (
            <Badge key={category.id} className="bg-purple-500 text-white mr-2">
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{event.title}</h3>
        
        
        {venue && (
          <div className="text-sm text-gray-500 mb-2">
            {venue.name}, {venue.city} - {venue.state}
          </div>
        )}
        
        {performance && (
          <div className="text-sm text-gray-500">
            {formatDate(performance.start_time)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
