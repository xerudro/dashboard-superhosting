import React from 'react';

interface CardGridProps {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  className?: string;
}

const CardGrid: React.FC<CardGridProps> = ({ 
  children, 
  columns = { sm: 1, md: 2, lg: 3 },
  className = ""
}) => {
  const getGridCols = () => {
    const cols = [];
    if (columns.sm) cols.push(`grid-cols-${columns.sm}`);
    if (columns.md) cols.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) cols.push(`lg:grid-cols-${columns.lg}`);
    return cols.join(' ');
  };

  return (
    <div className={`grid ${getGridCols()} gap-8 ${className}`}>
      {children}
    </div>
  );
};

export default CardGrid;