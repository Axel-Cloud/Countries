import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon as DarkMoon } from '@fortawesome/free-solid-svg-icons';
import { faMoon as LightMoon  } from "@fortawesome/free-regular-svg-icons";

export default function Header(props) {
    return (
        <header>
          <nav>
            <Link className="Title" to="/">Where in the world?</Link>

            <div className="ThemeSwitcher">
              { localStorage.getItem("Theme") === "Light" ? <FontAwesomeIcon icon={LightMoon} /> : <FontAwesomeIcon icon={DarkMoon} /> }
              <button className="ThemeButton" onClick={props.changeTheme}>{ localStorage.getItem("Theme") === "Light" ? "Dark Mode" : "Light Mode" }</button>
            </div>
          </nav>
        </header>
    );
}