import Page from 'components/Page';
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import dateFormat from 'dateformat';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, Nav, Form,
    Navbar,UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup,InputGroup, InputGroupAddon, FormGroup, CardFooter
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdAdd, MdDelete, MdSearch, MdEdit, MdCancel, MdSave } from 'react-icons/md';
import { runInThisContext } from 'vm';
import { withRouter } from 'react-router-dom';
import Principal_Tab from './Principal_Tab';

const ContactPerson = {
    ContPrin_RunningID    : "",
    ContPrin_Pricode      : "",
    ContPrin_Nama         : "",
    ContPrin_Jabatan      : "",
    ContPrin_Jenis        : "",
    ContPrin_PICJP        : "N",
    ContPrin_KodeArea     : "",
    ContPrin_Nomor        : "",
}

class Principal_DataPrincipal extends React.Component {
    constructor(props) {
        super(props);
        this.state  = {
            result                  : [],
            resultContact           : [],
            value                   : 0,
            resultListKota          : [],
            resultListKecamatan     : [],
            activeItemId            : this.props.activeItemId,
            activeItemIdforNotifVali: this.props.activeItemId,
            groupStatus             : this.props.groupStatus,
            activeItemName          : '',
            isCheckedDPPersen       : false,
            isCheckedDanaValue      : false,
            isCheckedJP             : false,
            inputtedContactPICJP    : 'N',
            activeDPPeriodStartEdit : dateFormat(new Date, "yyyy-mm-dd"),
            activeDPPeriodEndEdit   : dateFormat(new Date, "yyyy-mm-dd"),
            currentContactPerson    : { ...ContactPerson},
            editValueForContact     : 0,   
            editedValueDataPrincipal    : 0,
            editedValueContactPrincipal : 0,
            addedValueDataPrincipal     : 0,
            
        };

        console.log("value : " + this.state.value)
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
        modal_response       : false,
        modal_contact_person : false,
        responseHeader       : "",
        responseMessage      : "",
    };

    getKecamatan(kode) 
    {   
            const option = {
                method  : "GET",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                }
                fetch("https://api.docnet.id/CHCMasterD/Kecamatan?kode="+kode,option)
                .then(response => response.json())
                .then(data =>{ 
                        if(data.Data === null)  {   
                            this.setState({ resultListKecamatan : [], isLoading: false})
                            console.log("list kecamatan kosong")
                        }
                        else{
                            this.setState({ resultListKecamatan: data.Data, isLoading: false})   
                            console.log("list kecamatan tidak kosong")                         }
                    });
            
    }

    componentDidMount() {
        if(this.state.activeItemId !== -1){
            this.getDataPrincipalbyCode()
            this.state.flagDisabled = true
        }
        else{
            this.getListKota()
            this.getListKecamatan()
            this.state.flagDisabled = false
        }
    }

    addDataPrincipal(){
        var successValidation = true;
        if(this.state.activeNameEdit == "" || this.state.activeNameEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeAlamatEdit == "" || this.state.activeAlamatEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Alamat tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeKotaCodeEdit == "" || this.state.activeKotaCodeEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Kota tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeKodeposEdit == "" || this.state.activeKodeposEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Kode Pos tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(isNaN(this.state.activeKodeposEdit)){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Kode Pos harus angka",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeKecamatanCodeEdit == "" || this.state.activeKecamatanCodeEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Kecamatan tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeNoTelpEdit == "" || this.state.activeNoTelpEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nomor telepon tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeFaxEdit == "" || this.state.activeFaxEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Fax tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activePenanggungJawabEdit == "" || this.state.activePenanggungJawabEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Penanggung jawab tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeEdlpEdit == "" || this.state.activeEdlpEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "EDLP tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeEdlpEdit > 100){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "EDLP tidak melebihi 100",
                modal_response  : true})
                successValidation = false;
        }
        console.log("console sesuatu")
        if(successValidation == true){
        var payload = {
            Pri_UserID        : "123",
            Pri_Group         : parseInt(this.state.groupStatus),
            Pri_Name          : this.state.activeNameEdit,
            Pri_Address       : this.state.activeAlamatEdit,
            Pri_CityCode      : parseInt(this.state.activeKotaCodeEdit),
            Pri_PostalCode    : this.state.activeKodeposEdit,
            Pri_KecID         : parseInt(this.state.activeKecamatanCodeEdit),
            Pri_PhoneCode     : this.state.activeKodeAreaTelpEdit,
            Pri_TelpNumber    : this.state.activeNoTelpEdit,
            Pri_FaxNumber     : this.state.activeFaxEdit,
            Pri_Contact       : this.state.activePenanggungJawabEdit,
            Pri_EDLP          : parseInt(this.state.activeEdlpEdit),
            Pri_DPPercentage  : parseFloat(this.state.activeDPPercentageEdit),
            Pri_DPValueRupiah : parseFloat(this.state.activeDPValueRupiahEdit),
            Pri_DPPeriodStart : this.state.activeDPPeriodStartEdit,
            Pri_DPPeriodEnd   : this.state.activeDPPeriodEndEdit,
        };
            console.log("a "+this.state.groupStatus)
            console.log("b "+this.state.activeNameEdit)
            console.log("c "+this.state.activeAlamatEdit)
            console.log(this.state.activeKotaCodeEdit)
            console.log(this.state.activeKodeposEdit)
            console.log(this.state.activeKecamatanCodeEdit)
            console.log(this.state.activeKodeAreaTelpEdit)
            console.log(this.state.activeNoTelpEdit)
            console.log(this.state.activeFaxEdit)
            console.log(this.state.activeEdlpEdit)
            console.log(this.state.activeDPPercentageEdit)
            console.log(this.state.activeDPValueRupiahEdit)
            console.log(this.state.activeDPPeriodStartEdit)
            console.log(this.state.activeDPPeriodEndEdit)
            
            const option = {
            method  : "POST",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            body: JSON.stringify(payload)
            }
            
            fetch("https://api.docnet.id/CHCMasterD/MasterPrincipal/TambahPrincipal",option)
            .then(response => response.json())
            .then(response => {
                console.log("RESPONSE STATUS ADD : "+response.ResponseCode)
                if (response.ResponseCode == "200") {
                    console.log("jalan add true : ")
                    
                    this.setState({
                        addedValueDataPrincipal : 1
                    })
                    this.getPrincipalKodebyName()
                    
                }
                else if (response.ResponseCode == "405"){
                    console.log("jalan add false : ")
                    // this.state.activeNameEdit           = "";
                    // this.state.activeAlamatEdit         = "";
                    // this.state.activeKotaEdit           = "";
                    // this.state.activeKotaCodeEdit       = "";
                    // this.state.activeKodeposEdit        = "";
                    // this.state.activeKecamatanEdit      = "";
                    // this.state.activeKecamatanCodeEdit  = "";
                    // this.state.activeKodeAreaTelpEdit   = "";
                    // this.state.activeNoTelpEdit         = "";
                    // this.state.activeFaxEdit            = "";
                    // this.state.activeEdlpEdit           = "";
                    // this.state.activeDPPercentageEdit   = "";
                    // this.state.isCheckedDPPersen        = false;
                    // this.state.activeDPValueRupiahEdit  = "";
                    // this.state.isCheckedDanaValue       = false;
                    // this.state.activeDPPeriodStartEdit  = "";
                    // this.state.activeDPPeriodEndEdit    = "";
                    // this.state.activePenanggungJawabEdit= "";
                    // this.state.activePrincipalPICEdit   = "";
                    this.state.responseHeader  = "Add Data";
                    this.state.responseMessage = "Data sudah ada";
                    this.state.modal_response  = true; 
                    this.componentDidMount();
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
        }
    }
    
    getPrincipalKodebyName(){
        var payload = {
            Pri_Name : this.state.activeNameEdit
        };
        const option = {
            method  : "POST",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            body: JSON.stringify(payload)
            }
            
            fetch("https://api.docnet.id/CHCMasterD/MasterPrincipal/CariNamaPrincipal",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.ResponseCode === "200")  {
                        console.log("data get principal code gagal")
                        console.log("data code : "+data.Data[0].Pri_Code)
                        this.setState({
                            activeItemId : data.Data[0].Pri_Code,
                        })
                        
                        this.updatePriCodeContact(this.state.activeItemId)
                        this.saveContactList()
                        this.getDataPrincipalbyCode();
                    }
                    else{
                        console.log("data get principal code kosong") 
                    }            
                })
                
                ;
    
    }

