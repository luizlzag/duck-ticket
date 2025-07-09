import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setFilters } from '../store/slices/eventsSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EventFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.events.filters);
  const categories = useAppSelector(state => state.categories.categories);

  useEffect(() => {
    dispatch(fetchCategories({}));
  }, [dispatch]);

  const handleFilterChange = (key: string, value: string) => {
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
           value={filters.categoryId ? filters.categoryId.toString() : '0'}
            onValueChange={(value) => handleFilterChange('categoryId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'0'} >Todas as categorias</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
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