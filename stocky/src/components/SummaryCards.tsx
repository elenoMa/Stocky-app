interface SummaryCardProps {
    title: string;
    value: number | string;
    color: string;
    icon: string;
}

const SummaryCardData: SummaryCardProps[] = [
    {
        title: "Productos",
        value: 128,
        color: "bg-blue-100 text-blue700",
        icon: "📦",
    },
    {
        title: "Bajo Stock",
        value: 5,
        color: "bg-yellow-100 text-yellow-700",
        icon: "📊",
    },
    {
        title: "Categorías",
        value: 7,
        color: "bg-green-100 text-green-700",
        icon: "📁",
    },
]

const SummaryCards = () => {
return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {SummaryCardData.map((card) => (
        <div
          key={card.title}
          className={`flex items-center justify-between p-4 rounded shadow ${card.color}`}
        >
          <div className="text-4xl">{card.icon}</div>
          <div className="text-right">
            <p className="text-xl font-bold">{card.value}</p>
            <p className="text-sm">{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards;