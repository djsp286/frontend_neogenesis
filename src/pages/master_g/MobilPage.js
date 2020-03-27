import Page from 'components/Page';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from 'dateformat';
import React from 'react';
import * as myUrl from '../urlLinkMasterG';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, ButtonGroup, InputGroup,
    InputGroupAddon, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown, FormGroup
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdSearch, MdEdit} from 'react-icons/md';

class MobilPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            todos:[],
            isLoading: false,
            inputtedNoPolisi: '',
            inputtedJenisMobil: '',
            inputtedTglSTNK: dateFormat(new Date(), "yyyy-mm-dd"),
            viewedTglSTNK: new Date(),
            inputtedTglKIR: dateFormat(new Date(), "yyyy-mm-dd"),
            viewedTglKIR: new Date(),
            inputtedNoRangka: '',
            inputtedNoMesin: '',
            inputtedKeterangan: '',
            inputtedBoxYN: 'N',
            editCode: '',
            editnopol: '',
            editcheckbox: '',
            editjenismobil: '',
            searchType:"all",
            keyword:"",
            currentPage: 1,
            todosPerPage: 5,
            totalData:0,
            flag:0,
            currentData: 0,
            lastData: 0,
            selectedDropdown: "Show All",
            disabledTglKIR: true,
            disabledbNoPolisi: true,
            disabledJenisMobil: true,
            isChecked: true,
            displayStatus: "none"
        };
    }

    componentDidMount() {
        this.getTotalMobilPage();
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
                searchType:"all",
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

    //set Current Limit
    handleSelect(event) {
        this.setState({ [event.target.name]: parseInt(event.target.value), currentPage: 1
         },() =>{
            this.componentDidMount();
        });
    }

    //set Current Page
    handleWrite(event, flag, forl) {
        if(forl == "first"){
            this.state.currentData = 1; 
        }else if(forl == "last"){
            this.state.currentData = this.state.lastData;
        }else{
            this.state.currentData = Number(event.target.value)+ flag;
            if(this.state.currentData < 1){
                this.state.currentData = 1;
            }
            else if(this.state.currentData > this.state.lastData){
                console.log(this.state.lastData)
                this.state.currentData = this.state.lastData;
            }
        }
        console.log(this.state.currentData);
        this.setState({
          currentPage: this.state.currentData
                  },() =>{
            if(flag!==0)
            {
                this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
            }
        });
    }

    enterPressed= (event,search) =>{
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            event.preventDefault();
            this.setState({currentPage: 1}
            ,() =>{ 
                // this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
                this.getTotalMobilPage();
            });
        } 
    }

    getTotalMobilPage(){
        const kword = this.state.keyword;
        const currLimit = this.state.todosPerPage; 

        const urlA=myUrl.url_getTotalMobilPage;
        var payload = {
            keyword: kword,
            limit : currLimit.toString(),
            type : this.state.searchType
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
              },
            body: JSON.stringify(payload)
        };
        fetch(urlA ,option)
            .then(response => response.json())
            .then(data =>{
                console.log(data)
                if(data==0){
                    this.setState({
                        responseHeader: "Alert!!!",
                        responseMessage: "Data is empty!",
                        modal_response: true,
                        result: data,
                        isLoading: false
                    });
                }
                else{
                    this.setState({lastData: data} ,()=> this.getListbyPaging(this.state.currentPage,this.state.todosPerPage));
                }
            }, ()=> this.connectionOut("Can't reach the server", false));
    }

    getListbyPaging(currPage,currLimit){
        const kword = this.state.keyword;
        
        const urlA=myUrl.url_getMobilList;
        var payload = {
            type: this.state.searchType,
            keyword: kword,
            offset : ((currPage-1)*currLimit).toString(),
            limit : currLimit.toString()
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(payload)
        }
        fetch(urlA,option)
            .then(response => response.json())
            .then(data =>{
                console.log(data)
                this.setState({ result: data, isLoading: false})
            }, ()=> this.connectionOut("Can't reach the server", false));
    }

    insertMasterMobil = (no_polisi, jenis_mobil, tgl_stnk, tgl_kir, no_rangka, no_mesin, keterangan, boxYN) => () => {
        console.log("stnk: " + this.state.inputtedTglSTNK)
        if(no_polisi == ""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"No. Polisi can't be empty!",
                modal_response: true
            });
            
            console.log(this.state.modal_response);
        }
        else if(jenis_mobil==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Jenis mobil can't be empty!",
                modal_response: true
            });
        }
        else if(tgl_stnk==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Tanggal STNK can't be empty!",
                modal_response: true
            });
        }
        else if(tgl_kir==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Tanggal KIR can't be empty!",
                modal_response: true
            });
        }
        else if(no_rangka==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"No. Rangka can't be empty!",
                modal_response: true
            });
        }
        else{
            var url = myUrl.url_newMasterMobil;
            if(boxYN == "N"){
                tgl_kir = "";
            }

            fetch(url, {
                method : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Mobil_NoPolisi : no_polisi,
                    Mobil_Jenis : jenis_mobil,
                    Mobil_TglSTNK : tgl_stnk,
                    Mobil_TglKIR : tgl_kir,
                    Mobil_NoRangka : no_rangka,
                    Mobil_NoMesin : no_mesin,
                    Mobil_Keterangan : keterangan,
                    Mobil_BoxYN : boxYN,
                    Mobil_ID : "1"
                }, console.log(no_polisi, jenis_mobil, tgl_stnk, tgl_kir, no_rangka, no_mesin, keterangan, boxYN))
            }).then(response => {
                console.log("sudah request");
                if (response.ok) {
                    this.state.modal_nested = false;
                    this.state.modal_nested_parent = false;
                    this.state.currentPage = this.state.lastData;
                    this.componentDidMount();
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data added";
                    this.state.modal_response = true;
                    this.resetAll();
                }else{
                    this.state.responseHeader = "Confirmation";
                    this.state.responseMessage = "Data failed to add";
                    this.state.modal_response = true;
                }
            }).catch(()=>
            {
                this.connectionOut("Can't reach the server", false)
            });                
        }
    }

    //edit fix
    editMasterMobil = (mobil_id, no_polisi, jenis_mobil, tgl_stnk, tgl_kir, no_rangka, no_mesin, keterangan, boxYN) => () => {
        if(tgl_stnk==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Tanggal STNK can't be empty!",
                modal_response: true
            });
        }
        else if(no_rangka==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"No. Rangka can't be empty!",
                modal_response: true
            });
        }
        else if(boxYN=="N"){   
            console.log("edit bukan mobil box masuk");
            var url = myUrl.url_updateMasterMobil;

            fetch(url, {
                method : 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Mobil_NoPolisi : no_polisi,
                    Mobil_Jenis : jenis_mobil,
                    Mobil_TglSTNK : tgl_stnk,
                    Mobil_TglKIR : "",
                    Mobil_NoRangka : no_rangka,
                    Mobil_NoMesin : no_mesin,
                    Mobil_Keterangan : keterangan,
                    Mobil_BoxYN : "N",
                    Mobil_ID : mobil_id
                }, console.log("masukk lahh"))
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
        else{
            console.log("edit mobil box masuk");
            var url =myUrl.url_updateMasterMobil;

            fetch(url, {
                method : 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Mobil_NoPolisi : no_polisi,
                    Mobil_Jenis : jenis_mobil,
                    Mobil_TglSTNK : tgl_stnk,
                    Mobil_TglKIR : tgl_kir,
                    Mobil_NoRangka : no_rangka,
                    Mobil_NoMesin : no_mesin,
                    Mobil_Keterangan : keterangan,
                    Mobil_BoxYN : "Y",
                    Mobil_ID : mobil_id
                }, console.log("Mobil boxlahh"))
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

    updateInputValue(evt) {
        console.log(evt.target.name)
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }

    //untuk date stnk
    handleChange = date => {
        this.setState({
          inputtedTglSTNK: dateFormat(date, "yyyy-mm-dd"),
          viewedTglSTNK: date
        }, () => console.log("tgl stnk: " + this.state.inputtedTglSTNK));
    };

    //untuk date kir
    handleChanges = date => {
        this.setState({
          inputtedTglKIR: dateFormat(date, "yyyy-mm-dd"),
          viewedTglKIR: date
        }, () => console.log("tgl kir: " + this.state.inputtedTglKIR));
    };

    //reset isi insert dan edit
    resetAll(){
        this.setState({
            inputtedNoPolisi: '',
            inputtedJenisMobil: '',
            inputtedTglSTNK: dateFormat(new Date(), "yyyy-mm-dd"),
            inputtedTglKIR: dateFormat(new Date(), "yyyy-mm-dd"),
            inputtedNoMesin: '',
            inputtedNoRangka: '',
            inputtedKeterangan: '',
            viewedTglKIR: new Date(),
            viewedTglSTNK: new Date()
        })
    }

    updateCheckedValue(evt) {
        // console.log(evt.target.name)
        // this.setState({
        //     [evt.target.name]: evt.target.checked
        // });

        if(evt.target.checked==true){
            this.setState({
                inputtedBoxYN : 'Y',
                disabledTglKIR: false
            }, () => console.log(this.state.inputtedBoxYN))

        }

        else{
            this.setState({
                inputtedBoxYN : 'N',
                disabledTglKIR: true
            }, () => console.log(this.state.inputtedBoxYN))
        }
    }

    updateSearchValue(evt){
        console.log(evt.target.value);
        this.setState({
            keyword: evt.target.value
        });
    }

    SearchMobil = param => () =>
    {
        this.setState({
            currentPage: 1
                    },() =>{
              
                  this.getTotalMobilPage();
              
          });
    } 

    //untuk ubah checkbox
    toggleChange = () => {
        this.setState({
          isChecked: !this.state.isChecked,
        });
    }

    openModalWithItemID(code, nopol, jenismobil, checkbx){
        this.setState({
            modal_nested_parent_edit: true,
            editCode: code,
            editnopol: nopol,
            editjenismobil: jenismobil,
            editcheckbox: checkbx,
            isChecked: (checkbx === "Y" ? true : false),
            disabledTglKIR: (checkbx === "N" ? true : false)
        }, () => console.log(this.state.editcheckbox))
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

    //search dropdown
    updateSelectionValue(evt){
        this.setState({
            [evt.target.name]: evt.target.value,
            selectedDropdown : evt.target.value
        });

        if(evt.target.value==="No. Polisi")
        {
            this.setState({
                searchType:"nopol",
                displayStatus: 'inline-flex'
            })   
        }

        else if(evt.target.value==="Jenis Mobil")
        {
            this.setState({
                searchType:"jenis",
                displayStatus: 'inline-flex'
            }) 
        }

        else if(evt.target.value==="Tanggal STNK"){
            this.setState({
                searchType:"tglSTNK",
                displayStatus: 'inline-flex'
            })
        }

        else if(evt.target.value==="Tanggal KIR"){
            this.setState({
                searchType:"tglKIR",
                displayStatus: 'inline-flex'
            })
        }

        else if(evt.target.value === "Show All"){
            this.setState({
                searchType: "all",
                displayStatus: 'none',
                keyword: ""
            },()=>{
                this.componentDidMount();
            });
        }

    }

    render() {
        const currentTodos = this.state.result.data;

        const renderTodos = currentTodos && currentTodos.map((todo) => {
            return<tr>
                <th scope="row">{todo.Mobil_NoPolisi}</th>
                <td className="py-3">{todo.Mobil_Jenis}</td>
                <td className="py-3">{todo.Mobil_TglSTNK}</td>
                <td className="py-3">{todo.Mobil_TglKIR}</td>
                <td className="py-3">{todo.Mobil_NoRangka}</td>
                <td>
                    <Button color="danger" size="sm" onClick={()=>this.openModalWithItemID(todo.Mobil_ID, todo.Mobil_NoPolisi, todo.Mobil_Jenis, todo.Mobil_BoxYN)}><MdEdit/></Button>
                </td>
            </tr>
            } ) ;

        return (
            <Page
                title="Mobil"
                breadcrumbs={[{ name: 'mobil', active: true }]}
                className="MobilPage"
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardHeader className="d-flex justify-content-between">
                                {/*<ButtonGroup>*/}
                                <UncontrolledButtonDropdown
                                style={{
                                    marginRight: "1.5vw"
                                }}
                                >
                                    <DropdownToggle caret name = "filtermenu" color = "primary">
                                    {this.state.selectedDropdown}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem value = "Show All" onClick = {evt => this.updateSelectionValue(evt)}>Show All</DropdownItem>
                                        <DropdownItem value = "No. Polisi" onClick = {evt => this.updateSelectionValue(evt)}>No. Polisi</DropdownItem>
                                        <DropdownItem value = "Jenis Mobil" onClick = {evt => this.updateSelectionValue(evt)}>Jenis Mobil</DropdownItem>
                                        <DropdownItem value = "Tanggal STNK" onClick = {evt => this.updateSelectionValue(evt)}>Tanggal STNK</DropdownItem>
                                        <DropdownItem value = "Tanggal KIR" onClick = {evt => this.updateSelectionValue(evt)}>Tanggal KIR</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                                <Input
                                    type="search"
                                    className="cr-search-form__input"
                                    placeholder="Search"
                                    onKeyPress={(e) => this.enterPressed(e,false)}
                                    style={{
                                        marginRight: "0.5vw",
                                        display: this.state.displayStatus
                                    }}
                                    onChange={evt => this.updateSearchValue(evt)}>
                                </Input>
                                <Button
                                  size="md"
                                  style={{
                                      marginRight: "0.5vw",
                                      display: this.state.displayStatus
                                  }}
                                  onClick={this.SearchMobil()}>
                                    <MdSearch/>
                                </Button>
                                <ButtonGroup>
                                    <Button size="sm" onClick={this.toggle('nested_parent')}>Add</Button>
                                </ButtonGroup>
                                <Modal
                                  isOpen={this.state.modal_nested_parent}
                                  toggle={this.toggle('nested_parent')}
                                  className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent')}>
                                        Add new car
                                    </ModalHeader>
                                    <ModalBody>
                                        <FormGroup check>
                                            <Label check>
                                                <Input type="checkbox" value={this.state.inputtedBoxYN} onChange={evt => this.updateCheckedValue(evt)} name="inputtedBoxYN"/>
                                                BOX
                                            </Label>
                                        </FormGroup>

                                        <Label>No. Polisi</Label>
                                        <Input type="nopolisi" value={this.state.inputtedNoPolisi} onChange={evt => this.updateInputValue(evt)} name="inputtedNoPolisi"/>
                                        
                                        <Label>Jenis Mobil</Label>
                                        <Input type="jenismobil" value={this.state.inputtedJenisMobil} onChange={evt => this.updateInputValue(evt)} name="inputtedJenisMobil"/>

                                        <Label>Tanggal STNK</Label>
                                        <br/>
                                        <DatePicker
                                            selected={this.state.viewedTglSTNK}
                                            type="tanggalstnk"
                                            value={this.state.viewedTglSTNK}
                                            onChange={this.handleChange} 
                                            name="inputtedTglSTNK"
                                        />
                                        <br/>
                                        <Label
                                        >Tanggal KIR</Label>
                                        <br/>
                                        <DatePicker
                                            disabled={this.state.disabledTglKIR}
                                            selected={this.state.viewedTglKIR}
                                            type="tanggalkir"
                                            value={this.state.viewedTglKIR}
                                            onChange={this.handleChanges}
                                            name="inputtedTglKIR"
                                        />
                                        {/* <Input style={{display: this.state.displayStatus}} type="tanggalkir" value={this.state.inputtedTglKIR} onChange={evt => this.updateInputValue(evt)} name="inputtedTglKIR"/> */}
                                        <br/>
                                        <Label>No. Rangka</Label>
                                        <Input type="norangka" value={this.state.inputtedNoRangka} onChange={evt => this.updateInputValue(evt)} name="inputtedNoRangka"/>

                                        <Label>No. Mesin</Label>
                                        <Input type="nomesin" value={this.state.inputtedNoMesin} onChange={evt => this.updateInputValue(evt)} name="inputtedNoMesin"/>

                                        <Label>Keterangan</Label>
                                        <Input type="keterangan" value={this.state.inputtedKeterangan} onChange={evt => this.updateInputValue(evt)} name="inputtedKeterangan" />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="info" onClick={this.toggle('nested')}>
                                            Save
                                        </Button>
                                        <Modal
                                          isOpen={this.state.modal_nested}
                                          toggle={this.toggle('nested')}
                                        >
                                            <ModalHeader>Confirmation</ModalHeader>
                                            <ModalBody>Are you sure to save the data?</ModalBody>
                                            <ModalFooter>
                                                <Button color="success" onClick={this.insertMasterMobil(this.state.inputtedNoPolisi, this.state.inputtedJenisMobil,
                                                        this.state.inputtedTglSTNK, this.state.inputtedTglKIR, this.state.inputtedNoRangka,
                                                        this.state.inputtedNoMesin, this.state.inputtedKeterangan, this.state.inputtedBoxYN
                                                    )}>
                                                    <MdCheckCircle/> Yes
                                                </Button>{' '}
                                                <Button
                                                    color="danger"
                                                    onClick={this.toggle('nested')}>
                                                    <MdHighlightOff/> No
                                                </Button>
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color="danger" onClick={this.toggle('nested_parent')}>
                                            Cancel
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                                <Modal
                                  //{this.setState({})}
                                  isOpen={this.state.modal_nested_parent_edit}
                                  toggle={this.toggle('nested_parent_edit')}
                                  className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent_edit')}>
                                        Edit Mobil
                                    </ModalHeader>
                                    <ModalBody>
                                        <FormGroup check>
                                                <Label check>
                                                    <Input type="checkbox" checked={this.state.isChecked} value={this.state.editcheckbox} onChange={this.toggleChange} name="inputtedBoxYN"/>
                                                    {/* onChange={evt => this.updateCheckedValue(evt)} */}
                                                    BOX
                                                </Label>
                                            </FormGroup>

                                            <Label>No. Polisi</Label>
                                            <Input disabled={this.state.disabledbNoPolisi} type="nopolisi" value={this.state.editnopol} onChange={evt => this.updateInputValue(evt)} name="inputtedNoPolisi"/>
                                            
                                            <Label>Jenis Mobil</Label>
                                            <Input disabled={this.state.disabledbNoPolisi} type="jenismobil" value={this.state.editjenismobil} onChange={evt => this.updateInputValue(evt)} name="inputtedJenisMobil"/>
                                            
                                            <Label>Tanggal STNK</Label>
                                            <br/>
                                            <DatePicker
                                                selected={this.state.viewedTglSTNK}
                                                type="tanggalstnk"
                                                value={this.state.viewedTglSTNK}
                                                onChange={this.handleChange} 
                                                name="inputtedTglSTNK"
                                            />
                                            <br/>
                                            <Label
                                            >Tanggal KIR</Label>
                                            <br/> 
                                            <DatePicker
                                                disabled={this.state.disabledTglKIR}
                                                selected={this.state.viewedTglKIR}
                                                type="tanggalkir"
                                                value={this.state.viewedTglKIR}
                                                onChange={this.handleChanges} 
                                                name="inputtedTglKIR"
                                            />
                                            {/* <Input style={{display: this.state.displayStatus}} type="tanggalkir" value={this.state.inputtedTglKIR} onChange={evt => this.updateInputValue(evt)} name="inputtedTglKIR"/> */}
                                            <br/>
 
                                            <Label>No. Rangka</Label>
                                            <Input type="norangka" value={this.state.inputtedNoRangka} onChange={evt => this.updateInputValue(evt)} name="inputtedNoRangka"/>

                                            <Label>No. Mesin</Label>
                                            <Input type="nomesin" value={this.state.inputtedNoMesin} onChange={evt => this.updateInputValue(evt)} name="inputtedNoMesin"/>

                                            <Label>Keterangan</Label>
                                            <Input type="keterangan" value={this.state.inputtedKeterangan} onChange={evt => this.updateInputValue(evt)} name="inputtedKeterangan" />
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
                                                <Button color="success" onClick={this.editMasterMobil(this.state.editCode, this.state.editnopol, this.state.editjenismobil,
                                                        this.state.inputtedTglSTNK, this.state.inputtedTglKIR, this.state.inputtedNoRangka,
                                                        this.state.inputtedNoMesin, this.state.inputtedKeterangan, this.state.editcheckbox
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
                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>No Polisi</th>
                                            <th>Jenis Mobil</th>
                                            <th>Tanggal STNK</th>
                                            <th>Tanggal KIR</th>
                                            <th>No Rangka</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTodos}
                                    </tbody>
                                </Table>

                                <hr/>

                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">Data / Page</InputGroupAddon>
                                    <select
                                    name="todosPerPage"
                                    style={{
                                        height: 'auto'
                                    }}
                                    value={this.state.todosPerPage}
                                    onChange={(e) => this.handleSelect(e)}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                    </select>
                                </InputGroup>

                                <br/>

                                <Form
                                inline
                                className="cr-search-form"
                                onSubmit={e => e.preventDefault()}
                                style={{
                                    justifyContent: "center"
                                }}
                                >
                                    <Button
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleWrite(e,-1, "first")}>First</Button>
                                    <Button
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleWrite(e,-1)}>Prev</Button>
                                    <form >
                                        <input
                                        type="text"
                                        placeholder="Page"
                                        value = {this.state.currentPage}
                                        onKeyPress={(e) => this.enterPressed(e,false)}
                                        onChange={(e) => this.handleWrite(e,0)}
                                        style={{
                                            width: '25px',
                                            height: '38px',
                                            textAlign: 'center'
                                        }}
                                        />
                                    </form>
                                    <Button
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleWrite(e,1)}>Next</Button>

                                    <Button
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleWrite(e,1, "last")}>Last</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Page>
        );
    }

    
}
export default MobilPage;
