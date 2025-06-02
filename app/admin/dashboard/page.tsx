export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div
          key={n}
          className="bg-[#004432] text-white p-10 rounded-xl text-center text-xl"
        >
          Icon {n}
        </div>
      ))}
    </div>
  );
}
