import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import dateFormat from 'dateformat';
import InputMask from "react-input-mask";
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, Nav, Form,
    Navbar,UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup,InputGroup, InputGroupAddon, FormGroup, CardFooter
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdAdd, MdDelete, MdSearch, MdEdit, MdSave, MdCancel } from 'react-icons/md';

class Principal_DataFakturPajak extends React.Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state  = {
            result          : [],
            value           : 0,
            editValue       : 0,
            isCheckedPKP    : false,
            isCheckedPph    : false,
            activeItemId    : this.props.activeItemId,
            activeTglPengukuhanEdit : dateFormat(new Date, "yyyy-mm-dd") ,
            activeItemName  : '',
            activePKPYNEdit : 'N',
            activePphYNEdit : 'N',
            flagEditNPWP    : true

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
        this.getDataFakturPajakbyCode()
    }

    getDataFakturPajakbyCode()
    {   
            var payload = {
                FAPrin_PriCode : this.state.activeItemId
            };
            const option = {
                method  : "POST",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                body: JSON.stringify(payload)
                }
                
                
                fetch("https://api.docnet.id/CHCMasterD/MasterPrincipalFinacc/TampilkanPrincipalFinaccbyCode",option)
                .then(response => response.json())
                .then(data =>{ 
                        if(data.Data === null)  {
                            console.log("data faktur kosong")             
                            this.setState({ 
                                result: [], isLoading: false,
                                responseHeader  : "Data Faktur Principal",
                                responseMessage : "Data Kosong, Silahkan Menambah Data",
                                modal_response  : true,
                                value           : 1,
                                editValue       : 0,
                                flagEditNPWP    : false
                            })

                            
                        }
                        else{
                            console.log("data faktur tidak kosong")  
                            this.setState({ result: data.Data, isLoading: false, editValue : 1})
                            this.state.result.map(finAccPrin => 
                                this.setState({
                                    activePKPYNEdit           : finAccPrin.FAPrin_PKPYN,
                                    activeNameEdit            : finAccPrin.FAPrin_NmPerusahaan,
                                    activeAlamatEdit          : finAccPrin.FAPrin_Alamat,
                                    activeFinManagerEdit      : finAccPrin.FAPrin_MgrFin,
                                    activeNPWPEdit            : finAccPrin.FAPrin_NPWP,
                                    activeTglPengukuhanEdit   : finAccPrin.FAPrin_TglPengukuhan,
                                    activePphYNEdit           : finAccPrin.FAPrin_PphYN,
                                    isCheckedPKP              : (finAccPrin.FAPrin_PKPYN === "Y" ? true : false),
                                    isCheckedPph              : (finAccPrin.FAPrin_PphYN === "Y" ? true : false),
                                    flagEditNPWP              : true
                                }) 
                            )
                        }
                        console.log("active PKP : " + this.state.activePKPYNEdit)
                        console.log("active Pph : " + this.state.activePphYNEdit)
                }, ()=>  this.connectionOut("Can't reach the server", false));
    }

    addDataFakturPajak = () => {
        console.log("add masuk");
        var successValidation = true;
        if(this.state.activeNameEdit == "" || this.state.activeNameEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama Pajak tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeAlamatEdit == "" || this.state.activeAlamatEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Alamat Pajak tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeFinManagerEdit == "" || this.state.activeFinManagerEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Finance Manager tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        if(successValidation == true){
        var url     = `https://api.docnet.id/CHCMasterD/MasterPrincipalFinacc/TambahPrincipalFinacc`;
        var payload = {
            FAPrin_UserID        : "123",
            FAPrin_PriCode       : this.state.activeItemId,
            FAPrin_NmPerusahaan  : this.state.activeNameEdit,
            FAPrin_Alamat        : this.state.activeAlamatEdit,
            FAPrin_MgrFin        : this.state.activeFinManagerEdit,
            FAPrin_PKPYN         : this.state.activePKPYNEdit,
            FAPrin_NPWP          : this.state.activeNPWPEdit,
            FAPrin_TglPengukuhan : this.state.activeTglPengukuhanEdit,
            FAPrin_PphYN         : this.state.activePphYNEdit,
           }
           console.log("addDataFakturPajak")
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
                    this.componentDidMount();
                    this.state.responseHeader  = "Tambah Data";
                    this.state.responseMessage = "Data berhasil ditambah";      
                    this.toggle('response')      
                    this.state.modal_response  = true; 
                    this.changeEditButton()
                }
                else if (response.ResponseCode == "405"){
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan false : ")
                    this.componentDidMount();
                    this.state.responseHeader  = "Tambah Data";
                    this.state.responseMessage = "Data already exist";
                    this.toggle('response') 
                    this.state.modal_response  = true;
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
        }
    }

    editDataFakturPajak  = () => {
        var successValidation = true;
        if(this.state.activeNameEdit == "" || this.state.activeNameEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama Pajak tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeAlamatEdit == "" || this.state.activeAlamatEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Alamat Pajak tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeFinManagerEdit == "" || this.state.activeFinManagerEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Finance Manager tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        
        console.log("edit masuk");
        console.log("group : " +this.state.groupStatus);
    
        if(successValidation == true){
        var url     = `https://api.docnet.id/CHCMasterD/MasterPrincipalFinacc/UbahPrincipalFinacc`;
        var payload = {
            FAPrin_UserID        : "123",
            FAPrin_PriCode       : this.state.activeItemId,
            FAPrin_NmPerusahaan  : this.state.activeNameEdit,
            FAPrin_Alamat        : this.state.activeAlamatEdit,
            FAPrin_MgrFin        : this.state.activeFinManagerEdit,
            FAPrin_PKPYN         : this.state.activePKPYNEdit,
            FAPrin_NPWP          : this.state.activeNPWPEdit,
            FAPrin_TglPengukuhan : this.state.activeTglPengukuhanEdit,
            FAPrin_PphYN         : this.state.activePphYNEdit,
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
                    this.toggle('response')      
                }
                else if (response.ResponseCode == "410"){
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan false : ")
                    this.state.modal_response  = true;
                    this.componentDidMount();
                    this.state.responseHeader  = "Edit Data";
                    this.state.responseMessage = "Tidak ada perubahan data";
                    this.toggle('response') 
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
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

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateInputValue (type, event) {
        if (type === "Nama") {
            this.setState({ 
              inputtedName: event.target.value 
            });
        } 
    };

    updateCheckedValue(type, e) {
        console.log(e.target.checked)
        // var inputtglpengukuhan = document.getElementById("inputtglpengukuhan")

        if(type === "PKP"){
            if(e.target.checked==true){
            this.setState({
                isCheckedPKP        : !this.state.isCheckedPKP,
                activePKPYNEdit     : 'Y',
                flagEditNPWP        : false
            }) 
            // inputtglpengukuhan.disabled = false
            }
            else if(e.target.checked==false){
            this.setState({
                isCheckedPKP        : !this.state.isCheckedPKP,
                activePKPYNEdit     : 'N',
                flagEditNPWP        : true
            })
            // inputtglpengukuhan.disabled = true
            }
        } else if (type === "Pph"){
            if(e.target.checked==true){
                this.setState({
                    isCheckedPph: !this.state.isCheckedPph,
                    activePphYNEdit     : 'Y'
                },()=>console.log("status Pph : " + this.state.activePphYNEdit));
                }
                else if(e.target.checked==false){
                this.setState({
                    isCheckedPph: !this.state.isCheckedPph,
                    activePphYNEdit     : 'N'
                },()=>console.log("status Pph : " + this.state.activePphYNEdit));
            }
        }
    }

    handleChange = (type, event) => {
        if (type === "EditNama"){
            this.setState({
            activeNameEdit   : event.target.value
            });
        } else if (type === "EditAlamat"){
            this.setState({
            activeAlamatEdit : event.target.value
            });
        } else if (type === "EditManager"){
            this.setState({
            activeFinManagerEdit : event.target.value
            });
        } else if (type === "EditNPWP"){
            this.setState({
            activeNPWPEdit : event.target.value
            }); 
        } else if (type === "EditPengukuhan"){
            this.setState({
            activeTglPengukuhanEdit : event.target.value
            });
        }
    }


    changeEditButton = () => {
        if(this.state.value === 0){
            this.setState({
                value: 1
            })
            if(this.state.activePKPYNEdit == "Y"){
                this.setState({
                    flagEditNPWP: false
                })
            }
            else{
                this.setState({
                    flagEditNPWP: true
                })
            }
        }
        else if (this.state.value === 1){
            this.setState({
                value: 0
            })
        }
    }

    render() {
        const { result } = this.state;
        console.log(result)

        return (
            <Page
                title       = "Data Faktur Pajak"
                breadcrumbs = {[{ name: 'Data Faktur Pajak', active: true }]}
                className   = "DataFakturPajak">

                <CardHeader>
                    <Row className = "show-grid mt-3">
                        <Col xs = {8} md = {3}>
                            <Label>No. Principal</Label>
                        </Col>
                        <Col xs = {2} md = {9}>
                            <Input type = "Code" value = {this.state.activeItemId} name = "code" placeholder = "Code" disabled/>
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
                        <Col xs = {8} md = {3}> </Col>
                        <Col xs = {2} md = {4}>
                            {
                                this.state.value == 1?
                                <Input type = "checkbox" checked = {this.state.isCheckedPKP} style={{marginLeft: "5px"}} value = {this.state.activePKPYNEdit} onChange={e => this.updateCheckedValue("PKP",e)} name = "pkp" placeholder = "PKP" />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedPKP} style={{marginLeft: "5px"}} value = {this.state.activePKPYNEdit} onChange={e => this.updateCheckedValue("PKP",e)} name = "pkp" placeholder = "PKP" disabled/>
                            }
                            <Label style={{marginLeft: "20px"}}> PKP</Label>
                        </Col>
                    </Row>

                    <Row className = "show-grid mt-3">
                        <Col xs = {8} md = {3}>
                            <Label>Nama Pajak</Label>
                        </Col>
                        <Col xs = {2} md = {9}>
                            {
                                this.state.value == 1?
                                <Input type = "Nama" value = {this.state.activeNameEdit} onChange = {(e) => this.handleChange("EditNama",e)} name = "nama" placeholder = "Nama"/>
                                :
                                <Input type = "Nama" value = {this.state.activeNameEdit} onChange = {(e) => this.handleChange("EditNama",e)} name = "nama" placeholder = "Nama" disabled/>
                            }
                        </Col>
                    </Row>

                    <Row className = "show-grid mt-3">
                        <Col xs = {8} md = {3}>
                            <Label>Alamat Pajak</Label>
                        </Col>
                        <Col xs = {2} md = {9}>
                            {
                                this.state.value == 1?
                                <Input type = "Alamat" value = {this.state.activeAlamatEdit} onChange = {(e) => this.handleChange("EditAlamat",e)} name = "alamat" placeholder = "Alamat" />
                                :
                                <Input type = "Alamat" value = {this.state.activeAlamatEdit} onChange = {(e) => this.handleChange("EditAlamat",e)} name = "alamat" placeholder = "Alamat" disabled/>
                            }
                        </Col>
                    </Row>

                    <Row className = "show-grid mt-3">
                        <Col xs = {8} md = {3}>
                            <Label>Finance Manager</Label>
                        </Col>
                        <Col xs = {2} md = {9}>
                            {
                                this.state.value == 1?
                                <Input type = "Manager" value = {this.state.activeFinManagerEdit} onChange = {(e) => this.handleChange("EditManager",e)} name = "manager" placeholder = "Manager" />
                                :
                                <Input type = "Manager" value = {this.state.activeFinManagerEdit} onChange = {(e) => this.handleChange("EditManager",e)} name = "manager" placeholder = "Manager" disabled/>
                            }
                        </Col>
                    </Row>

                    <Row className = "show-grid mt-3">
                        <Col xs = {8} md = {3}>
                            <Label>NPWP</Label>
                        </Col>
                        <Col xs = {2} md = {9}>
                             {
                                this.state.value == 1?
                                <Input mask="99.999.999.9-999-999"  tag={InputMask} maskChar={null}  type = "NPWP" value = {this.state.activeNPWPEdit} onChange = {(e) => this.handleChange("EditNPWP",e)} name = "npwp" placeholder = "NPWP" disabled = {this.state.flagEditNPWP} />
                                :
                                <Input mask="99.999.999.9-999-999"  tag={InputMask} maskChar={null}  type = "NPWP" value = {this.state.activeNPWPEdit} onChange = {(e) => this.handleChange("EditNPWP",e)} name = "npwp" placeholder = "NPWP" disabled = {this.state.flagEditNPWP} />

                            }
                          
                        </Col>
                    </Row>



                    <Row className = "show-grid mt-3">
                        <Col xs = {8} md = {3}>
                            <Label> Tgl. Pengukuhan</Label>
                        </Col>
                        <Col>
                            { 
                                this.state.value == 1?
                                <Input disabled
                                    id = "inputtglpengukuhan"
                                    type = "date" 
                                    value = {dateFormat(this.state.activeTglPengukuhanEdit, "yyyy-mm-dd")} 
                                    onChange = {(e) => this.handleChange("EditPengukuhan",e)} 
                                    name = "pengukuhan" 
                                    placeholder = "Pengukuhan" 
                                    disabled = {this.state.flagEditNPWP}
                                    />
                                :
                                <Input disabled
                                    id = "inputtglpengukuhan"
                                    value = {dateFormat(this.state.activeTglPengukuhanEdit, "mm/dd/yyyy")}
                                    name = "pengukuhan" 
                                    placeholder = "Periode Pengukuhan"
                                    disabled = {this.state.flagEditNPWP}
                                    /> 
                            }
                        </Col>
                    </Row>

                    <Row className = "show-grid mt-3">
                        <Col xs = {8} md = {3}> </Col>
                        <Col xs = {2} md = {4}>
                            {   this.state.value == 1?
                                <Input type = "checkbox" checked = {this.state.isCheckedPph} style={{marginLeft: "5px"}} value = {this.state.activePphYNEdit} onChange={e => this.updateCheckedValue("Pph",e)} name = "Pph" placeholder = "PPH" />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedPph} style={{marginLeft: "5px"}} value = {this.state.activePphYNEdit} onChange={e => this.updateCheckedValue("Pph",e)} name = "Pph" placeholder = "PPH" disabled/>
                            }
                            <Label style={{marginLeft: "20px"}}> Potong Pph</Label>
                        </Col>
                    </Row>
                </CardBody>

                    <CardFooter>
                    {
                            this.state.value === 0
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
                        }

                        {
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
                                onClick = {this.state.editValue==1 ? ()=> this.editDataFakturPajak() : ()=> this.addDataFakturPajak()}
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
export default Principal_DataFakturPajak;
