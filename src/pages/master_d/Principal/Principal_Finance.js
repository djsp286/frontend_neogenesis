import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, Nav, Form,
    Navbar,UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup,InputGroup, InputGroupAddon, FormGroup, CardFooter
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdAdd, MdDelete, MdSearch, MdEdit, MdSave,MdCancel } from 'react-icons/md';
import Principal_Tab from './Principal_Tab';

class Principal_Finance extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            result                  : [],
            resultListBankPencairan : [],
            resultListVirtualAcc    : [],
            resultListAtasNama      : [],
            bankPencairans          : [],
            listAtasNamas           : [],
            activeItemId            : this.props.activeItemId,
            activeItemName          : '',
            value                   : 0,
            editValue               : 0,
            groupStatus             : this.props.groupStatus,
            
        };
    }
    
 jenisKartuInputValue = evt => {
    this.setState(
      {
        jenis_kartu: evt.target.value,
        disabledBankPencairan: false,
      }
    );
  };

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
        modal_delete       : false,
        responseHeader     : "",
        responseMessage    : "",
    };

    
    componentDidMount() {
        this.getPrincipalFinancebyCode()
        this.getPrincipalFinanceCode()
    }

    getPrincipalFinancebyCode()
    {   
        // this.getListBankPencairan()
        this.getTablePencairan()
        var payload = {
            FP_PriCode : this.state.activeItemId,
            FP_PriGroup : this.state.groupStatus
            };
            const option = {
                method  : "POST",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                body: JSON.stringify(payload)
                }
                
                fetch("https://api.docnet.id/CHCMasterD/MasterPrincipalFinance/TranslateCodePrincipalFinance",option)
                .then(response => response.json())
                .then(data =>{ 
                        if(data.Data === null)  {
                            console.log("data financial kosong")             
                            this.setState({ 
                                result: [], isLoading: false,
                                responseHeader  : "Finance Principal",
                                responseMessage : "Data Kosong, Silahkan Menambah Data",
                                modal_response  : true,
                                value           : 1,
                                editValue       : 0
                            })
                            
                        }
                        else{
                            console.log("data financial tidak kosong") 
                            console.log(data.Data.BIAtasNama)

                            this.setState({

                                activeAtasNamaEdit   : data.Data.BIAtasNama,
                                activeVirtualAccEdit : data.Data.VaccNomorRek,
                                activeNoRekEdit      : data.Data.BINomorRek,
                                value                : 0,
                                editValue            : 1
                            },()=>console.log("kasih nama kek : " + this.state.activeAtasNamaEdit))
                        }
                });
    }

    getPrincipalFinanceCode(){
        var payload = {
            FP_PriCode : this.state.activeItemId
       };
       const option = {
           method  : "POST",
           json    : true,
           headers : {
                   "Content-Type": "application/json;charset=UTF-8"
                   },
           body: JSON.stringify(payload)
           }
           fetch("https://api.docnet.id/CHCMasterD/MasterPrincipalFinance/TampilkanPrincipalFinancebyCode ",option)
         
           .then(response => response.json())
           .then(data =>{
                   if(data.Data === null)  {
                       console.log("data financial kosong")
                       this.setState({
                       })
                   }
                   else{

                       console.log("data financial tidak kosong")
                       this.setState({
                            activeBankEdit             : data.Data[0].FP_CbID,
                            activeVirtualAccCodeEdit   : data.Data[0].FP_VAccID,
                            activeBI_Id                : data.Data[0].FP_BIID
                       },
                       
                       ()=>console.log('DATA PRINCIPAL ' + this.state.activeBankEdit ))

                       if(this.state.activeBankEdit != null){
                            console.log(this.state.activeBankEdit+"activeBankEditLOHH")
                            this.getListAtasNama(this.state.activeBankEdit)
                            this.getListVirtualAcc(this.state.activeBI_Id)
                    }
                    console.log("getDatanya :  "+ this.state.activeBankEdit)
                   }
           });
    }

    getListBankPencairan = () =>{
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }
            
            fetch("https://api.docnet.id/CHCMasterBantuan/BankPencairan",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.Data===null)  {
                        console.log("data bank pencairan kosong")             
                        this.setState({ resultListBankPencairan: [], isLoading: false})
                        this.connectionOut("Bank Pencairan Kosong", false)
                    }
                    else{
                        console.log("data bank pencairan tidak kosong")  
                        this.setState({ resultListBankPencairan: data.Data, isLoading: false})
                    }
                });
    }

    getListVirtualAcc = (activeNoRekEdit) =>{
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }
            
            fetch("https://api.docnet.id/CHCMasterBantuan/SelectVirtualAccount?kode=" + activeNoRekEdit,option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.Data === null)  {
                        console.log("Virtual Acc kosong")
                                     
                        this.setState({ resultListVirtualAcc: [], isLoading: false})
                        this.connectionOut("Virtual Acc Kosong", false)
                    }
                    else{
                        console.log("Virtual Acc tidak kosong")  
                        this.setState({ resultListVirtualAcc: data.Data, isLoading: false})
                    }
                });
    }

    getListAtasNama = (activeBankEdit) =>{
        console.log("activeBankCodeEdit :" + activeBankEdit)
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }
            fetch("https://api.docnet.id/CHCMasterBantuan/SelectMasterBankIntern?id=" + activeBankEdit,option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.Data===null)  {
                        console.log("data atas nama kosong")             
                        this.setState({ resultListAtasNama: [], isLoading: false})
                        this.connectionOut("atas nama kosong", false)
                    }
                    else{
                        console.log("atas nama tidak kosong")  
                        this.setState({ resultListAtasNama: data.Data, isLoading: false})
                    }
                }); 
    }

    addFinancePrincipal = () => {
        var validasifinance = true
        console.log("add masuk");
        if(this.state.activeBankEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama Bank tidak boleh kosong",
                modal_response  : true})
                validasifinance = false;
        }else if(this.state.activeAtasNamaEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Atas Nama tidak boleh kosong",
                modal_response  : true})
                validasifinance = false;
        }else if(this.state.activeVirtualAccEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Virtual Account tidak boleh kosong",
                modal_response  : true})
                validasifinance = false
        }
        if(validasifinance == true){
        var url     = `https://api.docnet.id/CHCMasterD/MasterPrincipalFinance/TambahPrincipalFinance`;
        var payload = {
            FP_UserID       : "123",
            FP_PriCode      : this.state.activeItemId,
            FP_PriGroup     : parseInt(this.state.groupStatus),
            FP_CbID         : parseInt(this.state.activeBankEdit),
            FP_BIID         : parseInt(this.state.activeBI_Id),
            FP_VAccID       : parseInt(this.state.activeVirtualAccCodeEdit)
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
                    console.log("jalan add finance true : ")
                    this.state.responseHeader  = "Tambah Data";
                    this.state.responseMessage = "Data berhasil ditambah";         
                    this.state.modal_response  = true; 
                    this.componentDidMount()
                    this.changeEditButton()
                }
                else{
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan add finance false : ")
                    this.state.responseHeader  = "Tambah Data";
                    this.state.responseMessage = "Data sudah ada";
                    this.state.modal_response  = true;
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
        }
    }

    editFinancePrincipal = () => {
       var validasifinance = true
        if(this.state.activeBankEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama Bank tidak boleh kosong",
                modal_response  : true})
                validasifinance = false;
        }else if(this.state.activeAtasNamaEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Atas Nama tidak boleh kosong",
                modal_response  : true })
                validasifinance = false;
        }else if(this.state.activeVirtualAccEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Virtual Account tidak boleh kosong",
                modal_response  : true})
                validasifinance = false
        }
        console.log("edit masuk");
        console.log("group : " +this.state.groupStatus);
        if(validasifinance == true){
        var url     = `https://api.docnet.id/CHCMasterD/MasterPrincipalFinance/UbahPrincipalFinance`;
        
        var payload = {
            FP_UserID        : "123",
            FP_PriCode      : this.state.activeItemId,
            FP_PriGroup     : parseInt(this.state.groupStatus),
            FP_CbID         : parseInt(this.state.activeBankEdit),
            FP_BIID         : parseInt(this.state.activeBI_Id),
            FP_VAccID       : parseInt(this.state.activeVirtualAccCodeEdit)
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
                    console.log("jalan edit finance true : ")
                    this.state.modal_response  = true;  
                    this.componentDidMount();
                    this.changeEditButton()
                    this.state.responseHeader  = "Edit Data";
                    this.state.responseMessage = "Data berhasil diedit";      
                    this.toggle('response')      
                }
                else {
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan edit finance false : ")
                    this.state.modal_response  = true;
                    this.componentDidMount();
                    this.state.responseHeader  = "Edit Data";
                    this.state.responseMessage = "Tidak ada perubahan data";
                    this.toggle('response') 
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
        }
    }

    deleteFinancePrincipal = () => {
        console.log("masuk delete loh!!")
        var url     = `https://api.docnet.id/CHCMasterD/MasterPrincipalFinance/HapusPrincipalFinance`;
        var payload = {
            FP_PriCode      : this.state.activeItemId,
            FP_PriGroup     : parseInt(this.state.groupStatus),
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
                console.log("itemid" + this.state.activeItemId)
                console.log("gs" + this.state.groupStatus)
                console.log("response" + response.ResponseCode)
                if (response.ResponseCode == "200") {
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan true : ")
                    this.state.modal_delete    = false;   
                    this.componentDidMount();
                    this.state.activeBankEdit     = "";
                    this.state.activeAtasNamaEdit = "";
                    this.state.activeNoRekEdit    = "";
                    this.state.activeVirtualAccEdit = "";
                    this.state.activeBankCodeEdit = ""; 
                    this.state.resultListAtasNama = []
                    this.state.resultListVirtualAcc = []        
                }
                else if (response.ResponseCode == "400"){
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan false : ")
                    this.state.modal_delete    = false;
                    this.state.modal_response  = true;
                    this.componentDidMount();
                    this.state.responseHeader  = "Hapus Data";
                    this.state.responseMessage = "Data tidak berhasil dihapus";      
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
    }

    openModalDelete(){
        this.setState({
            modal_delete        : true
        });                            
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
  
    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateSelectionValue(evt){
        this.setState({
            [evt.target.name]: evt.target.value,
            selectedDropdown : evt.target.value
        });
    }

    updateInputValue (type, event) {
        if (type === "BankPencairan") {
            this.setState({ 
              inputtedBank      : event.target.value,
              inputtedBankCode  : event.target.id
            });
          } else if(type === "AtasNama"){
            this.setState({
              inputtedSellPack      : event.target.value,
              inputtedSellPackCode  : event.target.id
            });
          } else if(type === "VirtualAcc"){
              this.setState({
                inputtedVirtualAcc      : event.target.value,
                inputtedVirtualAccCode  : event.target.id
              });
          }
    };

    handleEditChange = (type, event) => {

        console.log("Bank Pencairan : " +this.state.activeBankEdit)
        
        if (type === "EditBank"){
            this.setState({
                activeBankEdit      : event.target.value,
                activeBankCodeEdit  : event.target.id
            },()=> this.getListAtasNama(this.state.activeBankEdit), 
                this.state.activeAtasNamaEdit       = "",
                this.state.activeNoRekEdit          = "",
                this.state.activeVirtualAccEdit     = "",
                this.state.activeBankCodeEdit       = "",
                this.state.activeBI_Id              = "",
                this.state.activeVirtualAccCodeEdit = "");
        } else if (type === "EditAtasNama"){
            this.setState({
                activeAtasNama      : event.target.value,
                activeNoRekEdit     : event.target.id
            });
        } else if (type === "EditVirtualAcc"){
            this.setState({
                activeVirtualAccEdit      : event.target.value,
                activeVirtualAccCodeEdit  : event.target.id
            });
        } 
    }

    handleEditChangeBank=(id,atasnama,norek)=>{
        console.log(atasnama + ":  atas nama")
        console.log(id + ":  id")
        console.log(norek + ":  norek")
        this.setState({
            activeBI_Id             : id,
            activeAtasNamaEdit      : atasnama,
            activeNoRekEdit         : norek
            }, () => this.getListVirtualAcc(this.state.activeBI_Id),
                    this.state.activeVirtualAccEdit = "",
                    this.state.activeVirtualAccCodeEdit = "")
        }

    getTablePencairan() {
        var url =  "https://api.docnet.id/CHCMasterD/BankPencairan";
        console.log('MASUK Table PENCAIRAN')

        fetch(url)
            .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('RESPONSE NOT FOUND');
            }
        })
            .then(data => {
            let bankPencairan = data.Data.map(bankPencairan => {
                return {
                   value  : bankPencairan.CB_ID,
                   display: bankPencairan.NAMA
                  };
                },()=>console.log());
                    
                console.log("test bankPencairan.CB_ID" + this.state.activeBankEdit)
                this.setState({
                    isLoading: false,
                    bankPencairans: [{ value: '', display: 'PILIH SALAH SATU'}].concat(
                    bankPencairan,
                    ),
                }); 
              })
              .catch(() => {
                console.log('ERROR table jenis kartu');
        });
    }

    // getTableAtasNama = (activeBankEdit) =>{
    //     var url = "https://api.docnet.id/SelectMasterBankIntern?id=" + activeBankEdit;

    //     console.log(url +'GETTABLEATASNAMA')


    //     fetch(url)
    //         .then(response => {
    //         if (response.ok) {
    //             return response.json();
    //         } else {
    //             console.log('RESPONSE NOT FOUND');
    //         }
    //     })
    //         .then(data => {
    //         let listAtasNama = data.Data.map(listAtasNama => {
    //             return {
    //                value: listAtasNama.BI_CabID,
    //                display: listAtasNama.BI_AtasNama
    //               };
    //             });
                    
    //             console.log(" ListAtasNama " + listAtasNama)
    //             this.setState({
    //                 isLoading: false,
    //                 listAtasNamas: [{ value: '', display: 'PILIH SALAH SATU'}].concat(listAtasNama),
    //             });
    //           })
    //           .catch(() => {
    //             console.log('ERROR table jenis kartu');
    //     });
    // }


    render() {
        const { result, resultListBankPencairan, resultListVirtualAcc, resultListAtasNama } = this.state;
        console.log(result)

        return (
            <Page
            title       = "Finance"
            breadcrumbs = {[{ name: 'Finance', active: true }]}
            className   = "Finance">

                <CardHeader>
                    <Row className = "show-grid mt-3">
                        <Col xs = {8} md = {3}>
                            <Label>No. Principal</Label>
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

                    <Modal
                        isOpen = {this.state.modal_delete}
                        toggle = {this.toggle('delete')}>
                        <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
                            <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
                                <ModalFooter>
                                    <Button color = "primary" 
                                    onClick = {() => this.deleteFinancePrincipal()}
                                    >
                                        Ya
                                    </Button>{' '}
                                    <Button
                                        color   = "secondary"
                                        onClick = {this.toggle('delete')}>
                                        Tidak
                                    </Button>
                                </ModalFooter>
                    </Modal>

                    <Row className = "show-grid mt-3">
                        <Col xs = {8} md = {3}>
                            <Label>Bank Pencairan</Label>
                        </Col>
                        <Col  xs = {9} md = {7} >
                            { this.state.value == 1?
                               <Input
                               type="select"
                               onChange = {(e) => this.handleEditChange("EditBank",e)}
                               value={this.state.activeBankEdit} 
                               id="bankpencairan"
                               >
                                   
                               {this.state.bankPencairans.map(bankPencairan => (
                                   <option key={bankPencairan.value} value={bankPencairan.value}>
                                   {bankPencairan.display}
                                   </option> 
                               ))}
                                </Input>

                                :

                                <Input
                                    type="select"
                                    onChange = {(e) => this.handleEditChange("EditBank",e)}
                                    value={this.state.activeBankEdit}
                                    id="bankpencairan"
                                    disabled
                                >
                                    {this.state.bankPencairans.map(bankPencairan => (
                                    <option key={bankPencairan.value} value={bankPencairan.value}>
                                        {bankPencairan.display}
                                    </option>
                                    ))}
                                </Input>
                                }
                            </Col>   
                    </Row> 

                    <Row className = "show-grid mt-3">
                        <Col xs = {8} md = {3}>
                            <Label>Atas Nama</Label>
                        </Col>
                        <Col  xs = {9} md = {7} >
                            {   this.state.value == 1 ?
                                <Input type = "Atas Nama" value = {this.state.activeAtasNamaEdit}  name = "AtasNama" placeholder = "Atas Nama" />
                                :
                                <Input type = "Atas Nama" value = {this.state.activeAtasNamaEdit}  name = "AtasNama" placeholder = "Atas Nama" disabled/>
                            }
                        </Col>
                        <Col>
                        {this.state.value == 1 ?
                            <UncontrolledButtonDropdown >
                                <DropdownToggle caret name = "filtermenu" color = "primary" className = "dropdownatasnama">
                                    . . .
                                </DropdownToggle>
                                <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>
                                    {resultListAtasNama.map(atasnama =>
                                        <tr>
                                            <DropdownItem onClick = {(e) => this.handleEditChangeBank(atasnama.BI_ID, atasnama.BI_AtasNama,atasnama.BI_NomorRek)}>{atasnama.BI_AtasNama}</DropdownItem>
                                        </tr>
                                    )}
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                            :
                            <UncontrolledButtonDropdown >
                            <DropdownToggle caret name = "filtermenu" color = "primary" className = "dropdownatasnama" disabled>
                                . . .
                            </DropdownToggle>
                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>
                                {resultListAtasNama.map(atasnama =>
                                    <tr>
                                        <DropdownItem onClick = {(e) => this.handleEditChangeBank(atasnama.BI_ID, atasnama.BI_AtasNama,atasnama.BI_NomorRek)}>{atasnama.BI_AtasNama}</DropdownItem>
                                    </tr>
                                )}
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                        }
                        </Col>
                    </Row>

                    <Row className = "show-grid mt-3">
                        <Col xs = {8} md = {3}>
                            <Label>No. Rekening</Label>
                        </Col>
                        <Col xs = {2} md = {9}>
                            { this.state.value ==1?
                                <Input type = "Norek" value = {this.state.activeNoRekEdit} onChange = {(e) => this.handleEditChange("EditNorek",e)} name = "norek" placeholder = "Norek"/>
                                :
                                <Input type = "Norek" value = {this.state.activeNoRekEdit} onChange = {(e) => this.handleEditChange("EditNorek",e)} name = "norek" placeholder = "Norek" disabled/>
                            }   
                        </Col>
                    </Row>


                    <Row className = "show-grid mt-3">
                        <Col xs = {8} md = {3}>
                            <Label>No. Virtual Account</Label>
                        </Col>
                        <Col  xs = {9} md = {7} >
                            {
                                this.state.value == 1 ?
                                <Input type = "Virtual Account" value = {this.state.activeVirtualAccEdit}  name = "Virtual Account" placeholder = "Virtual Account" />
                                :
                                <Input type = "Virtual Account" value = {this.state.activeVirtualAccEdit}  name = "Virtual Account" placeholder = "Virtual Account" disabled/>
                            }
                        </Col>
                        <Col>
                        { this.state.value ==1?
                            <UncontrolledButtonDropdown>
                                <DropdownToggle caret name = "filtermenu" color = "primary">
                                    . . .
                                </DropdownToggle>
                                <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                    {resultListVirtualAcc.map(virtualacc =>
                                        <tr>
                                            <DropdownItem value = {virtualacc.VAcc_NomorRek}  id = {virtualacc.VAcc_ID} onClick = {(e) => this.handleEditChange("EditVirtualAcc",e)}>{virtualacc.VAcc_NomorRek}</DropdownItem>           
                                        </tr>
                                    )}                                
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                            :
                            <UncontrolledButtonDropdown>
                                <DropdownToggle caret name = "filtermenu" color = "primary" disabled>
                                    . . .
                                </DropdownToggle>
                                <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                    {resultListVirtualAcc.map(virtualacc =>
                                        <tr>
                                            <DropdownItem value = {virtualacc.VAcc_NomorRek}  id = {virtualacc.VAcc_ID} onClick = {(e) => this.handleEditChange("EditVirtualAcc",e)}>{virtualacc.VAcc_NomorRek}</DropdownItem>           
                                        </tr>
                                    )}                                
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                            }
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
                                    size = "sm" 
                                    style={{
                                        display: "inline-flex", 
                                        alignItems: "center",
                                        marginLeft: "1%",
                                    }}
                                    onClick ={()=>this.openModalDelete()}
                                    >
                                    <MdDelete style = {{marginRight: "7px"}}></MdDelete>Delete
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
                                onClick = {this.state.editValue==1 ? ()=> this.editFinancePrincipal() : ()=> this.addFinancePrincipal()}
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
                                    marginRight: "1%",
                                    }}
                                    onClick ={()=>this.openModalDelete()}
                                    >
                                    <MdDelete style = {{marginRight: "7px"}}></MdDelete>Delete
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
export default Principal_Finance;
