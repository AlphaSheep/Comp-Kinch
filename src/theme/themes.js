import React from "react";
import { Button } from 'antd';
import './dark.less'


export const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {
    console.log("???");
  }
});

export class ThemeButton extends React.Component {

  render() {
    return <ThemeContext.Consumer>
      {({ theme, toggleTheme }) => 
        <Button shape="circle" onClick={toggleTheme}>T</Button>
      }
    </ThemeContext.Consumer>
  }
}
