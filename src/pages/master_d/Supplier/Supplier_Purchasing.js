import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, Nav, Form,
    Navbar,UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup,InputGroup, InputGroupAddon, FormGroup, CardFooter,UncontrolledTooltip
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdAdd, MdDelete, MdSearch, MdWarning, MdEdit, MdCancel, MdSave } from 'react-icons/md';
import { runInThisContext } from 'vm';
import { withRouter } from 'react-router-dom';

const ContactPerson = {
    ConSup_RunningID    : "",
    ConSup_SupCode      : "",
    ConSup_GrpCode      : "",
    ConSup_Name         : "",
    ConSup_JobTitle     : "",
    ConSup_Type         : "",
    ConSup_PICJP        : "N",
    ConSup_AreaCode     : "",
    ConSup_Number       : "",
    ConSup_PrimaryYN    : "N",
    ConSup_EmailFin     : "N",
    ConSup_UserID       : "123"
}

class Supplier_Purchasing extends React.Component {
  
    constructor(props) {
        super(props);
        this.state  = {
            result                  : [],
            resultContact           : [],
            resultGroup             : [],
            activeItemId            : this.props.activeItemId,
            activeItemName          : '',
            value                   : 0,
            editValue               : 0,
            isCheckedHR1            : false,
            isCheckedHR2            : false,
            isCheckedHR3            : false,
            isCheckedHR4            : false,
            isCheckedHR5            : false,
            isCheckedHR6            : false,
            isCheckedBufferHR1      : false,
            isCheckedBufferHR2      : false,
            isCheckedBufferHR3      : false,
            isCheckedBufferHR4      : false,
            isCheckedBufferHR5      : false,
            isCheckedBufferHR6      : false,
            isCheckedEveningPaxYN   : false,
            isCheckedSubDisYN       : false,
            isCheckedFirstPOYN      : false,
            activeEveningPaxYN      : "N",
            activeHR1               : "N",
            activeHR2               : "N",           
            activeHR3               : "N",
            activeHR4               : "N",
            activeHR5               : "N",
            activeHR6               : "N",
            activeSubDisYN          : "N",
            activeFirstPOYN         : "N",
            activeBufferHR1         : "N",
            activeBufferHR2         : "N",
            activeBufferHR3         : "N",
            activeBufferHR4         : "N",
            activeBufferHR5         : "N",
            activeBufferHR6         : "N",

            resultContact           : [],
            isCheckedJP             : false,
            inputtedContactPICJP    : 'N',
            isCheckedPO             : false,
            inputtedContactPICPO    : 'N',
            isCheckedEF             : false,
            inputtedContactEmailFinance : 'N',
            currentContactPerson    : { ...ContactPerson},
            editValueForContact     : 0,    
            idContact               : 1,
            flagDisabled            : true,
            
            editedValueDataPrincipal    : 0,
            editedValueContactPrincipal : 0,
            addedValueDataPrincipal     : 0,
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
            this.getGroup()
        }
    }

    getDataPurchasingbyCode()
    {   
        this.getKodeKota()
        this.getContactSupplierbyCode()
        var payload = {
                PurSup_SupCode : this.state.activeItemId,
                PurSup_GrpCode : this.state.activeGrpCode
            };
            const option = {
                method  : "POST",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                body: JSON.stringify(payload)
                }
                
                fetch("https://api.docnet.id/CHCMasterD/MasterSupplierPurchasing/TampilkanSupplierPurchasingbyCode",option)
                .then(response => response.json())
                .then(data =>{ 
                        if(data.Data === null)  {
                            console.log("data purchasing supplier kosong")             
                            this.setState({ 
                                result: [],
                                responseHeader  : "Purchase Supplier",
                                responseMessage : "Data Kosong, Silahkan Menambah Data",
                                modal_response  : true,
                                value           : 1,
                                editValue       : 0,
                                activeItemIdforNotifVali: -1,
                                    activeMinPOVal          : "",
                                    activeEveningPaxYN      : "N",
                                    activeHR1               : "N",
                                    activeHR2               : "N",           
                                    activeHR3               : "N",
                                    activeHR4               : "N",
                                    activeHR5               : "N",
                                    activeHR6               : "N",
                                    activeSubDisYN          : "N",
                                    activeFirstPOYN         : "N",
                                    activeSchBuffer         : "",
                                    activeBufferHR1         : "N",
                                    activeBufferHR2         : "N",
                                    activeBufferHR3         : "N",
                                    activeBufferHR4         : "N",
                                    activeBufferHR5         : "N",
                                    activeBufferHR6         : "N",
                                    isCheckedEveningPaxYN   : false,
                                    isCheckedSubDisYN       : false,
                                    isCheckedFirstPOYN      : false,
                                    isCheckedHR1            : false,
                                    isCheckedHR2            : false,
                                    isCheckedHR3            : false,
                                    isCheckedHR4            : false,
                                    isCheckedHR5            : false,
                                    isCheckedHR6            : false,
                                    isCheckedBufferHR1      : false,
                                    isCheckedBufferHR2      : false,
                                    isCheckedBufferHR3      : false,
                                    isCheckedBufferHR4      : false,
                                    isCheckedBufferHR5      : false,
                                    isCheckedBufferHR6      : false,
                            })
                        }
                        else{
                            console.log("data purchasing supplier tidak kosong")  
                            this.setState({ result: data.Data, isLoading: false})
                            this.state.result.map(purchasing => 
                                this.setState({
                                    activeItemIdforNotifVali: 0,
                                    value                   : 0,
                                    editValue               : 1,
                                    activeGrpCode           : purchasing.PurSup_GrpCode,
                                    activeMinPOVal          : purchasing.PurSup_MinPOVal,
                                    activeEveningPaxYN      : purchasing.PurSup_EveningPaxYN,
                                    activeHR1               : purchasing.PurSup_HR1,
                                    activeHR2               : purchasing.PurSup_HR2,           
                                    activeHR3               : purchasing.PurSup_HR3,
                                    activeHR4               : purchasing.PurSup_HR4,
                                    activeHR5               : purchasing.PurSup_HR5,
                                    activeHR6               : purchasing.PurSup_HR6,
                                    activeSubDisYN          : purchasing.PurSup_SubDisYN,
                                    activeFirstPOYN         : purchasing.PurSup_FirstPOYN,
                                    activeSchBuffer         : purchasing.PurSup_SchBuffer,
                                    activeBufferHR1         : purchasing.PurSup_BufferHR1,
                                    activeBufferHR2         : purchasing.PurSup_BufferHR2,
                                    activeBufferHR3         : purchasing.PurSup_BufferHR3,
                                    activeBufferHR4         : purchasing.PurSup_BufferHR4,
                                    activeBufferHR5         : purchasing.PurSup_BufferHR5,
                                    activeBufferHR6         : purchasing.PurSup_BufferHR6,
                                    isCheckedEveningPaxYN   : (purchasing.PurSup_EveningPaxYN === "Y" ? true : false),
                                    isCheckedSubDisYN       : (purchasing.PurSup_SubDisYN === "Y" ? true : false),
                                    isCheckedFirstPOYN      : (purchasing.PurSup_FirstPOYN === "Y" ? true : false),
                                    isCheckedHR1            : (purchasing.PurSup_HR1 === "Y" ? true : false),
                                    isCheckedHR2            : (purchasing.PurSup_HR2 === "Y" ? true : false),
                                    isCheckedHR3            : (purchasing.PurSup_HR3 === "Y" ? true : false),
                                    isCheckedHR4            : (purchasing.PurSup_HR4 === "Y" ? true : false),
                                    isCheckedHR5            : (purchasing.PurSup_HR5 === "Y" ? true : false),
                                    isCheckedHR6            : (purchasing.PurSup_HR6 === "Y" ? true : false),
                                    isCheckedBufferHR1      : (purchasing.PurSup_BufferHR1 === "Y" ? true : false),
                                    isCheckedBufferHR2      : (purchasing.PurSup_BufferHR2 === "Y" ? true : false),
                                    isCheckedBufferHR3      : (purchasing.PurSup_BufferHR3 === "Y" ? true : false),
                                    isCheckedBufferHR4      : (purchasing.PurSup_BufferHR4 === "Y" ? true : false),
                                    isCheckedBufferHR5      : (purchasing.PurSup_BufferHR5 === "Y" ? true : false),
                                    isCheckedBufferHR6      : (purchasing.PurSup_BufferHR6 === "Y" ? true : false),
                            }))
                        }
                    });
    }

