import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, Nav, Form,
    Navbar,UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup,InputGroup, InputGroupAddon, FormGroup, CardFooter, UncontrolledTooltip
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdWarning, MdDelete, MdSearch, MdEdit, MdCancel, MdSave } from 'react-icons/md';
import { runInThisContext } from 'vm';
import { withRouter } from 'react-router-dom';

class Supplier_Finance extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            result                  : [],
            resultPenerimaanUang    : [],
            activeItemId            : this.props.activeItemId,
            activeItemName          : '',
            value                   : 0,
            editValue               : 0,
            ValuePenerimaanUang     : 0,
            editValuePenerimaanUang : 0,
            resultListAtasNama      : [],
            resultListBankPencairan : [],
            resultListVirtualAcc    : [],
            resultListMasterBank    : [],
            resultListCabangBank    : [],
            resultTipePembayaran    : [],
            resultGroup             : [],
            selectedOption          : "Muka",
            selectedBayar           : "M",
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

    getSupplierFinancebyCode()
    {   
        console.log("getSupplierFinancebyCode")
        this.getMasterBank()
        this.getListTipePembayaran()
        var payload = {
            FinSup_SupCode  : this.state.activeItemId,
            FinSup_GrpCode  : this.state.activeGrpCode 
            };
            console.log(payload)
            const option = {
                method  : "POST",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                body: JSON.stringify(payload)
                }
                
                fetch("https://api.docnet.id/CHCMasterD/MasterSupplierFinance/TampilkanSupplierFinancebyCode",option)
                .then(response => response.json())
                .then(data =>{ 
                        console.log(data.Data)
                        if(data.Data === null)  {
                            console.log("data suplierfinance kosong")             
                            this.setState({ 
                                result: [],
                                responseHeader  : "Finance Supplier",
                                responseMessage : "Data Kosong, Silahkan Menambah Data",
                                modal_response  : true,
                                value           : 1,
                                editValue       : 0,
                                    activeChieffAcc         : "",
                                    activeNamaBank          : "",
                                    activeCabangBankCode    : "",
                                    activeNamaCabang        : "",
                                    activeKotaCabang        : "",
                                    activeAN                : "",
                                    activeAccountNumber     : "",
                                    activeTipePembayaranCode: "",
                                    activeTipePembayaran    : "",
                                    activeBayar             : "",
                                    activeTOP               : "",
                                    selectedOption          : "Muka",
                                    selectedBayar           : "M",
                            })
                        }
                        else{
                            console.log("data suplierfinance tidak kosong")  
                            console.log("Grp Code : " + data.Data.ModelSupplierFinance.FinSup_GrpCode)
                                this.setState({
                                    editValue               : 1,
                                    activeGrpCode           : data.Data.ModelSupplierFinance.FinSup_GrpCode,
                                    activeChieffAcc         : data.Data.ModelSupplierFinance.FinSup_ChieffAcc,
                                    activeNamaBank          : data.Data.BankName,
                                    activeCabangBankCode    : data.Data.ModelSupplierFinance.FinSup_CabangBankID,
                                    activeNamaCabang        : data.Data.CBName,
                                    activeKotaCabangID      : data.Data.KotaID,
                                    activeAN                : data.Data.ModelSupplierFinance.FinSup_AN,
                                    activeAccountNumber     : data.Data.ModelSupplierFinance.FinSup_AccountNumber,
                                    activeTipePembayaranCode: data.Data.ModelSupplierFinance.FinSup_PayCode,
                                    activeTipePembayaran    : data.Data.CaraPembayaran,
                                    activeBayar             : data.Data.ModelSupplierFinance.FinSup_Bayar,
                                    activeTOP               : data.Data.ModelSupplierFinance.FinSup_TOP,
                                    selectedOption          : (data.Data.ModelSupplierFinance.FinSup_Bayar === "M" ? "Muka" : "Belakang"),
                                })
                                this.getKota(this.state.activeKotaCabangID)
                        }
                    });          
    }

    getKota(kode) 
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
                            console.log("data kota kosong")
                        }
                        else{
                            console.log("data kota tidak kosong")
                            this.setState({
                                activeKotaCabang : data.data[0].kota_name
                            })
                            console.log("activeNamaKota :"+this.state.activeKotaCabang)
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
                            resultGroup : data.Data,
                            activeGrpCode : data.Data[0].Grp_Code,
                            activeGrpName : data.Data[0].Grp_Name,
                            activeGrpCodePenerimaanUang : data.Data[0].Grp_Code,
                            activeGrpNamePenerimaanUang : data.Data[0].Grp_Name,
                        })
                        console.log("selectedgroupcode :"+this.state.activeGrpCode)
                        this.getSupplierFinancebyCode()
                        
                    }
                    else{
                        console.log("data group kosong")
                        this.setState({
                            resultGroup : []
                        })
                    }
                });
    }

    addFinanceSupplier = () => {
        console.log("add masuk");
        var url     = `https://api.docnet.id/CHCMasterD/MasterSupplierFinance/TambahSupplierFinance`;
        var payload = {
            FinSup_UserID            : "123",
            FinSup_SupCode           : this.state.activeItemId,
            FinSup_GrpCode           : this.state.activeGrpCode,
            FinSup_ChieffAcc         : this.state.activeChieffAcc,
            FinSup_CabangBankID      : parseInt(this.state.activeCabangBankCode),
            FinSup_AN                : this.state.activeAN,
            FinSup_AccountNumber     : this.state.activeAccountNumber,  
            FinSup_Bayar             : this.state.selectedBayar,
            FinSup_PayCode           : parseInt(this.state.activeTipePembayaranCode), 
            FinSup_TOP               : parseInt(this.state.activeTOP)
           }

           console.log(payload)

        //    console.log("Chieff Acc : " + this.state.activeChieffAcc)
        //    console.log("CabangBank ID : " + this.state.activeCabangBankCode)
        //    console.log("Atas Nama : " + this.state.activeAN)
        //    console.log("Account Num : " + this.state.activeAccountNumber)
        //    console.log("Bayar (B/M) : " + this.state.selectedBayar)
        //    console.log("PayCode (Cash : 1/Transfer : 2) : " + this.state.activeTipePembayaranCode)
        //    console.log("Top: " + this.state.activeTOP)
           
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
                    this.state.modal_response  = true; 
                    this.changeEditButton()
                    this.state.modal_validasiAccNum = false;
                }
                else {
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan false : ")
                    this.componentDidMount();
                    this.state.responseHeader  = "Tambah Data";
                    this.state.responseMessage = "Data sudah ada";
                    this.state.modal_response  = true;
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
    }

    editFinanceSupplier = () => {        
        var url     = `https://api.docnet.id/CHCMasterD/MasterSupplierFinance/UbahSupplierFinance`;
        var payload = {
            FinSup_UserID            : "123",
            FinSup_SupCode           : this.state.activeItemId,
            FinSup_GrpCode           : this.state.activeGrpCode,
            FinSup_ChieffAcc         : this.state.activeChieffAcc,
            FinSup_CabangBankID      : parseInt(this.state.activeCabangBankCode),
            FinSup_AN                : this.state.activeAN,
            FinSup_AccountNumber     : this.state.activeAccountNumber,  
            FinSup_Bayar             : this.state.selectedBayar,
            FinSup_PayCode           : parseInt(this.state.activeTipePembayaranCode), 
            FinSup_TOP               : parseInt(this.state.activeTOP),
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
                    console.log("itemid" + this.state.activeItemId)
                    this.state.modal_response  = true;  
                    this.componentDidMount();
                    this.changeEditButton()
                    this.state.responseHeader  = "Edit Data";
                    this.state.responseMessage = "Data berhasil diedit";
                    this.state.modal_validasiAccNum = false;          
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

    validasiAccountNumber = () => {
        var successValidation = true;
        
        if(this.state.activeChieffAcc == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Chieff Account tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }else if(this.state.activeAN == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Atas Nama tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }else if(this.state.activeAccountNumber == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Account Number tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }else if(this.state.activeTOP == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Hari TOP tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }else if(this.state.activeNamaBank == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama Bank tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }else if(this.state.activeCabangBankCode == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Cabang Bank tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }else if(this.state.activeTipePembayaranCode == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Tipe Pembayaran tidak boleh kosong",
                modal_response  : true})
                successValidation = false
        }

        if(successValidation == true){
        

        var url     = `https://api.docnet.id/CHCMasterD/MasterSupplierFinance/ValidasiAccountNumber`;
        var payload = {
            FinSup_SupCode	     : this.state.activeItemId,
	        FinSup_GrpCode	     : this.state.activeGrpCode,
	        FinSup_AccountNumber : this.state.activeAccountNumber
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
                console.log("RESPONSE VALIDATION" +response.ResponseCode)
                if (response.ResponseCode == "205") {   
                    this.setState({
                        modal_validasiAccNum : true
                    })
                }
                else{
                    if(this.state.editValue==1){
                        this.editFinanceSupplier()
                    }
                    else{
                        this.addFinanceSupplier()
                    }
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));        
        }
    }

    getPenerimaanUangCode(){
        console.log("GETPENERIMAANUANGCODE")
        var payload = {
            PU_SupCode  : this.state.activeItemId,
            PU_Group    : this.state.activeGrpCodePenerimaanUang
       };
       console.log(payload)
       const option = {
           method  : "POST",
           json    : true,
           headers : {
                   "Content-Type": "application/json;charset=UTF-8"
                   },
           body: JSON.stringify(payload)
           }
           fetch("https://api.docnet.id/CHCMasterD/MasterSupplierPenerimaanUang/TampilkanSupplierPenerimaanUangbyCode",option)
           .then(response => response.json())
           .then(data =>{
                   if(data.Data === null)  {
                       console.log("data penerimaan uang kode kosong")
                       this.setState({
                            activeBankCodeEdit         : "",
                            activeVirtualAccCodeEdit   : "",
                            activeBI_Id                : ""
                       })
                   }
                   else{

                       console.log("data penerimaan uang kode tidak kosong")
                       this.setState({
                            activeBankCodeEdit         : data.Data[0].PU_CabangBankID,
                            activeVirtualAccCodeEdit   : data.Data[0].PU_VAcc_ID,
                            activeBI_Id                : data.Data[0].PU_BIID
                       })
                       if(this.state.activeBankCodeEdit != null){
                        console.log("masuk getPenerimaanUangCode")
                         this.getListAtasNama(this.state.activeBankCodeEdit)
                         this.getListVirtualAcc(this.state.activeBI_Id)
                    }
                       
                       console.log("getDatanya :  "+ "activeBankCodeEdit : "+this.state.activeBankCodeEdit 
                       +"activeVAccID : " + this.state.activeVirtualAccCodeEdit + "activeBIID : " +this.state.activeBI_Id)
                   }
           });
    }

    getPenerimaanUang()
    {
        console.log("GETPENERIMAANUANG")
       this.getListBankPencairan()
       var payload = {
                PU_SupCode  : this.state.activeItemId,
                PU_Group    : this.state.activeGrpCodePenerimaanUang
           };
           const option = {
               method  : "POST",
               json    : true,
               headers : {
                       "Content-Type": "application/json;charset=UTF-8"
                       },
               body: JSON.stringify(payload)
               }
               fetch("https://api.docnet.id/CHCMasterD/MasterSupplierPenerimaanUang/TranslateCodeSupplierPenerimaanUang",option)
               .then(response => response.json())
               .then(data =>{
                       if(data.Data === null)  {
                           console.log("data penerimaan uang kosong")
                           this.setState({
                                resultPenerimaanUang          : [],
                                responseHeader                : "Data Penerimaan Uang",
                                responseMessage               : "Data Kosong, Silahkan Menambah Data",
                                modal_response                : true,
                                ValuePenerimaanUang           : 1,
                                editValuePenerimaanUang       : 0,
                                activeAtasNamaEdit   : "",
                                activeBankEdit       : "",
                                activeVirtualAccEdit : "",
                                activeNoRekEdit      : ""
                           })
                       }
                       else{
                           console.log("data penerimaan uang tidak kosong")
                           console.log(data.Data.BIAtasNama)
                           this.setState({
                                editValuePenerimaanUang : 1,
                                activeAtasNamaEdit   : data.Data.BIAtasNama,
                                activeBankEdit       : data.Data.CBNama,
                                activeVirtualAccEdit : data.Data.VaccNomorRek,
                                activeNoRekEdit      : data.Data.BINomorRek,
                                ValuePenerimaanUang           : 0,
                                editValuePenerimaanUang       : 1,
                           })
                       }
               });
   }

    addPenerimaanUang = () => {
        var validasipenerimaanuang = true;
        if(this.state.activeBankEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama Bank tidak boleh kosong",
                modal_response  : true})
                validasipenerimaanuang = false;
        }else if(this.state.activeAtasNamaEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Atas Nama tidak boleh kosong",
                modal_response  : true})
                validasipenerimaanuang = false;
        }else if(this.state.activeVirtualAccEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Virtual Account tidak boleh kosong",
                modal_response  : true})
                validasipenerimaanuang = false
        }

        if(validasipenerimaanuang == true){
            var url     = `https://api.docnet.id/CHCMasterD/MasterSupplierPenerimaanUang/TambahSupplierPenerimaanUangBaru`;
            var payload = {
                PU_UserID       : "123",
                PU_SupCode      : this.state.activeItemId,
                PU_Group        : this.state.activeGrpCodePenerimaanUang,
                PU_CabangBankID : parseInt(this.state.activeBankCodeEdit),
                PU_BIID         : parseInt(this.state.activeBI_Id),
                PU_VAcc_ID      : parseInt(this.state.activeVirtualAccCodeEdit)
            }
            console.log("a "+this.state.activeItemId)
            console.log("g "+this.state.groupStatus)
            console.log("b "+this.state.activeBankCodeEdit)
            console.log("c "+this.state.activeBI_Id)
            console.log("d" +this.state.activeVirtualAccCodeEdit)
            
            
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
                        this.getPenerimaanUangCode()
                        this.getPenerimaanUang()  
                        this.state.responseHeader  = "Tambah Data";
                        this.state.responseMessage = "Data berhasil ditambah";     
                        this.state.modal_response  = true;
                        this.state.ValuePenerimaanUang =  0;  
                        this.changeEditButton()  
                    }
                    else{
                        console.log("RESPONSE STATUS : "+response.ResponseCode)
                        console.log("jalan false : ")
                        // this.getPenerimaanUangCode()
                        // this.getPenerimaanUang()
                        this.state.modal_response  = true;
                        this.state.responseHeader  = "Tambah Data";
                        this.state.responseMessage = "Data sudah ada";
                        this.componentDidMount()
                        
                    }
                }, ()=>  this.connectionOut("Can't reach the server", false));
        }
    }

    editPenerimaanUang = () => {
        var validasipenerimaanuang = true;
        if(this.state.activeBankEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama Bank tidak boleh kosong",
                modal_response  : true})
                validasipenerimaanuang = false;
        }else if(this.state.activeAtasNamaEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Atas Nama tidak boleh kosong",
                modal_response  : true})
                validasipenerimaanuang = false;
        }else if(this.state.activeVirtualAccEdit == ""){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Virtual Account tidak boleh kosong",
                modal_response  : true})
                validasipenerimaanuang = false
        }
        if(validasipenerimaanuang == true){
      
        
        console.log("edit masuk");
        var url     = `https://api.docnet.id/CHCMasterD/MasterSupplierPenerimaanUang/UbahSupplierPenerimaanUang`;
        var payload = {

            PU_UserID       : "123",
            PU_SupCode      : this.state.activeItemId,
            PU_Group        : this.state.activeGrpCodePenerimaanUang,
            PU_CabangBankID : parseInt(this.state.activeBankCodeEdit),
            PU_BIID         : parseInt(this.state.activeBI_Id),
            PU_VAcc_ID      : parseInt(this.state.activeVirtualAccCodeEdit)
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
                console.log("ini payload edit")
                console.log(payload)
                if (response.ResponseCode == "200") {
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan true : ")
                    this.state.ValuePenerimaanUang = 0;
                    this.getPenerimaanUangCode()  
                    this.getPenerimaanUang()
                    this.state.responseHeader  = "Edit Data";
                    this.state.responseMessage = "Data berhasil diedit";      
                    this.state.modal_response  = true; 
                    this.toggle('response')    
                    this.changeEditButtonModal()  
                }
                else {
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan false : ")
                    this.getPenerimaanUangCode()
                    this.getPenerimaanUang()  
                    this.state.responseHeader  = "Edit Data";
                    this.state.responseMessage = "Tidak ada perubahan data";
                    this.state.modal_response  = true;
                    this.toggle('response') 
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
        }
    }

    deletePenerimaanUang = () => {
        console.log("masuk delete loh!!")
        var url     = `https://api.docnet.id/CHCMasterD/MasterSupplierPenerimaanUang/HapusSupplierPenerimaanUang`;
        var payload = {
            PU_SupCode      : this.state.activeItemId,
            PU_Group        : this.state.activeGrpCodePenerimaanUang,
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
                    this.state.modal_delete       = false;
                    this.state.activeItemId       = this.state.activeItemId;
                    this.state.activeGrpCode      = this.state.activeGrpCodePenerimaanUang;
                    this.state.activeBankEdit     = "";
                    this.state.activeBankCodeEdit = "";
                    this.state.activeAtasNamaEdit = "";
                    this.state.activeNoRekEdit    = "";
                    this.state.activeVirtualAccEdit = "";
                    this.state.activeVirtualAccCodeEdit = ""
                    console.log("Bank Code : " + this.state.activeBankCodeEdit + this.state.activeBankEdit)
                    this.state.activeBankEdit     = "";
                    this.state.activeBankCodeEdit = "";
                    console.log("Atas Nama : " + this.state.activeAtasNamaEdit)
                    this.state.activeAtasNamaEdit = "";
                    this.state.activeNoRekEdit    = "";
                    console.log("Virtual Acc : " + this.state.activeVirtualAccEdit + this.state.activeVirtualAccCodeEdit)
                    this.state.activeVirtualAccEdit = "";
                    this.state.activeVirtualAccCodeEdit = ""
                    this.getPenerimaanUangCode()
                    this.getPenerimaanUang()
                    this.state.resultListAtasNama = []
                    this.state.resultListVirtualAcc = []
                    this.componentDidMount();
                }
                else{
                    console.log("RESPONSE STATUS : "+response.ResponseCode)
                    console.log("jalan false : ")
                    this.state.modal_delete    = false;
                    this.state.modal_response  = true;
                    this.state.activeItemId   = this.state.activeItemId;
                    this.state.activeGrpCode   = this.activeGrpCodePenerimaanUang;
                    this.getPenerimaanUangCode()
                    this.getPenerimaanUang()
                    this.state.responseHeader  = "Hapus Data";
                    this.state.responseMessage = "Data tidak berhasil dihapus";
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
    }

    getMasterBank = () => {
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }
            fetch("https://api.docnet.id/CHCMasterBantuan/SelectMasterBank",option)
            .then(response => response.json())
            .then(data =>{ 
                  
                    if(data.Data === null)  {
                        console.log("Data Master Bank Kosong")             
                        this.setState({ resultListMasterBank : []})
                        this.connectionOut("Data Master Bank Kosong", false)
                    }
                    else{   
                        console.log("Data Master Bank tidak kosong")  
                        this.setState({ resultListMasterBank: data.Data})
                    }
                });

    }

    getListCabangBank(activeBankCodeEdit) 
    {   
        const option = {
                method  : "GET",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                }
                fetch("https://api.docnet.id/CHCMasterD/CabangBank?kode="+ activeBankCodeEdit,option)
                .then(response => response.json())
                .then(data =>{ 
                        if(data.Data === null)  {   
                            this.setState({ resultListCabangBank : []})
                        }
                        else{
                            this.setState({ resultListCabangBank : data.Data})
                        }
                    });
    }

    getListTipePembayaran = () => {
        {   
            const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }
            fetch("https://api.docnet.id/CHCMasterD/TipeTransaksi",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.Data === null)  {   
                        this.setState({ resultTipePembayaran : []})
                        this.connectionOut("Tipe Transaksi Kosong", false)
                    }
                    else{
                        this.setState({ resultTipePembayaran : data.Data})
                    }
                });
        }
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

    getListAtasNama = (activeBankCodeEdit) =>{
        console.log("activeBankCodeEdit :" +activeBankCodeEdit)
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }
            fetch("https://api.docnet.id/CHCMasterBantuan/SelectMasterBankIntern?id=" + activeBankCodeEdit,option)
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

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    handleChange = (type, event) => {
        if (type === "EditChieffAcc"){
            this.setState({
            activeChieffAcc : event.target.value
            }); 
        
        } else if (type === "EditAN"){
            this.setState({
            activeAN : event.target.value
            });
        } else if (type === "EditAccountNumber"){
            this.setState({
            activeAccountNumber : event.target.value
            }); 
        } else if (type === "EditTipePembayaran"){
            this.setState({
            activeTipePembayaran     : event.target.value,
            activeTipePembayaranCode : event.target.id
            });
        }else if (type === "EditTOP"){
            this.setState({
            activeTOP : event.target.value
            });
        }else if (type === "EditNamaBank"){
            this.setState({
            activeNamaBank      : event.target.value,
            activeBankCodeEdit  : event.target.id
            },()=> this.getListCabangBank(this.state.activeBankCodeEdit));
        }
    }

    
    handleEditCabangBank=(kotaId,nama,kota, kodeCabangBank)=>{
        this.setState({
            activeCabangBankCode    : kodeCabangBank,
            activeNamaCabang        : nama,
            activeKotaCabangId      : kotaId
            },()=> this.getKota(this.state.activeKotaCabangId));
            console.log("activeCabangBankCode : "+this.state.activeCabangBankCode)
            console.log("activeNamaCabang : "+this.state.activeNamaCabang)
            console.log("activeKotaCabangId : "+this.state.activeKotaCabangId)    
            
    }

    handleEditChangeBank=(id,atasnama,norek)=>{
        this.setState({
            activeBI_Id             : id,
            activeAtasNamaEdit      : atasnama,
            activeNoRekEdit         : norek
            }, () => this.getListVirtualAcc(this.state.activeBI_Id));    
    }

    handleEditChange = (type, event) => {
        if (type === "EditBank"){
            this.setState({
                activeBankEdit      : event.target.value,
                activeBankCodeEdit  : event.target.id
            },      
            ()=> this.getListAtasNama(this.state.activeBankCodeEdit),
                    this.state.activeAtasNamaEdit       = "",
                    this.state.activeNoRekEdit          = "",
                    this.state.activeVirtualAccEdit     = "",
                    this.state.activeBankCodeEdit       = "",
                    this.state.activeBI_Id              = "",
                    this.state.activeVirtualAccCodeEdit = ""
            );
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
            console.log(""+this.state.activeVirtualAccCodeEdit)
        } 
    }

    radioChange(e) {
        this.setState({
          selectedOption: e.currentTarget.value
        });
        
        if(e.currentTarget.value === "Muka"){
            console.log("tipe transaksi = " + e.currentTarget.value)
            this.setState({
                selectedBayar : "M"
            },()=>console.log("tipe transaksi = " + this.state.selectedBayar)); 
        }
        else if(e.currentTarget.value === "Belakang"){
            console.log("tipe transaksi  = " + e.currentTarget.value)
            this.setState({
                selectedBayar : "B"
            },()=>console.log("tipe transaksi = " + this.state.selectedBayar));    
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

    changeEditButtonModal = () => {
        if(this.state.ValuePenerimaanUang === 0){
            this.setState({
                ValuePenerimaanUang: 1
            })
        }
        else if (this.state.ValuePenerimaanUang === 1){
            this.setState({
                ValuePenerimaanUang: 0
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

    openModalDelete(){
        this.setState({
            modal_delete        : true
        });                            
    }

    openModalPenerimaanUang(){
        this.setState({
            modal_penerimaan_uang : true
        })
        this.getPenerimaanUangCode()
        this.getPenerimaanUang()
    }
    
    updateInputSelectedGroup(name, code){
        this.setState({
            activeGrpName : name,
            activeGrpCode : code
        },()=>this.getSupplierFinancebyCode())
    }
    
    updateInputSelectedGroupPenerimaanUang(name, code){
        this.setState({
            activeGrpNamePenerimaanUang : name,
            activeGrpCodePenerimaanUang : code
        }, ()=>this.jalankanGetPenerimaanUangDanCode())
    }

    jalankanGetPenerimaanUangDanCode(){
        this.getPenerimaanUang()
        this.getPenerimaanUangCode()
    }
    

    render() {
        const { result, resultListMasterBank, resultListCabangBank, resultTipePembayaran, resultListBankPencairan, resultListVirtualAcc, resultListAtasNama, resultGroup} = this.state;
        console.log(result)

        return (
            <Page
            title       = "Finance"
            breadcrumbs = {[{ name: 'Supplier / Finance', active: true }]}
            className   = "Finance">
                
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
                    isOpen={this.state.modal_validasiAccNum}
                >
                    <ModalHeader>
                        Konfimasi Account Number
                    </ModalHeader>
                    <ModalBody>
                        Account Number sudah digunakan, Apakah ingin tetap digunakan?
                    </ModalBody>
                    <ModalFooter>
                        <Button color = "primary" 
                                onClick = {
                                    this.state.editValue==1?
                                    ()=> this.editFinanceSupplier()
                                    :
                                    ()=> this.addFinanceSupplier()
                                }
                        >
                            Ya
                        </Button>{' '}
                        <Button
                                color   = "secondary"
                                onClick = {
                                         () => {this.setState({
                                                modal_validasiAccNum : false
                                            })}}>
                                        Tidak
                                    </Button>
                        
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
                    size = "lg"
                    isOpen = {this.state.modal_penerimaan_uang}
                    >
                        <ModalHeader>
                            Input Penerimaan Uang
                        </ModalHeader>
                        <ModalBody>
                            <CardHeader>
                                <Row className = "show-grid mt-3">
                                    <Col xs = {8} md = {3}>
                                        <Label>No. Supplier</Label>
                                    </Col>
                                    <Col xs = {9} md = {9}>
                                        <Input type = "SupplierCode" value = {this.state.activeItemId} name = "SupplierCode" placeholder = "Supplier Code" disabled />
                                    </Col>
                                </Row>
                            </CardHeader>
                            
                            <CardBody>
                                <Row className = "show-grid mt-3">
                                    <Col xs = {8} md = {3}>
                                        <Label>Group Supplier</Label>
                                    </Col>
                                    <Col xs = {9} md = {7}>
                                        { this.state.ValuePenerimaanUang ==1 ?
                                            <Input type = "GrpCode" value = {this.state.activeGrpNamePenerimaanUang} name = "group_code" placeholder = "GroupCode" />                           
                                            :
                                            <Input type = "GrpCode" value = {this.state.activeGrpNamePenerimaanUang} name = "group_code" placeholder = "GroupCode" disabled/>                           
                                        }
                                    </Col>
                                    <Col>
                                        <UncontrolledButtonDropdown
                                        >
                                            <DropdownToggle caret name = "filtermenu" color = "primary">
                                            
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                {this.state.resultGroup.map(group=>
                                                    <DropdownItem value = {group.Grp_Name} onClick = {evt => this.updateInputSelectedGroupPenerimaanUang(group.Grp_Name, group.Grp_Code)}>{group.Grp_Name}</DropdownItem>
                                                )}
                                            
                                            
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        
                                    </Col>                           
                                </Row>

                                 <Row className = "show-grid mt-3">
                                    <Col xs = {8} md = {3}>
                                        <Label>Bank Pencairan</Label>
                                    </Col>
                                    <Col xs = {9} md = {7}>
                                        {this.state.ValuePenerimaanUang ==1 ?
                                            <Input type = "Bank Pencairan" value = {this.state.activeBankEdit}  name = "BankPencairan" placeholder = "Bank Pencairan" />
                                            :
                                            <Input type = "Bank Pencairan" value = {this.state.activeBankEdit}  name = "BankPencairan" placeholder = "Bank Pencairan" disabled />
                                        }
                                    </Col>
                                    <Col>
                                        {this.state.ValuePenerimaanUang ==1 ?
                                            <UncontrolledButtonDropdown>
                                                <DropdownToggle caret name = "filtermenu" color = "primary">
                                                    . . .
                                                </DropdownToggle>
                                                <DropdownMenu style={{height :"165px", overflowY :"scroll"}}
                                                >                      
                                                    {resultListBankPencairan.map(bankpencairan =>
                                                    <tr>
                                                        <DropdownItem value = {bankpencairan.NAMA}  id = {bankpencairan.CB_ID} onClick = {(e) => this.handleEditChange("EditBank",e)}>{bankpencairan.NAMA}</DropdownItem>           
                                                    </tr>
                                    )}                               
                                                </DropdownMenu >
                                            </UncontrolledButtonDropdown>
                                        :
                                            <UncontrolledButtonDropdown>
                                                <DropdownToggle caret name = "filtermenu" color = "primary" disabled>
                                                    . . .
                                                </DropdownToggle>
                                                <DropdownMenu style={{height :"165px", overflowY :"scroll"}}
                                                >                      
                                                     {resultListBankPencairan.map(bankpencairan =>
                                        <tr>
                                            <DropdownItem value = {bankpencairan.NAMA}  id = {bankpencairan.CB_ID} onClick = {(e) => this.handleEditChange("EditBank",e)}>{bankpencairan.NAMA}</DropdownItem>           
                                        </tr>
                                    )}
                                           
                                                </DropdownMenu >
                                            </UncontrolledButtonDropdown>
                                        }
                                    </Col>
                                </Row>  

                                <Row className = "show-grid mt-3">
                                    <Col xs = {8} md = {3}>
                                        <Label>Atas Nama</Label>
                                    </Col>
                                    <Col xs = {9} md = {7}>
                                        { this.state.ValuePenerimaanUang ==1?
                                            <Input type = "Atas Nama" value = {this.state.activeAtasNamaEdit}  name = "AtasNama" placeholder = "Atas Nama" />
                                            :
                                            <Input type = "Atas Nama" value = {this.state.activeAtasNamaEdit}  name = "AtasNama" placeholder = "Atas Nama" disabled/>
                                        }
                                    </Col>
                                    <Col>
                                        { this.state.ValuePenerimaanUang ==1?
                                        <UncontrolledButtonDropdown>
                                            <DropdownToggle caret name = "filtermenu" color = "primary">
                                                . . .
                                            </DropdownToggle>
                                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}
                                            >                      
                                                {resultListAtasNama.map(atasnama =>
                                        <tr>
                                            <DropdownItem onClick = {(e) => this.handleEditChangeBank(atasnama.BI_ID, atasnama.BI_AtasNama,atasnama.BI_NomorRek)}>{atasnama.BI_AtasNama}</DropdownItem>           
                                        </tr>
                                    )}        
                                            </DropdownMenu >
                                        </UncontrolledButtonDropdown>
                                        :
                                        <UncontrolledButtonDropdown>
                                            <DropdownToggle caret name = "filtermenu" color = "primary" disabled>
                                                 . . .
                                            </DropdownToggle>
                                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}
                                            >                      
                                                    {resultListAtasNama.map(atasnama =>
                                    <tr>
                                        <DropdownItem onClick = {(e) => this.handleEditChangeBank(atasnama.BI_ID, atasnama.BI_AtasNama,atasnama.BI_NomorRek)}>{atasnama.BI_AtasNama}</DropdownItem>           
                                    </tr>
                                )}          
                                            </DropdownMenu >
                                        </UncontrolledButtonDropdown>
                                        }
                                    </Col>
                                </Row> 

                                <Row className = "show-grid mt-3">
                                    <Col xs = {8} md = {3}>
                                        <Label>No. Rekening</Label>
                                    </Col>
                                    <Col xs = {9} md = {7}>
                                        { this.state.ValuePenerimaanUang ==1 ?
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
                                    <Col xs = {9} md = {7}>
                                        {  this.state.ValuePenerimaanUang ==1?              
                                            <Input type = "Virtual Account" value = {this.state.activeVirtualAccEdit}  name = "Virtual Account" placeholder = "Virtual Account" />
                                            :
                                            <Input type = "Virtual Account" value = {this.state.activeVirtualAccEdit}  name = "Virtual Account" placeholder = "Virtual Account" disabled/>
                                        }
                                    </Col>
                                    <Col>
                                        { this.state.ValuePenerimaanUang ==1?
                                            <UncontrolledButtonDropdown>
                                                <DropdownToggle caret name = "filtermenu" color = "primary">
                                                    . . .
                                                </DropdownToggle>
                                                <DropdownMenu style={{height :"165px", overflowY :"scroll"}}
                                                >                      
                                                    {resultListVirtualAcc.map(virtualacc =>
                                        <tr>
                                            <DropdownItem value = {virtualacc.VAcc_NomorRek}  id = {virtualacc.VAcc_ID} onClick = {(e) => this.handleEditChange("EditVirtualAcc",e)}>{virtualacc.VAcc_NomorRek}</DropdownItem>           
                                        </tr>
                                    )}     
                                                </DropdownMenu >
                                            </UncontrolledButtonDropdown> 
                                        :
                                            <UncontrolledButtonDropdown>
                                                <DropdownToggle caret name = "filtermenu" color = "primary" disabled>
                                                    . . .
                                                </DropdownToggle>
                                                <DropdownMenu style={{height :"165px", overflowY :"scroll"}}
                                                >                      
                                                    {resultListVirtualAcc.map(virtualacc =>
                                        <tr>
                                            <DropdownItem value = {virtualacc.VAcc_NomorRek}  id = {virtualacc.VAcc_ID} onClick = {(e) => this.handleEditChange("EditVirtualAcc",e)}>{virtualacc.VAcc_NomorRek}</DropdownItem>           
                                        </tr>
                                    )}      
                                                </DropdownMenu >
                                            </UncontrolledButtonDropdown>
                                        }
                                    </Col>
                                </Row>

                            </CardBody>

                            <CardFooter>
                                <div
                                    style={{
                                        textAlign:"center",
                                        justifyContent:"center",
                                        marginBottom: "20px"
                                }}> 
                                { this.state.ValuePenerimaanUang === 0 ?            
                                    <Button size = "sm" 
                                    style={{
                                        display: "inline-flex", 
                                        alignItems: "center",
                                        marginRight: "1%",
                                    }}
                                        onClick = {() => this.changeEditButtonModal()}
                                        color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                        <MdEdit style = {{marginRight: "7px"}}></MdEdit>Edit
                                    </Button>
                                :
                                    <Button size = "sm"
                                    style={{
                                        display: "inline-flex", 
                                        alignItems: "center",
                                        marginRight: "1%",
                                    }} 
                                        onClick = 
                                        { this.state.editValuePenerimaanUang ==1 ? 
                                            ()=> this.editPenerimaanUang() 
                                            : 
                                            ()=> this.addPenerimaanUang()
                                        }
                                        color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                        <MdSave style = {{marginRight: "7px"}}></MdSave>Save
                                    </Button>
                                }
                                    <Button 
                                        size = "sm" 
                                        style={{
                                            display: "inline-flex", 
                                            alignItems: "center",
                                            marginLeft: "1%",
                                        }}
                                        onClick ={()=>this.openModalDelete()}
                                        color    = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                        <MdDelete style = {{marginRight: "7px"}}></MdDelete>Delete
                                    </Button>    

                                    <Button size = "sm" 
                                        style={{
                                            display: "inline-flex", 
                                            alignItems: "center",
                                            marginRight: "1%",
                                        }}
                                            onClick={() => this.setState({
                                                modal_penerimaan_uang : false,
                                                ValuePenerimaanUang :0
                                            })
                                            }
                                        color    = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                        <MdCancel style = {{marginRight: "7px"}}></MdCancel>Cancel
                                    </Button> 
                                </div>
                            </CardFooter>
                        </ModalBody>
                </Modal>

                <Modal
                        isOpen = {this.state.modal_delete}
                        toggle = {this.toggle('delete')}>
                        <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
                            <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
                                <ModalFooter>
                                    <Button color = "primary" 
                                    onClick = {() => this.deletePenerimaanUang()}
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
                        <Label>Group Supplier</Label>
                    </Col>
                    <Col xs = {9} md = {8}>
                        { this.state.value == 1?
                            <Input type = "GrpCode" value = {this.state.activeGrpName} onChange = {(e) => this.handleChange("EditGrpCode",e)} name = "group_code" placeholder = "GroupCode" />
                            :
                            <Input type = "GrpCode" value = {this.state.activeGrpName} onChange = {(e) => this.handleChange("EditGrpCode",e)} name = "group_code" placeholder = "GroupCode" disabled/>
                        }
                        </Col>
                    <Col>
                  
                        <UncontrolledButtonDropdown
                        >
                            <DropdownToggle caret name = "filtermenu" color = "primary">
                            
                            </DropdownToggle>
                            <DropdownMenu>
                                {this.state.resultGroup.map(group=>
                                    <DropdownItem value = {group.Grp_Name} onClick = {evt => this.updateInputSelectedGroup(group.Grp_Name, group.Grp_Code)}>{group.Grp_Name}</DropdownItem>
                                )}
                            
                            
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                        
                     </Col>                           
                </Row>
            
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Chief Accounting</Label>
                    </Col>
                    <Col xs = {9} md = {8}>
                        {   this.state.activeItemId == -1?
                                <Input type = "Nama" 
                                value = {this.state.activeChieffAcc} 
                                onChange = {(e) => this.handleChange("EditChieffAcc",e)} 
                                placeholder = "Chief Accounting" 
                                maxLength={100}
                                />
                            :   
                            this.state.value == 1?
                            <Input type = "Nama" 
                            value = {this.state.activeChieffAcc} 
                            onChange = {(e) => this.handleChange("EditChieffAcc",e)} 
                            placeholder = "Chief Accounting" 
                            maxLength={100}/>
                            :
                            <Input type = "Nama" 
                            value = {this.state.activeChieffAcc} 
                            onChange = {(e) => this.handleChange("EditChieffAcc",e)} 
                            placeholder = "Chief Accounting" disabled/>
                        }
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Nama Bank</Label>
                    </Col>
                    <Col xs = {9} md = {8}>
                        {   this.state.activeItemId ==-1?
                                <Input type = "NamaBank" value = {this.state.activeNamaBank} name = "nama_bank" placeholder = "Nama Bank" />
                            :
                            this.state.value ==1 ?                   
                             <Input type = "NamaBank" value = {this.state.activeNamaBank} name = "nama_bank" placeholder = "Nama Bank" />
                             :
                            <Input type = "NamaBank" value = {this.state.activeNamaBank} name = "nama_bank" placeholder = "Nama Bank" disabled/>
                        }
                    
                    </Col>
                    <Col>
                       { this.state.activeItemId ==-1?
                        <UncontrolledButtonDropdown>
                        <DropdownToggle caret name = "filtermenu" color = "primary">
                            . . .
                        </DropdownToggle>
                        <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                            {resultListMasterBank.map(masterbank =>
                                <tr>
                                    <DropdownItem value = {masterbank.Bank_Name}  id = {masterbank.Bank_ID} onClick = {(e) => this.handleChange("EditNamaBank",e)}>{masterbank.Bank_Name}</DropdownItem>           
                                </tr>
                            )}                                
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
                 :
                       this.state.value ==1 ?
                        <UncontrolledButtonDropdown>
                            <DropdownToggle caret name = "filtermenu" color = "primary">
                                . . .
                            </DropdownToggle>
                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                {resultListMasterBank.map(masterbank =>
                                    <tr>
                                        <DropdownItem value = {masterbank.Bank_Name}  id = {masterbank.Bank_ID} onClick = {(e) => this.handleChange("EditNamaBank",e)}>{masterbank.Bank_Name}</DropdownItem>           
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
                                {resultListMasterBank.map(masterbank =>
                                    <tr>
                                        <DropdownItem value = {masterbank.Bank_Name}  id = {masterbank.Bank_ID} onClick = {(e) => this.handleChange("EditNamaBank",e)}>{masterbank.Bank_Name}</DropdownItem>           
                                    </tr>
                                )}                                
                            </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    }
                    </Col>
                </Row> 

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Cabang Bank</Label>
                    </Col>
                    <Col xs = {9} md = {8}>
                        { this.state.activeItemId==-1?
                        <Input type = "CabangBank" value = {this.state.activeNamaCabang} name = "cabang_bank" placeholder = "Cabang Bank" />
                        : 
                        this.state.value ==1 ?
                            <Input type = "CabangBank" value = {this.state.activeNamaCabang} name = "cabang_bank" placeholder = "Cabang Bank" />
                            :
                            <Input type = "CabangBank" value = {this.state.activeNamaCabang} name = "cabang_bank" placeholder = "Cabang Bank" disabled/>
                        }
                    </Col>
                    <Col>
                       {
                       this.state.activeItemId ==-1?
                       <UncontrolledButtonDropdown>
                       <DropdownToggle caret name = "filtermenu" color = "primary">
                           . . .
                       </DropdownToggle>
                       <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                           {resultListCabangBank.map(cabangbank =>
                               <tr>
                                   <DropdownItem onClick = {(e) => this.handleEditCabangBank(cabangbank.CB_KotaID, cabangbank.NAMA, cabangbank.Kota_Name, cabangbank.KODE)}>{cabangbank.NAMA}</DropdownItem>           
                               </tr>
                           )}                                
                       </DropdownMenu>
                   </UncontrolledButtonDropdown>
                   : 
                       this.state.value ==1 ?
                        <UncontrolledButtonDropdown>
                            <DropdownToggle caret name = "filtermenu" color = "primary">
                                . . .
                            </DropdownToggle>
                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                {resultListCabangBank.map(cabangbank =>
                                    <tr>
                                        <DropdownItem onClick = {(e) => this.handleEditCabangBank(cabangbank.CB_KotaID, cabangbank.NAMA, cabangbank.Kota_Name, cabangbank.KODE)}>{cabangbank.NAMA}</DropdownItem>           
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
                                {resultListCabangBank.map(cabangbank =>
                                    <tr>
                                        <DropdownItem onClick = {(e) => this.handleEditCabangBank(cabangbank.CB_KotaID, cabangbank.NAMA, cabangbank.Kota_Name, cabangbank.KODE)}>{cabangbank.NAMA}</DropdownItem>           
                                    </tr>
                                )}                                
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                        }
                    </Col>
                </Row> 

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Kota Bank</Label>
                    </Col>
                    <Col xs = {9} md = {8}>
                        <Input type = "KotaBank" value = {this.state.activeKotaCabang} name = "kota_bank" placeholder = "Kota Bank" disabled/>                        
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>A/N</Label>
                    </Col>
                    <Col xs = {9} md = {8}>
                        { this.state.activeItemId ==-1?
                            <Input type = "A/N" 
                            value = {this.state.activeAN} 
                            onChange = {(e) => this.handleChange("EditAN",e)} 
                            placeholder = "A/N" 
                            maxLength={50}/>
                            :
                            this.state.value ==1 ?
                            <Input type = "A/N" value = {this.state.activeAN} 
                            onChange = {(e) => this.handleChange("EditAN",e)}
                            placeholder = "A/N" 
                            maxLength={50}/>
                            :
                            <Input type = "A/N" value = {this.state.activeAN} 
                            onChange = {(e) => this.handleChange("EditAN",e)}
                            placeholder = "A/N" disabled/>
                        }
                    </Col>
                </Row>
                                      
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Account Number</Label>
                    </Col>
                    <Col xs = {9} md = {8}>
                        { this.state.activeItemId ==-1?
                            <Input type = "Account" 
                            value = {this.state.activeAccountNumber} 
                            onChange = {(e) => this.handleChange("EditAccountNumber",e)}
                            placeholder = "Account" 
                            maxLength={20}/>
                            :
                            this.state.value ==1?
                            <Input type = "Account"
                            value = {this.state.activeAccountNumber} 
                            onChange = {(e) => this.handleChange("EditAccountNumber",e)}
                            placeholder = "Account" 
                            maxLength={20}/>
                            :
                            <Input type = "Account" 
                            value = {this.state.activeAccountNumber} 
                            onChange = {(e) => this.handleChange("EditAccountNumber",e)}
                            placeholder = "Account" disabled />
                        }
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {9} md = {3}>
                        <Label>Bayar</Label>
                    </Col>
                    { this.state.activeItemId ==-1?
                      <div className = "radio" 
                      style = {{
                          marginLeft : "1vw"
                      }}>
                      <Label>
                          <input type="radio"
                          value="Muka"
                          checked={this.state.selectedBayar==="M", this.state.selectedOption === "Muka"}
                          onClick={e => this.radioChange(e, "M")}/>
                          Bayar di muka
                      </Label> 
                      <Label style ={{marginLeft : "25px"}}>
                          <input type="radio" 
                          value="Belakang" 
                          checked={this.state.selectedBayar==="B", this.state.selectedOption === "Belakang"}
                          onClick={e => this.radioChange(e, "B")}/> 
                          Bayar di belakang
                      </Label>
                  </div>
                  :
                    this.state.value ==1 ?
                        <div className = "radio" 
                        style = {{
                            marginLeft : "1vw"
                        }}>
                        <Label>
                            <input type="radio"
                            value="Muka"
                            checked={this.state.selectedBayar==="M", this.state.selectedOption === "Muka"}
                            onClick={e => this.radioChange(e, "M")}/>
                            Bayar di muka
                        </Label> 
                        <Label style ={{marginLeft : "25px"}}>
                            <input type="radio" 
                            value="Belakang" 
                            checked={this.state.selectedBayar==="B", this.state.selectedOption === "Belakang"}
                            onClick={e => this.radioChange(e, "B")}/> 
                            Bayar di belakang
                        </Label>
                    </div>
                    :
                    <div className = "radio" 
                    style = {{
                        marginLeft : "1vw"
                    }}>
                    <Label>
                        <input type="radio"
                        value="Muka"
                        disabled
                        checked={this.state.selectedBayar==="M", this.state.selectedOption === "Muka"}
                        onClick={e => this.radioChange(e, "M")}
                        />
                        Bayar di muka
                    </Label> 
                    <Label style ={{marginLeft : "25px"}}>
                        <input type="radio" 
                        value="Belakang" 
                        disabled
                        checked={this.state.selectedBayar==="B", this.state.selectedOption === "Belakang"}
                        onClick={e => this.radioChange(e, "B")}
                        disabled/> 
                        Bayar di belakang
                    </Label>
                    </div> 
                    }
                </Row>
                                        
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Tipe Pembayaran</Label>
                    </Col>
                    <Col xs = {9} md = {8}>
                        { this.state.activeItemId ==-1?
                        <Input type = "TipePembayaran" value = {this.state.activeTipePembayaran} name = "tipe_pembayaran" placeholder = "Tipe Pembayaran" />
                        :
                        this.state.value ==1 ?
                            <Input type = "TipePembayaran" value = {this.state.activeTipePembayaran} name = "tipe_pembayaran" placeholder = "Tipe Pembayaran" />
                            :
                            <Input type = "TipePembayaran" value = {this.state.activeTipePembayaran} name = "tipe_pembayaran" placeholder = "Tipe Pembayaran" disabled/>
                        }
                    </Col>
                    <Col >
                       { this.state.activeItemId ==-1?
                       <UncontrolledButtonDropdown>
                            <DropdownToggle caret name = "filtermenu" color = "primary">
                                . . .
                            </DropdownToggle>
                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                {resultTipePembayaran.map(tipepembayaran =>
                                    <tr>
                                        <DropdownItem value = {tipepembayaran.Pay_CaraPembayaran}  id = {tipepembayaran.Pay_ID} onClick = {(e) => this.handleChange("EditTipePembayaran",e)}>{tipepembayaran.Pay_CaraPembayaran}</DropdownItem>           
                                    </tr>
                                )}                                
                            </DropdownMenu> 
                       </UncontrolledButtonDropdown> 
                        :
                       this.state.value ==1?
                            <UncontrolledButtonDropdown>
                                <DropdownToggle caret name = "filtermenu" color = "primary">
                                    . . .
                                </DropdownToggle>
                                <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                    {resultTipePembayaran.map(tipepembayaran =>
                                        <tr>
                                            <DropdownItem value = {tipepembayaran.Pay_CaraPembayaran}  id = {tipepembayaran.Pay_ID} onClick = {(e) => this.handleChange("EditTipePembayaran",e)}>{tipepembayaran.Pay_CaraPembayaran}</DropdownItem>           
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
                                    {resultTipePembayaran.map(tipepembayaran =>
                                        <tr>
                                            <DropdownItem value = {tipepembayaran.Pay_CaraPembayaran}  id = {tipepembayaran.Pay_ID} onClick = {(e) => this.handleChange("EditTipePembayaran",e)}>{tipepembayaran.Pay_CaraPembayaran}</DropdownItem>           
                                        </tr>
                                    )}                                
                                </DropdownMenu> 
                            </UncontrolledButtonDropdown> 
                        }
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>TOP</Label>
                    </Col>
                    <Col  xs ={9} md = {8}>
                    { this.state.activeItemId ==-1?
                    <Input type = "TOP" 
                    value = {this.state.activeTOP} 
                    onChange = {(e) => this.handleChange("EditTOP",e)} 
                    placeholder = "TOP" />
                    : 
                    this.state.value ==1 ?
                        <Input type = "number" 
                        value = {this.state.activeTOP} 
                        onChange = {(e) => this.handleChange("EditTOP",e)} 
                        placeholder = "TOP" />
                        :
                        <Input type = "number" 
                        value = {this.state.activeTOP} 
                        onChange = {(e) => this.handleChange("EditTOP",e)} 
                        placeholder = "TOP" disabled/>
                    }
                    </Col>
                    <Col>
                        <Label>Hari</Label>
                    </Col>
                </Row>

                <Row>
                    <Col  xs = {8} md = {3}></Col>
                    <Col>
                        {   
                            this.state.activeItemId == -1
                            ?
                                <Button size = "sm" 
                                    onClick =  {()=>this.openModalPenerimaanUang()}
                                    color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                    PENERIMAAN UANG
                                </Button>  
                            :
                                this.state.value == 1 ?
                                <Button size = "sm" 
                                    onClick =  {()=>this.openModalPenerimaanUang()}
                                    color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                    PENERIMAAN UANG
                                </Button>  
                                :
                                <Button disabled size = "sm" 
                                    onClick =  {()=>this.openModalPenerimaanUang()}
                                    color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                    PENERIMAAN UANG
                                </Button>  

                        }
                         
                    </Col>
                </Row>
            </CardBody>
            
            <CardFooter>
                 <div
                    style={{
                        textAlign:"center",
                        justifyContent:"center",
                        marginBottom: "20px"
                 }}> 
                { 
                this.state.activeItemId ==-1?
                <Button size = "sm"
                style={{
                    display: "inline-flex", 
                    alignItems: "center",
                    marginRight: "1%",
                }} 
                    onClick = 
                    { 
                        ()=> this.validasiAccountNumber()
                    }
                    color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                    <MdSave style = {{marginRight: "7px"}}></MdSave>Save
                </Button>    
                :
                this.state.value === 0 ?            
                    <Button size = "sm" 
                    style={{
                        display: "inline-flex", 
                        alignItems: "center",
                        marginRight: "1%",
                    }}
                        onClick = {() => this.changeEditButton()}
                        color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                        <MdEdit style = {{marginRight: "7px"}}></MdEdit>Edit
                    </Button>
                  :
                    <Button size = "sm"
                    style={{
                        display: "inline-flex", 
                        alignItems: "center",
                        marginRight: "1%",
                    }} 
                        onClick = 
                        { 
                            ()=> this.validasiAccountNumber() 
                             
                        }
                        color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                        <MdSave style = {{marginRight: "7px"}}></MdSave>Save
                    </Button>
                }
                                 
                    <Button size = "sm" 
                     style={{
                        display: "inline-flex", 
                        alignItems: "center",
                        marginRight: "1%",
                    }}
                        onClick={()=>this.props.func()}
                        color    = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                        <MdCancel style = {{marginRight: "7px"}}></MdCancel>Cancel
                    </Button> 
                 </div>
                </CardFooter>       
            </Page>
        );
    }
}
export default Supplier_Finance;