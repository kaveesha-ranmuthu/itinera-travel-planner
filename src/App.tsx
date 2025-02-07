import "./App.css";
import art1 from "./assets/art-1.jpg";
import title from "./assets/title.svg";
import planeWithLine from "./assets/plane-with-line.svg";

function App() {
  return (
    <div className=" w-dvw h-dvh bg-cover bg-black">
      <img src={art1} className="w-full h-full opacity-50" />
      <div className="absolute bottom-0 left-0 flex items-center justify-center w-full h-full">
        <div className="text-center space-y-5">
          <img src={title} alt="itinera travel planner" />
          <button className="font-brand cursor-pointer italic uppercase bg-primary text-secondary px-7 py-1.5 rounded-lg">
            Get Started
          </button>
        </div>
      </div>
      <img
        className="absolute bottom-[56%] left-[57.5%]"
        src={planeWithLine}
        alt="logo"
      />
    </div>
  );
}

export default App;
