import React from 'react';
import { Icon } from 'semantic-ui-react'
import Choropleth from "../Choropleth/Choropleth";


export default class Header extends React.Component {
    render() {
        return (
            <div style={styles.body}>
                <div style={styles.card}>
                    <Choropleth />
                </div>
            </div>
        );
    }
}

const styles = {
    body: {
        padding: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    },
    card: {
        width: "100%",
        height: "100%",
        background: '#fff',
        backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAGElEQVQYV2NkYGCQYmBgeMYABYwwBvECAD1WAQVZi1QaAAAAAElFTkSuQmCC)",
        backgroundRepeat: "repeat",
        backgroundSize: "7px",
        boxShadow: "1px 1px 5px #bbb",
    }
}