    getGroup(){
        console.log("getGroup")
        var url     = "https://api.docnet.id/CHCMasterD/MasterSupplierGroup/TampilkanGroup";
        var payload = {
        }
        
        console.log(this.state.resultTest)
        fetch(url, {
            method : "POST",
            body   : JSON.stringify(payload),
            json   : true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())  
            .then(data =>{ 
               
                    if(data.ResponseCode === "200")  {
                        console.log("data group tidak kosong")
                        this.setState({
                            resultGroup   : data.Data,
                            activeGrpCode : data.Data[0].Grp_Code,
                            activeGrpName : data.Data[0].Grp_Name
                        })
                        this.getDataPurchasingbyCode() 
                    }
                    else{
                        console.log("data group kosong")
                        this.setState({
                            resultGroup : []
                        })
                    }
                });
    }

    addPurchaseSupplier = () => {
        var successValidation = true;

        if(this.state.activeMinPOVal == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Minimum Pembelian PO tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeSchBuffer == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Jadwal Buffer tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeSchBuffer > 10000000000){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Jadwal Buffer tidak melebihi 11 angka",
                modal_response  : true})
                successValidation = false;
        }

        if(successValidation == true){
        console.log("add masuk");
        var url     = `https://api.docnet.id/CHCMasterD/MasterSupplierPurchasing/TambahSupplierPurchasingBaru`;
        var payload = {
            PurSup_UserID            : "123",
            PurSup_SupCode           : this.state.activeItemId,
            PurSup_GrpCode           : this.state.activeGrpCode,
            PurSup_MinPOVal          : parseFloat(this.state.activeMinPOVal),
            PurSup_EveningPaxYN      : this.state.activeEveningPaxYN,
            PurSup_HR1               : this.state.activeHR1,
            PurSup_HR2               : this.state.activeHR2,
            PurSup_HR3               : this.state.activeHR3,
            PurSup_HR4               : this.state.activeHR4,
            PurSup_HR5               : this.state.activeHR5,
            PurSup_HR6               : this.state.activeHR6,
            PurSup_SubDisYN          : this.state.activeSubDisYN,
            PurSup_FirstPOYN         : this.state.activeFirstPOYN,
            PurSup_SchBuffer         : parseInt(this.state.activeSchBuffer),                       
            PurSup_BufferHR1         : this.state.activeBufferHR1,
            PurSup_BufferHR2         : this.state.activeBufferHR2, 
            PurSup_BufferHR3         : this.state.activeBufferHR3, 
            PurSup_BufferHR4         : this.state.activeBufferHR4, 
            PurSup_BufferHR5         : this.state.activeBufferHR5, 
            PurSup_BufferHR6         : this.state.activeBufferHR6,                                                 
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
                    this.setState({
                        addedValueDataPrincipal : 1
                    })
                    
                    this.updatePriCodeContact(this.state.activeItemId)
                    this.saveContactList()
                    
                }
                else {
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan false : ")
                    this.state.responseHeader  = "Tambah Data";
                    this.state.responseMessage = "Gagal Menambah Data";
                    this.state.modal_response  = true;
                    this.updatePriCodeContact(this.state.activeItemId)
                    this.saveContactList()
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
        }
    }

