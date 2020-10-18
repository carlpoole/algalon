import React from 'react'
import { MDBCollapse, MDBIcon, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBNavItem, MDBNavLink } from 'mdbreact';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

interface AppState {
  collapse: boolean;
}

class App extends React.Component<RouteComponentProps, AppState> {
  constructor(props : RouteComponentProps) {
      super(props);
      this.state = {
          collapse: false
      };

      this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({
        collapse: !this.state.collapse,
      });
  }

  render() {
    const navBar = { backgroundColor: '#181b24' }

    return(
      <div>
          <header>
            <MDBNavbar style={ navBar } dark expand="md" scrolling fixed="top">
              <MDBNavbarBrand href="/">
                  <strong>Algalon</strong>
              </MDBNavbarBrand>
              <MDBNavbarToggler onClick={ this.onClick } />
              <MDBCollapse isOpen = { this.state.collapse } navbar>
                <MDBNavbarNav left>
                  <MDBNavItem active={this.props.location.pathname === '/'}>
                      <MDBNavLink to="/">Home</MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem active={this.props.location.pathname === '/about'}>
                      <MDBNavLink to="/about">About</MDBNavLink>
                  </MDBNavItem>
                </MDBNavbarNav>
                <MDBNavbarNav right>
                  <MDBNavItem>
                    <a href="https://www.github.com/carlpoole/algalon" className="nav-link Ripple-parent"><MDBIcon fab icon="github"/></a>
                  </MDBNavItem>
                </MDBNavbarNav>
              </MDBCollapse>
            </MDBNavbar>
          </header>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/about">
              <About />
            </Route>
          </Switch>
      </div>
    );
  }
}

export default withRouter(App);
