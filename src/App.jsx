import HomeVisitRecordGenerator from "./HomeVisitRecordGenerator";

export default function App() {
  return (
    <div className="min-h-full">
      <HomeVisitRecordGenerator />
      <footer className="no-print mx-auto max-w-7xl px-4 pb-10 text-center text-xs text-slate-400 md:px-6">
        <p>
          僅供居家服務員協助整理訪視紀錄使用 · 表單內容會自動儲存在你的瀏覽器
        </p>
      </footer>
    </div>
  );
}
