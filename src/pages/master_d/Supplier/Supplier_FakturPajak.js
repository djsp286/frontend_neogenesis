import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import dateFormat from 'dateformat';
import InputMask from "react-input-mask";
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, Nav, Form,
    Navbar,UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup,InputGroup, InputGroupAddon, FormGroup, CardFooter
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdAdd, MdDelete, MdSearch, MdEdit, MdCancel, MdSave } from 'react-icons/md';
import { runInThisContext } from 'vm';
import { withRouter } from 'react-router-dom';

class Supplier_FakturPajak extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            result          : [],
            value           : 0,
            activeItemId    : this.props.activeItemId,
            activeItemName  : '',
            isCheckedPajak  : false,
            isCheckedPKP    : false,
            isCheckedPph    : false,
            activePajakYNEdit : "N",
            activePKPYNEdit : "N",
            activePphYNEdit : "N",
            activeTglPengukuhanEdit : dateFormat(new Date, "yyyy-mm-dd"),            
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
            this.getSupplierFakturPajak()
        }
    }


    getSupplierFakturPajak()
    {   
        var payload = {
            Sup_Code  : this.state.activeItemId
            };
            const option = {
                method  : "POST",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8",
                        "Authorization" : ""
                        },
                body: JSON.stringify(payload)
                }
                
                fetch("https://api.docnet.id/CHCMasterD/MasterSupplierFakturPajak/TampilSupplierFakturPajakbyCode",option)
                .then(response => response.json())
                .then(data =>{ 
                        if(data.Data === null)  {
                            console.log("data kosong")             
                            this.setState({ result: [], isLoading: false})
                            this.connectionOut("Can't reach the server", false)
                        }
                        else{
                            console.log("data tidak kosong")  
                            this.setState({ result: data.Data, isLoading: false})
                            console.log(this.state.result)
                            console.log("tanggal pengukuhan : "+data.Data[0].Sup_TglPengukuhan)
                            if(data.Data[0].Sup_TglPengukuhan == "0000-00-00 00:00:00"){
                                this.setState({
                                    activeTglPengukuhanEdit : dateFormat(new Date, "yyyy-mm-dd")
                                })
                            }else{
                                this.setState({
                                    activeTglPengukuhanEdit : data.Data[0].Sup_TglPengukuhan
                                })
                            }
                            console.log("active tanggal pengukuhan : "+this.state.activeTglPengukuhanEdit)

                            this.state.result.map(supplier =>  
                                this.setState({
                                    activeNameEdit              : supplier.Sup_Name,
                                    activeBossNameEdit          : supplier.Sup_BossName,
                                    activeAlamatEdit            : supplier.Sup_Address,
                                    activeKotaCodeEdit          : supplier.Sup_CityCode,
                                    activeKodeposEdit           : supplier.Sup_PostalCode,
                                    activeKecamatanCodeEdit     : supplier.Sup_KecID,
                                    activePKPYNEdit             : supplier.Sup_PKPYN,
                                    activeNPWPEdit              : supplier.Sup_NPWP,
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
                                    isCheckedPKP                : (supplier.Sup_PKPYN === "Y" ? true : false),
                                    isCheckedPajak              : (supplier.Sup_PajakYN === "Y" ? true : false),
                                    isCheckedPph                : (supplier.Sup_PphYN  === "Y" ? true : false)
                                })
                            )}
                            if(this.state.activePKPYNEdit == null){
                                this.setState({
                                    activePKPYNEdit : "N",
                                    isCheckedPKP : false
                                })
                            }
                            if(this.state.activePajakYNEdit == null){
                                this.setState({
                                    activePajakYNEdit : "N",
                                    isCheckedPajak : false
                                })
                            }
                            if(this.state.activePphYNEdit == null){
                                this.setState({
                                    activePphYNEdit : "N",
                                    isCheckedPph : false
                                })
                            }
                            console.log(this.state.result)
                            console.log("active PKP : " + this.state.activePKPYNEdit + "active Pajak : " + this.state.activePajakYNEdit + "active Pph : " + this.state.activePphYNEdit)
                            
                    });
            
    }

    editDataSupplier  = () => {
        var successValidation = true;
        if(this.state.activeNPWPEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "NPWP tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if (this.state.activeNamaPajakEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama Pajak tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if (this.state.activeAlamatPajakEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Alamat Pajak tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        
        if(successValidation == true){
        console.log("edit masuk");
        var url     = `https://api.docnet.id/CHCMasterD/MasterSupplierFakturPajak/UbahSupplierFakturPajak`;
        var payload = {
            Sup_UserID        : "123",
            Sup_Code          : this.state.activeItemId,
            Sup_BossName      : this.state.activeNameEdit,
            Sup_Address       : this.state.activeAlamatEdit,
            Sup_CityCode      : parseInt(this.state.activeKotaCodeEdit),
            Sup_PostalCode    : this.state.activeKodeposEdit,
            Sup_KecID         : parseInt(this.state.activeKecamatanCodeEdit),
            Sup_PKPYN         : this.state.activePKPYNEdit,
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

        console.log(payload)
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
                else if (response.ResponseCode == "410"){
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan false : ")
                    this.state.modal_response  = true;
                    this.componentDidMount();
                    this.state.responseHeader  = "Edit Data";
                    this.state.responseMessage = "Tidak ada perubahan data";
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
        }
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

    toggleChange = () => {
        this.setState({
            isCheckedPKP    : !this.state.isCheckedPKP,
            isCheckedPph    : !this.state.isCheckedPph,
            isCheckedPajak  : !this.state.isCheckedPajak
        });
    }

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateCheckedValue(type, e) {
        console.log(e.target.checked)

        if(type === "PKP") {
            if(e.target.checked==true){
                this.setState({
                    activePKPYNEdit : 'Y',
                    isCheckedPKP    : !this.state.isCheckedPKP,
                },()=>console.log("status PKP : " + this.state.activePKPYNEdit));
                
            }
            else if(e.target.checked==false){
                this.setState({
                    activePKPYNEdit : 'N',
                    isCheckedPKP    : !this.state.isCheckedPKP,
                },()=>console.log("status PKP : " + this.state.activePKPYNEdit));
            }
        }
        else if (type === "Pajak") {
            if(e.target.checked==true){
                this.setState({
                    activePajakYNEdit : 'Y',
                    isCheckedPajak  : !this.state.isCheckedPajak,
                },()=>console.log("status Pajak : " + this.state.activePajakYNEdit));
                
            }
            else if(e.target.checked==false){
                this.setState({
                    activePajakYNEdit : 'N',
                    isCheckedPajak  : !this.state.isCheckedPajak,
                },()=>console.log("status Pajak : " + this.state.activePajakYNEdit));
            }
        }
        else if (type === "Pph") {
            if(e.target.checked==true){
                this.setState({
                    activePphYNEdit : 'Y',
                    isCheckedPph    : !this.state.isCheckedPph
                },()=>console.log("status Pph : " + this.state.activePphYNEdit));
                
            }
            else if(e.target.checked==false){
                this.setState({
                    activePphYNEdit : 'N',
                    isCheckedPph    : !this.state.isCheckedPph
                },()=>console.log("status Pph : " + this.state.activePphYNEdit));
            }
        }
    }

    handleChange = (type, event) => {
        if (type === "EditPKPYN"){
            this.setState({
            activePKPYNEdit : event.target.value
            });
        } else if (type === "EditNPWP"){
            this.setState({
            activeNPWPEdit : event.target.value
            });
        } else if (type === "EditTglPengukuhan"){
            this.setState({
            activeTglPengukuhanEdit : event.target.value
            });
        } else if (type === "EditPajakYN"){
            this.setState({
            activePajakYNEdit : event.target.value
            }); 
        } else if (type === "EditNamaPajak"){
            this.setState({
            activeNamaPajakEdit : event.target.value
            });
        } else if (type === "EditAlamatPajak"){
            this.setState({
            activeAlamatPajakEdit : event.target.value
            });
        } else if (type === "EditPphYN"){
            this.setState({
            activePphYNEdit : event.target.value
            });
        }
    }
    
    render() {
        const { result, resultSellPack } = this.state;
        console.log(result)

        return (
            <Page
            title       = "Faktur Pajak"
            breadcrumbs = {[{ name: 'Supplier / Faktur Pajak', active: true }]}
            className   = "FakturPajak">
                
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
                <Col xs = {8} md = {3}></Col>
                    <Col xs = {2} md = {4}>
                        {
                            this.state.activeItemId == -1
                            ?
                            <Input type = "checkbox" checked = {this.state.isCheckedPKP} style={{marginLeft: "5px"}} value = {this.state.activePKPYNEdit} onChange={e => this.updateCheckedValue("PKP",e)} name = "pkp" placeholder = "PKP" />
                            :
                                this.state.value ==1
                                ?
                                <Input type = "checkbox" checked = {this.state.isCheckedPKP} style={{marginLeft: "5px"}} value = {this.state.activePKPYNEdit} onChange={e => this.updateCheckedValue("PKP",e)} name = "pkp" placeholder = "PKP" />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedPKP} style={{marginLeft: "5px"}} value = {this.state.activePKPYNEdit} onChange={e => this.updateCheckedValue("PKP",e)} name = "pkp" placeholder = "PKP" disabled/>
                        }
                        <Label style={{marginLeft: "20px"}}>PKP</Label>
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>NPWP</Label>
                    </Col>
                    <Col xs = {2} md = {3}>
                        {
                            this.state.activeItemId == -1
                            ?
                            <Input mask="99.999.999.9-999-999"  tag={InputMask} maskChar={null}  type = "NPWP" value = {this.state.activeNPWPEdit} onChange = {(e) => this.handleChange("EditNPWP",e)} name = "npwp" placeholder = "NPWP" />
                            :
                                this.state.value == 1
                                ?
                                <Input   tag={InputMask}  mask="99.999.999.9-999-999" maskChar={null} type = "NPWP" value = {this.state.activeNPWPEdit} onChange = {(e) => this.handleChange("EditNPWP",e)} name = "npwp" placeholder = "NPWP" />
                                :
                                <Input  tag={InputMask}  mask="99.999.999.9-999-999" maskChar={null}  type = "NPWP" value = {this.state.activeNPWPEdit} onChange = {(e) => this.handleChange("EditNPWP",e)} name = "npwp" placeholder = "NPWP" disabled/>
                                
                        }
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Tgl Pengukuhan</Label>
                    </Col>
                    <Col xs = {8} md = {2}>
                        {
                            this.state.activeItemId == -1
                            ?
                            <Input type = "date" value = {dateFormat(this.state.activeTglPengukuhanEdit, "yyyy-mm-dd")} onChange = {(e) => this.handleChange("EditTglPengukuhan",e)} name = "tgl_pengukuhan" placeholder = "Tgl Pengukuhan" />
                            :
                                this.state.value == 1
                                ?
                                <Input type = "date" value = {dateFormat(this.state.activeTglPengukuhanEdit, "yyyy-mm-dd")} onChange = {(e) => this.handleChange("EditTglPengukuhan",e)} name = "tgl_pengukuhan" placeholder = "Tgl Pengukuhan" />
                                :
                                <Input type = "datetime" value = {dateFormat(this.state.activeTglPengukuhanEdit,"yyyy-mm-dd")} onChange = {(e) => this.handleChange("EditTglPengukuhan",e)} name = "tgl_pengukuhan" placeholder = "Tgl Pengukuhan" disabled   />
                        }
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                <Col xs = {8} md = {3}></Col>
                    <Col xs = {2} md = {4}>
                    {
                        this.state.active == -1
                        ?
                        <Input type = "checkbox" checked = {this.state.isCheckedPajak} style={{marginLeft: "5px"}} value = {this.state.activePajakYNEdit} onChange={e => this.updateCheckedValue("Pajak",e)} name = "Pajak" placeholder = "Pajak" />
                        :
                            this.state.value ==1
                            ?
                            <Input type = "checkbox" checked = {this.state.isCheckedPajak} style={{marginLeft: "5px"}} value = {this.state.activePajakYNEdit} onChange={e => this.updateCheckedValue("Pajak",e)} name = "Pajak" placeholder = "Pajak" />
                            :
                            <Input type = "checkbox" checked = {this.state.isCheckedPajak} style={{marginLeft: "5px"}} value = {this.state.activePajakYNEdit} onChange={e => this.updateCheckedValue("Pajak",e)} name = "Pajak" placeholder = "Pajak" disabled />
                    }
                        <Label style={{marginLeft: "20px"}}>Pajak</Label>
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Nama Pajak</Label>
                    </Col>
                    <Col xs = {2} md = {3}>
                    {
                        this.state.activeItemId == -1
                        ?
                        <Input type = "NamaPajak" value = {this.state.activeNamaPajakEdit} onChange = {(e) => this.handleChange("EditNamaPajak",e)} name = "namapajak" placeholder = "Nama Pajak" />
                        :
                            this.state.value == 1
                            ?
                            <Input type = "NamaPajak" value = {this.state.activeNamaPajakEdit} onChange = {(e) => this.handleChange("EditNamaPajak",e)} name = "namapajak" placeholder = "Nama Pajak" />
                            :
                            <Input type = "NamaPajak" value = {this.state.activeNamaPajakEdit} onChange = {(e) => this.handleChange("EditNamaPajak",e)} name = "namapajak" placeholder = "Nama Pajak" disabled/>    
                        }
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Alamat Pajak</Label>
                    </Col>
                    <Col xs = {2} md = {9}>
                    {
                        this.state.activeItemId == -1
                        ?
                        <Input type = "AlamatPajak" value = {this.state.activeAlamatPajakEdit} onChange = {(e) => this.handleChange("EditAlamatPajak",e)} name = "alamatpajak" placeholder = "Alamat Pajak" />
                        :
                            this.state.value == 1
                            ?
                            <Input type = "AlamatPajak" value = {this.state.activeAlamatPajakEdit} onChange = {(e) => this.handleChange("EditAlamatPajak",e)} name = "alamatpajak" placeholder = "Alamat Pajak" />
                            :
                            <Input type = "AlamatPajak" value = {this.state.activeAlamatPajakEdit} onChange = {(e) => this.handleChange("EditAlamatPajak",e)} name = "alamatpajak" placeholder = "Alamat Pajak" disabled/>
                        }
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                <Col xs = {8} md = {3}></Col>
                    <Col xs = {2} md = {4}>
                    {
                        this.state.active == -1
                        ?
                        <Input type = "checkbox" checked = {this.state.isCheckedPph} style={{marginLeft: "5px"}} value = {this.state.activePphYNEdit} onChange={e => this.updateCheckedValue("Pph",e)} name = "Pph" placeholder = "Pph" />
                        :
                            this.state.value ==1
                            ?
                            <Input type = "checkbox" checked = {this.state.isCheckedPph} style={{marginLeft: "5px"}} value = {this.state.activePphYNEdit} onChange={e => this.updateCheckedValue("Pph",e)} name = "Pph" placeholder = "Pph" />
                            :
                            <Input type = "checkbox" checked = {this.state.isCheckedPph} style={{marginLeft: "5px"}} value = {this.state.activePphYNEdit} onChange={e => this.updateCheckedValue("Pph",e)} name = "Pph" placeholder = "Pph" disabled />
                        }                        
                        <Label style={{marginLeft: "20px"}}>Potong Pph</Label>
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
                        <Button
                        size="sm"
                        style={{
                            display: "inline-flex", 
                            alignItems: "center",
                            marginRight: "1%",
                        }}
                        onClick = {()=> this.editDataSupplier(this.state.activeItemId)}
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
                        onClick = {()=> this.editDataSupplier(this.state.activeItemId)}
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
export default Supplier_FakturPajak;
