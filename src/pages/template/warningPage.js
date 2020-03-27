import Page from 'components/Page';
import Typography from 'components/Typography';
import React from 'react';
import warning from './warning.png'

import {
    Card,
    CardBody,
    Col,
    Row,
} from 'reactstrap';

const warningPage = () => {
    return (
        <Page title="Akses Ditolak!" style={{ textAlign: "center" }}>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <br>
                            </br>
                            <Typography type="h1">
                                OOPS!
                </Typography>
                            <br></br>
                            <img src={warning} height='200px' width='200px' alt="warning" />
                            <br></br>
                            <br></br>
                            <br></br>
                            <Typography type="h5">
                                Maaf Anda tidak dapat mengakses halaman ini karena anda tidak memiliki Hak Akses!
                </Typography>
                            <br></br>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Page>
    );
};

export default warningPage;
