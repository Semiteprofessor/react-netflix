import './App.css';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Pagination  from './components/Pagination';
const App = () => {

  return (
    // <Router>
    <div className="App">
      <Pagination />
      {/* <Switch>
        <Route exact path='path' component={Pagination}/>
      </Switch> */}
    </div>
    // </Router>
  );
}

export default App;
