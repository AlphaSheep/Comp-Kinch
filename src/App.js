
import React from "react";
import AppRouter from './routes';
import { ThemeContext } from './theme/themes';

class App extends React.Component {
  constructor(props) {
    super(props);

    const savedTheme = localStorage.getItem('theme');
    const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.state = {
      theme: savedTheme ? savedTheme : (defaultDark ? 'dark' : 'light'),
      toggleTheme: () => this.toggleTheme()
    }
  }

  toggleTheme() {
    const theme = this.state.theme === 'light' ? 'dark' : 'light';    
    localStorage.setItem('theme', theme);
    this.setState({theme: theme});
  }

  render() {
    return <ThemeContext.Provider value={this.state}>
      <AppRouter />
    </ThemeContext.Provider>
  }
}

export default App;
