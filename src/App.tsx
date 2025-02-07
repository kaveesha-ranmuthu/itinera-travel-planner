import "./App.css";
import art1 from "./assets/art-1.jpg";
import frontPageLogo from "./assets/title.svg";

function App() {
  return (
    <div className=" w-dvw h-dvh bg-cover bg-black">
      <img src={art1} className="w-full h-full opacity-50" />
      <div className="absolute bottom-5 left-0 flex items-center justify-center w-full h-full">
        <div className="text-center space-y-5">
          <div className="ml-24">
            <img src={frontPageLogo} alt="itinera travel planner" />
          </div>
          <button className="hover:scale-98 transition ease-in-out duration-100 font-brand cursor-pointer italic uppercase bg-primary text-secondary px-7 py-1.5 rounded-lg">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