    editPurchaseSupplier  = () => {
        var successValidation = true;

        if(this.state.activeSchBuffer == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Jadwal Buffer tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeMinPOVal == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Minimum Pembelian PO tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        } 
        else if(this.state.activeSchBuffer > 10000000000 || this.state.activeSchBuffer == 10000000000){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Jadwal Buffer tidak melebihi 11 angka",
                modal_response  : true})
                successValidation = false;
        }

        if(successValidation == true){
        console.log("edit masuk");
        var url     = `https://api.docnet.id/CHCMasterD/MasterSupplierPurchasing/UbahSupplierPurchasing`;
        var payload = {
            PurSup_UserID            : "123",
            PurSup_SupCode           : this.state.activeItemId,
            PurSup_GrpCode           : this.state.activeGrpCode,
            PurSup_MinPOVal          : parseFloat(this.state.activeMinPOVal),
            PurSup_EveningPaxYN      : this.state.activeEveningPaxYN,
            PurSup_HR1               : this.state.activeHR1,
            PurSup_HR2               : this.state.activeHR2,
            PurSup_HR3               : this.state.activeHR3,
            PurSup_HR4               : this.state.activeHR4,
            PurSup_HR5               : this.state.activeHR5,
            PurSup_HR6               : this.state.activeHR6,
            PurSup_SubDisYN          : this.state.activeSubDisYN,
            PurSup_FirstPOYN         : this.state.activeFirstPOYN,
            PurSup_SchBuffer         : parseInt(this.state.activeSchBuffer),                       
            PurSup_BufferHR1         : this.state.activeBufferHR1,
            PurSup_BufferHR2         : this.state.activeBufferHR2, 
            PurSup_BufferHR3         : this.state.activeBufferHR3, 
            PurSup_BufferHR4         : this.state.activeBufferHR4, 
            PurSup_BufferHR5         : this.state.activeBufferHR5, 
            PurSup_BufferHR6         : this.state.activeBufferHR6,            
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
                    this.setState({
                        editedValueDataPrincipal : 1
                    })
                    
                    this.updatePriCodeContact(this.state.activeItemId)
                    this.saveContactList()
                 
                }
                else{
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan false : ")
                    this.setState({
                        editedValueDataPrincipal : 0
                    })
                    
                    this.updatePriCodeContact(this.state.activeItemId)
                    this.saveContactList()
                    
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
        }
    }
    
    toggleChange = () => {
        this.setState({
            isCheckedHR1            : !this.state.isCheckedHR1,
            isCheckedHR2            : !this.state.isCheckedHR2,
            isCheckedHR3            : !this.state.isCheckedHR3,
            isCheckedHR4            : !this.state.isCheckedHR4,
            isCheckedHR5            : !this.state.isCheckedHR5,
            isCheckedHR6            : !this.state.isCheckedHR6,
            isCheckedBufferHR1      : !this.state.isCheckedBufferHR1,
            isCheckedBufferHR2      : !this.state.isCheckedBufferHR2,
            isCheckedBufferHR3      : !this.state.isCheckedBufferHR3,
            isCheckedBufferHR4      : !this.state.isCheckedBufferHR4,
            isCheckedBufferHR5      : !this.state.isCheckedBufferHR5,
            isCheckedBufferHR6      : !this.state.isCheckedBufferHR6,
            isCheckedEveningPaxYN   : !this.state.isCheckedEveningPaxYN,
            isCheckedSubDisYN       : !this.state.isCheckedSubDisYN,
            isCheckedFirstPOYN      : !this.state.isCheckedFirstPOYN,
        });
        
    }

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    changeEditButton = () => {
        this.state.flagDisabled = false
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

    updateCheckedValue(type, e) {
        console.log(e.target.checked)

        if(type === "HR1") {
            if(e.target.checked==true){
                this.setState({
                    activeHR1       : 'Y',
                    isCheckedHR1    : !this.state.isCheckedHR1,
                },()=>console.log("status HR1 : " + this.state.activeHR1));
                
            }
            else if(e.target.checked==false){
                this.setState({
                    activeHR1 : 'N',
                    isCheckedHR1    : !this.state.isCheckedHR1,
                },()=>console.log("status HR1 : " + this.state.isCheckedHR1));
            }
        }
        else if (type === "HR2") {
            if(e.target.checked==true){
                this.setState({
                    activeHR2       : 'Y',
                    isCheckedHR2    : !this.state.isCheckedHR2,
                },()=>console.log("status HR2 : " + this.state.isCheckedHR2));
                
            }
            else if(e.target.checked==false){
                this.setState({
                    activeHR2       : 'N',
                    isCheckedHR2    : !this.state.isCheckedHR2,
                },()=>console.log("status HR2 : " + this.state.isCheckedHR2));
            }
        }
        else if (type === "HR3") {
            if(e.target.checked==true){
                this.setState({
                    activeHR3       : 'Y',
                    isCheckedHR3    : !this.state.isCheckedHR3,
                },()=>console.log("status HR3 : " + this.state.isCheckedHR3));
                
            }
            else if(e.target.checked==false){
                this.setState({
                    activeHR3       : 'N',
                    isCheckedHR3    : !this.state.isCheckedHR3,
                },()=>console.log("status HR3 : " + this.state.isCheckedHR3));
            }
        }
        else if (type === "HR4") {
            if(e.target.checked==true){
                this.setState({
                    activeHR4       : 'Y',
                    isCheckedHR4    : !this.state.isCheckedHR4,
                },()=>console.log("status HR4 : " + this.state.isCheckedHR4));
                
            }
            else if(e.target.checked==false){
                this.setState({
                    activeHR4       : 'N',
                    isCheckedHR4    : !this.state.isCheckedHR4,
                },()=>console.log("status HR4 : " + this.state.isCheckedHR4));
            }
        }
        else if (type === "HR5") {
            if(e.target.checked==true){
                this.setState({
                    activeHR5       : 'Y',
                    isCheckedHR5    : !this.state.isCheckedHR5,
                },()=>console.log("status HR5 : " + this.state.isCheckedHR5));
                
            }
            else if(e.target.checked==false){
                this.setState({
                    activeHR5       : 'N',
                    isCheckedHR5    : !this.state.isCheckedHR5,
                },()=>console.log("status HR5 : " + this.state.isCheckedHR5));
            }
        }
        else if (type === "HR6") {
            if(e.target.checked==true){
                this.setState({
                    activeHR6       : 'Y',
                    isCheckedHR6    : !this.state.isCheckedHR6,
                },()=>console.log("status HR6 : " + this.state.isCheckedHR6));
                
            }
            else if(e.target.checked==false){
                this.setState({
                    activeHR6       : 'N',
                    isCheckedHR6    : !this.state.isCheckedHR6,
                },()=>console.log("status HR6 : " + this.state.isCheckedHR6));
            }
        }
        else if (type === "BufferHR1") {
            if(e.target.checked==true){
                this.setState({
                    activeBufferHR1       : 'Y',
                    isCheckedBufferHR1    : !this.state.isCheckedBufferHR1,
                },()=>console.log("status Buffer HR1 : " + this.state.isCheckedBufferHR1));
            }
            else if(e.target.checked==false){
                this.setState({
                    activeBufferHR1       : 'N',
                    isCheckedBufferHR1    : !this.state.isCheckedBufferHR1,
                },()=>console.log("status Buffer HR1 : " + this.state.isCheckedBufferHR1));
            }
        }
        else if (type === "BufferHR2") {
            if(e.target.checked==true){
                this.setState({
                    activeBufferHR2       : 'Y',
                    isCheckedBufferHR2    : !this.state.isCheckedBufferHR2,
                },()=>console.log("status Buffer HR2 : " + this.state.isCheckedBufferHR2));
            }
            else if(e.target.checked==false){
                this.setState({
                    activeBufferHR2       : 'N',
                    isCheckedBufferHR2    : !this.state.isCheckedBufferHR2,
                },()=>console.log("status Buffer HR2 : " + this.state.isCheckedBufferHR2));
            }
        }
        else if (type === "BufferHR3") {
            if(e.target.checked==true){
                this.setState({
                    activeBufferHR3       : 'Y',
                    isCheckedBufferHR3    : !this.state.isCheckedBufferHR3,
                },()=>console.log("status Buffer HR3 : " + this.state.isCheckedBufferHR3));
            }
            else if(e.target.checked==false){
                this.setState({
                    activeBufferHR3       : 'N',
                    isCheckedBufferHR3    : !this.state.isCheckedBufferHR3,
                },()=>console.log("status Buffer HR3 : " + this.state.isCheckedBufferHR3));
            }
        }
        else if (type === "BufferHR4") {
            if(e.target.checked==true){
                this.setState({
                    activeBufferHR4       : 'Y',
                    isCheckedBufferHR4    : !this.state.isCheckedBufferHR4,
                },()=>console.log("status Buffer HR4 : " + this.state.isCheckedBufferHR4));
            }
            else if(e.target.checked==false){
                this.setState({
                    activeBufferHR4       : 'N',
                    isCheckedBufferHR4    : !this.state.isCheckedBufferHR4,
                },()=>console.log("status Buffer HR4 : " + this.state.isCheckedBufferHR4));
            }
        }
        else if (type === "BufferHR5") {
            if(e.target.checked==true){
                this.setState({
                    activeBufferHR5       : 'Y',
                    isCheckedBufferHR5    : !this.state.isCheckedBufferHR5,
                },()=>console.log("status Buffer HR5 : " + this.state.isCheckedBufferHR5));
            }
            else if(e.target.checked==false){
                this.setState({
                    activeBufferHR5       : 'N',
                    isCheckedBufferHR5    : !this.state.isCheckedBufferHR5,
                },()=>console.log("status Buffer HR5 : " + this.state.isCheckedBufferHR5));
            }
        }
        else if (type === "BufferHR6") {
            if(e.target.checked==true){
                this.setState({
                    activeBufferHR6       : 'Y',
                    isCheckedBufferHR6    : !this.state.isCheckedBufferHR6,
                },()=>console.log("status Buffer HR6 : " + this.state.isCheckedBufferHR6));
            }
            else if(e.target.checked==false){
                this.setState({
                    activeBufferHR6       : 'N',
                    isCheckedBufferHR6    : !this.state.isCheckedBufferHR6,
                },()=>console.log("status Buffer HR6 : " + this.state.isCheckedBufferHR6));
            }
        }
        else if (type === "EveningPax") {
            if(e.target.checked==true){
                this.setState({
                    activeEveningPaxYN    : 'Y',
                    isCheckedEveningPaxYN    : !this.state.isCheckedEveningPaxYN,
                },()=>console.log("status Evening Pax: " + this.state.isCheckedEveningPaxYN));
            }
            else if(e.target.checked==false){
                this.setState({
                    activeEveningPaxYN       : 'N',
                    isCheckedEveningPaxYN    : !this.state.isCheckedEveningPaxYN,
                },()=>console.log("status Evening Pax : " + this.state.isCheckedEveningPaxYN));
            }
        }
        else if (type === "SubDis") {
            if(e.target.checked==true){
                this.setState({
                    activeSubDisYN          : 'Y',
                    isCheckedSubDisYN       : !this.state.isCheckedSubDisYN,
                },()=>console.log("status subdis: " + this.state.isCheckedSubDisYN ));
            }
            else if(e.target.checked==false){
                this.setState({
                    activeSubDisYN          : 'N',
                    isCheckedSubDisYN       : !this.state.isCheckedSubDisYN,
                },()=>console.log("status subdis: " + this.state.isCheckedSubDisYN ));
            }
        }
        else if (type === "FirstPO") {
            if(e.target.checked==true){
                this.setState({
                    activeFirstPOYN         : 'Y',
                    isCheckedFirstPOYN      : !this.state.isCheckedFirstPOYN,
                },()=>console.log("status subdis: " + this.state.isCheckedFirstPOYN ));
            }
            else if(e.target.checked==false){
                this.setState({
                    activeFirstPOYN         : 'N',
                    isCheckedFirstPOYN      : !this.state.isCheckedFirstPOYN,
                },()=>console.log("status subdis: " + this.state.isCheckedFirstPOYN ));
            }
        }
    }

    handleChange = (type, event) => {
        if (type === "JadwalBuffer"){
            this.setState({
            activeSchBuffer : event.target.value
            });
        } else if (type === "MinPembelian"){
            this.setState({
            activeMinPOVal : event.target.value
            });
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

    getContactSupplierbyCode()
    {   
        var payload = {
            ConSup_SupCode : this.state.activeItemId,
            ConSup_GrpCode : this.state.activeGrpCode
        };
        const option = {
            method  : "POST",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            body: JSON.stringify(payload)
            }
            
            fetch("https://api.docnet.id/CHCMasterD/MasterSupplierContact/TampilkanSupplierContactbyCode",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.Data === null)  {
                        console.log("data contact principal kosong")             
                        this.setState({ resultContact: [], isLoading: false, 
                            flagDisabled    : false})
                        // this.connectionOut("Data Contact Principal Kosong", false)
                    }
                    else{
                        console.log("data contact principal tidak kosong")
                        this.setState({ resultContact: data.Data, isLoading: false, 
                            flagDisabled    : true})
                       
                    }
              
                });
        
    }


    openAddContactModal(){
        this.setState({
            modal_contact_person : true,
            editValueForContact : 0,
            inputtedContactName     : "",
            inputtedContactKodeArea : "",
            inputtedContactJabatan  : "",
            inputtedContactJenis    : "",
            selectedJenisContact    : "",
            inputtedContactNomor    : "",
            inputtedJenisContact    : "",
            inputtedContactPICJP    : "N",
            inputtedContactPICPO    : "N",
            inputtedContactEmailFinance : "N",
            isCheckedEF             : false,
            isCheckedPO             : false,
            isCheckedJP             : false,
        })
    }

    deleteContact(id, urut, grpcode, supcode){
      
        var temporary_result = this.state.resultContact;
     
        for(let i = 0 ; i< temporary_result.length ; i++){
            if(temporary_result[i].ConSup_RunningID == id){
                console.log("consup_supcode : "+ temporary_result[i].ConSup_SupCode)
                if(temporary_result[i].ConSup_SupCode !== ""){
                    this.deleteContactDatabase(urut, grpcode, supcode)
                }

                temporary_result.splice(i,1);
                this.setState({
                    resultContact : temporary_result,
                    modal_delete : false
                })
               
                return;
            }
        }
    }

    deleteContactDatabase(urut, grpcode, supcode){

        var url     = "https://api.docnet.id/CHCMasterD/MasterSupplierContact/HapusSupplierContact";
        var payload = {
            ConSup_SupCode    : this.state.activeItemId,
            ConSup_GrpCode    : parseInt(grpcode),
            ConSup_Urut       : parseInt(urut)
        }
        console.log(this.state.resultContact)
        fetch(url, {
            method : "POST",
            body   : JSON.stringify(payload),
            json   : true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
                    .then(response => response.json())  
                    .then(data =>{ 
                        console.log("response contact : "+data.ResponseCode)
                            if(data.ResponseCode === "200")  {
                                console.log("delete list success")   
                                this.setState({
                                    modal_delete : false
                                })   
                            }
                            else{
                                console.log("delete list not success")
                            }
                        });
    }

    updatePriCodeContact(id){
        
        console.log(this.state.resultContact.length);
        const tempResult=this.state.resultContact;
        for(let i = 0 ; i<  this.state.resultContact.length ; i++){
                console.log("update pricode ")
                console.log(this.state)
                tempResult[i].ConSup_SupCode = id;
                this.setState({
                    resultContact:tempResult
                });
        }
    }
 
    updateContactTable=(todo)=>{
       
        var length = this.state.resultContact.length
        console.log("panjang : " +length)
        todo["ConSup_GrpCode"]    = this.state.activeGrpCode
        todo["ConSup_AreaCode"]   = this.state.activeKodeTelp
        todo["ConSup_PICJP"]      = this.state.inputtedContactPICJP
        todo["ConSup_PrimaryYN"]    = this.state.inputtedContactPICPO
        todo["ConSup_EmailFin"]     = this.state.inputtedContactEmailFinance
        if(length == 0){
            todo["ConSup_RunningID"]     = 0+1
        }
        else{
            todo["ConSup_RunningID"]     = this.state.resultContact[length-1].ConSup_RunningID + 1
        }
        
        
        this.setState(prevState => ({
            resultContact           : [...prevState.resultContact, todo],
            modal_contact_person    : false,
            idContact               : this.state.idContact+1
        }));

        console.log(this.state.resultContact)
    }
    

    updateContactTableEdit=(id) =>{
    
        var temporary_result = this.state.resultContact;

        for(let i = 0 ; i< temporary_result.length ; i++){
            if(temporary_result[i].ConSup_RunningID == id){
                console.log("update edit ")
                console.log(this.state)
                temporary_result[i].ConSup_Number = this.state.inputtedContactNomor
                temporary_result[i].ConSup_Name = this.state.inputtedContactName
                temporary_result[i].ConSup_JobTitle = this.state.inputtedContactJabatan
                temporary_result[i].ConSup_AreaCode = this.state.inputtedContactKodeArea
                temporary_result[i].ConSup_Type  = this.state.selectedJenisContact
                temporary_result[i].ConSup_PICJP = this.state.inputtedContactPICJP
                temporary_result[i].ConSup_PrimaryYN = this.state.inputtedContactPICPO
                temporary_result[i].ConSup_EmailFin = this.state.inputtedContactEmailFinance
                this.setState({
                    resultContact           : temporary_result,
                    inputtedContactId       : "",
                    modal_contact_person    : false
                })
                if(temporary_result[i].ConSup_SupCode !== ""){
                    this.editContactDatabase(temporary_result[i])
                }
              

                return;
            }
        }
    }

    saveContactList(){
        var url     = "https://api.docnet.id/CHCMasterD/MasterSupplierContact/TambahSupplierContactList";
        var payload = this.state.resultContact
        
        console.log(this.state.resultContact)
        fetch(url, {
            method : "POST",
            body   : JSON.stringify(payload),
            json   : true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
                    .then(response => response.json())  
                    .then(data =>{ 
                        console.log(payload)
                            if(data.ResponseCode === "200")  {
                                console.log("save contact list success")  
                                this.setState({
                                    editedValueContactPrincipal : 1
                                })
                                this.responseDataAndContactPrincipal() 
                                this.getContactSupplierbyCode()
                            }
                            else{
                                console.log("save contact list not success / already exist")
                                this.setState({
                                    editedValueContactPrincipal : 0
                                })
                                this.responseDataAndContactPrincipal()
                            }
                        });
   
    }

    responseDataAndContactPrincipal(){
        console.log("responseDataAndContactPrincipal")
        if(this.state.activeItemIdforNotifVali == -1){
            console.log("addedValueDataPrincipal")
            if(this.state.addedValueDataPrincipal == 1 && this.state.editedValueContactPrincipal == 1){
                this.setState({
                    responseHeader          : "Add Data",
                    responseMessage         : "Data berhasil ditambah",
                    modal_response          : true,
                    value                   : 0,
                    flagDisabled            : true,
                    addedValueDataPrincipal : 0,
                    activeItemIdforNotifVali: this.state.activeItemId
                })
                this.changeEditButton()
                this.getDataPurchasingbyCode();
            }
            else if(this.state.addedValueDataPrincipal == 1 && this.state.editedValueContactPrincipal == 0){
                this.setState({
                    responseHeader          : "Add Data",
                    responseMessage         : "Data berhasil ditambah",
                    modal_response          : true,
                    value                   : 0,
                    flagDisabled            : true,
                    addedValueDataPrincipal : 0,
                    activeItemIdforNotifVali: this.state.activeItemId
                })
                this.changeEditButton()
                this.getDataPurchasingbyCode();
            }
            
        }

        else{
            console.log("editedValueDataPrincipal :"+this.state.editedValueDataPrincipal+" editedValueContactPrincipal : "+this.state.editedValueContactPrincipal)
            if(this.state.editedValueDataPrincipal == 0 && this.state.editedValueContactPrincipal == 0){
                console.log("noooo")
                this.state.modal_response  = true;
                this.state.responseHeader  = "Edit Data";
                this.state.responseMessage = "Tidak ada perubahan data";
                this.state.flagDisabled = false
                this.getDataPurchasingbyCode();
                this.state.editedValueDataPrincipal = 0
            }
            else if(this.state.editedValueDataPrincipal == 1 && this.state.editedValueContactPrincipal == 1){
                console.log("yesss")
                this.state.modal_response  = true;
                this.state.responseHeader  = "Edit Data";
                this.state.responseMessage = "Data berhasil diedit";   
                this.getDataPurchasingbyCode();         
                this.changeEditButton()
                this.state.flagDisabled = true
                this.state.editedValueDataPrincipal = 0
            }
            else if(this.state.editedValueDataPrincipal == 1 && this.state.editedValueContactPrincipal == 0){
                console.log("yesss 1")
                this.state.modal_response  = true;
                this.state.responseHeader  = "Edit Data";
                this.state.responseMessage = "Data berhasil diedit";   
                this.getDataPurchasingbyCode();         
                this.changeEditButton()
                this.state.flagDisabled = true
                this.state.editedValueDataPrincipal = 0
            }
            else if(this.state.editedValueDataPrincipal == 0 && this.state.editedValueContactPrincipal == 1){
                console.log("yesss 2")
                this.state.modal_response  = true;
                this.state.responseHeader  = "Edit Data";
                this.state.responseMessage = "Data berhasil diedit";   
                this.getDataPurchasingbyCode();         
                this.changeEditButton()
                this.state.flagDisabled = true
                this.state.editedValueDataPrincipal = 0
            }
        }
        
    }

    editContactDatabase(contactListEdit){
    
        var url     = "https://api.docnet.id/CHCMasterD/MasterSupplierContact/UbahSupplierContact";
        var payload =  contactListEdit
        
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
                    .then(data =>{ 
                        console.log("response contact edit : "+data.ResponseCode)
                            if(data.ResponseCode === "200")  {
                                console.log("edit list success")      
                            }
                            else{
                                console.log("edit list not success")
                            }
                        });
    }
    
    updateInputValueContact(value, field) {
        
        if(field == "ConSup_Name"){
            this.setState({
                inputtedContactName : value
            });
        }
        else if (field == "ConSup_JobTitle"){
            this.setState({
                inputtedContactJabatan : value
            })
        }
        else if(field == "ConSup_Number"){
            this.setState({
                inputtedContactNomor : value
            })
        }
        else if(field == "ConSup_Type"){
            if(value == "E"){
                this.setState({
                    selectedJenisContact : value,
                    inputtedJenisContact : "Email"
                })
            }
            else if(value == "F"){
                this.setState({
                    selectedJenisContact : value,
                    inputtedJenisContact : "Fax"
                })
            }
            else if(value == "H"){
                this.setState({
                    selectedJenisContact : value,
                    inputtedJenisContact : "Handphone"
                })
            }
            else if(value == "T"){
                this.setState({
                    selectedJenisContact : value,
                    inputtedJenisContact : "Telephone"
                })
            }
          
        }
        else if(field == "ConSup_PICJP"){
            if (value == true){
                this.setState({
                    isCheckedJP        : !this.state.isCheckedJP,
                    inputtedContactPICJP : 'Y'
                })
                value = 'Y'
               
            }
            else if (value == false){
                this.setState({
                    isCheckedJP        : !this.state.isCheckedJP,
                    inputtedContactPICJP : 'N',
                })
                value = 'N'
                
            }
        }
        else if(field == "ConSup_PrimaryYN"){
            if (value == true){
                this.setState({
                    isCheckedPO        : !this.state.isCheckedPO,
                    inputtedContactPICPO : 'Y'
                })
                value = 'Y'
              
            }
            else if (value == false){
                this.setState({
                    isCheckedPO        : !this.state.isCheckedPO,
                    inputtedContactPICPO : 'N',
                })
                value = 'N'
               
            }
        }

        else if(field == "ConSup_EmailFin"){
            if (value == true){
                this.setState({
                    isCheckedEF        : !this.state.isCheckedEF,
                    inputtedContactEmailFinance : 'Y'
                })
                value = 'Y'
                
            }
            else if (value == false){
                this.setState({
                    isCheckedEF        : !this.state.isCheckedEF,
                    inputtedContactEmailFinance : 'N',
                })
                value = 'N'
              
            }
        }

        let Point = {};
        Point = {...this.state.currentContactPerson };
       
        Point[field] = value;
       
        this.setState({
            currentContactPerson : Point
        });
    }

    openEditContactModal(id, name, jabatan, jenis, kodearea, nomor, pic_jp, pic_po, email_fin ){
        this.setState({
            editValueForContact     : 1,
            modal_contact_person    : true,
            inputtedContactId       : id,
            inputtedContactName     : name,
            inputtedContactJabatan  : jabatan,
            inputtedContactKodeArea : kodearea,
            inputtedContactNomor    : nomor,
            inputtedContactPICJP    : pic_jp,
            inputtedContactPICPO    : pic_po,
            inputtedContactEmailFinance : email_fin,
            selectedJenisContact    : jenis,
            isCheckedJP             : (pic_jp === "Y" ? true : false),
            isCheckedPO             : (pic_po === "Y" ? true : false),
            isCheckedEF             : (email_fin === "Y" ? true : false),
        })
        if(this.state.selectedJenisContact == "E"){
            this.setState({
                inputtedJenisContact : "Email"
            })
        }
        else if(this.state.selectedJenisContact == "F"){
            this.setState({
                inputtedJenisContact : "Fax"
            })
        }
        else if(this.state.selectedJenisContact == "H"){
            this.setState({
                inputtedJenisContact : "Handphone"
            })
        }
        else if(this.state.selectedJenisContact == "T"){
            this.setState({
                inputtedJenisContact : "Telephone"
            })
        }
    }

    getKodeKota()
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
                
                fetch("https://api.docnet.id/CHCMasterD/MasterSupplier/TampilkanSupplierbyCode",option)
                .then(response => response.json())
                .then(data =>{ 
                        if(data.Data === null)  {
                            console.log("data kota kosong")             
                           
                        }
                        else{
                            console.log("data kota tidak kosong")  
                                this.setState({
                                    activeKotaCodeEdit          : data.Data[0].Sup_CityCode
                                })
                            console.log("activeKotaCodeEdit : "+this.state.activeKotaCodeEdit)
                            
                            this.getKodeAreaKota(this.state.activeKotaCodeEdit)
                        }
                    });
                    
    }

    getKodeAreaKota(kode) 
    {   
            const option = {
                method  : "GET",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                }
                fetch("https://api.docnet.id/CHCMasterSupport/MasterKota?kode="+ kode,option)
                .then(response => response.json())
                .then(data =>{ 
                        if(data.data === null)  {   
                            console.log("getKodeAreaKota kosong")
                        }
                        else{
                            this.setState({
                                activeNamaKota      : data.data[0].kota_name,
                                activeKodeTelp      : data.data[0].kota_kodetelp
                            })
                            console.log("kode telp : "+this.state.activeKodeTelp)
                        }
                    });
    }

    updateInputSelectedGroup(name, code){
        this.setState({
            activeGrpName : name,
            activeGrpCode : code
        },()=>this.getDataPurchasingbyCode())
    }


    render() {
        const { result,resultGroup } = this.state;
        console.log(result)

        return (
            <Page
            title       = "Purchasing"
            breadcrumbs = {[{ name: 'Supplier / Purchasing', active: true }]}
            className   = "Purchasing">
                
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
                    isOpen = {this.state.modal_delete}>
                    <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
                        <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
                        <ModalFooter>
                            <Button color = "primary" 
                            onClick = {()=>this.deleteContact(this.state.deleteID,this.state.deleteUrut, this.state.deleteGrpCode, this.state.deleteSupCode)}
                            >
                                Ya
                            </Button>{' '}
                            <Button
                                color   = "secondary"
                                onClick = {()=>this.setState({modal_delete : false})} >
                                Tidak
                            </Button>
                        </ModalFooter>
                </Modal>


                 <Modal
                    isOpen={this.state.modal_contact_person}
                >
                    <ModalHeader>
                        Contact 
                    </ModalHeader>
                    <ModalBody>
                        <Row className = "show-grid mt-3">
                            <Col xs = {8} md = {3}>
                                <Label>Nama</Label>
                            </Col>
                            <Col xs = {2} md = {9}>
                            
                                <Input type = "Nama" value={this.state.inputtedContactName} onChange = {evt => this.updateInputValueContact(evt.target.value, "ConSup_Name")} name = "nama" placeholder = "Nama"/>
                            </Col>
                       </Row>
                        
                       <Row className = "show-grid mt-3">
                            <Col xs = {8} md = {3}>
                                <Label>Jabatan</Label>
                            </Col>
                            <Col xs = {2} md = {9}>
                                <Input type = "Jabatan" value={this.state.inputtedContactJabatan} onChange = {evt => this.updateInputValueContact(evt.target.value, "ConSup_JobTitle")} name = "jabatan" placeholder = "Jabatan"/>
                            </Col>
                       </Row>

                       <Row className = "show-grid mt-3">
                            <Col xs = {8} md = {3}>
                                <Label>Jenis</Label>
                            </Col>
                            <Col xs = {2} md = {4}>
                                <Input type = "Jenis" value={this.state.inputtedJenisContact} name = "jenis" placeholder = "Jenis"/>
                            </Col>
                            <Col> 
                                <UncontrolledButtonDropdown
                                >
                                    <DropdownToggle caret name = "filtermenu" color = "primary">
                                        {this.state.selectedDropdown}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem value = "E" onClick = {evt => this.updateInputValueContact(evt.target.value, "ConSup_Type")}>Email</DropdownItem>
                                        <DropdownItem value = "F" onClick = {evt => this.updateInputValueContact(evt.target.value, "ConSup_Type")}>Fax</DropdownItem>
                                        <DropdownItem value = "H" onClick = {evt => this.updateInputValueContact(evt.target.value, "ConSup_Type")}>Handphone</DropdownItem>                                        
                                        <DropdownItem value = "T" onClick = {evt => this.updateInputValueContact(evt.target.value, "ConSup_Type")}>Telephone</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </Col>
                            
                       </Row>
                    
                       <Row className = "show-grid mt-3">
                            <Col xs = {8} md = {3}>
                                <Label>Kode Area</Label>
                            </Col>
                            <Col xs = {2} md = {9}>
                                <Input type = "Kode Area" 
                                maxLength = {5}
                                value = {this.state.activeKodeTelp} 
                                onChange = {evt => this.updateInputValueContact(evt.target.value, "ConSup_AreaCode")} 
                                name = "kode_area" placeholder = "Kode Area"/>
                            </Col>
                       </Row>
                    
                       <Row className = "show-grid mt-3">
                            <Col xs = {8} md = {3}>
                                <Label>Nomor</Label>
                            </Col>
                            <Col xs = {2} md = {9}>
                                <Input type = "Nomor"value = {this.state.inputtedContactNomor} onChange = {evt => this.updateInputValueContact(evt.target.value, "ConSup_Number")} name = "nomor" placeholder = "Nomor"/>
                            </Col>
                       </Row>
                       <Row>
                            <Col xs = {8} md = {3}>
                            </Col>
                            <Col>
                            
                                <Input type = "checkbox" checked = {this.state.isCheckedPO} value = {this.state.inputtedContactPICPO} onClick ={evt => this.updateInputValueContact(evt.target.checked, "ConSup_PrimaryYN")} style={{marginLeft: "3px"}} name = "PIC_PO" placeholder = "PIC PO" />  
                                <Label style={{marginLeft: "20px"}}> PIC PO</Label>

                                <Input type = "checkbox" checked = {this.state.isCheckedJP} value = {this.state.inputtedContactPICJP} onClick ={evt => this.updateInputValueContact(evt.target.checked, "ConSup_PICJP")} style={{marginLeft: "3px"}} name = "PIC_JP" placeholder = "PIC JP" />  
                                <Label style={{marginLeft: "20px"}}> PIC JP</Label>

                                <Input type = "checkbox" checked = {this.state.isCheckedEF} value = {this.state.inputtedContactEmailFinance} onClick ={evt => this.updateInputValueContact(evt.target.checked, "ConSup_EmailFin")} style={{marginLeft: "3px"}} name = "Email_Finance" placeholder = "Email Finance" />  
                                <Label style={{marginLeft: "20px"}}>Email Finance</Label>
                            </Col>
                       </Row>
                    </ModalBody>
                    <ModalFooter>
                                <Button
                                size="sm"
                                style={{
                                    display: "inline-flex", 
                                    alignItems: "center",
                                    marginRight: "1%",
                                }}
                                onClick = {this.state.editValueForContact==1 ? ()=> this.updateContactTableEdit(this.state.inputtedContactId) : ()=> this.updateContactTable({ ...this.state.currentContactPerson}) }
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
                                onClick={ () => {this.setState({ modal_contact_person : false})}}
                                >
                                    <MdCancel
                                    style = {{
                                        marginRight: "7px"
                                    }}
                                    />Cancel
                                </Button>

                        {/* <Button color="success" onClick={ () => { this.setState({ modal_response: false}) } }>OK</Button> */}
                    </ModalFooter>
                </Modal> 


                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Group Supplier</Label>
                    </Col>
                    <Col xs = {9} md = {2}>
                        { this.state.value ==1 ?
                            <Input type = "GrpCode" value = {this.state.activeGrpName} name = "group_code" placeholder = "GroupCode" />                           
                            :
                            <Input type = "GrpCode" value = {this.state.activeGrpName} name = "group_code" placeholder = "GroupCode" disabled/>                           
                        }
                    </Col>
                    <Col>
                        <UncontrolledButtonDropdown
                        >
                            <DropdownToggle caret name = "filtermenu" color = "primary"></DropdownToggle>
                                <DropdownMenu>
                                    {this.state.resultGroup.map(group=>
                                        <DropdownItem value = {group.Grp_Name} onClick = {evt => this.updateInputSelectedGroup(group.Grp_Name, group.Grp_Code)}>{group.Grp_Name}</DropdownItem>
                                    )}   
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                    </Col>    
                    <Col xs = {8} md = {2}>
                         <Label>Jadwal Buffer</Label>
                    </Col>
                    <Col xs = {8} md = {4}>
                        {
                            this.state.activeItemId ==-1?
                            <Input type = "number" 
                            value = {this.state.activeSchBuffer} 
                            onChange = {(e) => this.handleChange("JadwalBuffer",e)} 
                            placeholder = "Jadwal Buffer"
                            
                            />
                            :
                                this.state.value ==1?
                                <Input type = "number" 
                                value = {this.state.activeSchBuffer}
                                onChange = {(e) => this.handleChange("JadwalBuffer",e)} 
                                placeholder = "Jadwal Buffer" 
                                />
                                :
                                <Input type = "number" 
                                value = {this.state.activeSchBuffer} 
                                onChange = {(e) => this.handleChange("JadwalBuffer",e)} 
                                placeholder = "Jadwal Buffer" disabled/>
                        }
                    </Col>                       
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Min. Pembelian / PO</Label>
                    </Col>
                    <Col xs = {2} md = {3}>
                        { this.state.activeItemId ==-1?
                            <Input type = "number" value = {this.state.activeMinPOVal} onChange = {(e) => this.handleChange("MinPembelian",e)} name = "min_pembelian" placeholder = "Min Pembelian" />
                            :
                                this.state.value ==1?
                                <Input type = "number" value = {this.state.activeMinPOVal} onChange = {(e) => this.handleChange("MinPembelian",e)} name = "min_pembelian" placeholder = "Min Pembelian" />
                                :
                                <Input type = "number" value = {this.state.activeMinPOVal} onChange = {(e) => this.handleChange("MinPembelian",e)} name = "min_pembelian" placeholder = "Min Pembelian" disabled/>
                        }
                    </Col>
            
                    <Col xs = {2} md = {2}>

                        {this.state.activeItemId == -1?
                            <Input type = "checkbox" checked = {this.state.isCheckedEveningPaxYN} style={{marginLeft: "5px"}} value = {this.state.activeEveningPaxYN} onChange={e => this.updateCheckedValue("EveningPax",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedEveningPaxYN} style={{marginLeft: "5px"}} value = {this.state.activeEveningPaxYN} onChange={e => this.updateCheckedValue("EveningPax",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedEveningPaxYN} style={{marginLeft: "5px"}} value = {this.state.activeEveningPaxYN} onChange={e => this.updateCheckedValue("EveningPax",e)} disabled/>
                        }
                        <Label style={{marginLeft: "20px"}}>Fax Malam</Label>
                    </Col>
                    <Col xs = {2} md = {2}>
                        {
                            this.state.activeItemId ==-1?
                            <Input type = "checkbox" checked = {this.state.isCheckedSubDisYN} style={{marginLeft: "5px"}} value = {this.state.activeSubDisYN} onChange={e => this.updateCheckedValue("SubDis",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedSubDisYN} style={{marginLeft: "5px"}} value = {this.state.activeSubDisYN} onChange={e => this.updateCheckedValue("SubDis",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedSubDisYN} style={{marginLeft: "5px"}} value = {this.state.activeSubDisYN} onChange={e => this.updateCheckedValue("SubDis",e)} disabled/>
                        }
                        <Label style={{marginLeft: "20px"}}>SubDis</Label>
                    </Col>
                    <Col xs = {2} md = {2}>
                        {
                            this.state.activeItemId==-1?
                            <Input type = "checkbox" checked = {this.state.isCheckedFirstPOYN} style={{marginLeft: "5px"}} value = {this.state.activeFirstPOYN} onChange={e => this.updateCheckedValue("FirstPO",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedFirstPOYN} style={{marginLeft: "5px"}} value = {this.state.activeFirstPOYN} onChange={e => this.updateCheckedValue("FirstPO",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedFirstPOYN} style={{marginLeft: "5px"}} value = {this.state.activeFirstPOYN} onChange={e => this.updateCheckedValue("FirstPO",e)} disabled/>
                        }          
                        <Label style={{marginLeft: "20px"}}>First PO</Label>
                    </Col>

                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Jadwal Pengiriman PO</Label>
                    </Col>
            
                    <Col xs = {2} md = {1}>
                        {
                            this.state.activeItemId ==-1?
                            <Input type = "checkbox" checked = {this.state.isCheckedHR1} style={{marginLeft: "5px"}} value = {this.state.activeHR1} onChange={e => this.updateCheckedValue("HR1",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedHR1} style={{marginLeft: "5px"}} value = {this.state.activeHR1} onChange={e => this.updateCheckedValue("HR1",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedHR1} style={{marginLeft: "5px"}} value = {this.state.activeHR1} onChange={e => this.updateCheckedValue("HR1",e)} disabled/>
                        }   
                        <Label style={{marginLeft: "20px"}}>Senin</Label>
                    </Col>
                    <Col xs = {2} md = {1}>
                        {
                            this.state.activeItemId == -1?
                            <Input type = "checkbox" checked = {this.state.isCheckedHR2} style={{marginLeft: "5px"}} value = {this.state.activeHR2} onChange={e => this.updateCheckedValue("HR2",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedHR2} style={{marginLeft: "5px"}} value = {this.state.activeHR2} onChange={e => this.updateCheckedValue("HR2",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedHR2} style={{marginLeft: "5px"}} value = {this.state.activeHR2} onChange={e => this.updateCheckedValue("HR2",e)} disabled/>
                        }  
                        <Label style={{marginLeft: "20px"}}>Selasa</Label>
                    </Col>
                    <Col xs = {2} md = {1}>
                        {
                            this.state.activeItemId == -1?
                            <Input type = "checkbox" checked = {this.state.isCheckedHR3} style={{marginLeft: "5px"}} value = {this.state.activeHR3} onChange={e => this.updateCheckedValue("HR3",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedHR3} style={{marginLeft: "5px"}} value = {this.state.activeHR3} onChange={e => this.updateCheckedValue("HR3",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedHR3} style={{marginLeft: "5px"}} value = {this.state.activeHR3} onChange={e => this.updateCheckedValue("HR3",e)} disabled/>
                        }                          
                        <Label style={{marginLeft: "20px"}}>Rabu</Label>
                    </Col>
                    <Col xs = {2} md = {1}>
                        {
                            this.state.activeItemId == -1?
                            <Input type = "checkbox" checked = {this.state.isCheckedHR4} style={{marginLeft: "5px"}} value = {this.state.activeHR4} onChange={e => this.updateCheckedValue("HR4",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedHR4} style={{marginLeft: "5px"}} value = {this.state.activeHR4} onChange={e => this.updateCheckedValue("HR4",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedHR4} style={{marginLeft: "5px"}} value = {this.state.activeHR4} onChange={e => this.updateCheckedValue("HR4",e)} disabled/>
                        }  
                        <Label style={{marginLeft: "20px"}}>Kamis</Label>
                    </Col>
                    <Col xs = {2} md = {1}>
                        {
                            this.state.activeItemId ==-1?
                            <Input type = "checkbox" checked = {this.state.isCheckedHR5} style={{marginLeft: "5px"}} value = {this.state.activeHR5} onChange={e => this.updateCheckedValue("HR5",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedHR5} style={{marginLeft: "5px"}} value = {this.state.activeHR5} onChange={e => this.updateCheckedValue("HR5",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedHR5} style={{marginLeft: "5px"}} value = {this.state.activeHR5} onChange={e => this.updateCheckedValue("HR5",e)} disabled/>
                        }  
                        <Label style={{marginLeft: "20px"}}>Jumat</Label>
                    </Col>
                    <Col xs = {2} md = {1}>
                        {
                            this.state.activeItemId ==-1?
                            <Input type = "checkbox" checked = {this.state.isCheckedHR6} style={{marginLeft: "5px"}} value = {this.state.activeHR6} onChange={e => this.updateCheckedValue("HR6",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedHR6} style={{marginLeft: "5px"}} value = {this.state.activeHR6} onChange={e => this.updateCheckedValue("HR6",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedHR6} style={{marginLeft: "5px"}} value = {this.state.activeHR6} onChange={e => this.updateCheckedValue("HR6",e)} disabled/>
                        }  
                        <Label style={{marginLeft: "20px"}}>Sabtu</Label>
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Jadwal Buffer</Label>
                    </Col>
            
                    <Col xs = {2} md = {1}>
                        {   this.state.activeItemId ==-1?
                            <Input type = "checkbox" checked = {this.state.isCheckedBufferHR1} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR1} onChange={e => this.updateCheckedValue("BufferHR1",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedBufferHR1} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR1} onChange={e => this.updateCheckedValue("BufferHR1",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedBufferHR1} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR1} onChange={e => this.updateCheckedValue("BufferHR1",e)} disabled/>
                        }  
                        <Label style={{marginLeft: "20px"}}>Senin</Label>
                    </Col>
                    <Col xs = {2} md = {1}>
                        {
                            this.state.activeItemId ==-1?
                            <Input type = "checkbox" checked = {this.state.isCheckedBufferHR2} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR2} onChange={e => this.updateCheckedValue("BufferHR2",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedBufferHR2} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR2} onChange={e => this.updateCheckedValue("BufferHR2",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedBufferHR2} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR2} onChange={e => this.updateCheckedValue("BufferHR2",e)} disabled/>
                        }  
                        <Label style={{marginLeft: "20px"}}>Selasa</Label>
                    </Col>
                    <Col xs = {2} md = {1}>
                        {
                            this.state.activeItemId==-1?
                            <Input type = "checkbox" checked = {this.state.isCheckedBufferHR3} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR3} onChange={e => this.updateCheckedValue("BufferHR3",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedBufferHR3} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR3} onChange={e => this.updateCheckedValue("BufferHR3",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedBufferHR3} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR3} onChange={e => this.updateCheckedValue("BufferHR3",e)} disabled/>
                        }  
                        <Label style={{marginLeft: "20px"}}>Rabu</Label>
                    </Col>
                    <Col xs = {2} md = {1}>
                        {
                            this.state.activeItemId == -1?
                            <Input type = "checkbox" checked = {this.state.isCheckedBufferHR4} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR4} onChange={e => this.updateCheckedValue("BufferHR4",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedBufferHR4} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR4} onChange={e => this.updateCheckedValue("BufferHR4",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedBufferHR4} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR4} onChange={e => this.updateCheckedValue("BufferHR4",e)} disabled/>
                        } 
                        <Label style={{marginLeft: "20px"}}>Kamis</Label>
                    </Col>
                    <Col xs = {2} md = {1}>
                        {
                            this.state.activeItemId ==-1?
                            <Input type = "checkbox" checked = {this.state.isCheckedBufferHR5} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR5} onChange={e => this.updateCheckedValue("BufferHR5",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedBufferHR5} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR5} onChange={e => this.updateCheckedValue("BufferHR5",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedBufferHR5} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR5} onChange={e => this.updateCheckedValue("BufferHR5",e)} disabled/>
                        } 
                        <Label style={{marginLeft: "20px"}}>Jumat</Label>
                    </Col>
                    <Col xs = {2} md = {1}>
                        {
                            this.state.activeItemId ==-1?
                            <Input type = "checkbox" checked = {this.state.isCheckedBufferHR6} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR6} onChange={e => this.updateCheckedValue("BufferHR6",e)} />
                            :
                                this.state.value ==1?
                                <Input type = "checkbox" checked = {this.state.isCheckedBufferHR6} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR6} onChange={e => this.updateCheckedValue("BufferHR6",e)} />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedBufferHR6} style={{marginLeft: "5px"}} value = {this.state.activeBufferHR6} onChange={e => this.updateCheckedValue("BufferHR6",e)} disabled/>
                        } 
                        <Label style={{marginLeft: "20px"}}>Sabtu</Label>
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Contact</Label>
                    </Col>
                    <Col xs = {2} md = {9}>
                        {this.state.activeItemId == -1 
                            ?
                            <Button size="sm" onClick = {()=>this.openAddContactModal()}>Add Contact</Button>
                            :
                                this.state.value ==1?
                                <Button size="sm" onClick = {()=>this.openAddContactModal()}>Add Contact</Button>
                                :
                                <Button size="sm" onClick = {()=>this.openAddContactModal()} disabled>Add Contact</Button>
                        }

                    </Col>

                    
                    <Col xs = {8} md = {3}></Col>
                    <Col xs = {2} md = {9}>
                        <Table responsive>
                            <thead>
                                <th>Nama</th>
                                <th>Jabatan</th>
                                <th>Jenis</th>
                                <th>Kode Area</th>
                                <th>Nomor</th>
                                <th>Action</th>

                            </thead>
                            <tbody>
                            {this.state.resultContact.map(contact => 
                                <tr>
                                      
                                    <td>{contact.ConSup_Name}</td>
                                    <td>{contact.ConSup_JobTitle}</td>
                                    <td>{contact.ConSup_Type}</td>
                                    <td>{contact.ConSup_AreaCode}</td>
                                    <td>{contact.ConSup_Number}</td>
                                    <td>
                                        <Button disabled = {this.state.flagDisabled} size="sm" onClick={()=>this.openEditContactModal(contact.ConSup_RunningID, contact.ConSup_Name, contact.ConSup_JobTitle, contact.ConSup_Type, contact.ConSup_AreaCode, contact.ConSup_Number,contact.ConSup_PICJP,contact.ConSup_PrimaryYN, contact.ConSup_EmailFin)} >Edit</Button>{"  "}
                                        {/* <Button size="sm" onClick={()=>this.deleteContact(contact.ConSup_RunningID, contact.ConSup_Urut, contact.ConSup_GrpCode, contact.ConSup_SupCode)} >Delete</Button> */}
                                        <Button disabled = {this.state.flagDisabled} size="sm" onClick={()=>
                                            this.setState({modal_delete : true, 
                                                deleteID : contact.ConSup_RunningID, 
                                                deleteUrut : contact.ConSup_Urut, 
                                                deleteGrpCode : contact.ConSup_GrpCode, 
                                                deleteSupCode : contact.ConSup_SupCode}) }>Delete
                                        </Button>
                                    </td>
                                </tr>    
                            )}
                            </tbody>
                        </Table>
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
                        onClick = {()=> this.addPurchaseSupplier(this.state.activeItemId)}
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
                        onClick = {this.state.editValue ==1 ? 
                            ()=> this.editPurchaseSupplier() 
                            : 
                            ()=> this.addPurchaseSupplier()}
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
export default Supplier_Purchasing;
