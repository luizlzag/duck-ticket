import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { toggleCart } from '../store/slices/cartSlice';
import { logout } from '../store/slices/userSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import { ShoppingCart,CircleUser  } from 'lucide-react';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector(state => state.cart.items);
  const user = useAppSelector(state => state.user.user);
  const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate('/')}
          >
            
            DuckTicket
          </h1>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-700 hover:text-purple-600 transition-colors"
          >
            Início
          </button>
          <button 
            onClick={() => navigate('/events')}
            className="text-gray-700 hover:text-purple-600 transition-colors"
          >
            Buscar Eventos
          </button>
          <a href="/categories" className="text-gray-700 hover:text-purple-600 transition-colors">
            Categorias
          </a>
          <a href="/about" className="text-gray-700 hover:text-purple-600 transition-colors">
            Sobre
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Olá, {user.name}</span>
              <Button variant="outline" size="sm">
                Perfil
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          ) : (
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <CircleUser/>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <Login onClose={() => setIsLoginOpen(false)} />
              </DialogContent>
            </Dialog>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(toggleCart())}
            className="relative"
          >
             <ShoppingCart />
            {cartItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;