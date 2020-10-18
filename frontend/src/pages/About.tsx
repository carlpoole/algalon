import { MDBContainer } from 'mdbreact';
import * as React from 'react';

function About() {
    const container = { height: 1300 }

    return (
        <div className="Home">
        <MDBContainer style={ container } className="text-center mt-5 pt-5">
            <h2>About</h2>
            <br/>
            <p>This app was made to help review raid logs more efficiently.</p>
            </MDBContainer>
        </div>
    );
}

export default About;