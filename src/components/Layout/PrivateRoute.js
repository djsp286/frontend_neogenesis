import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import WarningPage from 'pages/template/warningPage';


function getPermission(page, id, Component) {
    console.log(Component);
    console.log(page.location.pathname);
    var result = false;
    var accessList = { "191": [191] };
    if (window.localStorage.getItem('accessList')) {
        accessList = JSON.parse(window.localStorage.getItem('accessList'));
        result = true;
    }
    else {
        result = false;
    }
    
    //isAccess =true   Allow access page
    var isAccess = false;

    if (page.location.pathname === "/resetpassword" && page.location.state !== undefined) {
        //block Access to /resetpassword by URL
        isAccess = false;
    }

    if (result === true) {
        if (page.location.pathname === "/login" || page.location.pathname === "/lupapassword" || page.location.pathname === "/resetpassword") {
            return (<Redirect
                to={{
                    pathname: '/',
                }}
            />)
        }
        else {
            //check acces in accessList
            console.log(accessList)
            console.log("INI TEST ", id)
            var isAccess = Object.keys(accessList).includes(id);
        }
    } else {
        if (page.location.pathname !== "/login" && page.location.pathname !== "/lupapassword" && page.location.pathname !== "/resetpassword") {
            return (<Redirect
                to={{
                    pathname: '/login',
                    // state: { from: page }
                }}
            />)
        }
    }

    if (isAccess === true) {
        return (<Component {...page} menuID={id} />)
    } else {
        console.log({ ...page });
        return (<WarningPage {...page} />)
    }
}

const PrivateRoute = ({ component: Component, menuID, ...rest }) => (
    <Route
        {...rest}
        render={page =>
            getPermission(page, menuID, Component)
        }
    />
);

export default PrivateRoute;