    getDataPrincipalbyCode()
    {   
        console.log("JALAN GET DATA PRINCIPAL");
        this.getListKota()
        this.getContactPrincipalbyCode()
            var payload = {
                Pri_Code : this.state.activeItemId
            };
            const option = {
                method  : "POST",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                body: JSON.stringify(payload)
                }
                
                fetch("https://api.docnet.id/CHCMasterD/MasterPrincipal/TampilkanPrincipalbyCode",option)
                .then(response => response.json())
                .then(data =>{ 
                        if(data.Data === null)  {
                            console.log("data principal kosong")             
                            this.setState({ result: [], isLoading: false})
                            // this.connectionOut("Data Principal Kosong", false)
                        }
                        else{
                            console.log("data principal tidak kosong")
                            this.setState({ result: data.Data, isLoading: false})
                            this.state.result.map(principal => 
                                this.setState({
                                    activeNameEdit            : principal.Pri_Name,
                                    activeAlamatEdit          : principal.Pri_Address,
                                    activeKotaCodeEdit        : principal.Pri_CityCode,
                                    activeKodeposEdit         : principal.Pri_PostalCode,
                                    activeNoTelpEdit          : principal.Pri_TelpNumber,
                                    activeFaxEdit             : principal.Pri_FaxNumber,
                                    activeKecamatanCodeEdit   : principal.Pri_KecID,
                                    activePenanggungJawabEdit : principal.Pri_Contact,
                                    activeEdlpEdit            : principal.Pri_EDLP,
                                    activeDPPercentageEdit    : principal.Pri_DPPercentage,
                                    activeDPValueRupiahEdit   : principal.Pri_DPValueRupiah,
                                    activeDPPeriodStartEdit   : principal.Pri_DPPeriodStart,
                                    activeDPPeriodEndEdit     : principal.Pri_DPPeriodEnd
                                })
                            )
                        }
                        // console.log("tanggal1 :"+dateFormat(this.state.activeDPPeriodStartEdit, "ddd mmm dd yyyy"))
                        // this.getListNamaKota(this.state.activeKotaCodeEdit);
                        // this.getListNamaKecamatan(this.state.activeKecamatanCodeEdit);
                        this.getKecamatan(this.state.activeKotaCodeEdit)
                        this.getKotaKecamatan()                     
                    });
        
    }

