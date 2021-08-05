import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft as ArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Sentry } from "react-activity";
import "react-activity/dist/Sentry.css";

export default function CountryDetail(props){
    let { Name } = useParams();

    const [Country, setCountry] = useState({borders: []});
    const [CountryLoaded, setCountryLoaded] = useState(false)

    useEffect(() => {
        let Loaded = false;

        fetch(`https://restcountries.eu/rest/v2/name/${Name}?fullText=true`).then(CountryResponse => CountryResponse.json()).then(Data => {
            let Borders = "";
            let CountryData = Data[0];
            CountryData.population = CountryData.population.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            CountryData.countryDomain = CountryData.topLevelDomain[0];
            CountryData.currencyName = CountryData.currencies[0].name;
            CountryData.currencySymbol = CountryData.currencies[0].symbol;
            CountryData.allLanguages = "";

            for (let x = 0; x < CountryData.languages.length; x++) {
                CountryData.allLanguages += x === 0 ? CountryData.languages[x].name : `, ${ CountryData.languages[x].name }`;
            }

            CountryData.borders.forEach(Border => {
                Borders += `${Border};`
            });

            if(Borders !== ""){
                fetch(`https://restcountries.eu/rest/v2/alpha?fields=name&codes=${Borders}`).then(BordersResponse => BordersResponse.json()).then(Data => {
                    CountryData.borders = Data;
                    setCountry(CountryData);
                    Loaded = true;
                });
            }
            else{
                setCountry(CountryData);
                Loaded = true;
            }
        });

        props.resetCountries();

        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 500);

        setTimeout(() => {
            props.detailTransitionX(false);

            setInterval(() => {
                if(Loaded === true){
                    setCountryLoaded(true);
                    clearInterval();
                }
            }, 50);
        }, 1000);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <>
            {
                CountryLoaded === true ? 
                <section className="CountryDetailContainer">
                    <Link to="/" onClick={() => props.detailTransitionX(true)}>
                        <button className="BackBtn">
                            <FontAwesomeIcon icon={ArrowLeft} />
                            <p>Back</p>
                        </button>
                    </Link>

                    <div className="Details">
                        <figure>
                            <img src={Country.flag} alt={Country.name}/>
                        </figure>

                        <div className="TextDetails">
                            <p className="CountryName">{ Country.name }</p>

                            <div className="SubDetails">
                                <div className="SubDetailsLeft">
                                    <p>Native Name: <span>{ Country.nativeName }</span></p>
                                    <p>Population: <span>{ Country.population }</span></p>
                                    <p>Region: <span>{ Country.region }</span></p>
                                    <p>Sub Region: <span>{ Country.subregion }</span></p>
                                    <p>Capital: <span>{ Country.capital }</span></p>
                                </div>

                                <div className="SubDetailsRight">
                                    <p>Top Level Domain: <span>{ Country.countryDomain }</span></p>
                                    <p>Currencies: <span>{ Country.currencySymbol } { Country.currencyName }</span></p>
                                    <p>Languages: <span>{ Country.allLanguages }</span></p>
                                </div>
                            </div>

                            <div className="BorderCountries">
                                {
                                    Country.borders.length > 0 ?
                                    <p>Border Countries: </p>
                                    :
                                    <p>This country doesn't have borders.</p>
                                }
                                

                                {
                                    Country.borders.length > 0 ?
                                    Country.borders.map(Border => (
                                        <Link key={`Border_${Border.name}`} to={`/${Border.name}`}>
                                            <button>
                                                { Border.name }
                                            </button>
                                        </Link>
                                    ))
                                    :
                                    ""
                                }
                            </div>
                        </div>
                    </div>
                </section> 
                :
                <Sentry color={localStorage.getItem("Theme") === "Light" ? "#727981" : "#FFFFFF"} size={64} speed={1} animating={true} />
            }
        </>
    );
}