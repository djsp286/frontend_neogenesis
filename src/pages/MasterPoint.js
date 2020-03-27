import Page from 'components/Page';
import React from 'react';
import {
  Button, Card, CardBody, CardHeader, Col, Row, Table, Modal,
  ModalBody, ModalFooter, ModalHeader, Input, Label, DropdownMenu,
  DropdownItem, UncontrolledButtonDropdown, Form, InputGroupAddon, InputGroup,
} from 'reactstrap';
import { MdAdd, MdEdit, MdDelete, MdDone, MdClose, MdSearch, MdSave,
  MdPrint, MdExitToApp
} from 'react-icons/md';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import DropdownToggle from 'reactstrap/es/DropdownToggle';
import MasterPointTop from 'pages/MasterPoint/MasterPointTop';
import MasterPointMarMove from 'pages/MasterPoint/MasterPointMarMove';
import MasterPointRetur from 'pages/MasterPoint/MasterPointRetur';
import MasterPointImpLokal from 'pages/MasterPoint/MasterPointImpLokal';
import MasterPointBeaTrans from 'pages/MasterPoint/MasterPointBeaTrans';
import MasterPointGradasi from 'pages/MasterPoint/MasterPointGradasi';

class MasterPointTest extends React.Component {

    state={
        displayTabs: "block"
    }

    minimizeTabs(){
        this.setState({
            displayTabs: "none"
        })
    }

    render() {
        return (
            <Page
            title="Master Point">
            <Row>
                <Col>
                    <Card className="mb-3">
                        <CardHeader className="d-flex justify-content-between">
                            <div
                                className="input-group"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                            }}>
                                <div className="input-group-prepend">
                                    <label className="input-group-text">Group</label>
                                </div>
                                <select className="custom-select">
                                    <option selected value="apotik">Apotik</option>
                                    <option value="floor">Floor</option>
                                </select>
                            </div>

                            <Button
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                marginLeft: "1.5vw",
                                whiteSpace: "nowrap"
                            }}
                            color={"primary"}
                            onClick={this.minimizeTabs.bind(this)}
                            >
                            <MdEdit
                                style={{
                                marginRight: "5"
                                }}
                            />Edit Group
                            </Button>
                        </CardHeader>

                        <CardBody>
                            
                            <Tabs
                            defaultIndex={0}
                            onSelect={index => console.log(index)}
                            style={{
                                display: this.state.displayTabs,
                            }}
                            >

                            <TabList>
                                <Tab>TOP</Tab>
                                <Tab>MARMOVE</Tab>
                                <Tab>RETUR</Tab>
                                <Tab>IMPLOKAL</Tab>
                                <Tab>BEATRANS</Tab>
                                <Tab>GRADASI</Tab>
                            </TabList>

                            {/*Tab TOP*/}
                            <TabPanel>
                                <MasterPointTop/>
                            </TabPanel>

                            {/*Tab MARMOVE*/}
                            <TabPanel>
                                <MasterPointMarMove/>
                            </TabPanel>

                            {/*Tab RETUR*/}
                            <TabPanel>
                                <MasterPointRetur/>
                            </TabPanel>

                            {/*Tab IMPLOKAL*/}
                            <TabPanel>
                                <MasterPointImpLokal/>
                            </TabPanel>

                            {/*Tab BEATRANS*/}
                            <TabPanel>
                                <MasterPointBeaTrans/>
                            </TabPanel>

                            {/*Tab GRADASI*/}
                            <TabPanel>
                                <MasterPointGradasi/>
                            </TabPanel>
                            
                            </Tabs>

                        </CardBody>

                    </Card>
                </Col>
            </Row>
        </Page>
        )
    }
}

export default MasterPointTest;