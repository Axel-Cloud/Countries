import React from "react";
import { Link } from "react-router-dom";

export default function Country(props) {
  return (
    <article className="Country">
      <figure>
        <Link to={`/${props.Name}`}>
          <div style={{backgroundImage: `url(${props.Flag})`}}/>
        </Link>

        <Link className="LinkDetail" to={`/${props.Name}`}>{props.Name}</Link>

        <p>
          Population: <span className="DetailText">{props.Population.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span>
        </p>

        <p>
          {props.Region === "" ? "" : "Region: "}
          <span className="DetailText">{props.Region}</span>
        </p>

        <p>
          {props.Capital === "" ? "" : "Capital: "}
          <span className="DetailText">{props.Capital}</span>
        </p>
      </figure>
    </article>
  );
}
