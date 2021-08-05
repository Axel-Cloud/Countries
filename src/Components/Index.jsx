import React, { useState, useEffect } from 'react'
import { Switch, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

/* Components */
import Header from './Header';
import Filter from './Filter';
import Country from './Country';
import CountryDetail from './CountryDetail';


export default function Index(){
    const [SelectedTheme, setSelectedTheme] = useState("Light");
    const [Countries, setCountries] = useState([]);
    const [Region, setRegion] = useState("Worldwide");
    const [XDetailTransition, setXDetailTransition] = useState(100);

    useEffect(() => {
        //Verify theme
        if(localStorage.getItem("Theme") === null){
            localStorage.setItem("Theme", "Light");
        }

        setSelectedTheme(localStorage.getItem("Theme"));

        document.documentElement.style.setProperty("--Theme-Body", SelectedTheme === "Light" ? "hsl(207, 26%, 17%)" : "hsl(0, 0%, 90%)");

        InitCountries();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const InitCountries = () => {
        fetch("https://restcountries.eu/rest/v2/all").then(CountriesResponse => CountriesResponse.json()).then(Data => setCountries(Data));
    };

    const ChangeTheme = () => {
        localStorage.setItem("Theme", SelectedTheme === "Light" ? "Dark" : "Light");
        setSelectedTheme(localStorage.getItem("Theme"));
        document.documentElement.style.setProperty("--Theme-Body", SelectedTheme === "Light" ? "hsl(207, 26%, 17%)" : "hsl(0, 0%, 90%)");
    };

    const ChangeFilter = (Search, Type) => {
        if(Type === "Search"){
            if(Search === ""){
                if(Region !== "Worldwide"){
                    fetch(`https://restcountries.eu/rest/v2/region/${Region}`).then(CountriesResponse => CountriesResponse.json()).then(Data => setCountries(Data));
                }
                else{
                    fetch("https://restcountries.eu/rest/v2/all").then(CountriesResponse => CountriesResponse.json()).then(Data => setCountries(Data));
                }
            }
            else{

                fetch(`https://restcountries.eu/rest/v2/name/${Search}`).then(CountriesResponse => CountriesResponse.json()).then(Data => {
                    if(Region !== "Worldwide"){
                        Data = Data.filter(Country => Country.region === Region); 
                    }

                    setCountries(Data)
                });
            }
        }
        else if(Type === "Region"){
            setRegion(Search);

            if(Search !== "Worldwide"){
                fetch(`https://restcountries.eu/rest/v2/region/${Search}`).then(CountriesResponse => CountriesResponse.json()).then(Data => setCountries(Data));
            }
            else{
                fetch("https://restcountries.eu/rest/v2/all").then(CountriesResponse => CountriesResponse.json()).then(Data => setCountries(Data));
            }
        }
    };

    const DetailTransitionX = (Exiting) => {
        if(Exiting){
            setXDetailTransition(100);
        }
        else{
            setXDetailTransition(0);
        }
    };

    const MainPageVariants = {
        initial:{
            opacity: 0,
            x: "-100vw"
        },
        in: {
            opacity: 1,
            x: "0vw"
        },
        out: {
            opacity: 0,
            x: "-100vw"
        }
    }

    const DetailPageVariants = {
        initial:{
            opacity: 0,
            x: `${XDetailTransition}vw`
        },
        in: {
            opacity: 1,
            x: "0vw"
        },
        out: {
            opacity: 0,
            x: `${XDetailTransition}vw`
        }
    }

    const PageTransition = {
        duration: 1
    }

    return(
        <div className="Main">
            <AnimatePresence initial={false}>
                <Switch location={useLocation()} key={useLocation().pathname}>
                    <Route path="/" exact>
                        <motion.div className={SelectedTheme === "Light" ? "LightTheme" : "DarkTheme"} initial="initial" animate="in" exit="out" variants={MainPageVariants} transition={PageTransition}>
                            <Header changeTheme={ChangeTheme}/>

                            <Filter ChangeFilter={ChangeFilter}/>

                            <section className="CountriesContainer">
                                {
                                    Countries.length > 0 ?
                                    Countries.map((country) => (
                                        <Country key={country.name} Name={country.name} Flag={country.flag} Population={country.population} Region={country.region} Capital={country.capital}/>
                                    )) 
                                    :
                                    ""
                                }
                            </section>
                        </motion.div>
                    </Route>
                    <Route path="/:Name">
                        <motion.div className={SelectedTheme === "Light" ? "LightTheme" : "DarkTheme"} initial="initial" animate="in" exit="out" variants={DetailPageVariants} transition={PageTransition}>
                            <Header changeTheme={ChangeTheme}/>
                            <CountryDetail resetCountries={InitCountries} detailTransitionX={DetailTransitionX}/>
                        </motion.div>
                    </Route>
                </Switch>
            </AnimatePresence>
        </div>
    );
}