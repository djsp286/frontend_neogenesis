import Page from 'components/Page';
import React from 'react';
import {
  Button, Card, CardBody, CardHeader, Col, Row, Form, Label, Table
} from 'reactstrap';
import {MdEdit, MdArrowForward,MdArrowBack, MdSave, MdCancel
} from 'react-icons/md';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MasterPointTop from 'pages/master_c/MasterPoint/MasterPointTop';
import MasterPointMarMove from 'pages/master_c/MasterPoint/MasterPointMarMove';
import MasterPointRetur from 'pages/master_c/MasterPoint/MasterPointRetur';
import MasterPointImpLokal from 'pages/master_c/MasterPoint/MasterPointImpLokal';
import MasterPointBeaTrans from 'pages/master_c/MasterPoint/MasterPointBeaTrans';
import MasterPointGradasi from 'pages/master_c/MasterPoint/MasterPointGradasi';
import axios from 'axios'

class MasterPoint extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            resultUnselected: [],
            resultSelected: [],
            headers:'',
            groupId: 1,
            displayTabs: "block",
            displayGroup: "none",
            noDataMessage: "none",
            selectedTabs: 0,
            supplier: [
                {
                    groupId: 1,
                    groupName: "Apotik",
                },
                {
                    groupId: 2,
                    groupName: "Floor"
                }
            ]
        };
    }

    componentDidMount = () => {
        this.auth();
    }
    auth = async() => {
        await Promise.all([
            axios.post('https://api.docnet.id/CHCAuth/login',
            {
                username: 'admin',
                password: 'admin'
            })
            .then((res) => {
                this.setState({
                    headers: res.headers
                })
            })
        ])
        this.getPointSelected();
        this.getPointUnselected();
    }

    getPointUnselected = () => {
        axios
        .get('https://api.docnet.id/CHCMasterProduk/PointGroup/' + this.state.groupId,
        {
            headers:this.state.headers
        })
        .then((res) => {
            if(res.data.data !== null){
                this.setState({
                    resultUnselected: res.data.data,
                })
            } else
            {
               this.setState({
                   resultUnselected: []
               }) 
            }
        })
    }

    getPointSelected = () => {
        axios
        .get('https://api.docnet.id/CHCMasterProduk/PointGroup/' + this.state.groupId,
        {
            headers:this.state.headers
        })
        .then((res) => {
            if(res.data.data !== null){
                this.setState({
                    resultSelected: res.data.data,
                })
            }else
            {
            this.setState({
                resultSelected: []
            }) 
            }
        })
    }

    saveEditGroup = () => {
        axios.post('https://api.docnet.id/CHCMasterProduk/PointGroup/' + this.state.groupId, {
        // axios.post('http://10.0.111.208:8090/PointGroup/' + this.state.groupId, {
            metadata: [{
              pgroup_userid: "CONVERT"
            }],
            data: this.state.resultSelected
        }).then((res) => {
            this.componentDidMount();
            this.showTabs();
        });
    }

    showTabs = () => {
        this.setState({
            displayTabs: "block",
            displayGroup: "none",
        })
    }

    showGroup = () => {
        this.setState({
            displayTabs: "none",
            displayGroup: "block",
        })
    }

    showEditGroup = () => {
        this.auth();
        this.showGroup();
    }

    cancelBtn = () => {
        this.showTabs();
        this.setState({
            resultSelected: [],
            resultUnselected: [],
        })
    }

    moveItem = (from, to, dept) => {
        if (from === "selected" && to === "unselected") {
            var tmpSelected = this.state.resultSelected
            tmpSelected.splice(tmpSelected.indexOf(dept), 1)
            this.setState({
                resultSelected: tmpSelected
            })

            var tmpUnselected = this.state.resultUnselected
            tmpUnselected.push(dept)
            this.setState({
                resultUnselected: tmpUnselected
            })

            console.log("Selected: ", this.state.resultSelected);
            console.log("Unselected: ", this.state.resultUnselected);
        }
        else if (from === "unselected" && to === "selected") {
            var tmpUnselected = this.state.resultUnselected
            tmpUnselected.splice(tmpUnselected.indexOf(dept), 1)
            this.setState({
                resultUnselected: tmpUnselected
            })

            var tmpSelected = this.state.resultSelected
            tmpSelected.push(dept)
            this.setState({
                resultSelected: tmpSelected
            })
            
            console.log("Selected: ", this.state.resultSelected);
            console.log("Unselected: ", this.state.resultUnselected);
        }
    }

    moveAllItem = (from, to) => {
        var tmpSelected = this.state.resultSelected
        var tmpUnselected = this.state.resultUnselected
        if (from === "selected" && to === "unselected") {
            for (var i = 0; i < tmpSelected.length; i++) {
                tmpUnselected.push(tmpSelected[i])
            }
            tmpSelected = []

            console.log("Selected: ", tmpSelected)
            console.log("Unselected: ", tmpUnselected)
        }
        else if (from === "unselected" && to === "selected") {
            for (var i = 0; i < tmpUnselected.length; i++) {
                tmpSelected.push(tmpUnselected[i])
            }
            tmpUnselected = []
            this.setState({resultSelected: tmpSelected, resultUnselected: tmpUnselected})

            console.log("Selected: ", tmpSelected)
            console.log("Unselected: ", tmpUnselected)
        }
        
        this.setState({resultSelected: tmpSelected, resultUnselected: tmpUnselected})
    }

    handleGroupChange = (e) => {
        this.getPointSelected()
        this.getPointUnselected()
        this.setState({
            groupId: e.target.value,
            selectedTabs: this.state.selectedTabs + 1
        }, () => {
            this.setState({
                selectedTabs: this.state.selectedTabs - 1
            })
        })
    }

    render = () => {
      const { resultUnselected, resultSelected, supplier } = this.state || [];

        return (
            <Page
            title="Master Point">
            <Row>
                <Col>
                    <Card className="mb-3">

                        {/* Card Header */}
                        <CardHeader className="d-flex justify-content-between">
                            <div
                                className="input-group"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                }}
                            >
                                    
                                <div className="input-group-prepend">
                                    <label className="input-group-text">Group</label>
                                </div>
                                
                                <select 
                                className = "custom-select"
                                onChange = {(e) => this.handleGroupChange(e)}
                                >
                                    {supplier.map(
                                        sup =>
                                        <option value={sup.groupId}>{sup.groupName}</option>
                                    )} 
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
                            onClick={ this.showEditGroup.bind(this) }
                            >
                            <MdEdit
                            style={{
                                marginRight: "5"
                            }}/>Edit Group
                            </Button>
                        </CardHeader>
                        {/* Card Header */}

                        {/* Card Body */}
                        <CardBody>
                            
                            <Tabs
                            selectedIndex={this.state.selectedTabs}
                            style={{
                                display: this.state.displayTabs,
                            }}>
                                
                                <TabList>
                                    <Tab onClick={ () => {this.setState({ selectedTabs: 0 })} }>TOP</Tab>
                                    <Tab onClick={ () => {this.setState({ selectedTabs: 1 })} }>MARMOVE</Tab>
                                    <Tab onClick={ () => {this.setState({ selectedTabs: 2 })} }>RETUR</Tab>
                                    <Tab onClick={ () => {this.setState({ selectedTabs: 3 })} }>IMPLOKAL</Tab>
                                    <Tab onClick={ () => {this.setState({ selectedTabs: 4 })} }>BEATRANS</Tab>
                                    <Tab onClick={ () => {this.setState({ selectedTabs: 5 })} }>GRADASI</Tab>
                                </TabList>
                                
                                {/*Tab TOP*/}
                                <TabPanel>
                                    <MasterPointTop groupId={this.state.groupId}/>
                                </TabPanel>

                                {/*Tab MARMOVE*/}
                                <TabPanel>
                                    <MasterPointMarMove groupId={this.state.groupId}/>
                                </TabPanel>

                                {/*Tab RETUR*/}
                                <TabPanel>
                                    <MasterPointRetur groupId={this.state.groupId}/>
                                </TabPanel>

                                {/*Tab IMPLOKAL*/}
                                <TabPanel>
                                    <MasterPointImpLokal groupId={this.state.groupId}/>
                                </TabPanel>

                                {/*Tab BEATRANS*/}
                                <TabPanel>
                                    <MasterPointBeaTrans groupId={this.state.groupId}/>
                                </TabPanel>

                                {/*Tab GRADASI*/}
                                <TabPanel>
                                    <MasterPointGradasi groupId={this.state.groupId}/>
                                </TabPanel>

                                <hr/>
                                
                            </Tabs>

                            <div
                            style={{
                                display: this.state.displayGroup,
                                textAlign: "center",
                                justifyContent: "center",
                            }}
                            >
                                <Row>
                                    <Form
                                    onSubmit={e => e.preventDefault()}
                                    style={{
                                        textAlign: "left",
                                        display: "block",
                                        width:"50%",
                                        paddingLeft: "5%",
                                        paddingRight: "2.5%",
                                    }}> 
                                        
                                        <Label>Pilih Departemen:</Label>
                                        
                                        <br/>
                                        
                                        <Table
                                        bordered
                                        responsive
                                        >
                                            <thead>
                                                <tr>
                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>ID</th>
                                                    
                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>Departemen</th>

                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}
                                                    >
                                                        <Button
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                        color="primary"
                                                        onClick={ () => this.moveAllItem("unselected", "selected") }
                                                        >
                                                            {">>"}
                                                        </Button>
                                                    </th>
                                                </tr>
                                                
                                            </thead>

                                            <tbody>
                                            {resultUnselected.map((Unselected)=>
                                            <tr>
                                                <th 
                                                scope="row"
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}>
                                                    {Unselected.dept_code}
                                                </th>
                                                
                                                <td
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}>
                                                    {Unselected.dept_name}
                                                </td>
                                                
                                                <td
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}
                                                >
                                                    <Button
                                                    color="primary"
                                                    onClick={ () => this.moveItem("unselected", "selected", Unselected) }
                                                    >
                                                        <MdArrowForward/>
                                                    </Button>
                                                </td>
                                            </tr>
                                            )}
                                            </tbody>
                                            
                                        </Table>
                                        
                                    </Form>

                                    <Form
                                    onSubmit={e => e.preventDefault()}
                                    style={{
                                        textAlign: "left",
                                        display: "block",
                                        width:"50%",
                                        paddingLeft: "2.5%",
                                        paddingRight: "5%",
                                    }}>
                                        
                                        <Label>Departemen yang dipilih:</Label>
                        
                                        <br/>
                                        
                                        <Table
                                        bordered
                                        responsive
                                        style={{
                                            float:"right"
                                        }}
                                        >
                                            <thead>
                                                <tr>

                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}
                                                    >
                                                        <Button
                                                        color="primary"
                                                        onClick={ 
                                                            () => this.moveAllItem("selected", "unselected") 
                                                        }>
                                                            {"<<"}
                                                        </Button>
                                                    </th>

                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>ID</th>
                                                    
                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>Departemen</th>

                                                </tr>
                                            </thead>

                                            <tbody>
                                                {resultSelected.map((Selected)=>
                                                <tr>
                                                
                                                    <td
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>
                                                        <Button
                                                        color="primary"
                                                        style={{
                                                            verticalAlign: "middle",
                                                        }}
                                                        onClick={ 
                                                            () => this.moveItem("selected", "unselected", Selected) 
                                                        }>
                                                            <MdArrowBack/>
                                                        </Button>
                                                    </td>

                                                    <th 
                                                    scope="row"
                                                    style={{
                                                        verticalAlign: "middle"
                                                    }}>{Selected.dept_code}
                                                    </th>
                                                    
                                                    <td
                                                    style={{
                                                        verticalAlign: "middle"
                                                    }}>{Selected.dept_name}
                                                    </td>
                                                    
                                                </tr>
                                                )}
                                            </tbody>
                                            
                                        </Table>

                                        
                                    </Form>
                                </Row>

                                <Row>
                                    <Col>
                                    
                                    <Form
                                    inline
                                    style={{
                                        justifyContent: "center",
                                    }}
                                    >

                                        <Button
                                        style={{
                                            marginRight: "2.5vw",
                                            // width: "20vw"
                                        }}
                                        onClick={ () => this.saveEditGroup() }
                                        >
                                            <MdSave
                                            style={{
                                                marginRight: "5px"
                                            }}
                                            />SAVE</Button>

                                        <Button
                                        style={{
                                            // width: "20vw",
                                        }}
                                        onClick={ () => this.cancelBtn() }
                                        >
                                            <MdCancel
                                            style={{
                                                marginRight: "5px"
                                            }}
                                            />CANCEL</Button>

                                    </Form>
                                    </Col>
                                </Row>
                        </div>

                        </CardBody>
                        {/* Card Body */}

                    </Card>
                    
                </Col>
            </Row>
        </Page>
        )
    }
}

export default MasterPoint;