import "./App.css";
import art1 from "./assets/art-1.jpg";
import title from "./assets/title.svg";

function App() {
  return (
    <div className=" w-dvw h-dvh bg-cover bg-black">
      <img src={art1} className="w-full h-full opacity-50" />
      <div className="absolute bottom-5 left-10 flex items-center justify-center w-full h-full text-primary">
        <img src={title} alt="itinera travel planner" />
      </div>
    </div>
  );
}

export default App;
