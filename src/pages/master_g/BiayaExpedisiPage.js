import Page from 'components/Page';
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from 'dateformat';
import React from 'react';
import * as myUrl from '../urlLinkMasterG';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, ButtonGroup, InputGroup,
    InputGroupAddon, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown
} from 'reactstrap';
import Select from 'react-select';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdSearch, MdDelete, MdEdit} from 'react-icons/md';

class BiayaExpedisiPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            todos:[],
            listekspedisi:[],
            listarea:[],
            isLoading: false,
            inputtedExpedisi: '',
            inputtedArea: '',
            inputtedNamaExpedisi: '',
            inputtedKota: '',
            inputtedRegular: '',
            inputtedExpress: '',
            inputtedMinKirimReg: '',
            inputtedMinKirimExp: '',
            inputtedMinRegular: '',
            inputtedMinExpress: '',
            inputtedLeadTimeReg: '',
            inputtedLeadTimeExp: '',
            inputtedVolReg: '',
            inputtedVolExp: '',
            inputtedMinTerimaExp: '',
            inputtedMinTerimaReg: '',
            inputtedDisc: '',
            inputtedPPN: '',
            editCode: '',
            editnopol: '',
            editcheckbox: '',
            detailid: '',
            detailarea: '',
            detailnama: '',
            detailkota: '',
            searchType:"all",
            expedisi: "FeeExp_KodeEx",
            area: "FeeExp_Area",
            keyword:"",
            currentPage: 1,
            todosPerPage: 5,
            totalData:0,
            flag:0,
            currentData: 0,
            lastData: 0,
            selectedDropdown: "Show All",
            selectedOption: null,
            isChecked: true,
            isDisabled: true,
            isEditHidden: false,
            isSaveHidden: true,
            displayStatus: "none"
        };
    }

    componentDidMount() {
        //this.setState.isLoading=true;
        this.getTotalBiayaExpedisiPage();
        this.getAllNamaKota();
        this.getAllKodeEkspedisi();
    }

    //function connection out
    connectionOut(message, render){
        if(render){
            this.setState({
                modal_backdrop: false,
                modal_nested_parent: false,
                modal_nested_parent_edit: false,
                modal_nested_parent_detail: false,
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
                modal_nested_parent_detail: false,
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
            // this.getListbyPaging(1,this.state.todosPerPage);
            this.componentDidMount();
        });
        console.log(event.target.value);
        console.log(event.target.name);
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
                this.getTotalBiayaExpedisiPage();
            });
        } 
    }

    getTotalBiayaExpedisiPage(){
        const kword = this.state.keyword;
        const typeex = this.state.searchType;
        const currLimit = this.state.todosPerPage; 

        const urlA=myUrl.url_getTotalBiayaExpedisiPage;
        var payload = {
            keyword: kword,
            limit : currLimit.toString(),
            type : typeex
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
        const typeex = this.state.searchType;
            const urlA=myUrl.url_getBiayaExpedisiList;
                var payload = {
                    type: typeex,
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

    getAllNamaKota(){
        const url=myUrl.url_getAllNamaKota;
        fetch(url)
            .then(response => response.json())
            .then(data =>{
                console.log(data)
                if(data==0){
                    this.setState({
                        responseHeader: "Alert!!!",
                        responseMessage: "Data is empty!",
                        modal_response: true,
                        listarea: data.data,
                        isLoading: false
                    });
                }
                else{
                    this.setState({listarea: data.data});
                }
            }, ()=> this.connectionOut("Can't reach the server", false));
    }

    getAllKodeEkspedisi(){
        const kword = this.state.keyword;
        const currLimit = this.state.todosPerPage;
        const url=myUrl.url_getAllKodeExpedisi;
        fetch(url)
            .then(response => response.json())
            .then(data =>{
                console.log(data)
                if(data==0){
                    this.setState({
                        responseHeader: "Alert!!!",
                        responseMessage: "Data is empty!",
                        modal_response: true,
                        listekspedisi: data.data,
                        isLoading: false
                    });
                }
                else{
                    this.setState({listekspedisi: data.data} );
                }
            }, ()=> this.connectionOut("Can't reach the server", false));
    }

    insertMasterBiayaExpedisi = (id, area, nama, kota, regular, express, mkr, mke, mr, me, ltg, 
        lte, vr, ve, mtr, mte, disc, ppn) => () => {
        if(id == ""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Expedisi can't be empty!",
                modal_response: true
            });
            
            console.log(this.state.modal_response);
        }
        else if(area==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Area can't be empty!",
                modal_response: true
            });
        }
        else if(nama==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Name can't be empty!",
                modal_response: true
            });
        }
        else if(kota==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"City can't be empty!",
                modal_response: true
            });
        }
        else if(regular==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Regular can't be empty!",
                modal_response: true
            });
        }
        else if(express==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Express can't be empty!",
                modal_response: true
            });
        }
        else if(mkr==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Min Kirim Reg can't be empty!",
                modal_response: true
            });
        }
        else if(mke==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Min Kirim Exp can't be empty!",
                modal_response: true
            });
        }
        else if(mr==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Min Regular can't be empty!",
                modal_response: true
            });
        }
        else if(me==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Min Express can't be empty!",
                modal_response: true
            });
        }
        else if(ltg==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Lead Time Reg can't be empty!",
                modal_response: true
            });
        }
        else if(lte==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Lead Time Exp can't be empty!",
                modal_response: true
            });
        }
        else if(vr==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Vol / Reg can't be empty!",
                modal_response: true
            });
        }
        else if(ve==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Vol / Exp can't be empty!",
                modal_response: true
            });
        }
        else if(mtr==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Min Terima Reg can't be empty!",
                modal_response: true
            });
        }
        else if(mte==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Min Terima Exp can't be empty!",
                modal_response: true
            });
        }
        else if(disc==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"Disc can't be empty!",
                modal_response: true
            });
        }
        else if(ppn==""){
            this.setState({
                responseHeader: "Warning!!!",
                responseMessage:"PPN can't be empty!",
                modal_response: true
            });
        }
        else{   
            console.log("insert masuk");
            var url = myUrl.url_addBiayaExpedisi;

            fetch(url, {
                method : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    FeeExp_KodeEx : id,
                    FeeExp_Area : area,
                    nmex_nama  : nama,
                    FeeExp_Lokasi2 : kota,
                    FeeExp_Regular  : regular,
                    FeeExp_Express : express,
                    FeeExp_MinKrm  : mkr,
                    FeeExp_MinKrmExp  : mke,
                    FeeExp_Kg15l  : mr,
                    FeeExp_MinExp : me, 
                    FeeExp_LeadTime : ltg, 
                    FeeExp_LeadTimeExp : lte, 
                    FeeExp_FeeRgl : vr,
                    FeeExp_FeeExp : ve, 
                    FeeExp_MinTrm : mtr, 
                    FeeExp_MinTrmExp : mte,
                    FeeExp_Disc : disc, 
                    FeeExp_PPN : ppn,
                    FeeExp_RunningId : "1"
                }, console.log(id, area, nama, kota, regular, express, mkr, mke, mr, me, ltg, lte, vr,ve, mtr, mte, disc, ppn))
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

    resetAll(){
        this.setState({
            inputtedExpedisi: '',
            inputtedArea: '',
            inputtedNamaExpedisi: '',
            inputtedKota: '',
            inputtedRegular: '',
            inputtedExpress: '',
            inputtedMinKirimReg: '',
            inputtedMinKirimExp: '',
            inputtedMinRegular: '',
            inputtedMinExpress: '',
            inputtedLeadTimeReg: '',
            inputtedLeadTimeExp: '',
            inputtedVolReg: '',
            inputtedVolExp: '',
            inputtedMinTerimaExp: '',
            inputtedMinTerimaReg: '',
            inputtedDisc: '',
            inputtedPPN: '',
        })
    }

    //edit fix
    editMasterBiayaExpedisi = (id, area, nama, kota, regular, express, mkr, mke, mr, me, ltg, 
        lte, vr, ve, mtr, mte, disc, ppn) => () => {
        
         
        console.log("edit masuk");
        var url = myUrl.url_editBiayaExpedisi;

        fetch(url, {
            method : 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                FeeExp_KodeEx : id,
                FeeExp_Area : area,
                nmex_nama  : nama,
                FeeExp_Lokasi2 : kota,
                FeeExp_Regular  : regular,
                FeeExp_Express : express,
                FeeExp_MinKrm  : mkr,
                FeeExp_MinKrmExp  : mke,
                FeeExp_Kg15l  : mr,
                FeeExp_MinExp : me, 
                FeeExp_LeadTime : ltg, 
                FeeExp_LeadTimeExp : lte, 
                FeeExp_FeeRgl : vr,
                FeeExp_FeeExp : ve, 
                FeeExp_MinTrm : mtr, 
                FeeExp_MinTrmExp : mte,
                FeeExp_Disc : disc, 
                FeeExp_PPN : ppn,
            }, console.log("masukk lahh"))
        }).then(response => {
            if (response.ok) {
                this.state.modal_nested_parent_detail = false;
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

    updateInputValue(evt) {
        console.log(evt.target.name)
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }


    updateSearchValue(evt){
        console.log(evt.target.value);
        this.setState({
            keyword: evt.target.value
        });
    }

    SearchBiayaExpedisi = param => () =>
    {
        this.setState({
            currentPage: 1
                    },() =>{
                  this.getTotalBiayaExpedisiPage();
              
          });
    } 

    openEdit(){
        this.setState({
            isDisabled:false,
            isEditHidden: true,
            isSaveHidden: false
        })
    }

    closeEdit(){
        this.setState({
            modal_nested_parent_edit: false,
            modal_nested_parent_detail: true
        })
    }

    openModalDetail(id, area, nama, kota, regular, express, mkr, mke, mr, me, ltg, 
            lte, vr, ve, mtr, mte, disc, ppn
        ){
        this.setState({
            modal_nested_parent_detail: true,
            detailid: id,
            detailarea: area,
            detailnama: nama,
            detailkota: kota,
            inputtedRegular: regular,
            inputtedExpress: express,
            inputtedMinKirimReg: mkr,
            inputtedMinKirimExp: mke,
            inputtedMinRegular: mr,
            inputtedMinExpress: me,
            inputtedLeadTimeReg: ltg,
            inputtedLeadTimeExp: lte,
            inputtedVolReg: vr,
            inputtedVolExp: ve,
            inputtedMinTerimaReg: mtr,
            inputtedMinTerimaExp: mte,
            inputtedDisc: disc,
            inputtedPPN: ppn
        })
    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested_parent_edit: false,
        modal_nested_parent_detail: false,
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
            isDisabled: true,
            isSaveHidden: true,
            isEditHidden: false,
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    updateOptionSelected(type, evt){
        if(type === "expedisi"){
            const expedisi_array = evt.value.split(" - ")
            this.setState({
                inputtedExpedisi: expedisi_array[0],
                inputtedNamaExpedisi: expedisi_array[1]
            })
        }else if(type === "area"){
            const area_array = evt.value.split(" - ")
            this.setState({
                inputtedArea: area_array[0],
                inputtedKota: area_array[1]
            })
        }
    }

    //search dropdown
    updateSelectionValue(evt){
        this.setState({
            [evt.target.name]: evt.target.value,
            selectedDropdown : evt.target.value
        });

        if(evt.target.value==="Nama Kota")
        {
            this.setState({
                searchType:"namaKota",
                displayStatus: 'inline-flex'
            })   
        }

        else if(evt.target.value==="Kode Ekspedisi")
        {
            this.setState({
                searchType:"code",
                displayStatus: 'inline-flex'
            }) 
        }

        else if(evt.target.value === "Show All"){
            this.setState({
                searchType: "all",
                displayStatus: 'none',
                keyword: "",
            },()=>{
                this.componentDidMount();
            });
        }
    }

    render() {
        const currentTodos = this.state.result.data;

        const renderTodos = currentTodos && currentTodos.map((todo) => {
            return<tr>
                <th scope="row">{todo.FeeExp_KodeEx}</th>
                <td className="py-3">{todo.FeeExp_Area}</td>
                <td className="py-3">{todo.nmex_nama}</td>
                <td className="py-3">{todo.FeeExp_Lokasi2}</td>
                <td>
                    <Button color="info" size="sm" onClick={()=>this.openModalDetail(
                            todo.FeeExp_KodeEx, todo.FeeExp_Area, todo.nmex_nama, todo.FeeExp_Lokasi2,
                            todo.FeeExp_Regular, todo.FeeExp_Express,
                            todo.FeeExp_MinKrm, todo.FeeExp_MinKrmExp,
                            todo.FeeExp_Kg15l, todo.FeeExp_MinExp,
                            todo.FeeExp_LeadTime, todo.FeeExp_LeadTimeExp,
                            todo.FeeExp_FeeRgl, todo.FeeExp_FeeExp,
                            todo.FeeExp_MinTrm, todo.FeeExp_MinTrmExp,
                            todo.FeeExp_Disc, todo.FeeExp_PPN
                        )}>Detail</Button>
                </td>
            </tr>
            } ) ;

        return (
            <Page
                title="Biaya Expedisi"
                breadcrumbs={[{ name: 'biayaexpedisi', active: true }]}
                className="BiayaExpedisiPage"
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
                                        <DropdownItem value = "Nama Kota" onClick = {evt => this.updateSelectionValue(evt)}>Nama Kota</DropdownItem>
                                        <DropdownItem value = "Kode Ekspedisi" onClick = {evt => this.updateSelectionValue(evt)}>Kode Ekspedisi</DropdownItem>
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
                                  onClick={this.SearchBiayaExpedisi()}>
                                    <MdSearch/>
                                </Button>
                                <ButtonGroup>
                                    <Button size="sm" onClick={this.toggle('nested_parent')}>Add</Button>
                                </ButtonGroup>
                                <Modal
                                  isOpen={this.state.modal_nested_parent}
                                  toggle={this.toggle('nested_parent')}
                                  className={this.props.className}
                                  size="lg"
                                  >
                                    <ModalHeader toggle={this.toggle('nested_parent')}>
                                        Add New Biaya Expedisi
                                    </ModalHeader>
                                    <ModalBody
                                    >
                                        <Table>
                                            <tr>
                                                <th style={{width: "30%"}} >
                                                    <Label>Expedisi</Label>
                                                </th>
                                                <td style={{width: "70%"}}>
                                                    {this.state.selectedOption}
                                                    <Select
                                                        name="expedisi"
                                                        options={this.state.listekspedisi}
                                                        onChange={evt => this.updateOptionSelected('expedisi', evt)} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th style={{width: "30%"}}>
                                                    <Label>Area</Label>
                                                </th>
                                                <td style={{width: "70%"}}>
                                                    <Select
                                                        name="area"
                                                        options={this.state.listarea}
                                                        onChange={evt => this.updateOptionSelected('area', evt)}/>
                                                </td>
                                            </tr>
                                        </Table>

                                        <Table>
                                            <tr>
                                                <th style={{width: "20%"}}>
                                                    <Label>Regular</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedRegular} type="regular" onChange={evt => this.updateInputValue(evt)} name="inputtedRegular"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>Rp</Label>
                                                </th>

                                                <th style={{width: "20%"}}>
                                                    <Label>Vol/Reg</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedVolReg} type="vr" onChange={evt => this.updateInputValue(evt)} name="inputtedVolReg"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>Rp</Label>
                                                </th>
                                            </tr>

                                            <tr>
                                                <th style={{width: "20%"}}>
                                                    <Label>Express</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedExpress} type="express" onChange={evt => this.updateInputValue(evt)} name="inputtedExpress"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>Rp</Label>
                                                </th>

                                                <th style={{width: "20%"}}>
                                                    <Label>Vol/Exp</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedVolExp} type="ve" onChange={evt => this.updateInputValue(evt)} name="inputtedVolExp"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>Rp</Label>
                                                </th>
                                            </tr>

                                            <tr>
                                                <th style={{width: "20%"}}>
                                                    <Label>Min Kirim Reg</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedMinKirimReg} type="mkr" onChange={evt => this.updateInputValue(evt)} name="inputtedMinKirimReg"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>Kg</Label>
                                                </th>

                                                <th style={{width: "20%"}}>
                                                    <Label>Min Terima Reg</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedMinTerimaReg} type="mtr" onChange={evt => this.updateInputValue(evt)} name="inputtedMinTerimaReg"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>Kg</Label>
                                                </th>
                                            </tr>

                                            <tr>
                                                <th style={{width: "20%"}}>
                                                    <Label>Min Kirim Exp</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedMinKirimExp} type="mke" onChange={evt => this.updateInputValue(evt)} name="inputtedMinKirimExp"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>Kg</Label>
                                                </th>

                                                <th style={{width: "20%"}}>
                                                    <Label>Min Terima Exp</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedMinTerimaExp} type="mte" onChange={evt => this.updateInputValue(evt)} name="inputtedMinTerimaExp"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>Kg</Label>
                                                </th>
                                            </tr>

                                            <tr>
                                                <th style={{width: "20%"}}>
                                                    <Label>Min Regular</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedMinRegular} type="mr" onChange={evt => this.updateInputValue(evt)} name="inputtedMinRegular"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>Rp</Label>
                                                </th>

                                                <th style={{width: "20%"}}>
                                                    <Label>Disc</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedDisc} type="disc" onChange={evt => this.updateInputValue(evt)} name="inputtedDisc"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>%</Label>
                                                </th>
                                            </tr>

                                            <tr>
                                                <th style={{width: "20%"}}>
                                                    <Label>Min Express</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedMinExpress} type="me" onChange={evt => this.updateInputValue(evt)} name="inputtedMinExpress"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>Rp</Label>
                                                </th>

                                                <th style={{width: "20%"}}>
                                                    <Label>PPN</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedPPN} type="ppn" onChange={evt => this.updateInputValue(evt)} name="inputtedPPN"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>%</Label>
                                                </th>
                                            </tr>

                                            <tr>
                                                <th style={{width: "20%"}}>
                                                    <Label>Lead Time Reg</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedLeadTimeReg} type="ltr" onChange={evt => this.updateInputValue(evt)} name="inputtedLeadTimeReg"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>Hari</Label>
                                                </th>
                                            </tr>

                                            <tr>
                                                <th style={{width: "20%"}}>
                                                    <Label>Lead Time Exp</Label>
                                                </th>
                                                <td style={{width: "25%"}}>
                                                    <Input value={this.state.inputtedLeadTimeExp} type="lte" onChange={evt => this.updateInputValue(evt)} name="inputtedLeadTimeExp"/>
                                                </td>
                                                <th style={{width: "5%"}}>
                                                    <Label>Hari</Label>
                                                </th>
                                            </tr>
                                        </Table>
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
                                                <Button color="success" onClick={this.insertMasterBiayaExpedisi(this.state.inputtedExpedisi, this.state.inputtedArea, this.state.inputtedNamaExpedisi,
                                                        this.state.inputtedKota, this.state.inputtedRegular, this.state.inputtedExpress,
                                                        this.state.inputtedMinKirimReg, this.state.inputtedMinKirimExp, this.state.inputtedMinRegular, this.state.inputtedMinExpress,
                                                        this.state.inputtedLeadTimeReg, this.state.inputtedLeadTimeExp, this.state.inputtedVolReg,
                                                        this.state.inputtedVolExp, this.state.inputtedMinTerimaReg, this.state.inputtedMinTerimaExp,
                                                        this.state.inputtedDisc, this.state.inputtedPPN
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
                                  isOpen={this.state.modal_nested_parent_detail}
                                  toggle={this.toggle('nested_parent_detail')}
                                  className={this.props.className}
                                  size="lg">
                                    <ModalHeader toggle={this.toggle('nested_parent_detail')}>
                                        Biaya Expedisi Detail
                                    </ModalHeader>
                                    <ModalBody>
                                    <Table>
                                        <tr>
                                            <th style={{width: "20%"}}>
                                                <Label>Kode Expedisi</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled="true" type="expedisi" value={this.state.detailid} onChange={evt => this.updateInputValue(evt)} name="inputtedExpedisi"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                            </th>

                                            <th style={{width: "20%"}}>
                                                <Label>Nama Expedisi</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                            <Input disabled="true" type="nama" value={this.state.detailnama} onChange={evt => this.updateInputValue(evt)} name="inputtedNamaExpedisi"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                            </th>
                                        </tr>

                                        <tr>
                                            <th style={{width: "20%"}}>
                                                <Label>Kode Area</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled="true" type="area" value={this.state.detailarea} onChange={evt => this.updateInputValue(evt)} name="inputtedArea"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                            </th>

                                            <th style={{width: "20%"}}>
                                                <Label>Kota</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled="true" type="kota" value={this.state.detailkota} onChange={evt => this.updateInputValue(evt)} name="inputtedKota"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                            </th>
                                        </tr>

                                        <tr>
                                            <th style={{width: "20%"}}>
                                                <Label>Regular</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedRegular} type="regular" onChange={evt => this.updateInputValue(evt)} name="inputtedRegular"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>Rp</Label>
                                            </th>

                                            <th style={{width: "20%"}}>
                                                <Label>Vol/Reg</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedVolReg} type="vr" onChange={evt => this.updateInputValue(evt)} name="inputtedVolReg"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>Rp</Label>
                                            </th>
                                        </tr>

                                        <tr>
                                            <th style={{width: "20%"}}>
                                                <Label>Express</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedExpress} type="express" onChange={evt => this.updateInputValue(evt)} name="inputtedExpress"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>Rp</Label>
                                            </th>

                                            <th style={{width: "20%"}}>
                                                <Label>Vol/Exp</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedVolExp} type="ve" onChange={evt => this.updateInputValue(evt)} name="inputtedVolExp"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>Rp</Label>
                                            </th>
                                        </tr>

                                        <tr>
                                            <th style={{width: "20%"}}>
                                                <Label>Min Kirim Reg</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedMinKirimReg} type="mkr" onChange={evt => this.updateInputValue(evt)} name="inputtedMinKirimReg"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>Kg</Label>
                                            </th>

                                            <th style={{width: "20%"}}>
                                                <Label>Min Terima Reg</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedMinTerimaReg} type="mtr" onChange={evt => this.updateInputValue(evt)} name="inputtedMinTerimaReg"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>Kg</Label>
                                            </th>
                                        </tr>

                                        <tr>
                                            <th style={{width: "20%"}}>
                                                <Label>Min Kirim Exp</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedMinKirimExp} type="mke" onChange={evt => this.updateInputValue(evt)} name="inputtedMinKirimExp"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>Kg</Label>
                                            </th>

                                            <th style={{width: "20%"}}>
                                                <Label>Min Terima Exp</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedMinTerimaExp} type="mte" onChange={evt => this.updateInputValue(evt)} name="inputtedMinTerimaExp"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>Kg</Label>
                                            </th>
                                        </tr>

                                        <tr>
                                            <th style={{width: "20%"}}>
                                                <Label>Min Regular</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedMinRegular} type="mr" onChange={evt => this.updateInputValue(evt)} name="inputtedMinRegular"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>Rp</Label>
                                            </th>

                                            <th style={{width: "20%"}}>
                                                <Label>Disc</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedDisc} type="disc" onChange={evt => this.updateInputValue(evt)} name="inputtedDisc"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>%</Label>
                                            </th>
                                        </tr>

                                        <tr>
                                            <th style={{width: "20%"}}>
                                                <Label>Min Express</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedMinExpress} type="me" onChange={evt => this.updateInputValue(evt)} name="inputtedMinExpress"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>Rp</Label>
                                            </th>

                                            <th style={{width: "20%"}}>
                                                <Label>PPN</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedPPN} type="ppn" onChange={evt => this.updateInputValue(evt)} name="inputtedPPN"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>%</Label>
                                            </th>
                                        </tr>

                                        <tr>
                                            <th style={{width: "20%"}}>
                                                <Label>Lead Time Reg</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedLeadTimeReg} type="ltr" onChange={evt => this.updateInputValue(evt)} name="inputtedLeadTimeReg"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>Hari</Label>
                                            </th>
                                        </tr>

                                        <tr>
                                            <th style={{width: "20%"}}>
                                                <Label>Lead Time Exp</Label>
                                            </th>
                                            <td style={{width: "25%"}}>
                                                <Input disabled={this.state.isDisabled} value={this.state.inputtedLeadTimeExp} type="lte" onChange={evt => this.updateInputValue(evt)} name="inputtedLeadTimeExp"/>
                                            </td>
                                            <th style={{width: "5%"}}>
                                                <Label>Hari</Label>
                                            </th>
                                        </tr>
                                    </Table>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button hidden={this.state.isEditHidden} color="danger" onClick={()=>this.openEdit()}>
                                            <MdEdit/>
                                        </Button>
                                        <Button hidden={this.state.isSaveHidden} color="info" onClick={this.toggle('nested_edit')}>
                                            Save
                                        </Button>
                                        {' '}
                                        <Button color="info" onClick={this.toggle('nested_parent_detail')}>
                                            Back
                                        </Button>
                                        <Modal
                                          isOpen={this.state.modal_nested_edit}
                                          toggle={this.toggle('nested_edit')}
                                        >
                                            <ModalHeader>Confirmation</ModalHeader>
                                            <ModalBody>Are you sure to save the data?</ModalBody>
                                            <ModalFooter>
                                                <Button color="success" onClick={this.editMasterBiayaExpedisi(this.state.detailid, this.state.detailarea, this.state.detailnama,
                                                        this.state.detailkota, this.state.inputtedRegular, this.state.inputtedExpress,
                                                        this.state.inputtedMinKirimReg, this.state.inputtedMinKirimExp, this.state.inputtedMinRegular, this.state.inputtedMinExpress,
                                                        this.state.inputtedLeadTimeReg, this.state.inputtedLeadTimeExp, this.state.inputtedVolReg,
                                                        this.state.inputtedVolExp, this.state.inputtedMinTerimaReg, this.state.inputtedMinTerimaExp,
                                                        this.state.inputtedDisc, this.state.inputtedPPN
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
                                            <th>Expedisi</th>
                                            <th>Area</th>
                                            <th>Nama</th>
                                            <th>Kota</th>
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
export default BiayaExpedisiPage;
//untuk amp
//export const config = {amp : true}
