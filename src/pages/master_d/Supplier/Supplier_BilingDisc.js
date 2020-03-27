import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
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

class Supplier_BillingDisc extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            result              : [],
            value               : 0,
            editValue           : 0,
            activeItemId        : this.props.activeItemId,
            activeItemName      :'',
            isCheckedBilDisc    : false,
            isCheckedFktDisc    : false,
            activeBilDiscEdit   : "N",
            activeFktDiscYN     : "N"
            
        };
    }
    
    connectionOut(message, render){
        console.log("masuk");
        if(render){
            this.setState({
                modal_response      : true,
                responseHeader      : "CONNECTION ERROR",
                responseMessage     : message
            },  () => this.componentDidMount())
        }else{
            this.setState({
                modal_response      : true,
                responseHeader      : "CONNECTION ERROR",
                responseMessage     : message
            })
        }
    }

    state = {
        modal_response     : false,
        responseHeader     : "",
        responseMessage    : "",
    };

    componentDidMount() {
        if(this.state.activeItemId !==-1){ 
           this.getBillingDiscSupplier();
        }
    }


    getBillingDiscSupplier()
    {   
        var payload = {
            Sup_Code  : this.state.activeItemId
            };
            const option = {
                method  : "POST",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                body: JSON.stringify(payload)
                }
                
                fetch("https://api.docnet.id/CHCMasterD/MasterSupplierBillingDiscount/TampilSupplierBillingDiscountbyCode",option)
                .then(response => response.json())
                .then(data =>{ 
                        console.log("panjang data : "+data.Data.length)
                        if(data.Data === null)  {
                            console.log("data billing disc kosong")             
                            this.setState({ 
                                result: [],
                                responseHeader  : "Billing Discount",
                                responseMessage : "Data Kosong, Silahkan Menambah Data",
                                modal_response  : true,
                                value           : 1,
                                editValue       : 0,
                            })
                        }
                        else{
                            console.log("data count : "+data.Data.length)
                            console.log("data tidak kosong")  
                            this.setState({ result: data.Data, isLoading: false})
                            this.state.result.map(supplier => 
                                this.setState({
                                    editValue                   : 1,
                                    activeNameEdit              : supplier.Sup_Name,
                                    activeBossNameEdit          : supplier.Sup_BossName,
                                    activeAlamatEdit            : supplier.Sup_Address,
                                    activeKotaCodeEdit          : supplier.Sup_CityCode,
                                    activeKodeposEdit           : supplier.Sup_PostalCode,
                                    activeKecamatanCodeEdit     : supplier.Sup_KecID,
                                    activePkpynEdit             : supplier.Sup_PKPYN,
                                    activeNPWPEdit              : supplier.Sup_NPWP,
                                    activeTglPengukuhanEdit     : supplier.Sup_TglPengukuhan,
                                    activePeriodeEdit           : supplier.Sup_PerRenew,
                                    activeTglPerjanjianEdit     : supplier.Sup_TglRenew,
                                    activeExpPerjanjianEdit     : supplier.Sup_ExpRenew,
                                    activeImportYNEdit          : supplier.Sup_ImportYN,
                                    activePajakYNEdit           : supplier.Sup_PajakYN,
                                    activeNamaPajakEdit         : supplier.Sup_NamaPajak,
                                    activeAlamatPajakEdit       : supplier.Sup_AlamatPajak,
                                    activeGrpDiscEdit           : supplier.Sup_GrpDisc,
                                    activePphYNEdit             : supplier.Sup_PphYN,       
                                    activeUangMukaYNEdit        : supplier.Sup_UangMukaYN,
                                    activeUangMukaYNEdit        : supplier.Sup_UangMukaYN,
                                    activeInternalYNEdit        : supplier.Sup_InternalYN,
                                    activeBilDiscEdit           : supplier.Sup_BilDiscYN,
                                    activeFktDiscYN             : supplier.Sup_FktDiscYN,
                                    isCheckedBilDisc            : (supplier.Sup_BilDiscYN === "Y" ? true : false),
                                    isCheckedFktDisc            : (supplier.Sup_FktDiscYN  === "Y" ? true : false)
                                })
                            )}
                    });
            
    }

    changeEditButton = () => {
        if(this.state.value === 0){
            this.setState({
                value: 1
            })
        }
        else if (this.state.value === 1){
            this.setState({
                value: 0
            })
        }
    }

    toggleChange = () => {
        this.setState({
          isChecked         : !this.state.isChecked,
          isCheckedBilDisc  : !this.state.isCheckedBilDisc,
          isCheckedFktDisc  : !this.state.isCheckedFktDisc
        });
    }

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateCheckedValue(type, e) {

        if(type === "Billing") {
            if(e.target.checked==true){
                this.setState({
                    activeBilDiscEdit : 'Y',
                    isCheckedBilDisc    : !this.state.isCheckedBilDisc,
                },()=>console.log("status Billing : " + this.state.activeBilDiscEdit));
                
            }
            else if(e.target.checked==false){
                this.setState({
                    activeBilDiscEdit : 'N',
                    isCheckedBilDisc    : !this.state.isCheckedBilDisc,
                },()=>console.log("status Billing : " + this.state.activeBilDiscEdit));
            }
        }
        else if (type === "Faktur") {
            if(e.target.checked==true){
                this.setState({
                    activeFktDiscYN : 'Y',
                    isCheckedFktDisc  : !this.state.isCheckedFktDisc,
                },()=>console.log("status Faktur : " + this.state.activeFktDiscYN));
                
            }
            else if(e.target.checked==false){
                this.setState({
                    activeFktDiscYN : 'N',
                    isCheckedFktDisc  : !this.state.isCheckedFktDisc,
                },()=>console.log("status Faktur : " + this.state.activeFktDiscYN));
            }
        }

    }

    handleChange = (type, event) => {
        if (type === "EditBilDisc"){
            this.setState({
            activeBilDiscEdit : event.target.value
            });
        }else if (type === "EditFktDisc"){
            this.setState({
            activeFktDiscYN : event.target.value
            });
        }
    }
    
    editBillingDiscSupplier  = () => {
        var successValidation = true;
        
        console.log("edit masuk");
        var url     = `https://api.docnet.id/CHCMasterD/MasterSupplierBillingDiscount/UbahSupplierBillingDiscount`;
        var payload = {
            Sup_UserID        : "123",
            Sup_Code          : this.state.activeItemId,
            Sup_BossName      : this.state.activeNameEdit,
            Sup_Address       : this.state.activeAlamatEdit,
            Sup_CityCode      : parseInt(this.state.activeKotaCodeEdit),
            Sup_PostalCode    : this.state.activeKodeposEdit,
            Sup_KecID         : parseInt(this.state.activeKecamatanCodeEdit),
            Sup_PKPYN         : this.state.activePkpynEdit,
            Sup_NPWP          : this.state.activeNPWPEdit,
            Sup_TglPengukuhan : this.state.activeTglPengukuhanEdit,
            Sup_TglRenew      : this.state.activeTglPerjanjianEdit,
            Sup_PerRenew      : this.state.activePeriodeEdit,
            Sup_ExpRenew      : this.state.activeExpPerjanjianEdit,
            Sup_ImportYN      : this.state.activeImportYNEdit,
            Sup_PajakYN       : this.state.activePajakYNEdit,
            Sup_NamaPajak     : this.state.activeNamaPajakEdit,
            Sup_AlamatPajak   : this.state.activeAlamatPajakEdit,
            Sup_BilDiscYN     : this.state.activeBilDiscEdit,
            Sup_FktDiscYN     : this.state.activeFktDiscYN,
            Sup_GrpDisc       : parseInt(this.state.activeGrpDiscEdit),
            Sup_PphYN         : this.state.activePphYNEdit,
            Sup_UangMukaYN    : this.state.activeUangMukaYNEdit,
            Sup_InternalYN    : this.state.activeInternalYNEdit
        }
        fetch(url, {
            method : "POST",
            body   : JSON.stringify(payload),
            json   : true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(response => {
                if (response.ResponseCode == "200") {
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan true : ")
                    this.state.modal_response  = true;  
                    this.componentDidMount();
                    this.state.responseHeader  = "Edit Data";
                    this.state.responseMessage = "Data berhasil diedit";            
                    this.changeEditButton()
                }
                else{
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan false : ")
                    this.state.modal_response  = true;
                    this.componentDidMount();
                    this.state.responseHeader  = "Edit Data";
                    this.state.responseMessage = "Tidak ada perubahan data";
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
    }

    toggle = modalType => () => {

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
        const { result, resultSellPack } = this.state;
        console.log(result)

        return (
            <Page
            title       = "Billing Discount"
            breadcrumbs = {[{ name: 'Supplier / Billing Discount', active: true }]}
            className   = "BillingDiscount">
                
            <CardHeader>
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>No. Supplier</Label>
                    </Col>
                    <Col xs = {2} md = {9}>
                        <Input type = "Code" value = {this.state.activeItemId} onChange = {(e) => this.updateInputValue("Code",e)} name = "code" placeholder = "Code" disabled/>
                    </Col>
                </Row>
            </CardHeader>

            <CardBody>

                 <Modal
                        isOpen={this.state.modal_response}
                    >
                        <ModalHeader>
                            {this.state.responseHeader}
                        </ModalHeader>
                        <ModalBody>
                            {this.state.responseMessage}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={ () => { this.setState({ modal_response: false}) } }>OK</Button>
                        </ModalFooter>
                 </Modal>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Prgoram Discount</Label>
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {2} md = {4}>
                    {
                            this.state.activeItemId == -1
                            ?
                            <Input type = "checkbox" checked = {this.state.isCheckedBilDisc} style={{marginLeft: "5px"}} value = {this.state.activeBilDiscEdit} onChange={e => this.updateCheckedValue("Billing",e)} name = "Billing" placeholder = "Billing" />
                            :
                                this.state.value == 1
                                ?
                                <Input type = "checkbox" checked = {this.state.isCheckedBilDisc} style={{marginLeft: "5px"}} value = {this.state.activeBilDiscEdit} onChange={e => this.updateCheckedValue("Billing",e)} name = "Billing" placeholder = "Billing" />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedBilDisc} style={{marginLeft: "5px"}} value = {this.state.activeBilDiscEdit} onChange={e => this.updateCheckedValue("Billing",e)} name = "Billing" placeholder = "Billing" disabled/>                        
                        }
                        <Label style={{marginLeft: "20px"}}>Pisah Billing</Label>
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {2} md = {4}>
                        {
                            this.state.activeItemId == -1
                            ?
                            <Input type = "checkbox" checked = {this.state.isCheckedFktDisc} style={{marginLeft: "5px"}} value = {this.state.activeFktDiscYN} onChange={e => this.updateCheckedValue("Faktur",e)} name = "Faktur" placeholder = "Faktur" />
                            :
                                this.state.value == 1
                                ?
                                <Input type = "checkbox" checked = {this.state.isCheckedFktDisc} style={{marginLeft: "5px"}} value = {this.state.activeFktDiscYN} onChange={e => this.updateCheckedValue("Faktur",e)} name = "Faktur" placeholder = "Faktur" />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedFktDisc} style={{marginLeft: "5px"}} value = {this.state.activeFktDiscYN} onChange={e => this.updateCheckedValue("Faktur",e)} name = "Faktur" placeholder = "Faktur" disabled/>                        
                        }
                        <Label style={{marginLeft: "20px"}}>Pisah Faktur</Label>
                    </Col>
                </Row>     
            </CardBody>
            
            <CardFooter>
            {this.state.activeItemId === -1
                            ?
                                <div style={{
                                    textAlign:"center",
                                    justifyContent:"center",
                                    marginBottom: "20px"
                                }}
                                >
                                    <Button size="sm"
                                    style={{
                                        display: "inline-flex", 
                                        alignItems: "center",
                                        marginRight: "1%",
                                    }}
                                    onClick = {()=> this.editBillingDiscSupplier(this.state.activeItemId)}
                                    >
                                        <MdSave
                                        style = {{
                                            marginRight: "7px"
                                        }}
                                        />Save
                                    </Button>

                                    <Button
                                    size="sm"
                                    style={{
                                        display: "inline-flex", 
                                        alignItems: "center",
                                        marginLeft: "1%",
                                    }}
                                    onClick={()=>this.props.func()}
                                    >
                                        <MdCancel
                                        style = {{
                                            marginRight: "7px"
                                        }}
                                        />Cancel
                                    </Button>
                                </div>

                            :

                                this.state.value === 0
                                ?
                                <div
                                style={{
                                    textAlign:"center",
                                    justifyContent:"center",
                                    marginBottom: "20px"
                                }}
                                >
                                    <Button
                                    size="sm"
                                    style={{
                                        display: "inline-flex", 
                                        alignItems: "center",
                                        marginRight: "1%",
                                    }}
                                    onClick = {() => this.changeEditButton()}
                                    >
                                        <MdEdit
                                        style = {{
                                            marginRight: "7px"
                                        }}
                                        />Edit
                                    </Button>

                                    <Button
                                    size="sm"
                                    style={{
                                        display: "inline-flex", 
                                        alignItems: "center",
                                        marginLeft: "1%",
                                    }}
                                    onClick={()=>this.props.func()}
                                    >
                                        <MdCancel
                                        style = {{
                                            marginRight: "7px"
                                        }}
                                        />Cancel
                                    </Button>
                                </div>

                                :

                                this.state.value === 1 
                                &&
                                <div
                                style={{
                                    textAlign:"center",
                                    justifyContent:"center",
                                    marginBottom: "20px"
                                }}
                                >
                                    <Button
                                    size="sm"
                                    style={{
                                        display: "inline-flex", 
                                        alignItems: "center",
                                        marginRight: "1%",
                                    }}
                                    onClick = {()=> this.editBillingDiscSupplier(this.state.activeItemId)}
                                    >
                                        <MdSave
                                        style = {{
                                            marginRight: "7px"
                                        }}
                                        />Save
                                    </Button>

                                    <Button
                                    size="sm"
                                    style={{
                                        display: "inline-flex", 
                                        alignItems: "center",
                                        marginLeft: "1%",
                                    }}
                                    onClick={()=>this.props.func()}
                                    >
                                        <MdCancel
                                        style = {{
                                            marginRight: "7px"
                                        }}
                                        />Cancel
                                    </Button>
                                </div>
                        }
            </CardFooter>       
            </Page>
        );
    }
}
export default Supplier_BillingDisc;
