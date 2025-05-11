interface PriceRangeProps {
  range: 1 | 2 | 3 | 4;
  className?: string;
}

function PriceRange({ range, className = '' }: PriceRangeProps) {
  const renderPrice = () => {
    const active = 'text-gray-900 font-medium';
    const inactive = 'text-gray-300';
    
    return (
      <>
        <span className={range >= 1 ? active : inactive}>$</span>
        <span className={range >= 2 ? active : inactive}>$</span>
        <span className={range >= 3 ? active : inactive}>$</span>
        <span className={range >= 4 ? active : inactive}>$</span>
      </>
    );
  };
  
  return (
    <div className={`flex ${className}`}>
      {renderPrice()}
    </div>
  );
}

export default PriceRange;