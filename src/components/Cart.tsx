
import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { removeFromCart, updateQuantity, toggleCart, setCartOpen } from '../store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, total, isOpen } = useAppSelector(state => state.cart);

  if (!isOpen) return null;

  const handleCheckout = () => {
    dispatch(setCartOpen(false));
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Carrinho</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(toggleCart())}
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Seu carrinho está vazio</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const itemId = `${item.eventId}-${item.ticketId}-${item.performanceId}`;
                  return (
                    <Card key={itemId}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm">{item.eventTitle}</h4>
                        <p className="text-xs text-gray-600 mb-2">{item.venue}</p>
                        <p className="text-xs text-gray-600 mb-2">{item.date}</p>
                        <p className="text-sm">{item.ticketName}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => dispatch(updateQuantity({ 
                                id: itemId, 
                                quantity: Math.max(1, item.quantity - 1) 
                              }))}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => dispatch(updateQuantity({ 
                                id: itemId, 
                                quantity: item.quantity + 1 
                              }))}
                            >
                              +
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => dispatch(removeFromCart(itemId))}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    R$ {total.toFixed(2)}
                  </span>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                >
                  Finalizar Compra
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
