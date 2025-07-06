
import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { clearCart } from '../store/slices/cartSlice';
import { addToPurchaseHistory } from '../store/slices/userSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, total } = useAppSelector(state => state.cart);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate payment processing
    const purchase = {
      id: Date.now().toString(),
      items: items,
      total: total,
      date: new Date().toISOString(),
      customer: formData,
    };

    dispatch(addToPurchaseHistory(purchase));
    dispatch(clearCart());

    toast({
      title: "Compra realizada com sucesso!",
      description: "Seus ingressos foram enviados por email.",
    });

    navigate('/profile');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Seu carrinho está vazio</p>
          <Button onClick={() => navigate('/')}>
            Voltar aos Eventos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="document">CPF</Label>
                    <Input
                      id="document"
                      name="document"
                      value={formData.document}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dados do Cartão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="0000 0000 0000 0000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Validade</Label>
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/AA"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => {
                    const itemId = `${item.eventId}-${item.ticketId}-${item.performanceId}`;
                    return (
                      <div key={itemId} className="flex justify-between py-2 border-b">
                        <div>
                          <p className="font-semibold text-sm">{item.eventTitle}</p>
                          <p className="text-xs text-gray-600">{item.ticketName}</p>
                          <p className="text-xs text-gray-600">{item.date}</p>
                          <p className="text-xs text-gray-600">Qtd: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg py-3"
                  >
                    Finalizar Compra
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
