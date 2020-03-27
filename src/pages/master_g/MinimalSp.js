import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from 'dateformat';
import * as myUrl from '../urlLinkMasterG';

import React from 'react';
import {
    Button,  Card, CardBody,  Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdSearch, MdDelete, MdEdit, MdCheckBox} from 'react-icons/md';
import Tabs from 'pages/master_g/Tabs';
require('pages/master_g/styles.css');
class MinimalSp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            resultSP: [],
            resultSPNIE: [],
            resultSPSIASIPA: [],
            todos:[],
            isLoading: false,

            inputtedSPGroup: '',
            viewedTglSPPeriodeawal: new Date(),
            inputtedTglSPPeriodeawal: new Date(),
            viewedTglSPPeriodeakhir: new Date(),
            inputtedTglSPPeriodeakhir: new Date(),
            inputtedNilaiSP: '',
            editspgroup: '',
            editspnilaisp: '',

            inputtedSPNIEGroup: '',
            viewedTglSPNIEPeriodeawal: new Date(),
            inputtedTglSPNIEPeriodeawal: new Date(),
            viewedTglSPNIEPeriodeakhir: new Date(),
            inputtedTglSPNIEPeriodeakhir: new Date(),
            editspniegroup: '',

            inputtedSPSIASIPAGroup: '',
            viewedTglSPSIASIPAPeriodeawal: new Date(),
            inputtedTglSPSIASIPAPeriodeawal: new Date(),
            viewedTglSPSIASIPAPeriodeakhir: new Date(),
            inputtedTglSPSIASIPAPeriodeakhir: new Date(),
            editspsiasipagroup: '',

            keyword:"",
            disabledspgroup: true,
            disabledspniegroup: true,
            disabledspsiasipagroup: true,
            displayStatus: "none"
        };
    }

    componentDidMount() {
        this.getMinimalSP();
        this.getMinimalSPNIE();
        this.getMinimalSPSiaSipa();
    }

    //function connection out
    connectionOut(message, render){
        if(render){
            this.setState({
                modal_backdrop: false,
                modal_nested_parent: false,
                modal_nested_parent_edit: false,
                modal_nested: false,
                modal_nested_edit: false,
                backdrop: true,
                modal_response: true,
                searchType:"Show_All",
                responseHeader: "CONNECTION ERROR",
                responseMessage: message
            },  () => this.pagecount())
        }else{
            this.setState({
                modal_backdrop: false,
                modal_nested_parent: false,
                modal_nested_parent_edit: false,
                modal_nested: false,
                modal_nested_edit: false,
                backdrop: true,
                modal_response: true,
                responseHeader: "CONNECTION ERROR",
                responseMessage: message
            })
        }
    }

    getMinimalSPSiaSipa(){
        const kword = this.state.keyword;
        const currLimit = this.state.todosPerPage; 

        const urlA=myUrl.url_getListMinimalSPSIASIPA;
        fetch(urlA )
            .then(response => response.json())
            .then(data =>{
                console.log(data)
                if(data==0){
                    this.setState({
                        responseHeader: "Alert!!!",
                        responseMessage: "Data is empty!",
                        modal_response: true,
                        resultSPSIASIPA: data,
                        isLoading: false
                    });
                }
                else{
                    this.setState({resultSPSIASIPA: data} );
                }
            }, ()=> this.connectionOut("Can't reach the server", false));
    }

    getMinimalSPNIE(){
        const kword = this.state.keyword;
        const currLimit = this.state.todosPerPage; 

        const urlA=myUrl.url_getListMinimalSPNIE;
        fetch(urlA )
            .then(response => response.json())
            .then(data =>{
                console.log(data)
                if(data==0){
                    this.setState({
                        responseHeader: "Alert!!!",
                        responseMessage: "Data is empty!",
                        modal_response: true,
                        resultSPNIE: data,
                        isLoading: false
                    });
                }
                else{
                    this.setState({resultSPNIE: data} );
                }
            }, ()=> this.connectionOut("Can't reach the server", false));
    }

    getMinimalSP(){
        const kword = this.state.keyword;
        const currLimit = this.state.todosPerPage; 

        const urlA=myUrl.url_getListMinimalSP;
        fetch(urlA )
            .then(response => response.json())
            .then(data =>{
                console.log(data)
                if(data==0){
                    this.setState({
                        responseHeader: "Alert!!!",
                        responseMessage: "Data is empty!",
                        modal_response: true,
                        resultSP: data,
                        isLoading: false
                    });
                }
                else{
                    this.setState({resultSP: data} );
                }
            }, ()=> this.connectionOut("Can't reach the server", false));
    }

    //edit minimal SP
    newMinimalSP = (msp_group, msp_periodeawal, msp_periodeakhir, msp_nilaisp) => () => {
        if(msp_nilaisp==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Nilai SP can't be empty!",
                modal_response: true
            });
        }
        else{
            console.log("edit minimal sp masuk");
            var url = myUrl.url_addMinimalSP;

            fetch(url, {
                method : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    MSP_Group : msp_group.toString(),
                    MSP_PeriodeAwal : msp_periodeawal.toString(),
                    MSP_PeriodeAkhir : msp_periodeakhir.toString(),
                    MSP_NilaiSP : msp_nilaisp.toString()
                }, console.log(msp_group, msp_periodeawal, msp_periodeakhir, msp_nilaisp))
            }).then(response => {
                console.log(response)
                if (response.ok) {
                    this.state.modal_nested_edit = false;
                    this.state.modal_nested_parent_edit = false;
                    this.state.currentPage = this.state.lastData;
                    this.componentDidMount();
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data save";
                    this.state.modal_response = true;
                    this.resetAll();
                }else{
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data failed to edit";
                    this.state.modal_response = true;
                }
            }).catch(()=>
            {
                this.connectionOut("Can't reach the server", false)
            });
        }
    }
    //untuk date periode awal sp
    handleChangesp = date => {
        this.setState({
          inputtedTglSPPeriodeawal: dateFormat(date, "yyyy-mm-dd"),
          viewedTglSPPeriodeawal: date
        }, () => console.log("tgl sp periode awal: " + this.state.inputtedTglSPPeriodeawal));
    };

    //untuk date periode akhir sp
    handleChangessp = date => {
        this.setState({
          inputtedTglSPPeriodeakhir: dateFormat(date, "yyyy-mm-dd"),
          viewedTglSPPeriodeakhir: date
        }, () => console.log("tgl sp periode akhir: " + this.state.inputtedTglSPPeriodeakhir));
    };
    //edit minimal SP NIE
    newMinimalSPNIE = (mspn_group, mspn_periodeawal, mspn_periodeakhir) => () => {
        if(mspn_periodeawal==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Tanggal Periode Awal can't be empty!",
                modal_response: true
            });
        }
        else if(mspn_periodeakhir==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Tanggal Periode Akhir can't be empty!",
                modal_response: true
            });
        }
        else{
            console.log("edit minimal sp masuk");
            var url = myUrl.url_addMinimalSPNIE;

            fetch(url, {
                method : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    MSPN_Group : mspn_group,
                    MSPN_PeriodeAwal : mspn_periodeawal,
                    MSPN_PeriodeAkhir : mspn_periodeakhir
                }, console.log("New Minimal SP NIE"))
            }).then(response => {
                if (response.ok) {
                    this.state.modal_nested_edit = false;
                    this.state.modal_nested_parent_edit = false;
                    this.state.currentPage = this.state.lastData;
                    this.componentDidMount();
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data save";
                    this.state.modal_response = true;
                    this.resetAll();
                }else{
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data failed to edit";
                    this.state.modal_response = true;
                }
            }).catch(()=>
            {
                this.connectionOut("Can't reach the server", false)
            });
        }
    }
    //untuk date periode awal sp nie
    handleChangespnie = date => {
        this.setState({
            inputtedTglSPNIEPeriodeawal: dateFormat(date, "yyyy-mm-dd"),
            viewedTglSPNIEPeriodeawal: date
        }, () => console.log("tgl sp nie periode awal: " + this.state.inputtedTglSPNIEPeriodeawal));
    };

    //untuk date periode akhir sp nie
    handleChangesspnie = date => {
        this.setState({
          inputtedTglSPNIEPeriodeakhir: dateFormat(date, "yyyy-mm-dd"),
          viewedTglSPNIEPeriodeakhir: date
        }, () => console.log("tgl sp nie periode akhir: " + this.state.inputtedTglSPNIEPeriodeakhir));
    };
   //edit minimal SP Sia Sipa
   newMinimalSPSIASIPA = (msps_group, msps_periodeawal, msps_periodeakhir) => () => {
    if(msps_periodeawal==""){
        this.setState({
            responseHeader: "Warning!!!",
            responseMessage:"Tanggal Periode Awal can't be empty!",
            modal_response: true
        });
    }
    else if(msps_periodeakhir==""){
        this.setState({
            responseHeader: "Warning!!!",
            responseMessage:"Tanggal Periode Akhir can't be empty!",
            modal_response: true
        });
    }
    else{
        console.log("edit minimal sp SIa Sipa masuk");
        var url = myUrl.url_addMinimalSPSIASIPA;

        fetch(url, {
            method : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                MSPS_Group : msps_group,
                MSPS_PeriodeAwal : msps_periodeawal,
                MSPS_PeriodeAkhir : msps_periodeakhir
            }, console.log("New Minimal SP SIA SIPA"))
        }).then(response => {
            if (response.ok) {
                this.state.modal_nested_edit = false;
                this.state.modal_nested_parent_edit = false;
                this.state.currentPage = this.state.lastData;
                this.componentDidMount();
                this.state.responseHeader = "Confirmation";
                this.state.responseMessage = "Data save";
                this.state.modal_response = true;
                this.resetAll();
            }else{
                this.state.responseHeader = "Confirmation";
                this.state.responseMessage = "Data failed to edit";
                this.state.modal_response = true;
            }
        }).catch(()=>
        {
            this.connectionOut("Can't reach the server", false)
        });
    }
}
    //untuk date periode awal sp sia sipa
    handleChangespsiasipa = date => {
        this.setState({
            inputtedTglSPSIASIPAPeriodeawal: dateFormat(date, "yyyy-mm-dd"),
            viewedTglSPSIASIPAPeriodeawal: date
        }, () => console.log("tgl sp siasipa periode awal: " + this.state.inputtedTglSPSIASIPAPeriodeawal));
    };

    //untuk date periode akhir sp sia sipa
    handleChangesspsiasipa = date => {
        this.setState({
        inputtedTglSPSIASIPAPeriodeakhir: dateFormat(date, "yyyy-mm-dd"),
        viewedTglSPSIASIPAPeriodeakhir: date
        }, () => console.log("tgl sp nie periode akhir: " + this.state.inputtedTglSPSIASIPAPeriodeakhir));
    };


    updateInputValue(evt) {
        console.log(evt.target.name)
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }

    //reset isi insert dan edit
    resetAll(){
        this.setState({
            inputtedSPGroup: '',
            inputtedTglSPPeriodeawal: new Date(),
            inputtedTglSPPeriodeakhir: new Date(),
            inputtedTglSPNIEPeriodeawal: new Date(),
            inputtedTglSPNIEPeriodeakhir: new Date(),
            inputtedTglSPSIASIPAPeriodeawal: new Date(),
            inputtedTglSPSIASIPAPeriodeakhir: new Date(),
            inputtedNilaiSP: '',
        })
    }

    //modal sp
    openModalSPWithItemID(spgroup, nilaisp){
        this.setState({
            modal_nested_parent_edit: true,
            editspgroup: spgroup,
            editspnilaisp: nilaisp,
        }, () => console.log(this.state.editspnilaisp))
    }
    
    //modal sp NIE
    openModalSPNIEWithItemID(spniegroup){
        this.setState({
            modal_nested_parent_edit: true,
            editspniegroup: spniegroup,
        }, () => console.log(this.state.editspnilaisp))
    }
    
    //modal sp SIASIPA
    openModalSPSIASIPAWithItemID(spsiasipagroup){
        this.setState({
            modal_nested_parent_edit: true,
            editspsiasipagroup: spsiasipagroup,
        }, () => console.log(this.state.editspnilaisp))
    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested_parent_edit: false,
        modal_nested: false,
        modal_nested_edit: false,
        backdrop: true,
        modal_response: false,
        responseHeader:"",
        responseMessage:"",
    };

    toggle = modalType => () => {
        console.log(modalType);
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    render() {
        const {inputtedTglSPPeriodeawal} = this.state;

        // const errorMessage =this.state.result.responseMessage;

        // const currentRESULT = this.state.result;

        const currentTodosSP = this.state.resultSP.data;
        const currentTodosSPNIE = this.state.resultSPNIE.data;
        const currentTodosSPSIASIPA = this.state.resultSPSIASIPA.data;
        
        const renderTodosSP = currentTodosSP && currentTodosSP.map((todo) => {
            return<tr>
                <th scope="row">{todo.MSP_Group}</th>
                <td className="py-3">{todo.MSP_PeriodeAwal}</td>
                <td className="py-3">{todo.MSP_PeriodeAkhir}</td>
                <td className="py-3">{todo.MSP_NilaiSP}</td>
                <td>
                    <Button color="danger" size="sm" onClick={()=>this.openModalSPWithItemID(todo.MSP_Group, todo.MSP_PeriodeAwal, todo.MSP_PeriodeAkhir, todo.MSP_NilaiSP)}><MdEdit/></Button>
                </td>
            </tr>
            } ) ;
        const renderTodosSPNIE = currentTodosSPNIE && currentTodosSPNIE.map((todo) => {
            return<tr>
                <th scope="row">{todo.MSPN_Group}</th>
                <td className="py-3">{todo.MSPN_PeriodeAwal}</td>
                <td className="py-3">{todo.MSPN_PeriodeAkhir}</td>
                <td>
                    <Button color="danger" size="sm" onClick={()=>this.openModalSPNIEWithItemID(todo.MSPN_Group, todo.MSPN_PeriodeAwal, todo.MSPN_PeriodeAkhir)}><MdEdit/></Button>
                </td>
            </tr>
            } ) ;
        const renderTodosSPSIASIPA = currentTodosSPSIASIPA && currentTodosSPSIASIPA.map((todo) => {
            return<tr>
                <th scope="row">{todo.MSPS_Group}</th>
                <td className="py-3">{todo.MSPS_PeriodeAwal}</td>
                <td className="py-3">{todo.MSPS_PeriodeAkhir}</td>
                <td>
                    <Button color="danger" size="sm" onClick={()=>this.openModalSPSIASIPAWithItemID(todo.MSPS_Group, todo.MSPS_PeriodeAwal, todo.MSPS_PeriodeAkhir)}><MdEdit/></Button>
                </td>
            </tr>
            } ) ;

        return (
            <div>
                <Tabs>
                    <div label="Minimal SP">
                        <Page title="Minimal SP" breadcrumbs={[{ name: 'minimal sp', active: true }]} className="MinimalSp">
                            <Row>
                                <Col>
                                    <Card className="mb-3">
                                        <CardBody>
                                            
                                            <Modal
                                            //{this.setState({})}
                                            isOpen={this.state.modal_nested_parent_edit}
                                            toggle={this.toggle('nested_parent_edit')}
                                            className={this.props.className}>
                                                <ModalHeader toggle={this.toggle('nested_parent_edit')}>
                                                    Edit SP
                                                </ModalHeader>
                                                <ModalBody>

                                                        <Label>Minimal SP Group</Label>
                                                        <Input disabled={this.state.disabledspgroup} type="spgroup" value={this.state.editspgroup} onChange={evt => this.updateInputValue(evt)} name="inputtedSPGroup"/>
                                                        
                                                        <Label>Periode Awal</Label>
                                                        <br/>
                                                        <DatePicker
                                                            selected={this.state.viewedTglSPPeriodeawal}
                                                            type="tanggalspperiodeawal"
                                                            value={this.state.viewedTglSPPeriodeawal}
                                                            onChange={this.handleChangesp} 
                                                            name="inputtedTglSPPeriodeawal"
                                                        />
                                                        <br/>
                                                        <Label>Periode Akhir</Label>
                                                        <br/> 
                                                        <DatePicker
                                                            selected={this.state.viewedTglSPPeriodeakhir}
                                                            type="tanggalspperiodeakhir"
                                                            minDate = {this.state.viewedTglSPPeriodeawal}
                                                            value={this.state.viewedTglSPPeriodeakhir}
                                                            onChange={this.handleChangessp} 
                                                            name="inputtedTglSPPeriodeakhir"
                                                        />
                                                        {/* <Input style={{display: this.state.displayStatus}} type="tanggalkir" value={this.state.inputtedTglKIR} onChange={evt => this.updateInputValue(evt)} name="inputtedTglKIR"/> */}
                                                        <br/>
            
                                                        <Label>Nilai SP</Label>
                                                        <Input type="nilaisp" value={this.state.inputtedNilaiSP} onChange={evt => this.updateInputValue(evt)} name="inputtedNilaiSP"/>

                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="info" onClick={this.toggle('nested_edit')}>
                                                        Save
                                                    </Button>
                                                    <Modal
                                                    isOpen={this.state.modal_nested_edit}
                                                    toggle={this.toggle('nested_edit')}
                                                    >
                                                        <ModalHeader>Confirmation</ModalHeader>
                                                        <ModalBody>Are you sure to save the data?</ModalBody>
                                                        <ModalFooter>
                                                            <Button color="success" onClick={this.newMinimalSP(this.state.editspgroup, 
                                                                    this.state.inputtedTglSPPeriodeawal, this.state.inputtedTglSPPeriodeakhir, this.state.inputtedNilaiSP
                                                                )}>
                                                                <MdCheckCircle/> Yes
                                                            </Button>{' '}
                                                            <Button
                                                                color="danger"
                                                                onClick={this.toggle('nested_edit')}>
                                                                <MdHighlightOff/> No
                                                            </Button>
                                                        </ModalFooter>
                                                    </Modal>
                                                    {' '}
                                                    <Button color="danger" onClick={this.toggle('nested_parent_edit')}>
                                                        Cancel
                                                    </Button>
                                                </ModalFooter>
                                            </Modal>
                                            <Modal
                                                isOpen={this.state.modal_response}
                                                toggle={this.toggle('response')}
                                            >
                                                <ModalHeader>
                                                {this.state.responseHeader}
                                                </ModalHeader>
                                                <ModalBody>
                                                {this.state.responseMessage}
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="success" onClick={ () => { this.setState({ modal_response: false, modal_nested: false, modal_nested_edit:false}) } }>Ok</Button>
                                                </ModalFooter>
                                            </Modal>

                                            <Table responsive>
                                                <thead>
                                                    <tr>
                                                        <th>MSP Group</th>
                                                        <th>MSP Periode Awal</th>
                                                        <th>MSP Periode Akhir</th>
                                                        <th>MSP Nilai SP</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {renderTodosSP}
                                                </tbody>
                                            </Table>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Page>
                    </div>
                    <div label="Minimal SP NIE">
                        <Page title="Minimal SP Nie" breadcrumbs={[{ name: 'minimal sp nie', active: true }]} className="MinimalSpNie">
                            <Row>
                                <Col>
                                    <Card className="mb-3">
                                        <CardBody>
                                        <Modal
                                            //{this.setState({})}
                                            isOpen={this.state.modal_nested_parent_edit}
                                            toggle={this.toggle('nested_parent_edit')}
                                            className={this.props.className}>
                                                <ModalHeader toggle={this.toggle('nested_parent_edit')}>
                                                    Edit SP NIE
                                                </ModalHeader>
                                                <ModalBody>

                                                        <Label>Minimal SP Nie Group</Label>
                                                        <Input disabled={this.state.disabledspniegroup} type="spniegroup" value={this.state.editspniegroup} onChange={evt => this.updateInputValue(evt)} name="inputtedSPNIEGroup"/>
                                                        
                                                        <Label>Periode Awal</Label>
                                                        <br/>
                                                        <DatePicker
                                                            selected={this.state.viewedTglSPNIEPeriodeawal}
                                                            type="tanggalspnieperiodeawal"
                                                            value={this.state.viewedTglSPNIEPeriodeawal}
                                                            onChange={this.handleChangespnie} 
                                                            name="inputtedTglSPNIEPeriodeawal"
                                                        />
                                                        <br/>
                                                        <Label>Periode Akhir</Label>
                                                        <br/> 
                                                        <DatePicker
                                                            selected={this.state.viewedTglSPNIEPeriodeakhir}
                                                            type="tanggalspnieperiodeakhir"
                                                            minDate = {this.state.viewedTglSPNIEPeriodeawal}
                                                            value={this.state.viewedTglSPNIEPeriodeakhir}
                                                            onChange={this.handleChangesspnie} 
                                                            name="inputtedTglSPNIEPeriodeakhir"
                                                        />
                                                        {/* <Input style={{display: this.state.displayStatus}} type="tanggalkir" value={this.state.inputtedTglKIR} onChange={evt => this.updateInputValue(evt)} name="inputtedTglKIR"/> */}
                                                        {/* <br/> */}
            
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="info" onClick={this.toggle('nested_edit')}>
                                                        Save
                                                    </Button>
                                                    <Modal
                                                    isOpen={this.state.modal_nested_edit}
                                                    toggle={this.toggle('nested_edit')}
                                                    >
                                                        <ModalHeader>Confirmation</ModalHeader>
                                                        <ModalBody>Are you sure to save the data?</ModalBody>
                                                        <ModalFooter>
                                                            <Button color="success" onClick={this.newMinimalSPNIE(this.state.editspniegroup, 
                                                                    this.state.inputtedTglSPNIEPeriodeawal, this.state.inputtedTglSPNIEPeriodeakhir
                                                                )}>
                                                                <MdCheckCircle/> Yes
                                                            </Button>{' '}
                                                            <Button
                                                                color="danger"
                                                                onClick={this.toggle('nested_edit')}>
                                                                <MdHighlightOff/> No
                                                            </Button>
                                                        </ModalFooter>
                                                    </Modal>
                                                    {' '}
                                                    <Button color="danger" onClick={this.toggle('nested_parent_edit')}>
                                                        Cancel
                                                    </Button>
                                                </ModalFooter>
                                            </Modal>
                                            <Modal
                                                isOpen={this.state.modal_response}
                                                toggle={this.toggle('response')}
                                            >
                                                <ModalHeader>
                                                {this.state.responseHeader}
                                                </ModalHeader>
                                                <ModalBody>
                                                {this.state.responseMessage}
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="success" onClick={ () => { this.setState({ modal_response: false, modal_nested: false, modal_nested_edit:false}) } }>Ok</Button>
                                                </ModalFooter>
                                            </Modal>
                                            {/*</ButtonGroup>*/}
                                            <Table responsive>
                                                <thead>
                                                    <tr>
                                                        <th>MSP Group</th>
                                                        <th>MSP Periode Awal</th>
                                                        <th>MSP Periode Akhir</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {renderTodosSPNIE}
                                                </tbody>
                                            </Table>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Page>
                    </div>
                    <div label="Minimal SP SIA SIPA">
                        <Page title="Minimal SP Sia Sipa" breadcrumbs={[{ name: 'minimal sp sia sipa', active: true }]} className="MinimalSpSiaSipa">
                            <Row>
                                <Col>
                                    <Card className="mb-3">
                                        <CardBody>
                                        <Modal
                                            //{this.setState({})}
                                            isOpen={this.state.modal_nested_parent_edit}
                                            toggle={this.toggle('nested_parent_edit')}
                                            className={this.props.className}>
                                                <ModalHeader toggle={this.toggle('nested_parent_edit')}>
                                                    Edit SP SIA SIPA
                                                </ModalHeader>
                                                <ModalBody>

                                                        <Label>Minimal SP SIA SIPA Group</Label>
                                                        <Input disabled={this.state.disabledspsiasipagroup} type="spsiasipagroup" value={this.state.editspsiasipagroup} onChange={evt => this.updateInputValue(evt)} name="inputtedSPSIASIPAGroup"/>
                                                        
                                                        <Label>Periode Awal</Label>
                                                        <br/>
                                                        <DatePicker
                                                            selected={this.state.viewedTglSPSIASIPAPeriodeawal}
                                                            type="tanggalspsiasipaperiodeawal"
                                                            value={this.state.viewedTglSPSIASIPAPeriodeawal}
                                                            onChange={this.handleChangespsiasipa} 
                                                            name="inputtedTglSPSIASIPAPeriodeawal"
                                                        />
                                                        <br/>
                                                        <Label>Periode Akhir</Label>
                                                        <br/> 
                                                        <DatePicker
                                                            selected={this.state.viewedTglSPSIASIPAPeriodeakhir}
                                                            type="tanggalspsiasipaperiodeakhir"
                                                            minDate = {this.state.viewedTglSPSIASIPAPeriodeawal}
                                                            value={this.state.viewedTglSPSIASIPAPeriodeakhir}
                                                            onChange={this.handleChangesspsiasipa} 
                                                            name="inputtedTglSPSIASIPAPeriodeakhir"
                                                        />
                                                        {/* <Input style={{display: this.state.displayStatus}} type="tanggalkir" value={this.state.inputtedTglKIR} onChange={evt => this.updateInputValue(evt)} name="inputtedTglKIR"/> */}
                                                        {/* <br/> */}
            
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="info" onClick={this.toggle('nested_edit')}>
                                                        Save
                                                    </Button>
                                                    <Modal
                                                    isOpen={this.state.modal_nested_edit}
                                                    toggle={this.toggle('nested_edit')}
                                                    >
                                                        <ModalHeader>Confirmation</ModalHeader>
                                                        <ModalBody>Are you sure to save the data?</ModalBody>
                                                        <ModalFooter>
                                                            <Button color="success" onClick={this.newMinimalSPSIASIPA(this.state.editspsiasipagroup, 
                                                                    this.state.inputtedTglSPSIASIPAPeriodeawal, this.state.inputtedTglSPSIASIPAPeriodeakhir
                                                                )}>
                                                                <MdCheckCircle/> Yes
                                                            </Button>{' '}
                                                            <Button
                                                                color="danger"
                                                                onClick={this.toggle('nested_edit')}>
                                                                <MdHighlightOff/> No
                                                            </Button>
                                                        </ModalFooter>
                                                    </Modal>
                                                    {' '}
                                                    <Button color="danger" onClick={this.toggle('nested_parent_edit')}>
                                                        Cancel
                                                    </Button>
                                                </ModalFooter>
                                            </Modal>
                                            {/*</ButtonGroup>*/}
                                            <Table responsive>
                                                <thead>
                                                    <tr>
                                                        <th>MSP Group</th>
                                                        <th>MSP Periode Awal</th>
                                                        <th>MSP Periode Akhir</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {renderTodosSPSIASIPA}
                                                </tbody>
                                            </Table>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Page>
                    </div>
                </Tabs>
            </div>
        );
    }

    
}
const container = document.createElement('div');
document.body.appendChild(container);
export default MinimalSp;
//untuk amp
//export const config = {amp : true}
