import Page from 'components/Page';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from 'reactstrap';
import { MdAdd, MdDelete, MdEdit, MdRefresh } from 'react-icons/md';
import * as s_url from '../urlLinkMasterJ';
import * as Request from '../../custom_functions/Request';
import NavTabs from '../../custom_components/NavTabs';
import ModalMessage from '../../custom_components/ModalMessage';
import TmpOutRow from '../../custom_components/TmpOutRow';
import DropdownTemplate from '../../custom_components/DropdownTemplate';
import ModalConfrimation from '../../custom_components/ModalConfirmation';

class GenerikPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            isLoadingData: false,


            //table data
            result: [],
            resultAdd: [],

            //row and payload data
            tmpout_jenisarea: "",
            tmpout_l0: "",
            tmpout_l15: "",
            tmpout_l30: "",
            tmpout_l45: "",
            tmpout_l60: "",
            tmpout_l80: "",
            tmpout_l100: "",
            tmpout_userid: "",


            //preset data for offline
            message: "Something went wrong. Please try again in a few seconds.",
            messageData: "Something went wrong. Please try again in a few seconds.",
            code: "0",
            codeData: "0",
            dropdownSatuan: "1",
            dropdownHJA: "1",
            dropdownClass: "A",
            dropdownFlag: "O",
            dropdownSatuanOption: {
                "1": "SELLPACK",
                "2": "MEDPACK"
            },
            dropdownHJAOption: {
                "1": "<= 200RB",
                "2": "> 200RB"
            },
            dropdownClassOption: {
                "A": "A",
                "C": "C",
                "S": "S",
                "G": "G"
            },
            dropdownFlagOption: {
                "O": "Master Optional",
                "V":"Master Harus"
            },

            //modal states
            modal: false,
            modal_add: false,
            modal_add_nested: false,
            modal_delete: false,
            modal_edit: false,
            modal_edit_nested: false,
            modal_message: false,
            modal_message_data: false,

        };
    }

    //request to backend
    getParameter(){
        var  url = s_url.url_ParameterTmpOut;

        this.setState({ isLoadingData: true});

        Request.Get(
            url,

            data =>
            {
                try{
                    this.setState({ dropdownSatuanOption: data.responseData[0].SATUAN,
                        dropdownHJAOption: data.responseData[0].hja,
                        dropdownClassOption: data.responseData[0].KELAS,
                        dropdownSatuan: Object.keys(data.responseData[0].SATUAN)[0],
                        dropdownHJA: Object.keys(data.responseData[0].hja)[0],
                        dropdownClass: Object.keys(data.responseData[0].KELAS)[0],
                        isLoadingData: false
                    },() => this.getTableData());
                }catch{this.popUpMessage("cannot parse data, please contact the administrator.", "999",false,true);}

            },

            response => this.popUpMessage("cannot reach the server", response.status + " - " + response.statusText,false,true),

            () => this.popUpMessage("cannot reach the server", "0",false,true)

        );

    }

    getTableData(){
        var  url = s_url.url_CetakTmpOut;

        this.setState({ isLoadingData: true, result:[]});

        var satuan = this.state.dropdownSatuanOption[this.state.dropdownSatuan];
        var Class = this.state.dropdownClassOption[this.state.dropdownClass];

        var formdata = {
            tmpout_satuan: satuan,
            tmpout_flag: this.state.dropdownFlag,
            tmpout_hja: this.state.dropdownHJA,
            tmpout_kelas: Class,
        };

        Request.Post(
            url,
            formdata,

            data =>
            {
                this.setState({ result: data.responseData,
                    isLoadingData: false});

            },

            response => this.popUpMessage("cannot reach the server", response.status + " - " + response.statusText,false,true),

            () => this.popUpMessage("cannot reach the server", "0",false,true)

        );

    }
    
    getAddTableData(){
        var  url = s_url.url_CetakAddTmpOut;

        this.setState({
            isLoadingData: true,
            modal_add: true, 
            resultAdd: []
        });

        var satuan = this.state.dropdownSatuanOption[this.state.dropdownSatuan];
        var Class = this.state.dropdownClassOption[this.state.dropdownClass];

        var formdata = {
            tmpout_satuan: satuan,
            tmpout_flag: this.state.dropdownFlag,
            tmpout_hja: this.state.dropdownHJA,
            tmpout_kelas: Class,
        };

        Request.Post(
            url,
            formdata,

            data =>
            {
                this.setState({ resultAdd: data.responseData,
                   modal_add: true,
                    isLoadingData: false
                 });

            },

            response => this.popUpMessage("cannot reach the server", response.status + " - " + response.statusText,false,true),

            () => this.popUpMessage("cannot reach the server", "0",false,true)

        );

    }

    addTableData(){
        var  url = s_url.url_TambahTmpOut;

        this.setState({ isLoading: true});

        var satuan = this.state.dropdownSatuanOption[this.state.dropdownSatuan];
        var Class = this.state.dropdownClassOption[this.state.dropdownClass];

        var data = this.state.resultAdd;

        /*for(var i = 0; i < data.length; i++){
            data[i]["tmpout_satuan"] = satuan;
            data[i]["tmpout_flag"] = this.state.dropdownFlag;
            data[i]["tmpout_hja"] = this.state.dropdownHJA;
            data[i]["tmpout_kelas"] = Class;
        }*/

        var formdata = {
            tmpout_satuan: satuan,
            tmpout_flag: this.state.dropdownFlag,
            tmpout_hja: this.state.dropdownHJA,
            tmpout_kelas: Class,
            tmpout_data: JSON.stringify(data)
        };

        Request.Post(
            url,
            formdata,

            data =>
            {
                this.popUpMessage(data.responseMessage, data.responseCode,true,false);
            },

            response => this.popUpMessage("cannot reach the server", response.status + " - " + response.statusText,false,false),

          () => this.popUpMessage("cannot reach the server", "0",false,false)

        );

    }
    
    updateTableData(){
        var  url = s_url.url_UbahTmpOut;

        this.setState({ isLoading: true});

        var satuan = this.state.dropdownSatuanOption[this.state.dropdownSatuan];
        var Class = this.state.dropdownClassOption[this.state.dropdownClass];

        var formdata = {
            tmpout_satuan: satuan,
            tmpout_flag: this.state.dropdownFlag,
            tmpout_hja: this.state.dropdownHJA,
            tmpout_kelas: Class,
            tmpout_jenisarea: this.state.tmpout_kodearea,
            tmpout_l0: this.state.tmpout_l0,
            tmpout_l15: this.state.tmpout_l15,
            tmpout_l30: this.state.tmpout_l30,
            tmpout_l45: this.state.tmpout_l45,
            tmpout_l60: this.state.tmpout_l60,
            tmpout_l80: this.state.tmpout_l80,
            tmpout_l100: this.state.tmpout_l100,
        };

        Request.Post(
            url,
            formdata,

            data =>
            {
                this.popUpMessage(data.responseMessage, data.responseCode,true,false);
            },

            response => this.popUpMessage("cannot reach the server", response.status + " - " + response.statusText,false,false),

            () => this.popUpMessage("cannot reach the server", "0",false,false)
        );

    }

    deleteTableData(){
        var  url = s_url.url_HapusTmpOut;

        this.setState({ isLoading: true});

        var satuan = this.state.dropdownSatuanOption[this.state.dropdownSatuan];
        var Class = this.state.dropdownClassOption[this.state.dropdownClass];

        var formdata = {
            tmpout_satuan: satuan,
            tmpout_flag: this.state.dropdownFlag,
            tmpout_hja: this.state.dropdownHJA,
            tmpout_kelas: Class,
            tmpout_jenisarea: this.state.tmpout_kodearea,
            tmpout_userid: "HELLO"
        };

        Request.Post(
            url,
            formdata,

            data =>
            {
                this.popUpMessage(data.responseMessage, data.responseCode,true,false);
            },

            response => this.popUpMessage("cannot reach the server", response.status + " - " + response.statusText,false,false),

            () => this.popUpMessage("cannot reach the server", "0",false,false)
        );

    }


    //other methods
    componentDidMount() {
        this.getParameter();
    }

    popUpMessage(message,code,render,data){

        const load = data ? "isLoadingData" : "isLoading";
        const loadCode = data ? "codeData" : "code";
        const loadData = data ? "messageData" : "message";
        const loadModal = data ? "modal_message_data" : "modal_message";

        if(render){

            this.setState({
                [`${loadData}`]: message,
                [`${loadCode}`]: code,
                [`${loadModal}`]:true,
                modal_add: false,
                modal_add_nested: false,
                modal_delete: false,
                modal_edit: false,
                modal_edit_nested: false,
                [`${load}`]: false
            },() => this.getTableData())

        }else{

            this.setState({
                [`${loadData}`]: message,
                [`${loadCode}`]: code,
                [`${loadModal}`]:true,
                modal_add: false,
                modal_add_nested: false,
                modal_delete: false,
                modal_edit: false,
                modal_edit_nested: false,
                [`${load}`]: false
            })

        }
    }

    checkInput(e){
        var p = e.target.placeholder
        var v = e.target.value;
        e.target.value = "";
        try{
            if(v === "") return p;
            if(isNaN(Number(v))) return p;
            if(Number(v) < 1) return p;
            return v;
        }catch{return p}
        
    }


    //functions to declutter render

    //update
    updateData(e){
        var spaceIndex = e.target.className.indexOf(" ");
        const className = e.target.className.substring(0,spaceIndex);
        const index = e.target.id;
        const value = this.checkInput(e);

        this.setState( state => {
            var tableData = state.resultAdd.slice();
            
            tableData[index][className] = value;

            return {resultAdd: tableData}
        })
    }

    updateSatuanValue(evt){
        this.setState({dropdownSatuan: evt.target.value});
    }

    updateHJAValue(evt){
        this.setState({dropdownHJA: evt.target.value});
    }
    
    updateClassValue(evt){
        this.setState({dropdownClass: evt.target.value});
    }

    updateFlagValue(evt){
        if(evt.target.id === this.state.dropdownFlag)
        this.setState({dropdownFlag: evt.target.id});
        else
        this.setState({dropdownFlag: evt.target.id},
            () => this.getTableData());
    }


    //toggle
    toggle(modalType){

        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    toggledata(data, edit){
        this.setState({
            tmpout_jenisarea: data.tmpout_jenisarea,
            tmpout_kodearea: data.tmpout_kodearea,
            tmpout_l0: data.tmpout_l0,
            tmpout_l15: data.tmpout_l15,
            tmpout_l30: data.tmpout_l30,
            tmpout_l45: data.tmpout_l45,
            tmpout_l60: data.tmpout_l60,
            tmpout_l80: data.tmpout_l80,
            tmpout_l100: data.tmpout_l100,

            modal_edit: edit,
            modal_delete: !edit
        })
    }

    closeMessage(data){
        const load = data ? "isLoadingData" : "isLoading";
        const loadModal = data ? "modal_message_data" : "modal_message";
        this.setState({
            [`${loadModal}`]:false,
            [`${load}`]: false
        })

    }


    render() {
        const { 
            isLoading,
            isLoadingData,
            result,  
            resultAdd,

            dropdownSatuanOption,
            dropdownHJAOption,
            dropdownClassOption,
            dropdownFlagOption,

            dropdownSatuan,
            dropdownHJA,
            dropdownClass,
            dropdownFlag,

            tmpout_jenisarea,
            tmpout_kodearea,
            tmpout_l0,
            tmpout_l15,
            tmpout_l30,
            tmpout_l45,
            tmpout_l60,
            tmpout_l80,
            tmpout_l100,

            message,
            messageData,
            code,
            codeData
        
        } = this.state;

        var modal_add, modal_delete, modal_edit, modal_message, modal_message_data;
        var navigation_tab;
        var dropdown_row;
        var tableHeader,tableBody;
        var addButton, refreshButton;
        var loader, nodata;
        var tableBody_add,tableHeader_add;
        var SatuanDisplay, HJADisplay, ClassDisplay;

        SatuanDisplay = dropdownSatuanOption[dropdownSatuan];
        HJADisplay = dropdownHJAOption[dropdownHJA];
        ClassDisplay = dropdownClassOption[dropdownClass];


        //other elements
        navigation_tab=<NavTabs data={dropdownFlagOption} id={dropdownFlag} onClick={e => this.updateFlagValue(e)}/>;

        addButton = 
        <Button  
            onClick={() => this.getAddTableData()}
            className="btn-block"
            style={{textAlign: "center"}}
            size="sm"
        >
            <MdAdd style={{marginRight: "5px"}}/>ADD
        </Button>
        ;
        
        refreshButton = 
        <Button  
            onClick={() => this.getTableData()}
            style={{textAlign: "center"}}
            size="sm"
        >
           <MdRefresh style={{marginRight: "5px"}}/>REFRESH
        </Button>
        ;

        dropdown_row=
        <Row className="clearfix">
            <Col align="center">{"Satuan"}
                <br/>
                <DropdownTemplate 
                    onClick={e => this.updateSatuanValue(e)}
                    name={SatuanDisplay}
                    data={dropdownSatuanOption}
                />
            </Col>
            <Col align="center">{"HJA"}
                <br/>
                <DropdownTemplate 
                    onClick={e => this.updateHJAValue(e)}
                    name={HJADisplay}
                    data={dropdownHJAOption}
                />
            </Col>
            <Col align="center">{"Class"}
                <br/>
                <DropdownTemplate 
                    onClick={e => this.updateClassValue(e)}
                    name={ClassDisplay}
                    data={dropdownClassOption}
                />
            </Col>
            <Col align="center">{"Refresh"}
                <br/>
                {refreshButton}
            </Col>
        </Row>
        ;
        
        loader = 
        <td colSpan= "10">
            <Spinner size="lg" type="grow" color="primary" />
            <br/>
            Loading...
        </td>
        ;

        nodata =
        <td colSpan= "10">
            <Spinner size="lg"  color="danger" />
            <br/>
            No data
        </td>
        ;

        //table datas
        tableHeader =
          <thead>
            <tr style={{width:"100%", textAlign: "center"}}>
              <th rowSpan={2}  style={{whiteSpace: "pre",verticalAlign: "middle"}}>{" Kode Area "}</th>
              <th rowSpan={2}  style={{whiteSpace: "pre",verticalAlign: "middle"}}>{"Jenis Area "}</th>
              <th colSpan={8} style={{whiteSpace: "pre"}}>Luas</th>
            </tr>
            <tr style={{width:"100%", textAlign: "center"}}>
                <th style={{whiteSpace: "pre"}}>{" >  0 - 15  "}</th>
                <th style={{whiteSpace: "pre"}}>{" > 15 - 30  "}</th>
                <th style={{whiteSpace: "pre"}}>{" > 30 - 45  "}</th>
                <th style={{whiteSpace: "pre"}}>{" > 45 - 60  "}</th>
                <th style={{whiteSpace: "pre"}}>{" > 60 - 80  "}</th>
                <th style={{whiteSpace: "pre"}}>{" > 80 - 100 "}</th>
                <th style={{whiteSpace: "pre"}}>{"      > 100 "}</th>
                <th style={{whiteSpace: "pre"}}>{"           "}</th>
            </tr>
          </thead>

        ;

        tableHeader_add  =
          <thead>
          <tr style={{width:"100%", textAlign: "center"}}>
            <th rowSpan={2}  style={{whiteSpace: "pre",verticalAlign: "middle"}}>{" Kode Area "}</th>
            <th rowSpan={2}  style={{whiteSpace: "pre",verticalAlign: "middle"}}>{"Jenis Area "}</th>
            <th colSpan={8} style={{whiteSpace: "pre"}}>Luas</th>
          </tr>
          <tr style={{width:"100%", textAlign: "center"}}>
            <th style={{whiteSpace: "pre"}}>{" >  0 - 15  "}</th>
            <th style={{whiteSpace: "pre"}}>{" > 15 - 30  "}</th>
            <th style={{whiteSpace: "pre"}}>{" > 30 - 45  "}</th>
            <th style={{whiteSpace: "pre"}}>{" > 45 - 60  "}</th>
            <th style={{whiteSpace: "pre"}}>{" > 60 - 80  "}</th>
            <th style={{whiteSpace: "pre"}}>{" > 80 - 100 "}</th>
            <th style={{whiteSpace: "pre"}}>{"      > 100 "}</th>
          </tr>
        </thead>

        ;
        
        if(result.length > 0 && !isLoadingData){
        tableBody = 
        result.map(tmpout =>
            <tr style={{textAlign: "center"}} className = {tmpout.tmpout_editableyn !== 'Y' ? "table-active" : null}>
                <th>{tmpout.tmpout_kodearea}</th>
                <th>{tmpout.tmpout_jenisarea}</th>
                <th>{tmpout.tmpout_l0}</th>
                <th>{tmpout.tmpout_l15}</th>
                <th>{tmpout.tmpout_l30}</th>
                <th>{tmpout.tmpout_l45}</th>
                <th>{tmpout.tmpout_l60}</th>
                <th>{tmpout.tmpout_l80}</th>
                <th>{tmpout.tmpout_l100}</th> 
                <th width="10%" style={{textAlign: "center"}}>
                {tmpout.tmpout_editableyn === 'Y' ? <Button size ="sm" onClick={() => this.toggledata(tmpout,true)} color="success" style={{display: "inline-flex", alignItems: "center", justifyContent: 'center'}}><MdEdit/></Button>: null}
                                                    <Button size ="sm" onClick={() => this.toggledata(tmpout,false)} color="danger" style={{display: "inline-flex", alignItems: "center", marginLeft: "10px"}}><MdDelete/></Button>
                </th>
            </tr>
        )
        ;
        }else{
            if(isLoadingData)
            tableBody = <tr style={{textAlign: "center"}}>{loader}</tr>;
            else
            tableBody = <tr style={{textAlign: "center"}}>{nodata}</tr>;
        }

        if(resultAdd.length > 0 && !isLoadingData){
            tableBody_add = 
                resultAdd.map((data,index) => {
                    //if(data.tmpout_HJA !== Number(dropdownHJA)) return null;
                    //if(data.tmpout_Satuan !== SatuanDisplay) return null;
                    //if(data.tmpout_Class !== ClassDisplay) return null;
                        
                    return (
                    <TmpOutRow data={data} index={index} onBlur={e => this.updateData(e)}/>
                    );

                });
        }else{
            if(isLoadingData)
            tableBody_add = <tr style={{textAlign: "center"}}>{loader}</tr>;
            else
            tableBody_add = <tr style={{textAlign: "center"}}>{nodata}</tr>;
        }

        //modal
        modal_delete =  <ModalConfrimation
                            isLoading={isLoading}
                            isOpen={this.state.modal_delete}
                            toggle={() => this.toggle('delete')}
                            onClick={() => this.deleteTableData()}
                            header="Konfirmasi Delete"
                            body={
                                <ModalBody>
                                    <b>Kode Area: {tmpout_kodearea}</b><br/>
                                    <b>Nama Area: {tmpout_jenisarea}</b><br/>
                                    <b>{" >  0 - 15  "}: {tmpout_l0}</b><br/>
                                    <b>{" > 15 - 30  "}: {tmpout_l15}</b><br/>
                                    <b>{" > 30 - 45  "}: {tmpout_l30}</b><br/>
                                    <b>{" > 45 - 60  "}: {tmpout_l45}</b><br/>
                                    <b>{" > 60 - 80  "}: {tmpout_l60}</b><br/>
                                    <b>{" > 80 - 100 "}: {tmpout_l80}</b><br/>
                                    <b>{"      > 100 "}: {tmpout_l100}</b><br/><br/>
                                    Apakah anda ingin menghapus data ini?
                                </ModalBody>}/>
        ;

        modal_message=<ModalMessage 
            isOpen={this.state.modal_message}
            message={message}
            code={code}
            onClick={() => this.closeMessage(false)}
            toggle={() => this.closeMessage(false)}
            />
        ;

        modal_message_data=<ModalMessage
          isOpen={this.state.modal_message_data}
          message={messageData}
          code={codeData}
          onClick={() => this.closeMessage(true)}
          toggle={() => this.closeMessage(true)}
        />
        ;

        modal_edit =<Modal

                        isOpen={this.state.modal_edit}
                        toggle={() => this.toggle('edit')}
                        className={this.props.className}>

                        <ModalHeader toggle={() => this.toggle('edit')}>
                            Template Alokasi
                        </ModalHeader>

                        <ModalBody >

                            <Row>
                                <Col>{"Nama Area: "}</Col>
                                <Col className="col-auto"><Input value={tmpout_jenisarea} disabled size ="sm"/></Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>{"Kode Area: "}</Col>
                                <Col className="col-auto"><Input value={tmpout_kodearea}  disabled size ="sm"/></Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>{" >  0 - 15  "}</Col>
                                <Col className="col-auto"><Input placeholder={tmpout_l0}    size ="sm" onBlur={e => this.setState({tmpout_l0: this.checkInput(e)})}/></Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>{" > 15 - 30  "}</Col>
                                <Col className="col-auto"><Input placeholder={tmpout_l15}   size ="sm" onBlur={e => this.setState({tmpout_l15: this.checkInput(e)})}/></Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>{" > 30 - 45  "}</Col>
                                <Col className="col-auto"><Input placeholder={tmpout_l30}   size ="sm" onBlur={e => this.setState({tmpout_l30: this.checkInput(e)})}/></Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>{" > 45 - 60  "}</Col>
                                <Col className="col-auto"><Input placeholder={tmpout_l45}   size ="sm" onBlur={e => this.setState({tmpout_l45: this.checkInput(e)})}/></Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>{" > 60 - 80  "}</Col>
                                <Col className="col-auto"><Input placeholder={tmpout_l60}   size ="sm" onBlur={e => this.setState({tmpout_l60: this.checkInput(e)})}/></Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>{" > 80 - 100 "}</Col>
                                <Col className="col-auto"><Input placeholder={tmpout_l80}   size ="sm" onBlur={e => this.setState({tmpout_l80: this.checkInput(e)})}/></Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>{"      > 100 "}</Col>
                                <Col className="col-auto"><Input placeholder={tmpout_l100}  size ="sm" onBlur={e => this.setState({tmpout_l100: this.checkInput(e)})}/></Col>
                            </Row>
                            
                        </ModalBody>

                        <ModalFooter>

                            <Button color="primary" onClick={() => this.toggle('edit_nested')}>
                                Simpan
                            </Button>
                            {' '}
                            <Button color="secondary" onClick={() => this.toggle('edit')}>
                                Batal
                            </Button>

                        </ModalFooter>

                        <ModalConfrimation
                            isLoading={isLoading}
                            isOpen={this.state.modal_edit_nested}
                            toggle={() => this.toggle('edit_nested')}
                            onClick={() => this.updateTableData()}
                            header="Konfirmasi Penyimpanan"
                            body={
                                <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                            }
                        />

                    </Modal>
        ;

        modal_add =<Modal
            isOpen={this.state.modal_add}
            toggle={() => this.toggle('add')}
            size="xl"
            >
            

            <ModalHeader>
                Add Template Alokasi
            </ModalHeader>

            <ModalBody>

                <Table responsive>
                        {tableHeader_add}

                    <tbody>
                        {tableBody_add}
                    </tbody>
                </Table>

            </ModalBody>

            <ModalFooter className="d-flex">

                <Button
                    className="mr-auto p-2"
                    onClick={() => this.getAddTableData()}
                    style={{textAlign: "center"}}
                >
                    <MdRefresh style={{marginRight: "5px"}}/>REFRESH
                </Button>
                {' '}
                <Button color="primary" onClick={() => this.toggle('add_nested')} disabled={this.state.resultAdd.length === 0}>
                    Simpan
                </Button>
                {' '}
                <Button color="secondary" onClick={() => this.toggle('add')}>
                    Batal
                </Button>

            </ModalFooter>

            <ModalConfrimation
                isLoading={isLoading}
                isOpen={this.state.modal_add_nested}
                toggle={() => this.toggle('add_nested')}
                onClick={() => this.addTableData()}
                header="Konfirmasi Penyimpanan"
                body={
                    <ModalBody>
                        Apakah anda ingin menyimpan data ini?
                    </ModalBody>
                }
            />
            
        </Modal>
        ;
        


        //true render
        return (
            <Page
                title="Template Alokasi Outlet"
                breadcrumbs={[{ name: 'Template Alokasi Outlet', active: true }]}
                className="GenerikPage">

                {modal_message}
                {modal_message_data}
                {modal_delete}
                {modal_edit}
                {modal_add}

                {navigation_tab}
                
                <Card style={{borderTop: "none", borderRadius: 0}}>

                    <CardBody className="mr-3">

                        {dropdown_row}
                        <p /*style={{textAlign: "center"}}*/><b>Note: Untuk Memperbaharui Data dan Mencari data harus klik Tombol Refresh</b></p>
                        {addButton}
                        <br/>

                        <Table responsive>
                                {tableHeader}

                            <tbody>
                                {tableBody}
                            </tbody>

                        </Table>
                    </CardBody>
                </Card>
        
            </Page>

            
        );
    }


}
export default GenerikPage;
//style={{display:"inline-block", width:"10 0px"}}