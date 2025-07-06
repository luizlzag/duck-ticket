
import React from 'react';
import { useAppSelector } from '../hooks/redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
  const user = useAppSelector(state => state.user.user);
  const purchaseHistory = useAppSelector(state => state.user.purchaseHistory);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Você precisa estar logado para ver seu perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nome</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Compras</CardTitle>
              </CardHeader>
              <CardContent>
                {purchaseHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Você ainda não realizou nenhuma compra
                  </p>
                ) : (
                  <div className="space-y-4">
                    {purchaseHistory.map((purchase) => (
                      <div key={purchase.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm text-gray-600">
                              Pedido #{purchase.id}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(purchase.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <Badge className="bg-green-500">Confirmado</Badge>
                        </div>

                        <div className="space-y-2 mb-3">
                          {purchase.items.map((item: any, index: number) => (
                            <div key={index} className="text-sm">
                              <p className="font-semibold">{item.eventTitle}</p>
                              <p className="text-gray-600">
                                {item.ticketName} - Qtd: {item.quantity} - R$ {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            Total: R$ {purchase.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
