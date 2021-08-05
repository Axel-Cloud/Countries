import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch as Search } from '@fortawesome/free-solid-svg-icons';

export default function Filter(props) {
    return (
        <section className="Filter">
            <div className="FilterContainer">
                <FontAwesomeIcon className="IconFilter" icon={Search} />
                <input className="InputFilter" type="text" placeholder="Search for a country..." autoComplete="onoff" onChange={(e) => {
                    props.ChangeFilter(e.target.value, "Search");
                }}/>
            </div>

            <select id="RegionFilter" className="FilterRegion" onChange={(e) => props.ChangeFilter(e.target.value, "Region")}>
                <option defaultValue value="Worldwide">Worldwide</option>
                <option value="Africa">Africa</option>
                <option value="Americas">America</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Oceania">Oceania</option>
            </select>
        </section>
    );
}