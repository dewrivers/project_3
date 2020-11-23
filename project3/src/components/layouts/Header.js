import React from 'react';
import {Link} from "react-router-dom";
import AuthOptions from '../auth/AuthOptions';

function Header() {
    return (
        <header id="header">
           <Link  to="/"> 
           <h1 className="title">Melody</h1>
           </Link>

           <AuthOptions />
        </header>
       
    );
}

export default Header;