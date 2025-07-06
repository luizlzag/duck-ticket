import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setFilters } from '../store/slices/eventsSlice';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EventFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.events.filters);

  const handleFilterChange = (key: string, value: string) => {
    // Convert "all" values back to empty strings for the filter logic
    const filterValue = value === 'all' ? '' : value;
    dispatch(setFilters({ [key]: filterValue }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">Filtros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar eventos
          </label>
          <Input
            type="text"
            placeholder="Nome do evento..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <Select 
            value={filters.category || 'all'} 
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="1">Música</SelectItem>
              <SelectItem value="teatro">Teatro</SelectItem>
              <SelectItem value="stand-up">Stand-Up</SelectItem>
              <SelectItem value="esportes">Esportes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localização
          </label>
          <Select 
            value={filters.location || 'all'} 
            onValueChange={(value) => handleFilterChange('location', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as cidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              <SelectItem value="sao-paulo">São Paulo</SelectItem>
              <SelectItem value="rio-de-janeiro">Rio de Janeiro</SelectItem>
              <SelectItem value="belo-horizonte">Belo Horizonte</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data
          </label>
          <Input
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EventFilters;