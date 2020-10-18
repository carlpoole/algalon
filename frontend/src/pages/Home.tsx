import { MDBContainer } from 'mdbreact';
import * as React from 'react';

function Home() {
    const container = { height: 1300 }

    return (
        <div className="Home">
        <MDBContainer style={ container } className="text-center mt-5 pt-5">
            <h2>Algalon</h2>
            <h5>This app is currently a work in progress</h5>
            <br/>
            <p>Check back later for more</p>
            </MDBContainer>
        </div>
    );
}

export default Home;