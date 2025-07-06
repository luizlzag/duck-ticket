import React, { useMemo } from 'react';

// Tipos
type Seat = {
  rowLabel: string;
  seatNumber: number;
  columnIndex: number;
  status: 'available' | 'occupied';
};

type Sector = {
  id: number;
  name: string;
  price: number;
  block: 'left' | 'center' | 'right';
  rowIndex: number;
  seats: Seat[];
};

interface SeatMapProps {
  sectors: Sector[];
  selectedSeats: Seat[];
  onSeatClick: (seat: Seat, sector: Sector) => void;
}

// Componente para renderizar um assento ou placeholder
const SeatOrPlaceholder: React.FC<{
  item?: { seat: Seat; sector: Sector };
  onSeatClick: (seat: Seat, sector: Sector) => void;
  getSeatClass: (seat: Seat) => string;
}> = ({ item, onSeatClick, getSeatClass }) => {
  if (!item) {
    return <div className="w-9 h-8" />;
  }

  const { seat, sector } = item;
  return (
    <button
      key={`${seat.rowLabel}-${seat.seatNumber}`}
      onClick={() => onSeatClick(seat, sector)}
      disabled={seat.status === 'occupied'}
      className={`w-9 h-8 flex items-center justify-center rounded text-xs font-mono transition-colors ${getSeatClass(seat)}`}
      title={`${sector.name} - Fila ${seat.rowLabel}, Assento ${seat.seatNumber}`}
    >
      {seat.seatNumber}
    </button>
  );
};

const SeatMap: React.FC<SeatMapProps> = ({ sectors, selectedSeats, onSeatClick }) => {
  const isSeatSelected = (seat: Seat) => {
    return selectedSeats.some(s => s.seatNumber === seat.seatNumber && s.rowLabel === seat.rowLabel);
  };

  const getSeatClass = (seat: Seat) => {
    if (seat.status === 'occupied') {
      return 'bg-gray-400 cursor-not-allowed text-gray-600';
    }
    if (isSeatSelected(seat)) {
      return 'bg-purple-600 text-white hover:bg-purple-700 ring-2 ring-purple-400';
    }
    return 'bg-gray-200 hover:bg-gray-300';
  };

  // Lógica de layout
  const { unifiedLayout, maxSeats, sortedRowLabels } = useMemo(() => {
    const layout: { [rowLabel: string]: { seat: Seat; sector: Sector }[] } = {};
    let maxSeats = 0;

    // Ordena os setores por rowIndex
    const sortedSectors = [...sectors].sort((a, b) => a.rowIndex - b.rowIndex);

    // Preenche a estrutura do layout (apenas bloco central)
    sortedSectors.forEach(sector => {
      sector.seats.forEach(seat => {
        const { rowLabel } = seat;
        if (!layout[rowLabel]) {
          layout[rowLabel] = [];
        }
        layout[rowLabel].push({ seat, sector });
      });
    });

    // Ordena assentos e calcula o máximo
    for (const rowLabel in layout) {
      layout[rowLabel].sort((a, b) => a.seat.seatNumber - b.seat.seatNumber);
      const currentLength = layout[rowLabel].length;
      if (currentLength > maxSeats) {
        maxSeats = currentLength;
      }
    }

    const sortedRowLabels = Object.keys(layout).sort().reverse();

    return { unifiedLayout: layout, maxSeats, sortedRowLabels };
  }, [sectors]);

  // Função para renderizar os assentos de uma linha
  const renderRowSeats = (rowLabel: string) => {
    const seats = unifiedLayout[rowLabel] || [];
    const placeholders = Array(maxSeats - seats.length).fill(null);
    const allItems = [...seats, ...placeholders];

    return allItems.map((item, index) => (
      <SeatOrPlaceholder
        key={index}
        item={item}
        onSeatClick={onSeatClick}
        getSeatClass={getSeatClass}
      />
    ));
  };

  // Estilo do grid
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${maxSeats}, auto)`,
    gap: '4px',
    alignItems: 'center',
    minWidth: `${maxSeats * 40}px`, // Garante largura suficiente
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg bg-gray-50 space-y-8 overflow-x-auto">
      <div className="w-full p-2 text-center bg-gray-300 text-gray-800 font-semibold rounded sticky top-0 z-10">
        PALCO / TELA
      </div>

      <div className="flex flex-col gap-y-2">
        {sortedRowLabels.map(rowLabel => (
          <div key={rowLabel} className="flex items-center gap-x-4">
            <span className="w-8 text-sm font-semibold text-gray-500 text-right">{rowLabel}</span>
            <div style={gridStyle}>
              {renderRowSeats(rowLabel)}
            </div>
            <span className="w-8 text-sm font-semibold text-gray-500 text-left">{rowLabel}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center flex-wrap gap-4 pt-4 border-t w-full">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-gray-200"></div>
          <span className="text-sm">Disponível</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-purple-600"></div>
          <span className="text-sm">Selecionado</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-gray-400"></div>
          <span className="text-sm">Ocupado</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;