    getContactPrincipalbyCode()
    {   
        var payload = {
            ContPrin_PriCode : this.state.activeItemId
        };
        const option = {
            method  : "POST",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            body: JSON.stringify(payload)
            }
            
            fetch("https://api.docnet.id/CHCMasterD/MasterPrincipalContact/TampilkanPrincipalContactbyCode",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.Data === null)  {
                        console.log("data contact principal kosong")             
                        this.setState({ resultContact: [], isLoading: false})
                        
                        // this.connectionOut("Data Contact Principal Kosong", false)
                    }
                    else{
                        console.log("data contact principal tidak kosong")
                        this.setState({ resultContact: data.Data, isLoading: false})
                       
                    }
              
                });
        
    }

    editDataPrincipal  = () => {
        var successValidation = true;
        
        if(this.state.activeAlamatEdit == "" || this.state.activeAlamatEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Alamat tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeKotaCodeEdit == "" || this.state.activeKotaCodeEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Kota tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeKodeposEdit == "" || this.state.activeKodeposEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Kode Pos tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        
        else if(isNaN(this.state.activeKodeposEdit)){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Kode Pos harus angka",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeKecamatanCodeEdit == "" || this.state.activeKecamatanCodeEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Kecamatan tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeNoTelpEdit == "" || this.state.activeNoTelpEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nomor telepon tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeFaxEdit == "" || this.state.activeFaxEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Fax tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activePenanggungJawabEdit == "" || this.state.activePenanggungJawabEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Penanggung jawab tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeEdlpEdit == "" || this.state.activeEdlpEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "EDLP tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeEdlpEdit > 100){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "EDLP tidak boleh melebihi 100",
                modal_response  : true})
                successValidation = false;
        }
       
        console.log("edit masuk");
        console.log("group : " +this.state.groupStatus);

        if(successValidation == true){
        var url     = `https://api.docnet.id/CHCMasterD/MasterPrincipal/UbahPrincipal`;
        var payload = {
            Pri_UserID        : "123",
            Pri_Code          : this.state.activeItemId,
            Pri_Group         : parseInt(this.state.groupStatus),
            Pri_Address       : this.state.activeAlamatEdit,
            Pri_CityCode      : parseInt(this.state.activeKotaCodeEdit),
            Pri_PostalCode    : this.state.activeKodeposEdit,
            Pri_KecID         : parseInt(this.state.activeKecamatanCodeEdit),
            Pri_PhoneCode     : this.state.activeKodeAreaTelpEdit,
            Pri_TelpNumber    : this.state.activeNoTelpEdit,
            Pri_FaxNumber     : this.state.activeFaxEdit,
            Pri_Contact       : this.state.activePenanggungJawabEdit,
            Pri_EDLP          : parseInt(this.state.activeEdlpEdit),
            Pri_DPPercentage  : parseFloat(this.state.activeDPPercentageEdit),
            Pri_DPValueRupiah : parseFloat(this.state.activeDPValueRupiahEdit),
            Pri_DPPeriodStart : this.state.activeDPPeriodStartEdit,
            Pri_DPPeriodEnd   : this.state.activeDPPeriodEndEdit    
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
                else if (response.ResponseCode == "410"){
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
    
    getListKota = () =>{
            const option = {
                method  : "GET",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                }
                
                fetch("https://api.docnet.id/CHCMasterSupport/MasterKota?page=0&length=0",option)
                .then(response => response.json())
                .then(data =>{ 
                        if(data.data.length===0)  {
                            console.log("Data Kota Kosong")             
                            this.setState({ resultListKota: [], isLoading: false})
                            this.connectionOut("Data Kota Kosong", false)
                        }
                        else{
                            console.log("data kota count : "+data.data.length)
                            console.log("data kota tidak kosong")  
                            this.setState({ resultListKota: data.data, isLoading: false})
                        }
                    });
    }

    getListKecamatan = () =>{
            const option = {
                method  : "GET",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                }
                fetch("https://api.docnet.id/CHCMasterD/Kecamatan?name=jem&start=1&length=3",option)
                .then(response => response.json())
                .then(data =>{ 
                      
                        if(data.Data.length===0)  {
                            console.log("Data kecamatan Kosong")             
                            this.setState({ resultListKecamatan : [], isLoading: false})
                            this.connectionOut("Data Kecamatan Kosong", false)
                        }
                        else{   
                            console.log("data kecamatan tidak kosong")  
                            this.setState({ resultListKecamatan: data.Data, isLoading: false})
                        }
                    });
    }
 
    getKotaKecamatan (){
        var url     = "https://api.docnet.id/CHCMasterD/MasterPrincipal/TranslateCode";
        var payload = {
            Pri_CityCode     : parseInt(this.state.activeKotaCodeEdit),
            Pri_KecID        : parseInt(this.state.activeKecamatanCodeEdit)
        }
        console.log("masuk : "+this.state.activeKotaCodeEdit)
        console.log("masuk : "+this.state.activeKecamatanCodeEdit)
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
                            if(data.Data === null)  {
                                console.log("Data Nama Kota Kosong")      
                            }
                            else{
                                console.log("data Nama Kota tidak kosong")
                                    this.setState({
                                        activeKotaEdit         : data.Data.CityCode,
                                        activeKodeAreaTelpEdit : data.Data.TelpCode,
                                        activeKecamatanEdit    : data.Data.KecCode
                                    })
                                
                                console.log("ohyeah : " +data.Data.CityCode)
                                console.log("sudah masuk")
                            }
                        });
    }

    saveContactList(){
        var url     = "https://api.docnet.id/CHCMasterD/MasterPrincipal/TambahPrincipalContactList";
        var payload = this.state.resultContact
        
        console.log("savecontactini")
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
                                console.log("save contact list success")      
                                
                                this.setState({
                                    editedValueContactPrincipal : 1
                                })
                                
                                this.responseDataAndContactPrincipal()
                                this.getContactPrincipalbyCode()
                                
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
            }
            else if(this.state.addedValueDataPrincipal == 1 && this.state.editedValueContactPrincipal == 0){
                this.setState({
                    responseHeader          : "Add Data",
                    responseMessage         : "Data Principal berhasil ditambah, Data Contact tidak berhasil ditambah",
                    modal_response          : true,
                    value                   : 0,
                    flagDisabled            : true,
                    addedValueDataPrincipal : 0,
                    activeItemIdforNotifVali: this.state.activeItemId
                })
            }
            
        }

        else{
            console.log("editedValueDataPrincipal :"+this.state.editedValueDataPrincipal+" editedValueContactPrincipal : "+this.state.editedValueContactPrincipal)
            if(this.state.editedValueDataPrincipal == 0 && this.state.editedValueContactPrincipal == 0){
                console.log("noooo")
                this.componentDidMount();
                this.state.modal_response  = true;
                this.state.responseHeader  = "Edit Data";
                this.state.responseMessage = "Tidak ada perubahan data";
                this.state.flagDisabled = false;
                this.state.editedValueDataPrincipal = 0
            }
            else if(this.state.editedValueDataPrincipal == 1 && this.state.editedValueContactPrincipal == 1){
                console.log("yesss")
                this.componentDidMount();
                this.state.modal_response  = true;  
                this.state.responseHeader  = "Edit Data";
                this.state.responseMessage = "Data berhasil diedit";  
                this.changeEditButton()
                this.state.flagDisabled = true
                this.state.editedValueDataPrincipal = 0
            }
            else if(this.state.editedValueDataPrincipal == 1 && this.state.editedValueContactPrincipal == 0){
                console.log("yesss 1")
                this.componentDidMount();
                this.state.modal_response  = true;  
                this.state.responseHeader  = "Edit Data";
                this.state.responseMessage = "Data berhasil diedit";  
                this.changeEditButton()
                this.state.flagDisabled = true
                this.state.editedValueDataPrincipal = 0
            }
            else if(this.state.editedValueDataPrincipal == 0 && this.state.editedValueContactPrincipal == 1){
                console.log("yesss 2")
                this.componentDidMount();
                this.state.modal_response  = true;  
                this.state.responseHeader  = "Edit Data";
                this.state.responseMessage = "Data berhasil diedit";  
                this.changeEditButton()
                this.state.flagDisabled = true
                this.state.editedValueDataPrincipal = 0
            }
        }
        
    }

    toggleChange = () => {
        this.setState({
          isChecked: !this.state.isChecked,
        });
    }

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateCheckedValue(type,e) {
        console.log(e.target.checked)
        
        var inputDPPersen = document.getElementById("inputDPPersen");
        var inputDPValue  = document.getElementById("inputDPValue");
        console.log("cekandricek :"+inputDPPersen.disabled)

        if(type === "DPPersen"){
            if(e.target.checked==true){
                this.setState({
                    isCheckedDPPersen : !this.state.isCheckedDPPersen
                })
                inputDPPersen.disabled = false
                console.log("status DP Persen : " + this.state.isCheckedDPPersen);   
            }
            else if(e.target.checked==false){
                this.setState({
                    isCheckedDPPersen : !this.state.isCheckedDPPersen
                })
                inputDPPersen.disabled = true
                this.state.activeDPPercentageEdit    = "";
                console.log("status DP Persen : " + this.state.isCheckedDPPersen);
            }
        }
        if(type === "DPValue"){
            if(e.target.checked==true){
                this.setState({
                    isCheckedDanaValue : !this.state.isCheckedDanaValue,
                })
                inputDPValue.disabled = false
                console.log("status DP Persen : " + this.state.isCheckedDPPersen);   
            }
            else if(e.target.checked==false){
                this.setState({
                    isCheckedDanaValue : !this.state.isCheckedDanaValue,
                })
                inputDPValue.disabled = true
                this.state.activeDPValueRupiahEdit = "";
            }
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

    handleEditChange = (type, event) => {
        if (type === "EditAlamat"){
            this.setState({
            activeAlamatEdit : event.target.value
            });
        } else if(type === "EditNama"){
            this.setState({
            activeNameEdit : event.target.value
            })
        } else if (type === "EditKodePos"){
            this.setState({
            activeKodeposEdit : event.target.value
            }); 
        } else if (type === "EditKecamatan"){
            this.setState({
            activeKecamatanEdit : event.target.value,
            activeKecamatanCodeEdit : event.target.id
            });
        } else if (type === "EditKodeAreaTelp"){
            
        } else if (type === "EditNoTelp"){
            this.setState({
            activeNoTelpEdit : event.target.value
            });
        } else if (type === "EditFax"){
            this.setState({
            activeFaxEdit : event.target.value
            });
        }else if (type === "EditPenanggungJawab"){
            this.setState({
            activePenanggungJawabEdit : event.target.value
            });
        }else if (type === "EditEdlp"){
            this.setState({
            activeEdlpEdit : event.target.value
            });
        }else if (type === "EditDPPercentage"){
            this.setState({
            activeDPPercentageEdit : event.target.value
            });
        }else if (type === "EditDPValueRupiah"){
            this.setState({
            activeDPValueRupiahEdit : event.target.value
            });
        }else if (type === "EditDPPeriodStart"){
            this.setState({
            activeDPPeriodStartEdit : event.target.value
            });
        }else if (type === "EditDPPeriodEnd"){
            this.setState({
            activeDPPeriodEndEdit : event.target.value
            });
        }else if(type === "EditPrincipalPIC"){
            this.setState({
                activePrincipalPICEdit : event.target.value
            });
        }
    }

    handleEditChangeKota=(id,nama,kodetelp)=>{
        this.setState({
            activeKotaEdit           : nama,
            activeKotaCodeEdit       : id,
            activeKodeAreaTelpEdit   : kodetelp,
            activeKecamatanEdit : ""
            },()=>this.getKecamatan(this.state.activeKotaCodeEdit));    
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

    updatePriCodeContact(id){
        console.log(this.state.resultContact.length);
        const tempResult=this.state.resultContact;
        for(let i = 0 ; i<  this.state.resultContact.length ; i++){
                console.log("update pricode ")
                console.log(this.state)
                tempResult[i].ContPrin_PriCode = id;
                this.setState({
                    resultContact:tempResult
                });
        }
    }
 
    updateContactTable=(todo)=>{
       
        var length = this.state.resultContact.length
        todo["ContPrin_KodeArea"]   = this.state.activeKodeAreaTelpEdit
        todo["ContPrin_PICJP"]     = this.state.inputtedContactPICJP
        if(length == 0){
            todo["ContPrin_RunningID"]     = 0+1
        }
        else{
            todo["ContPrin_RunningID"]     = this.state.resultContact[length-1].ContPrin_RunningID + 1
        }
        
        this.setState(prevState => ({
            resultContact           : [...prevState.resultContact, todo],
            modal_contact_person    : false,
        }));

        console.log(this.state.resultContact)
    }
    

    updateContactTableEdit=(id) =>{
        console.log("update edit contact")
        var temporary_result = this.state.resultContact;

        for(let i = 0 ; i< temporary_result.length ; i++){
            if(temporary_result[i].ContPrin_RunningID == id){
                console.log("update edit ")
                console.log(this.state)
                temporary_result[i].ContPrin_Nomor = this.state.inputtedContactNomor
                temporary_result[i].ContPrin_Nama = this.state.inputtedContactName
                temporary_result[i].ContPrin_Jabatan = this.state.inputtedContactJabatan
                temporary_result[i].ContPrin_KodeArea = this.state.inputtedContactKodeArea
                temporary_result[i].ContPrin_Jenis = this.state.selectedJenisContact
                temporary_result[i].ContPrin_PICJP = this.state.inputtedContactPICJP
                this.setState({
                    resultContact           : temporary_result,
                    inputtedContactId       : "",
                    modal_contact_person    : false
                })
                if(temporary_result[i].ContPrin_PriCode !== ""  && temporary_result[i].ContPrin_PriCode !== undefined){
                    this.editContactDatabase(temporary_result[i])
                }
              
                return;
            }
        }
    }

    editContactDatabase(contactListEdit){
    
        var url     = "https://api.docnet.id/CHCMasterD/MasterPrincipal/UbahPrincipalContact";
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
    
        if(field == "ContPrin_Nama"){
            this.setState({
                inputtedContactName : value
            });
        }
        else if (field == "ContPrin_Jabatan"){
            this.setState({
                inputtedContactJabatan : value
            })
        }
        else if(field == "ContPrin_Nomor"){
            this.setState({
                inputtedContactNomor : value
            })
        }
        else if(field == "ContPrin_Jenis"){
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
        else if(field == "ContPrin_PICJP"){
            if (value == true){
                this.setState({
                    isCheckedJP        : !this.state.isCheckedJP,
                    inputtedContactPICJP : 'Y'
                })
                value = 'Y'
                console.log ("value : "+value) 
                console.log ("nilai jp : " + this.state.inputtedContactPICJP)
                console.log ("true/false jp : " + this.state.isCheckedJP)
            }
            else if (value == false){
                this.setState({
                    isCheckedJP        : !this.state.isCheckedJP,
                    inputtedContactPICJP : 'N',
                })
                value = 'N'
                console.log ("value : "+value) 
                console.log ("nilai jp : " + this.state.inputtedContactPICJP)
                console.log ("true/false jp : " + this.state.isCheckedJP)
            }
        }

        let Point = {};
        Point = {...this.state.currentContactPerson };
       
        Point[field] = value;
       
        this.setState({
            currentContactPerson : Point
        });
    }

    openEditContactModal(id, name, jabatan, jenis, kodearea, nomor, pic_jp){
        this.setState({
            editValueForContact     : 1,
            modal_contact_person    : true,
            inputtedContactId       : id,
            inputtedContactName     : name,
            inputtedContactJabatan  : jabatan,
            inputtedContactKodeArea : kodearea,
            inputtedContactNomor    : nomor,
            inputtedContactPICJP    : pic_jp,
            selectedJenisContact    : jenis,
            isCheckedJP             : (pic_jp === "Y" ? true : false),
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
            isCheckedJP             : false,
        })
    }

    deleteContact(id, urut){
        var temporary_result = this.state.resultContact;
     
        for(let i = 0 ; i< temporary_result.length ; i++){
            if(temporary_result[i].ContPrin_RunningID == id){
                console.log("contprin_pricode : "+temporary_result[i].ContPrin_PriCode)
                if(temporary_result[i].ContPrin_PriCode !== "" && temporary_result[i].ContPrin_PriCode !== undefined){
                    this.deleteContactDatabase(urut)
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

    deleteContactDatabase(urut){
        var url     = "https://api.docnet.id/CHCMasterD/MasterPrincipal/HapusPrincipalContact";
        var payload = {
            ContPrin_PriCode     : this.state.activeItemId,
            ContPrin_Urut        : parseInt(urut)
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
                            }
                            else{
                                console.log("delete list not success")
                            }
                        });
    }

    updateSelectionValue(event){
        this.setState({
            selectedJenisContact : event.target.value
        })
    }

    render() {
        const { result, resultListKota, resultListKecamatan, resultContact} = this.state;
        console.log(result)

        return (
            <Page
            title       = "Data Principal"
            breadcrumbs = {[{ name: 'Data Principal', active: true }]}
            className   = "DataPrincipal">


            <CardHeader>
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>No. Principal</Label>
                    </Col>
                    <Col xs = {2} md = {9}>
                        {
                            this.state.activeItemId == -1 ?
                                <Input type = "Code" value = "-" name = "code" placeholder = "Code" disabled/>
                            :
                                <Input type = "Code" value = {this.state.activeItemId} onChange = {(e) => this.updateInputValue("Code",e)} name = "code" placeholder = "Code" disabled/>
                        }     
                    </Col>
                </Row>
            </CardHeader>

            <CardBody>

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
                        <Button color="success" onClick={ () => { this.setState({ modal_response: false}) } }>OK</Button>
                    </ModalFooter>
                </Modal>
                
                <Modal
                    isOpen = {this.state.modal_delete}>
                    <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
                        <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
                        <ModalFooter>
                            <Button color = "primary" 
                            onClick = {()=>this.deleteContact(this.state.deleteID,this.state.deleteUrut)}
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
                    toggle={this.toggle('contact_person')}
                >
                    <ModalHeader toggle = {this.toggle('contact_person')}>
                        Contact Person
                    </ModalHeader>
                    <ModalBody>
                        <Row className = "show-grid mt-3">
                            <Col xs = {8} md = {3}>
                                <Label>Nama</Label>
                            </Col>
                            <Col xs = {2} md = {9}>
                                <Input type = "Nama" value={this.state.inputtedContactName} onChange = {evt => this.updateInputValueContact(evt.target.value, "ContPrin_Nama")} name = "nama" placeholder = "Nama"/>
                            </Col>
                       </Row>
                        
                       <Row className = "show-grid mt-3">
                            <Col xs = {8} md = {3}>
                                <Label>Jabatan</Label>
                            </Col>
                            <Col xs = {2} md = {9}>
                                <Input type = "Jabatan" value={this.state.inputtedContactJabatan} onChange = {evt => this.updateInputValueContact(evt.target.value, "ContPrin_Jabatan")} name = "jabatan" placeholder = "Jabatan"/>
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
                                        <DropdownItem value = "E" onClick = {evt => this.updateInputValueContact(evt.target.value, "ContPrin_Jenis")}>Email</DropdownItem>
                                        <DropdownItem value = "F" onClick = {evt => this.updateInputValueContact(evt.target.value, "ContPrin_Jenis")}>Fax</DropdownItem>
                                        <DropdownItem value = "H" onClick = {evt => this.updateInputValueContact(evt.target.value, "ContPrin_Jenis")}>Handphone</DropdownItem>                                        
                                        <DropdownItem value = "T" onClick = {evt => this.updateInputValueContact(evt.target.value, "ContPrin_Jenis")}>Telephone</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </Col>
                            <Col>
                                <Input type = "checkbox" checked = {this.state.isCheckedJP} value = {this.state.inputtedContactPICJP} onClick ={evt => this.updateInputValueContact(evt.target.checked, "ContPrin_PICJP")} style={{marginLeft: "3px"}} name = "PIC_JP" placeholder = "PIC_JP" />  
                                <Label style={{marginLeft: "20px"}}> PIC JP</Label>
                            </Col>
                       </Row>
                    
                       <Row className = "show-grid mt-3">
                            <Col xs = {8} md = {3}>
                                <Label>Kode Area</Label>
                            </Col>
                            <Col xs = {2} md = {9}>
                                <Input type = "Kode Area" 
                                maxLength = {5}
                                value = {this.state.activeKodeAreaTelpEdit} 
                                onChange = {evt => this.updateInputValueContact(evt.target.value, "ContPrin_KodeArea")} 
                                name = "kode_area" placeholder = "Kode Area"/>
                            </Col>
                       </Row>
                    
                       <Row className = "show-grid mt-3">
                            <Col xs = {8} md = {3}>
                                <Label>Nomor</Label>
                            </Col>
                            <Col xs = {2} md = {9}>
                                <Input type = "Nomor"value = {this.state.inputtedContactNomor} onChange = {evt => this.updateInputValueContact(evt.target.value, "ContPrin_Nomor")} name = "nomor" placeholder = "Nomor"/>
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

             <Form>
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Nama</Label>
                    </Col>
                    <Col xs = {2} md = {9}>
                        {
                            this.state.activeItemId == -1 
                            ?
                            <Input type = "Nama" value = {this.state.activeNameEdit} onChange = {(e) => this.handleEditChange("EditNama",e)}  name = "nama" placeholder = "Nama"/>
                            :
                            <Input type = "Nama" value = {this.state.activeNameEdit} onChange = {(e) => this.handleEditChange("EditNama",e)} name = "nama" placeholder = "Nama" disabled/>
                       }

                    </Col>
                </Row>      

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Alamat</Label>
                    </Col>
                    <Col xs = {2} md = {9}>
                    {
                            this.state.activeItemId == -1 
                            ?
                            <Input type = "Alamat" value = {this.state.activeAlamatEdit} onChange = {(e) => this.handleEditChange("EditAlamat",e)} name = "alamat" placeholder = "Alamat" />
                            :
                                this.state.value == 1 ?
                                <Input type = "Alamat" value = {this.state.activeAlamatEdit} onChange = {(e) => this.handleEditChange("EditAlamat",e)} name = "alamat" placeholder = "Alamat" />
                                :
                                <Input type = "Alamat" value = {this.state.activeAlamatEdit} onChange = {(e) => this.handleEditChange("EditAlamat",e)} name = "alamat" placeholder = "Alamat" disabled/>
                                
                     }
                    </Col>
                </Row>                    
                                        
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Kota</Label>
                    </Col>
                    <Col>
                    {       this.state.activeItemId == -1 
                            ?
                            <Input type = "Kota" value = {this.state.activeKotaEdit}  name = "Kota" placeholder = "Kota"/>
                            :
                            this.state.value == 1 ?
                                <Input type = "Kota" value = {this.state.activeKotaEdit}  name = "Kota" placeholder = "Kota"/>
                                :
                                <Input type = "Kota" value = {this.state.activeKotaEdit}  name = "Kota" placeholder = "Kota" disabled/>
                    }
                    </Col>
                    <Col >
                    {       this.state.activeItemId == -1 
                            ?
                        <UncontrolledButtonDropdown>
                            <DropdownToggle caret name = "filtermenu" color = "primary"  >
                                . . .
                            </DropdownToggle>
                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                {resultListKota.map(listkota =>
                                    <tr>   
                                        {this.state.activeItemId == -1 
                                            ?
                                            <DropdownItem value = {listkota.kota_name}  id = {listkota.kota_id} onClick = {()=>this.handleEditChangeKota(listkota.kota_id, listkota.kota_name,listkota.kota_kodetelp)}>{listkota.kota_name} </DropdownItem>           
                                            :
                                            this.state.value == 1 ?
                                                <DropdownItem value = {listkota.kota_name}  id = {listkota.kota_id} onClick = {()=>this.handleEditChangeKota(listkota.kota_id, listkota.kota_name,listkota.kota_kodetelp)}>{listkota.kota_name}</DropdownItem>           
                                                :
                                                <DropdownItem value = {listkota.kota_name}  id = {listkota.kota_id} onClick = {()=>this.handleEditChangeKota(listkota.kota_id, listkota.kota_name,listkota.kota_kodetelp)}>{listkota.kota_name}</DropdownItem>           
                                            } 
                                    </tr>
                                 )}                                
                                
                                </DropdownMenu> 
                        </UncontrolledButtonDropdown>                            
                        :
                        this.state.value == 1 ?
                            <UncontrolledButtonDropdown>
                                <DropdownToggle caret name = "filtermenu" color = "primary">
                                    . . .
                                </DropdownToggle>
                                <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                    {resultListKota.map(listkota =>
                                        <tr>   
                                            {this.state.activeItemId == -1 
                                                ?
                                                <DropdownItem value = {listkota.kota_name}  id = {listkota.kota_id} onClick = {()=>this.handleEditChangeKota(listkota.kota_id, listkota.kota_name,listkota.kota_kodetelp)}>{listkota.kota_name} </DropdownItem>           
                                                :
                                                <DropdownItem value = {listkota.kota_name}  id = {listkota.kota_id} onClick = {()=>this.handleEditChangeKota(listkota.kota_id, listkota.kota_name,listkota.kota_kodetelp)}>{listkota.kota_name}</DropdownItem>           
                                            } 
                                        </tr>
                                    )}                                
                                    
                                    </DropdownMenu> 
                            </UncontrolledButtonDropdown> 
                            :
                            <UncontrolledButtonDropdown>
                            <DropdownToggle caret name = "filtermenu" color = "primary" disabled >
                                . . .
                            </DropdownToggle>
                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                {resultListKota.map(listkota =>
                                    <tr>   
                                        {this.state.activeItemId == -1 
                                            ?
                                            <DropdownItem value = {listkota.kota_name}  id = {listkota.kota_id} onClick = {()=>this.handleEditChangeKota(listkota.kota_id, listkota.kota_name,listkota.kota_kodetelp)}>{listkota.kota_name} </DropdownItem>           
                                            :
                                            <DropdownItem value = {listkota.kota_name}  id = {listkota.kota_id} onClick = {()=>this.handleEditChangeKota(listkota.kota_id, listkota.kota_name,listkota.kota_kodetelp)}>{listkota.kota_name}</DropdownItem>           
                                        } 
                                    </tr>
                                )}                                
                                
                                </DropdownMenu> 
                        </UncontrolledButtonDropdown> 
                    }
                    </Col>
                    <Col>
                        <Label>Kode Pos</Label>
                    </Col>
                    <Col>
                    {       this.state.activeItemId == -1 
                            ?
                            <Input 
                            
                            type=""
                            maxLength = {5}
                            value = {this.state.activeKodeposEdit} 
                            onInput = {(e) => this.handleEditChange("EditKodePos",e)} 
                            name = "kodepos" 
                            placeholder = "Kode Pos" />                            
                            :
                            this.state.value == 1 ?
                                <Input 
                              
                                type=""
                                maxLength = {5}
                                value = {this.state.activeKodeposEdit} 
                                onInput = {(e) => this.handleEditChange("EditKodePos",e)} 
                                name = "kodepos" 
                                placeholder = "Kode Pos" />
                                :
                                <Input disabled
                                
                                type=""
                                maxLength = {5}
                                value = {this.state.activeKodeposEdit} 
                                onInput = {(e) => this.handleEditChange("EditKodePos",e)} 
                                name = "kodepos" 
                                placeholder = "Kode Pos" />
                    }
                       
                    </Col>
                </Row>
                                        
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Kecamatan</Label>
                    </Col>
                    <Col  xs = {9} md = {7} >
                    {       this.state.activeItemId == -1 
                            ?
                            <Input type = "Kecamatan" value = {this.state.activeKecamatanEdit} name = "Kecamatan" placeholder = "Kecamatan" />
                            :
                            this.state.value == 1 ?
                                <Input type = "Kecamatan" value = {this.state.activeKecamatanEdit} name = "Kecamatan" placeholder = "Kecamatan" />
                                :
                                <Input type = "Kecamatan" value = {this.state.activeKecamatanEdit} name = "Kecamatan" placeholder = "Kecamatan" disabled />
                    }
                    </Col>
                    <Col>
                    {       this.state.activeItemId == -1 
                            ?
                            <UncontrolledButtonDropdown>
                            <DropdownToggle caret name = "filtermenu" color = "primary">
                                . . .
                            </DropdownToggle>
                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                {resultListKecamatan.map(listkecamatan =>
                                    <tr>
                                        <DropdownItem value = {listkecamatan.Kec_Nama}  id = {listkecamatan.Kec_ID} onClick = {(e) => this.handleEditChange("EditKecamatan",e)}>{listkecamatan.Kec_Nama}</DropdownItem>           
                                    </tr>
                                 )}                                
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>                            
                        :
                            this.state.value == 1 ?
                            <UncontrolledButtonDropdown>
                                <DropdownToggle caret name = "filtermenu" color = "primary">
                                    . . .
                                </DropdownToggle>
                                <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                    {resultListKecamatan.map(listkecamatan =>
                                        <tr>
                                            <DropdownItem value = {listkecamatan.Kec_Nama}  id = {listkecamatan.Kec_ID} onClick = {(e) => this.handleEditChange("EditKecamatan",e)}>{listkecamatan.Kec_Nama}</DropdownItem>           
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
                                    {resultListKecamatan.map(listkecamatan =>
                                        <tr>
                                            <DropdownItem value = {listkecamatan.Kec_Nama}  id = {listkecamatan.Kec_ID} onClick = {(e) => this.handleEditChange("EditKecamatan",e)}>{listkecamatan.Kec_Nama}</DropdownItem>           
                                        </tr>
                                    )}                                
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                    }
                    </Col>
                </Row> 

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Telepon</Label>
                    </Col>
                    <Col xs = {8} md = {1}>
                    {       
                        this.state.activeItemId == -1 
                            ?
                            <Input type = "Telepon" value = {this.state.activeKodeAreaTelpEdit} onChange = {(e) => this.handleEditChange("EditKodeAreaTelp",e)} name = "telepon" placeholder = "Telepon" />
                            :
                            this.state.value == 1 ?
                                <Input type = "Telepon" value = {this.state.activeKodeAreaTelpEdit} onChange = {(e) => this.handleEditChange("EditKodeAreaTelp",e)} name = "telepon" placeholder = "Telepon"/>
                            :
                            <Input type = "Telepon" value = {this.state.activeKodeAreaTelpEdit} onChange = {(e) => this.handleEditChange("EditKodeAreaTelp",e)} name = "telepon" placeholder = "Telepon" disabled/>
                    }

                    </Col>
                    <Col xs = {2} md = {8}>

                    {       this.state.activeItemId == -1 
                            ?
                            <Input type = "Telepon" value = {this.state.activeNoTelpEdit} onChange = {(e) => this.handleEditChange("EditNoTelp",e)} name = "telepon" placeholder = "Telepon" />
                            :
                                this.state.value == 1 ?
                                <Input type = "Telepon" value = {this.state.activeNoTelpEdit} onChange = {(e) => this.handleEditChange("EditNoTelp",e)} name = "telepon" placeholder = "Telepon" />
                                :   
                                <Input type = "Telepon" value = {this.state.activeNoTelpEdit} onChange = {(e) => this.handleEditChange("EditNoTelp",e)} name = "telepon" placeholder = "Telepon" disabled /> 
                    }

                    </Col>
                </Row> 
 
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Fax</Label>
                    </Col>
                    <Col xs = {2} md = {9}>
                    {       this.state.activeItemId == -1 
                            ?
                            <Input type = "Fax" value = {this.state.activeFaxEdit} onChange = {(e) => this.handleEditChange("EditFax",e)} name = "fax" placeholder = "Fax"/>
                            :
                            this.state.value == 1 ?
                                <Input type = "Fax" value = {this.state.activeFaxEdit} onChange = {(e) => this.handleEditChange("EditFax",e)} name = "fax" placeholder = "Fax"/>
                                :
                                <Input type = "Fax" value = {this.state.activeFaxEdit} onChange = {(e) => this.handleEditChange("EditFax",e)} name = "fax" placeholder = "Fax" disabled/>
                    }
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Penanggung Jawab</Label>
                    </Col>
                    <Col xs = {2} md = {5}>
                    {       this.state.activeItemId == -1 
                            ?
                            <Input type = "PenanggungJawab" value = {this.state.activePenanggungJawabEdit} onChange = {(e) => this.handleEditChange("EditPenanggungJawab",e)} name = "penanggung_jawab" placeholder = "Penanggung Jawab" />
                            :
                                this.state.value == 1 ?
                                <Input type = "PenanggungJawab" value = {this.state.activePenanggungJawabEdit} onChange = {(e) => this.handleEditChange("EditPenanggungJawab",e)} name = "penanggung_jawab" placeholder = "Penanggung Jawab"/>
                                :
                                <Input type = "PenanggungJawab" value = {this.state.activePenanggungJawabEdit} onChange = {(e) => this.handleEditChange("EditPenanggungJawab",e)} name = "penanggung_jawab" placeholder = "Penanggung Jawab" disabled/>
                    }

                    </Col>
                    <Col>
                        <Label>EDLP</Label>
                    </Col>
                    <Col>
                    {       this.state.activeItemId == -1 
                            ?
                            <Input type = "number"
                            value = {this.state.activeEdlpEdit} onChange = {(e) => this.handleEditChange("EditEdlp",e)} name = "edlp" placeholder = "EDLP" />
                            :
                            this.state.value == 1 ?
                               <Input type = "number" 
                               value = {this.state.activeEdlpEdit} onChange = {(e) => this.handleEditChange("EditEdlp",e)} name = "edlp" placeholder = "EDLP"/>
                                :
                                <Input type = "number" 
                               value = {this.state.activeEdlpEdit} onChange = {(e) => this.handleEditChange("EditEdlp",e)} name = "edlp" placeholder = "EDLP" disabled/>
                   }
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Principal PIC</Label>
                    </Col>
                    <Col xs = {2} md = {9}>
                    {       this.state.activeItemId == -1 
                            ?
                            <Input type = "PrincipalPIC" value = {this.state.activePrincipalPICEdit} onChange = {(e) => this.handleEditChange("EditPrincipalPIC",e)} name = "principal_pic" placeholder = "Principal PIC" />
                            :
                                 this.state.value == 1
                                 ?
                                <Input type = "PrincipalPIC" value = {this.state.activePrincipalPICEdit} onChange = {(e) => this.handleEditChange("EditPrincipalPIC",e)} name = "principal_pic" placeholder = "Principal PIC"/>
                                :
                                <Input type = "PrincipalPIC" value = {this.state.activePrincipalPICEdit} onChange = {(e) => this.handleEditChange("EditPrincipalPIC",e)} name = "principal_pic" placeholder = "Principal PIC" disabled/>
                    }

                    </Col>
                </Row>
                                        

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Contact Person</Label>
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
                                <th>ID</th>
                                <th>Nama</th>
                                <th>Jabatan</th>
                                <th>Jenis</th>
                                <th>Kode Area</th>
                                <th>Nomor</th>
                                <th>Action</th>

                            </thead>
                            <tbody>
                            {resultContact.map(contact => 
                                <tr>
                                    <td>{contact.ContPrin_RunningID}</td>
                                    <td>{contact.ContPrin_Nama}</td>
                                    <td>{contact.ContPrin_Jabatan}</td>
                                    <td>{contact.ContPrin_Jenis}</td>
                                    <td>{contact.ContPrin_KodeArea}</td>
                                    <td>{contact.ContPrin_Nomor}</td>

                                     
                                    {/* <td>{contact.ContPrin_PICJP}</td> */}
                                    <td>
                                        <Button disabled = {this.state.flagDisabled} size="sm" onClick={()=>this.openEditContactModal(contact.ContPrin_RunningID, contact.ContPrin_Nama, contact.ContPrin_Jabatan, contact.ContPrin_Jenis, contact.ContPrin_KodeArea, contact.ContPrin_Nomor,contact.ContPrin_PICJP)} >Edit</Button>{"  "}
                                        <Button disabled = {this.state.flagDisabled} size="sm" onClick={()=>
                                            this.setState({modal_delete : true, 
                                                deleteID :contact.ContPrin_RunningID, 
                                                deleteUrut : contact.ContPrin_Urut, 
                                                })}
                                            >Delete</Button>
                                    </td>
                                </tr>    
                            )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>    

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Dana Promosi</Label>
                    </Col>
                    <Col xs = {2} md = {4}>
                    {       
                            this.state.activeItemId == -1 
                            ?
                            <Input type = "checkbox" style={{marginLeft: "5px"}} value = {this.state.isCheckedDPPersen} onClick={e => this.updateCheckedValue("DPPersen",e)} name = "dana_percentage" placeholder = "Data Percentage" />
                            :
                            this.state.value == 1 ?
                                <Input type = "checkbox" style={{marginLeft: "5px"}} value = {this.state.isCheckedDPPersen} onClick={e => this.updateCheckedValue("DPPersen",e)} name = "dana_percentage" placeholder = "Data Percentage" />
                                :
                                <Input  type = "checkbox" style={{marginLeft: "5px"}} value = {this.state.isCheckedDPPersen} onClick={e => this.updateCheckedValue("DPPersen",e)} name = "dana_percentage" placeholder = "Data Percentage" disabled/>
                    }

                    <Label style={{marginLeft: "20px"}}> % </Label>
                    </Col>
                    <Col>
                    {       this.state.activeItemId == -1 
                            ?
                            <Input type = "Dana Percentage" id="inputDPPersen"value = {this.state.activeDPPercentageEdit} onChange = {(e) => this.handleEditChange("EditDPPercentage",e)} name = "dana_percentage" placeholder = "Dana Percentage" disabled/>                       
                            :
                            <Input type = "Dana Percentage" id="inputDPPersen" value = {this.state.activeDPPercentageEdit} onChange = {(e) => this.handleEditChange("EditDPPercentage",e)} name = "dana_percentage" placeholder = "Dana Percentage" disabled/>                       
                        }

                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}> </Col>
                    <Col xs = {2} md = {4}>
                    {       
                            this.state.activeItemId == -1 
                            ?
                            <Input type = "checkbox"  style={{marginLeft: "5px"}} value = {this.state.isCheckedDanaValue} onChange={e => this.updateCheckedValue("DPValue",e)} name = "dana_value" placeholder = "Dana Value" />
                            :
                            this.state.value == 1 ?
                                <Input type = "checkbox"  style={{marginLeft: "5px"}} value = {this.state.isCheckedDanaValue} onChange={e => this.updateCheckedValue("DPValue",e)} name = "dana_value" placeholder = "Dana Value" />
                            :
                                <Input type = "checkbox"  style={{marginLeft: "5px"}} value = {this.state.isCheckedDanaValue} onChange={e => this.updateCheckedValue("DPValue",e)} name = "dana_value" placeholder = "Dana Value" disabled/>
                        }
                        
                        <Label style={{marginLeft: "20px"}}> Value (Rupiah)</Label>
                    </Col>
                    <Col>
                    {       this.state.activeItemId == -1 
                            ?
                            <Input type = "Dana Value" id = "inputDPValue" value = {this.state.activeDPValueRupiahEdit} onChange = {(e) => this.handleEditChange("EditDPValueRupiah",e)} name = "dana_value" placeholder = "Dana Value" disabled/>
                            :
                            <Input type = "Dana Value" id = "inputDPValue" value = {this.state.activeDPValueRupiahEdit} onChange = {(e) => this.handleEditChange("EditDPValueRupiah",e)} name = "dana_value" placeholder = "Dana Value" disabled/>
                        }


                    </Col>
                </Row>
                                                                
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}> </Col>
                    <Col xs = {2} md = {4}>
                        <Label> Periode</Label>
                    </Col>
                    <Col>
                        {
                            this.state.activeItemId == -1?
                            <Input 
                            type = "date" 
                            value = {dateFormat(this.state.activeDPPeriodStartEdit, "yyyy-mm-dd")} 
                            onChange = {(e) => this.handleEditChange("EditDPPeriodStart",e)} 
                            name = "periode_start" 
                            placeholder = "Periode Start" 
                            />
                            :
                                this.state.value == 1?
                                <Input 
                                type = "date" 
                                value = {dateFormat(this.state.activeDPPeriodStartEdit, "yyyy-mm-dd")} 
                                onChange = {(e) => this.handleEditChange("EditDPPeriodStart",e)} 
                                name = "periode_start" 
                                placeholder = "Periode Start" 
                                />
                                :
                                <Input disabled
                                value = {dateFormat(this.state.activeDPPeriodStartEdit, "mm/dd/yyyy")}
                                name = "periode_start" 
                                placeholder = "Periode Start"
                                />
                        }

                    </Col>
                    <Col>
                        <Label>s/d</Label>
                    </Col>
                     <Col>
                     {
                         this.state.activeItemId == -1?
                         <Input 
                         type = "date" 
                         value = {dateFormat(this.state.activeDPPeriodEndEdit, "yyyy-mm-dd")} 
                         onChange = {(e) => this.handleEditChange("EditDPPeriodEnd",e)} 
                         name = "periode_end" 
                         placeholder = "Periode End" 
                         />
                         :
                         this.state.value == 1 ?
                            <Input 
                            type = "date" 
                            value = {dateFormat(this.state.activeDPPeriodEndEdit, "yyyy-mm-dd")} 
                            onChange = {(e) => this.handleEditChange("EditDPPeriodEnd",e)} 
                            name = "periode_end" 
                            placeholder = "Periode End" 
                            />
                            :
                            <Input disabled
                            value = {dateFormat(this.state.activeDPPeriodEndEdit, "mm/dd/yyyy")}
                            name = "periode_end" 
                            placeholder = "Periode End"
                            />
                     }
                    </Col>
                    
                </Row>
                </Form>
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
                                    onClick = {()=> this.addDataPrincipal()}
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
                                    onClick = {()=> this.editDataPrincipal(this.state.activeItemId)}
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
export default Principal_DataPrincipal;
