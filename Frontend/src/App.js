import Navbar from './component/Navbar';
import Resultwraper from './component/Resultwraper';
import Searchcontainer from './component/Searchcontainer';

function App() {


   
    return (
        <div className="App bg-slate-100">
            <Navbar  />
            <Searchcontainer />
            <Resultwraper />
        </div>
    );
}

export default App;