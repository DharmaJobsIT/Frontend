function IntelligenceFeed() {
  const insights = [
    "📈 Applications increased by 18% today",
    "🎯 Math teachers trending in Bangalore",
    "⚠️ 3 recruiters pending verification",
    "🏫 2 new institutes joined today",
  ];

  return (
    <div className="
      p-5 rounded-xl

      bg-white shadow
      dark:bg-gray-900
    ">
      <h3 className="font-semibold mb-3">🔥 Today’s Intelligence</h3>

      <ul className="space-y-2 text-sm">
        {insights.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default IntelligenceFeed;