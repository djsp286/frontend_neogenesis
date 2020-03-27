import Page from 'components/Page';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, Nav, Form,
    Navbar,UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup,InputGroup, InputGroupAddon, FormGroup, CardFooter
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdAdd, MdDelete, MdSearch, MdEdit, MdCancel, MdSave } from 'react-icons/md';
import { runInThisContext } from 'vm';
import { withRouter } from 'react-router-dom';

class Purchase_Order_Agreement extends React.Component{

    render(){
        return(
            <Page
            title       = "Agreement"
            className   = "Agreement">

                <Row className ={"mt-3, ml-1"}>
                    <Col xs={1.5}>
                        <Label>NO AGREEMENT</Label>
                    </Col>
                    <Col xs={2}>
                        <Input type="text" ></Input>
                    </Col>

                    <Col xs={0.1}>
                        <Label>TYPE</Label>
                    </Col>
                    <Col xs={1}>
                        <Input type="text" ></Input>
                    </Col>

                    <Col xs={0.1}>
                        <Label>PERIODE</Label>
                    </Col>
                    <Col xs={2}>
                        <Input type="date" ></Input>
                    </Col>

                    <Col xs={0.1}>
                        <Label>s/d</Label>
                    </Col>
                    <Col xs={2} >
                        <Input type="date" ></Input>
                    </Col>
                </Row>

                
            </Page>  
        );
    }
}
export default Purchase_Order_Agreement
