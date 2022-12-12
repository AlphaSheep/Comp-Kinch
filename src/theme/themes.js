import React from "react";
import './Theme.less'
import './light.less'
import './dark.less'
import { Switch } from "antd";

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
       
        <Switch 
          className="dark-mode-toggle"
          checkedChildren={<>🔆</>}
          unCheckedChildren={<>🌙</>}
          checked={theme==='light'}
          defaultChecked={theme==='light'}
          onClick={toggleTheme}
        />
      }
    </ThemeContext.Consumer>
  }
}
