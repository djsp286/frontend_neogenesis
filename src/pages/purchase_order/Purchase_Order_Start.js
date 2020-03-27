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

class Purchase_Order_Start extends React.Component{

    render(){
        return(
            <Page
            title       = "Start"
            className   = "Start">

            </Page>  
        );
    }
}
export default Purchase_Order_Start