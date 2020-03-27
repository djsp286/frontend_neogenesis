import AuthForm, { STATE_LOGIN } from 'components/AuthForm';
import React from 'react';
import { Card, Col, Row } from 'reactstrap';
import * as myUrl from '../urlLink';

import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

import {
  MdLoyalty,
} from 'react-icons/md';



class AuthPage extends React.Component {



  handleAuthState = authState => {
    if (authState === STATE_LOGIN) {
      this.props.history.push('/login');
    } else {
      this.props.history.push('/lupapassword');
    }
  };

  gotoChangePwd = () => {
    this.props.history.push({
      pathname: '/resetpassword',
      state: { ok: true }
    });
  }


  handleLogoClick = () => {
    this.props.history.push('/login');
  };


  requestLogin = async (username, password) => {
    const urlA = myUrl.url_login;
    var status = false;

    var payload = {
      username: username,
      password: password,

    };

    const option = {
      method: "POST",
      json: true,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": ""
      },
      body: JSON.stringify(payload)
    }
    let data = await fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          this.showNotification("Koneksi ke server gagal", 'error');
          return true;
        }
      }).catch((err) => {
        this.showNotification("Koneksi ke server gagal!", 'error');
        return true;
      });

    if (data === true) {
      return true;
    }
    if (data) {

      var token = data.headers.get('Authorization');
      data = await data.json();

      var data1 = data.data;
      var error = data.error;
      var metadata = data.metadata;

      if (error.status === false) {
        if (metadata.Status === "TRUE") {
          if (data1.mem_forcechangepasswordyn === "Y") {
            this.props.history.push({
              pathname: '/resetpassword',
              state: { ok: true }
            })
          } else {
            window.localStorage.setItem('tokenLogin', token);
            window.localStorage.setItem('accessList', JSON.stringify(data1.mem_access));
            window.localStorage.setItem('profile',JSON.stringify(data1));
            // console.log( JSON.parse(window.localStorage.getItem('profile')));
            
            this.props.history.push({
              pathname: '/',
              state: { profile: data.result }
            })
          }

        } else {
          this.showNotification(metadata.Message, 'error');
        }
      } else {
        this.showNotification(error.responseMessage, 'error');
      }
    } else {
      this.showNotification("Koneksi ke server gagal", 'error');
    }

    return true;

  }


  showNotification = (currMessage, levelType) => {
    setTimeout(() => {
      if (!this.notificationSystem) {
        return;
      }
      this.notificationSystem.addNotification({
        title: <MdLoyalty />,
        message:
          currMessage,
        level: levelType,
      });
    }, 300);
  }

  render() {
    return (
      <Row
        style={{
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}>

        <Col md={6} lg={4}>

          <Card body>
            <NotificationSystem
              dismissible={false}
              ref={notificationSystem =>
                (this.notificationSystem = notificationSystem)
              }
              style={NOTIFICATION_SYSTEM_STYLE}
            />
            <AuthForm
              authState={this.props.authState}
              onChangeAuthState={this.handleAuthState}
              onLogoClick={this.handleLogoClick}
              onButtonClick={this.requestLogin}
              gotoChangePwd={this.gotoChangePwd}
              showNotification={this.showNotification}
            />

          </Card>

        </Col>
      </Row>
    );
  }
}
export default AuthPage;
