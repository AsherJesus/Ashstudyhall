import "@/App.css";
import LofiRoom from "@/pages/LofiRoom";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App" data-testid="app-root">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LofiRoom />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
