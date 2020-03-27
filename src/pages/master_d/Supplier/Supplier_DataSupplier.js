import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
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



class Supplier_DataSupplier extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            result              : [],
            resultDeptList      : [],
            resultSupplierGroup : [],
            resultSupplierDept  : [],
            DeptCodeArray    : [],
            resultHasilDeptName     : [],
            activeItemId        :this.props.activeItemId,
            activeItemName      :'',
            isCheckedImport     : false,
            isCheckedUangMuka   : false,
            resultTest          : [],
            test                : false,
            resultGroup         : [],
            value               : 0,
            resultListKota      : [],
            resultListKecamatan : [],
            activeTglPerjanjianEdit : dateFormat(new Date, "yyyy-mm-dd"),
            activeExpPerjanjianEdit   : dateFormat(new Date, "yyyy-mm-dd"),
            nullState           :   2,

            flagButtonTambahDepartemen : true
            
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
        modal_tambah_departemen : false,
        modal_supplier_group    : false
    };

    componentDidMount() {
        if(this.state.activeItemId!== -1){
            this.getListbyPaging()
            this.getListKota()
        }else{
            this.getListKota()
        }
    }

    
    deleteMasterSupplier(){
        console.log("delete master supplier");
        var url = `https://api.docnet.id/CHCMasterD/MasterSupplier/HapusSupplier`;
        var payload = {
            Sup_Code  : this.state.activeItemId,
        }

        fetch(url, {
            method : 'POST',
            body   : JSON.stringify(payload),
            JSON   : true, 
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
            .then(response => {
                if (response.ResponseCode = "200") {
                    console.log("jalan true : ")
                    this.state.modal_delete_disactive    = false;
                    this.state.responseHeader  = "Delete Data";
                    this.state.responseMessage = "Data berhasil dihapus";
                    this.state.modal_response  = true;
                    this.props.func()   
                    this.componentDidMount();
                }
                else if (response.ResponseCode = "400"){    
                    console.log("jalan false : ")
                    this.state.modal_delete_disactive    = false;
                    this.state.responseHeader  = "Delete Data";
                    this.state.responseMessage = "Data gagal dihapus";
                    this.state.modal_response  = true;
                    this.componentDidMount();      
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
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
                                
                                console.log("citycode : " +data.Data.CityCode)
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
                        if(data.Data === null)  {   
                            this.setState({ result: [], isLoading: false})
                            this.connectionOut("Data Kota Kosong", false)
                        }
                        else{
                            data.data.map(kota => 
                                this.setState({
                                    activeNamaKota      : kota.kota_name
                                })
                            )}
                    });
            
    }

    getListbyPaging()
    {   
        this.getListKota()
        
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
                            console.log("data datasupplier kosong")             
                            this.setState({ result: [], isLoading: false})
                            this.connectionOut("Data Supplier Kosong", false)
                        }
                        else{
                            console.log("data datasupplier tidak kosong")  
                            this.setState({ result: data.Data, isLoading: false})
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
                                    isCheckedImport             : (supplier.Sup_ImportYN === "Y" ? true : false),
                                    isCheckedUangMuka           : (supplier.Sup_UangMukaYN  === "Y" ? true : false)
                                })
                            )}
                            console.log("test ini " + this.state.activeExpPerjanjianEdit)
                            console.log("test ini activePeriodeEdit " + this.state.activePeriodeEdit)
                            this.getKotaKecamatan()
                            this.getKecamatan(this.state.activeKotaCodeEdit)
                    });
            
    }

    getListKota(){
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }
            
            fetch(" ",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.data===null)  {
                        console.log("Data Kota Kosong")             
                        this.setState({ resultListKota: [], isLoading: false})
                        this.connectionOut("List Kota Kosong", false)
                    }
                    else{
                        console.log("Data kota tidak kosong")  
                        this.setState({
                            resultListKota: data.data,
                            
                        })
                    }
                }) 
                ;
    }

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

    openModalWithItemID(code){
        this.setState({
            modal_delete_disactive: true,
            activeItemId: code
        })
    }

    changeEditButton() {
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

    openModalEditWithItemID(code, name, userid, saletype, sellpack, sellunit, buyprice, timbangan, supplier, principal){
        this.setState({
            modal_edit              : true,
            activeIdEdit            : code,
            activeNameEdit          : name,
            activeSaleTypeEdit      : saletype,
            activeSellPackCodeEdit  : sellpack,
            activeSellUnitEdit      : sellunit,
            activeSupplierEdit      : supplier,
            activePrincipalEdit     : principal,
            activeuserID            : userid,
            activeBuyPriceEdit      : buyprice,
            activeTimbanganEdit     : timbangan,
            isChecked: (timbangan === "Y" ? true : false),
        }); 
     
        if(saletype == 52){
            console.log("karin 52");
            this.setState({
                selectedOption      : "Gimmick",
                displayStatusGim    : 'inline-flex',
                displayStatusDoctor : 'none',
            })
        }else if (saletype == 129){
            console.log("karin 129");
            this.setState({
                selectedOption      : "Doctor",
                displayStatusGim    : 'none',
                displayStatusDoctor : 'inline-flex',
            })
        }        
        if(sellpack == "" || sellpack == null){
            this.state.activeSellPackEdit = ""
        }

        this.state.resultSellPack.map(sellpack1 =>
            {
                if (sellpack == sellpack1.pack_code) {
                    this.state.activeSellPackEdit = sellpack1.pack_name
                }
            }
        )  
        console.log("activesellpackeditnow : "+this.state.activeSellPackEdit)                             

    }

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateCheckedValue(type, e) {
        console.log(e.target.checked)
     
        if(type === "Import") {
            if(e.target.checked==true){
                this.setState({
                    activeImportYNEdit : 'Y',
                    isCheckedImport    : !this.state.isCheckedImport,
                },()=>console.log("status Import : " + this.state.activeImportYNEdit));
                
            }
            else if(e.target.checked==false){
                this.setState({
                    activeImportYNEdit : 'N',
                    isCheckedImport    : !this.state.isCheckedImport,
                },()=>console.log("status Import : " + this.state.activeImportYNEdit));
            }
        }
        else if (type === "UangMuka") {
            if(e.target.checked==true){
                this.setState({
                    activeUangMukaYNEdit : 'Y',
                    isCheckedUangMuka  : !this.state.isCheckedUangMuka,
                },()=>console.log("status Uang Muka : " + this.state.activeUangMukaYNEdit));
                
            }
            else if(e.target.checked==false){
                this.setState({
                    activeUangMukaYNEdit : 'N',
                    isCheckedUangMuka  : !this.state.isCheckedUangMuka,
                },()=>console.log("status Uang Muka : " + this.state.activeUangMukaYNEdit));
            }
        }

    }

    handleEditChangeKota=(id,nama,kodetelp)=>{
        this.setState({
            activeKotaEdit           : nama,
            activeKotaCodeEdit       : id,
            activeKodeAreaTelpEdit   : kodetelp
            },()=>this.getKecamatan(this.state.activeKotaCodeEdit));    
    }

    handleChange = (type, event) => {
        if (type === "EditNama"){
            this.setState({
            activeNameEdit : event.target.value
            });
        } else if (type === "EditNamaBoss"){
            this.setState({
            activeBossNameEdit : event.target.value
            });
        } else if (type === "EditAlamat"){
            this.setState({
            activeAlamatEdit : event.target.value
            });
        } else if (type === "EditKodePos"){
            this.setState({
            activeKodeposEdit : event.target.value
            }); 
        } else if (type === "EditTglPerjanjian"){
            this.setState({
            activeTglPerjanjianEdit : event.target.value
            });
        } else if (type === "EditExpPerjanjian"){
            this.setState({
            activeExpPerjanjianEdit : event.target.value
            });
        } else if (type === "EditPeriode"){
            this.setState({
            activePeriodeEdit : event.target.value
            });
        }else if (type === "EditImportYN"){
            this.setState({
            activeImportYNEdit : event.target.value
            });
        }else if (type === "EditKecamatan"){
                this.setState({
                    activeKecamatanEdit : event.target.value,
                    activeKecamatanCodeEdit : event.target.id
                });
        }else if (type === "EditUangMukaYN"){
            this.setState({
            activeUangMukaYNEdit : event.target.value
            });
        }
    }

    editDataSupplier  = () => {
        var successValidation = true;
        var date = new Date(this.state.activeTglPerjanjianEdit)

        if(this.state.activeBossNameEdit == "" || this.state.activeBossNameEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama bos tidak boleh kosong",
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
        else if(this.state.activeKecamatanCodeEdit == "" || this.state.activeKecamatanCodeEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Kecamatan tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }else if(this.state.activePeriodeEdit == "" || this.state.activePeriodeEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Periode tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }

        
        console.log("edit masuk");
        console.log("group : " +this.state.groupStatus);
        if(successValidation == true){
        var url     = `https://api.docnet.id/CHCMasterD/MasterSupplier/UbahSupplier`;
        var payload = {
            Sup_UserID        : "123",
            Sup_Code          : this.state.activeItemId,
            Sup_BossName      : this.state.activeBossNameEdit,
            Sup_Address       : this.state.activeAlamatEdit,
            Sup_CityCode      : parseInt(this.state.activeKotaCodeEdit),
            Sup_PostalCode    : this.state.activeKodeposEdit,
            Sup_KecID         : parseInt(this.state.activeKecamatanCodeEdit),
            Sup_PKPYN         : this.state.activePKPYNEdit,
            Sup_NPWP          : this.state.activeNPWPEdit,
            Sup_TglPengukuhan : this.state.activeTglPengukuhanEdit,
            Sup_TglRenew      : this.state.activeTglPerjanjianEdit,
            Sup_PerRenew      : this.state.activePeriodeEdit,
            Sup_ExpRenew      : dateFormat(date.setMonth(date.getMonth()+parseInt(this.state.activePeriodeEdit)),"yyyy-mm-dd" + " 00:00:00"),
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


    addDataSupplier(){
        var successValidation = true;
        console.log("console sesuatu")
        var date = new Date(this.state.activeTglPerjanjianEdit)

        if(this.state.activeNameEdit == "" || this.state.activeNameEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        else if(this.state.activeBossNameEdit == "" || this.state.activeBossNameEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama bos tidak boleh kosong",
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
        else if(this.state.activeKecamatanCodeEdit == "" || this.state.activeKecamatanCodeEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Kecamatan tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }else if(this.state.activePeriodeEdit == "" || this.state.activePeriodeEdit == null){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Periode tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }
        
        if(successValidation == true){
        var payload = {
            Sup_UserID        : "123",
            Sup_Name          : this.state.activeNameEdit,
            Sup_BossName      : this.state.activeBossNameEdit,
            Sup_Address       : this.state.activeAlamatEdit,
            Sup_CityCode      : parseInt(this.state.activeKotaCodeEdit),
            Sup_PostalCode    : this.state.activeKodeposEdit,
            Sup_KecID         : parseInt(this.state.activeKecamatanCodeEdit),
            Sup_TglRenew      : this.state.activeTglPerjanjianEdit,
            Sup_PerRenew      : this.state.activePeriodeEdit,
            Sup_ExpRenew      : dateFormat(date.setMonth(date.getMonth()+parseInt(this.state.activePeriodeEdit)),"yyyy-mm-dd"),
            //Sup_ExpRenew      : this.state.activeExpPerjanjianEdit,
            Sup_ImportYN      : this.state.activeImportYNEdit,
            Sup_UangMukaYN    : this.state.activeUangMukaYNEdit
        };
        console.log("name "+this.state.activeNameEdit)
        console.log("namebos "+this.state.activeBossNameEdit)
        console.log("alamat "+this.state.activeAlamatEdit)
        console.log("kota "+this.state.activeKotaCodeEdit)
        console.log("kodepos "+this.state.activeKodeposEdit)
        console.log("kecamatan "+this.state.activeKecamatanCodeEdit)
        console.log("period "+this.state.activePeriodeEdit)
        console.log("tglperjanjian "+this.state.activeTglPerjanjianEdit)
        console.log("expperjanjian "+date.setMonth(date.getMonth()+parseInt(this.state.activePeriodeEdit)))
        console.log("import "+this.state.activeImportYNEdit)
        console.log("uangmuka "+this.state.activeUangMukaYNEdit)

        const option = {
            method  : "POST",
            body    : JSON.stringify(payload),
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    }
            }
            
            fetch("https://api.docnet.id/CHCMasterD/MasterSupplier/TambahSupplier",option)
            .then(response => response.json())
            .then(response => {
                console.log("RESPONSE STATUS : "+response.status)
                if (response.ResponseCode == "200") {
                    console.log("jalan true : ")
                    this.state.activeNameEdit           = "";
                    this.state.activeBossNameEdit       = "";
                    this.state.activeAlamatEdit         = "";
                    this.state.activeImportYNEdit       = "";
                    this.state.activeUangMukaYNEdit     = "";
                    this.state.activeTglPerjanjianEdit  = "";
                    this.state.activePeriodeEdit        = "";
                    this.state.activePerRenewEdit       = "";
                    this.state.activeKotaEdit           = "";
                    this.state.activeKotaCodeEdit       = "";
                    this.state.activeKecamatanCodeEdit  = "";
                    this.state.activeKecamatanEdit      = "";
                    this.state.activeKodeposEdit        = "";
                    this.state.activeExpPerjanjianEdit  = "";
                    this.state.isCheckedImport          = "";
                    this.state.isCheckedUangMuka        = "";
                    this.state.isChecked                = "";

                    this.componentDidMount();
                    this.state.responseHeader  = "Add Data";
                    this.state.responseMessage = "Data berhasil ditambah"; 
                    this.state.modal_responseSuccessSaveData  = true;
                                  
                }
                else if (response.ResponseCode == "405"){
                    console.log("jalan false : ")
                    this.componentDidMount();
                    this.state.responseHeader  = "Add Data";
                    this.state.responseMessage = "Data sudah ada";
                    this.state.modal_response  = true; 
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
        }
    }

    
    getDeptList(){
        var payload = {
            dept_code : this.state.DeptCodeArray
        };
        const option = {
            method  : "POST",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            body: JSON.stringify(payload)
            }

            fetch("http://10.0.111.56:8081/getDeptListByDeptOutCode",option)
            .then(response => response.json())
            .then(data =>{ 
                console.log(data.result)
                    if(data.result === null)  {
                        console.log("data departemen api lain kosong")             
                        this.setState({ 
                            resultDeptList: [],
                            responseHeader  : "Data Departemen",
                            responseMessage : "Data Kosong",
                            modal_response  : true
                        })

                    }
                    else{
                        console.log("data departemen api lain tidak kosong")  
                        this.setState({
                            resultDeptList : data.result
                        })
                    }
            });
    }

    getAllDeptList(){
        var payload = {
           
        };
        const option = {
            method  : "POST",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            body: JSON.stringify(payload)
            }

            fetch("http://10.0.111.56:8081/getDeptListActive",option)
            .then(response => response.json())
            .then(data =>{ 
                console.log(data.result)
                    if(data.result == null)  {
                        console.log("data departemen api lain kosong")             
                        this.setState({ 
                            resultDeptList: [],
                            responseHeader  : "Data Departemen",
                            responseMessage : "Data Kosong",
                            modal_response  : true
                        })

                    }
                    else{
                        console.log("data departemen api lain tidak kosong")  
                        this.setState({
                            resultDeptList : data.result
                        })
                        console.log(this.state.resultDeptList)
                    }
            });
    }

    getSupplierGroup(){
        var payload = {};
        const option = {
            method  : "POST",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            body: JSON.stringify(payload)
            }

            fetch("https://api.docnet.id/CHCMasterD/MasterSupplierGroup/TampilkanSupplierGroup",option)
            .then(response => response.json())
            .then(data =>{ 
                console.log(data.Data)
                    if(data.Data === null)  {
                        console.log("data supplier group kosong")             
                        this.setState({ 
                            resultSupplierGroup: [],
                            responseHeader  : "Supplier Group",
                            responseMessage : "Data Kosong",
                            modal_response  : true
                        })
                      

                    }
                    else{
                        console.log("data supplier group tidak kosong")  
                        this.setState({
                            resultSupplierGroup : data.Data
                        })
                    }
            });
    }

    getSupplierDept(){
        var payload = {
            GrpSup_SupCode : this.state.activeItemId,
            GrpSup_GrpCode : this.state.selectedGroupCode
        };
        const option = {
            method  : "POST",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            body: JSON.stringify(payload)
            }

            fetch("https://api.docnet.id/CHCMasterD/MasterSupplierGroup/TampilkanSupplierDept",option)
            .then(response => response.json())
            .then(data =>{ 
                console.log(data.Data)
                    if(data.Data === null)  {
                        console.log("data supplier dept kosong")             
                        this.setState({ 
                            resultSupplierDept: [],
                            resultHasilDeptName :[],
                            responseHeader  : "Supplier Dept",
                            responseMessage : "Data Kosong",
                            modal_response  : true
                        })
                        this.setDeptCodetoSend()

                    }
                    else{
                        console.log("data supplier dept tidak kosong")  
                        this.setState({
                            resultSupplierDept : data.Data
                        })
                        this.setDeptCodetoSend()
                    }
            });
    }
    
    setDeptCodetoSend(){
        this.state.DeptCodeArray = []
        for(let i = 0; i<this.state.resultSupplierDept.length ; i++){
            this.setState(prevState=>({
                DeptCodeArray : [...prevState.DeptCodeArray, this.state.resultSupplierDept[i].GrpSup_DeptCode],
            }))
        }

        this.getDeptName()

        console.log("setdeptcodetosend")
        console.log(this.state.DeptCodeArray)
    }



    changeGroupData(type,deptName,deptCode,deptUserId){
        
        var count = 0;
        let todo = {};
        todo["GrpSup_DeptCode"]   = deptCode
        todo["GrpSup_UserID"]     = deptUserId
        todo["Grp_Name"]          = deptName
        todo["GrpSup_SupCode"]    = this.state.activeItemId
        todo["GrpSup_GrpCode"]    = this.state.selectedGroupCode
        
        if(this.state.resultTest == null){
            this.setState(prevState => ({
                resultTest     : [...prevState.resultTest, todo],
            }))
        }
        else{
            for(let i=0; i<this.state.resultTest.length ; i++){
                console.log("jalankanfor")
                if(this.state.resultTest[i].GrpSup_DeptCode === deptCode){
                    count = 1
                }
            }
            console.log("count : "+ count)
            if(count !== 1){
                this.setState(prevState => ({
                    resultTest     : [...prevState.resultTest, todo],
                }))
            }
          
        }
       
    }

    openModal(type){
        if(type == "tambahDepartemen"){
            this.setState({
                modal_tambah_departemen : true
            })
            console.log(this.state.DeptCodeArray)
            if(this.state.DeptCodeArray == ""){
                console.log("getalldeptlist")
                this.getAllDeptList()
            }
            else{
                console.log("getdeptlist")
                this.getDeptList()
            }
          
        }
        else if(type == "tambahGroup"){
            this.setState({
                modal_tambah_group : true
            })
        }
        else{
            this.setState({
                modal_supplier_group : true
            })
            this.getGroup()
        }
    }

    closeModal(type){
        if(type == "tambahDepartemen"){
            this.setState({
                modal_tambah_departemen : false,
                resultTest              :[]
            })
        }
        else if(type == "deleteModal"){
            this.setState({
                modal_delete : false,
            })
        }
        else if(type == "tambahGroup"){
            this.setState({
                modal_tambah_group : false,
            })
        }
        else{
            this.setState({
                modal_supplier_group : false
            })
        }
    }

    saveDepartemenList(){
        var url     = "https://api.docnet.id/CHCMasterD/MasterSupplierGroup/TambahSupplierGroupList";
        
        var payload = this.state.resultTest
        
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
                console.log(payload)
                    if(data.ResponseCode === "200")  {
                        console.log("save group list success")
                        this.setState({
                            modal_response : true,
                            responseHeader : "Save Group",
                            responseMessage : "Berhasil Save",
                            modal_tambah_departemen : false,
                            resultTest      : []
                        })
                        this.getSupplierDept()
                    }
                    else{
                        console.log("save group list not success / already exist")
                        this.setState({
                            modal_response : true,
                            responseHeader : "Save Group",
                            responseMessage : "Gagal Save",
                            resultTest      : []
                        })
                    }
                });
    }

    getDeptName(){
        var url     = "http://10.0.111.56:8081/getDeptListByDeptInCode";
        var payload = {
            dept_code : this.state.DeptCodeArray
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
                console.log(payload)
                    if(data.result === null)  {
                        console.log("group name api lain kosong")
                        
                    }
                    else{
                        console.log("group name api lain tidak kosong")
                        this.setState({
                            resultHasilDeptName : data.result
                        })
                    }
                });
    }

    deleteSupplierDept(deptcode){
        var url     = "https://api.docnet.id/CHCMasterD/MasterSupplierGroup/HapusSupplierGroup";
        var payload = {
            GrpSup_SupCode  : this.state.activeItemId,
            GrpSup_GrpCode  : this.state.selectedGroupCode,
            GrpSup_DeptCode : deptcode
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
                console.log(payload)
                    if(data.ResponseCode === "200")  {
                        console.log("berhasil menghapus departemen")
                        this.setState({
                            modal_response : true,
                            responseHeader: "Delete Departemen",
                            responseMessage: "Delete Success",
                            modal_delete : false
                        },()=>this.getSupplierDept())
                        
                    }
                    else{
                        console.log("tidak berhasil menghapus departemen")
                        this.setState({
                            modal_response : true,
                            responseHeader: "Delete Departemen",
                            responseMessage: "Delete Failed"
                        })
                    }
                });
    
    }
    
    openDeleteModalInGroupMenu(deptcode){
        this.setState({
            modal_delete : true,
            deptcodefordelete : deptcode
        })
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
                        })
                        
                    }
                    else{
                        console.log("data group kosong")
                        this.setState({
                            resultGroup : []
                        })
                    }
                });
    }

    saveGroup(){
        console.log("getGroup")
        var url     = "https://api.docnet.id/CHCMasterD/MasterSupplierGroup/TambahGroup";
        var payload = {
            Grp_Name : this.state.activeNamaGroup,
            GrpSup_UserID : "123"

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
                        console.log("group berhasil save")
                        this.setState({
                            modal_response : true,
                            responseHeader: "Add Group",
                            responseMessage: "Group Berhasil Ditambah",
                            modal_tambah_group : false
                        })
                        this.getGroup()
                     
                    }
                    else{
                        console.log("group gagal save")
                        this.setState({
                            modal_response : true,
                            responseHeader: "Add Group",
                            responseMessage: "Group Gagal Ditambah",
                            modal_tambah_group : false
                        })
                    }
                });
    }

    updateInputSelectedGroup(name, code){
        this.setState({
            selectedGroupName : name,
            selectedGroupCode : code
        },()=> this.getSupplierDept())
        if(this.state.selectedGroupName != ""){
            this.state.flagButtonTambahDepartemen = false
        }
    }

    updateInputNameGroup(evt){
        this.setState({
            activeNamaGroup : evt.target.value
        })
    }

    render() {
        const { result, resultSellPack, resultDeptList, resultSupplierGroup, resultListKota, resultListKecamatan } = this.state;
      
        var date = new Date(this.state.activeTglPerjanjianEdit)


        return (
            <Page
            title       = "Data Supplier"
            breadcrumbs = {[{ name: 'Supplier / Data Supplier', active: true }]}
            className   = "DataSupplier">
                
            <CardHeader>
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>No. Supplier</Label>
                    </Col>
                    <Col xs = {2} md = {9}>
                        {
                            this.state.activeItemId == -1 ?
                                <Input type = "Code" value = "-" name = "code" placeholder = "Code" disabled/>
                            :
                                <Input type = "Code" value = {this.state.activeItemId} name = "code" placeholder = "Code" disabled/>
                        }  
                        
                    </Col>
                </Row>

            </CardHeader>

            <CardBody>
                <Modal
                    isOpen = {this.state.modal_delete_disactive}>
                        <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
                        <ModalBody>Apakah Anda yakin ingin disactive data ini?</ModalBody>
                        <ModalFooter>
                            <Button color = "primary" onClick = {()=>this.deleteMasterSupplier()}> Ya</Button>
                            {' '}
                            <Button color   = "secondary" onClick = {()=>this.setState({modal_delete_disactive: false})}> Tidak</Button>
                        </ModalFooter>
                </Modal>

                <Modal
                    isOpen = {this.state.modal_delete}>
                    <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
                        <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
                            <ModalFooter>
                                <Button color = "primary" 
                                onClick = {()=>this.deleteSupplierDept(this.state.deptcodefordelete)}
                                >
                                    Ya
                                </Button>{' '}
                                <Button
                                    color   = "secondary"
                                    onClick = {()=>this.closeModal("deleteModal")} >
                                    Tidak
                                </Button>
                            </ModalFooter>
                </Modal>

                <Modal
                    isOpen={this.state.modal_supplier_group}
                    size="lg"
                    style={{
                        height: "200pw", width: "200pw",
                    
                        }}
                    >
                        
                    <ModalHeader>
                        Add Group Supplier
                    </ModalHeader>
                    <ModalBody>
                        <Row className = "show-grid mt-3">
                            <Col xs = {8} md = {3}>
                                <Label>No. Sup</Label>
                            </Col>
                            <Col xs = {2} md = {9}>
                                <Input type = "text" value={this.state.activeItemId}  name = "No. Sup" placeholder = "No. Sup" disabled/>
                            </Col>
                        </Row>
                    
                        <Row className = "show-grid mt-3">
                            <Col xs = {8} md = {3}>
                                <Label>Nama Group</Label>
                            </Col>
                            <Col xs = {2} md = {4}>
                                <Input type = "text" value={this.state.selectedGroupName} name = "Nama Group" placeholder = "Nama Group"/>
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
                            <Col>
                                <Button 
                                        size = "sm" 
                                        color = "primary" 
                                        onClick = {()=>this.openModal("tambahGroup")}
                                        style = {{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            float: "right",
                                        }}
                                    >
                                        <MdAdd 
                                        style ={{
                                            marginRight: "5px"
                                        }}>
                                        </MdAdd>Tambah Group
                                                
                                </Button>
                            </Col>
                        </Row>
                                <Table
                                style={{
                                    marginTop: "15px"
                                }} 
                                responsive>
                                    <thead>
                                        <tr width = "100%">
                                        <th>Nama</th>
                                        <th>Action</th>
                                        <th>
                                            <Button 
                                                disabled = {this.state.flagButtonTambahDepartemen}
                                                size = "sm" 
                                                color = "primary" 
                                                onClick = {()=>this.openModal("tambahDepartemen")}
                                                style = {{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    float: "right",
                                                }}
                                            >

                                                <MdAdd 
                                                style ={{
                                                    marginRight: "5px"
                                                }}>
                                                </MdAdd>Tambah Departemen
                                                        
                                            </Button>
                                        </th>
                                        
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {this.state.resultHasilDeptName.map(supplierDept => 
                                            <tr>
                                                <td>{supplierDept.dept_name}</td>
                                                <td>{supplierDept.dept_code}</td>
                                                <td>
                                                <Button onClick = {()=>this.openDeleteModalInGroupMenu(supplierDept.dept_code)}>del</Button>
                                                </td>

                                                <td>
                                                    
                                                </td>
                                                
                                            </tr>    
                                            )}
                                    </tbody>
                                </Table>
                    
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={()=>this.closeModal("openGroupModal")}>Cancel</Button>
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
                    isOpen={this.state.modal_responseSuccessSaveData}
                >
                    <ModalHeader>
                        {this.state.responseHeader}
                    </ModalHeader>
                    <ModalBody>
                        {this.state.responseMessage}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={ () => this.props.func() }>OK</Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    isOpen={this.state.modal_tambah_departemen}
                >
                    <ModalHeader>
                        Tambah Data Departemen
                    </ModalHeader>
                    <ModalBody>
                        <Table>
                        <td>
                        {this.state.resultDeptList.map(departemen => 
                            <tr>
                                <td>{departemen.dept_name}</td>
                                <td>{departemen.dept_code}</td>
                                
                                <td>
                                    <Button onClick={()=>this.changeGroupData("departemen",departemen.dept_name, departemen.dept_code, departemen.dept_userid )}>></Button>
                                </td>

                                
                            </tr>   
                        )}
                        </td>

                        <td>
                                <tr>
                                    Departemen yang dipilih
                                </tr>
                                {this.state.resultTest.map(dpt =>
                                    <tr>
                                        <td>{dpt.Grp_Name}</td>
                                    </tr>   
                                )}
                        </td>
                        </Table>
                       
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={ () => this.saveDepartemenList()  }>Save</Button>
                        <Button color="success" onClick={ () => this.closeModal("tambahDepartemen")  }>Cancel</Button>
                    </ModalFooter>
                </Modal>


                <Modal
                    isOpen={this.state.modal_tambah_group}
                >
                    <ModalHeader>
                        Tambah Group
                    </ModalHeader>
                    <ModalBody>
                        <Col xs = {8} md = {3}>
                            <Label>Nama Group</Label>
                        </Col>
                        <Col xs = {2} md = {9}>
                            <Input type = "text" value={this.state.activeNamaGroup} onChange = {(evt)=>this.updateInputNameGroup(evt)} name = "Nama Group" placeholder = "Nama Group"/>
                        </Col>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick ={()=>this.saveGroup()}>Save</Button>
                        <Button color="success" onClick ={()=>this.closeModal("tambahGroup")} >Cancel</Button>
                    </ModalFooter>
                </Modal>


                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Nama</Label>
                    </Col>
                    <Col xs = {2} md = {5}>
                    {
                        this.state.activeItemId == -1
                        ?
                        <Input type = "Nama" value = {this.state.activeNameEdit} onChange = {(e) => this.handleChange("EditNama",e)} name = "nama" placeholder = "Nama" />
                        :
                            this.state.value ==1
                            ?
                            <Input type = "Nama" value = {this.state.activeNameEdit} onChange = {(e) => this.handleChange("EditNama",e)} name = "nama" placeholder = "Nama" disabled/>
                            :
                            <Input type = "Nama" value = {this.state.activeNameEdit} onChange = {(e) => this.handleChange("EditNama",e)} name = "nama" placeholder = "Nama" disabled/>
                    }
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Nama Bos</Label>
                    </Col>
                    <Col xs = {2} md = {5}>
                        {
                            this.state.activeItemId == -1
                            ?
                            <Input type = "Nama" value = {this.state.activeBossNameEdit} onChange = {(e) => this.handleChange("EditNamaBoss",e)} name = "nama_boss" placeholder = "Nama Boss" />
                            :
                                this.state.value == 1
                                ?
                                <Input type = "Nama" value = {this.state.activeBossNameEdit} onChange = {(e) => this.handleChange("EditNamaBoss",e)} name = "nama_boss" placeholder = "Nama Boss" />
                                :
                                <Input type = "Nama" value = {this.state.activeBossNameEdit} onChange = {(e) => this.handleChange("EditNamaBoss",e)} name = "nama_boss" placeholder = "Nama Boss" disabled/>
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
                            <Input type = "Alamat" value = {this.state.activeAlamatEdit} onChange = {(e) => this.handleChange("EditAlamat",e)} name = "alamat" placeholder = "Alamat" />
                            :
                                this.state.value == 1
                                ?
                                <Input type = "Alamat" value = {this.state.activeAlamatEdit} onChange = {(e) => this.handleChange("EditAlamat",e)} name = "alamat" placeholder = "Alamat" />
                                :
                                <Input type = "Alamat" value = {this.state.activeAlamatEdit} onChange = {(e) => this.handleChange("EditAlamat",e)} name = "alamat" placeholder = "Alamat" disabled/>
                        }
                    </Col>
                </Row>
                                        
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Kota</Label>
                    </Col>
                    <Col xs = {8} md = {3}>
                        {
                            this.state.activeItemId == -1
                            ?
                            <Input type = "Kota" value = {this.state.activeKotaEdit}  name = "Kota" placeholder = "Kota" />
                            :
                                this.state.value == 1
                                ?
                                <Input type = "Kota" value = {this.state.activeKotaEdit}  name = "Kota" placeholder = "Kota" />
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
                    <Col xs = {8} md = {1}>
                        <Label>Kode Pos</Label>
                    </Col>
                    <Col xs = {8} md = {2}>
                        {
                            this.state.activeItemId == -1
                            ?
                            <Input type = "KodePos" value = {this.state.activeKodeposEdit} onChange = {(e) => this.handleChange("EditKodePos",e)} name = "kode_pos" placeholder = "Kode Pos" />
                            :
                                this.state.value == 1
                                ?
                                <Input type = "KodePos" value = {this.state.activeKodeposEdit} onChange = {(e) => this.handleChange("EditKodePos",e)} name = "kode_pos" placeholder = "Kode Pos" />
                                :
                                <Input type = "KodePos" value = {this.state.activeKodeposEdit} onChange = {(e) => this.handleChange("EditKodePos",e)} name = "kode_pos" placeholder = "Kode Pos" disabled/>
                        }
                    </Col>
                </Row>
                                        
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Kecamatan</Label>
                    </Col>
                    <Col xs = {8} md = {3}>
                        {
                            this.state.activeItemId == -1
                            ?
                            <Input type = "Kecamatan" value = {this.state.activeKecamatanEdit}  name = "Kecamatan" placeholder = "Kecamatan" />
                            :
                                this.state.value == 1
                                ?
                                <Input type = "Kecamatan" value = {this.state.activeKecamatanEdit} name = "Kecamatan" placeholder = "Kecamatan" />
                                :
                                <Input type = "Kecamatan" value = {this.state.activeKecamatanEdit}  name = "Kecamatan" placeholder = "Kecamatan" disabled/>
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
                                            <DropdownItem value = {listkecamatan.Kec_Nama}  id = {listkecamatan.Kec_ID} onClick = {(e) => this.handleChange("EditKecamatan",e)}>{listkecamatan.Kec_Nama}</DropdownItem>           
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
                                            <DropdownItem value = {listkecamatan.Kec_Nama}  id = {listkecamatan.Kec_ID} onClick = {(e) => this.handleChange("EditKecamatan",e)}>{listkecamatan.Kec_Nama}</DropdownItem>           
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
                                            <DropdownItem value = {listkecamatan.Kec_Nama}  id = {listkecamatan.Kec_ID} onClick = {(e) => this.handleChange("EditKecamatan",e)}>{listkecamatan.Kec_Nama}</DropdownItem>           
                                        </tr>
                                    )}                                
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                    }
                    </Col>
                </Row> 

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Tgl Perjanjian</Label>
                    </Col>
                    <Col xs = {8} md = {2}>
                        {
                            this.state.activeItemId == -1
                            ?
                            <Input type = "date" value = {dateFormat(this.state.activeTglPerjanjianEdit, "yyyy-mm-dd")} onChange = {(e) => this.handleChange("EditTglPerjanjian",e)} name = "tgl_perjanjian" placeholder = "TglPerjanjian" />
                            :
                                this.state.value == 1
                                ?
                                <Input type = "date" value = {dateFormat(this.state.activeTglPerjanjianEdit, "yyyy-mm-dd")} onChange = {(e) => this.handleChange("EditTglPerjanjian",e)} name = "tgl_perjanjian" placeholder = "TglPerjanjian" />
                                :
                                <Input type = "datetime" value = {dateFormat(this.state.activeTglPerjanjianEdit, "mm/dd/yyyy")} onChange = {(e) => this.handleChange("EditTglPerjanjian",e)} name = "tgl_perjanjian" placeholder = "TglPerjanjian" disabled/>
                        }
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Periode</Label>
                    </Col>
                    <Col xs = {8} md = {1}>
                        {
                            this.state.activeItemId == -1
                            ?
                            <Input type = "name" value = {this.state.activePeriodeEdit} onChange = {(e) => this.handleChange("EditPeriode",e)} name = "periode" placeholder = "Periode" disabled/>
                            :
                                this.state.value ==1
                                ?
                                <Input type = "name" value = {this.state.activePeriodeEdit} onChange = {(e) => this.handleChange("EditPeriode",e)} name = "periode" placeholder = "Periode" disabled/>
                                :
                                <Input type = "name" value = {this.state.activePeriodeEdit} onChange = {(e) => this.handleChange("EditPeriode",e)} name = "periode" placeholder = "Periode" disabled/>
                        }
                    </Col>                            
                    <Col>
                    {       this.state.activeItemId == -1 
                            ?
                        <UncontrolledButtonDropdown>
                            <DropdownToggle caret name = "filtermenu" color = "primary"  >
                                . . .
                            </DropdownToggle>
                            <DropdownMenu style={{height :"80px", overflowY :"scroll"}}>                      

                                       
                                        {this.state.activeItemId == -1 
                                            ?
                                            <tr>
                                            <DropdownItem value = "6" onClick = {(e) => this.handleChange("EditPeriode",e)}>6</DropdownItem>          
                                            <DropdownItem value = "12" onClick = {(e) => this.handleChange("EditPeriode",e)}>12</DropdownItem>           
                                            </tr>
                                            :
                                            this.state.value == 1 ?
                                                <tr>
                                                <DropdownItem value = "6" onClick = {(e) => this.handleChange("EditPeriode",e)}>6</DropdownItem>          
                                                <DropdownItem value = "12" onClick = {(e) => this.handleChange("EditPeriode",e)}>12</DropdownItem>           
                                                </tr>
                                            :
                                                <tr>
                                                <DropdownItem value = "6" onClick = {(e) => this.handleChange("EditPeriode",e)}>6</DropdownItem>          
                                                <DropdownItem value = "12" onClick = {(e) => this.handleChange("EditPeriode",e)}>12</DropdownItem>           
                                                </tr>
                                        } 
                                          
                                </DropdownMenu> 
                        </UncontrolledButtonDropdown>                            
                        :
                        this.state.value == 1 ?
                            <UncontrolledButtonDropdown>
                                <DropdownToggle caret name = "filtermenu" color = "primary">
                                    . . .
                                </DropdownToggle>
                                <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                        
                                            {this.state.activeItemId == -1 
                                                ?
                                                <tr>
                                                <DropdownItem value = "6" onClick = {(e) => this.handleChange("EditPeriode",e)}>6</DropdownItem>          
                                                <DropdownItem value = "12" onClick = {(e) => this.handleChange("EditPeriode",e)}>12</DropdownItem>           
                                                </tr>
                                            :
                                                <tr>
                                                <DropdownItem value = "6" onClick = {(e) => this.handleChange("EditPeriode",e)}>6</DropdownItem>          
                                                <DropdownItem value = "12" onClick = {(e) => this.handleChange("EditPeriode",e)}>12</DropdownItem>           
                                                </tr>
                                    }                        
                                    
                                    </DropdownMenu> 
                            </UncontrolledButtonDropdown> 
                            :
                            <UncontrolledButtonDropdown>
                            <DropdownToggle caret name = "filtermenu" color = "primary" disabled >
                                . . .
                            </DropdownToggle>
                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                        {this.state.activeItemId == -1 
                                            ?
                                            <tr>
                                                <DropdownItem value = "6" onClick = {(e) => this.handleChange("EditPeriode",e)}>6</DropdownItem>          
                                                <DropdownItem value = "12" onClick = {(e) => this.handleChange("EditPeriode",e)}>12</DropdownItem>           
                                            </tr>
                                            :
                                            <tr>
                                                <DropdownItem value = "6" onClick = {(e) => this.handleChange("EditPeriode",e)}>6</DropdownItem>          
                                                <DropdownItem value = "12" onClick = {(e) => this.handleChange("EditPeriode",e)}>12</DropdownItem>           
                                            </tr>
                                        } 
                                </DropdownMenu> 
                        </UncontrolledButtonDropdown> 
                    }
                        </Col>
                        <Col xs = {8} md = {7}>
                        <Label>Bulan</Label>
                    </Col>                  
                </Row>
                    
                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Exp. Perjanjian</Label>
                    </Col>
                    <Col xs = {8} md = {2}>
                        {
                            
                            this.state.activeItemId == -1
                            ?
                                this.state.activePeriodeEdit != null
                                ?
                                <Input type = "datetime" value = {dateFormat(date.setMonth(date.getMonth()+parseInt(this.state.activePeriodeEdit)),"mm/dd/yyyy")} onChange = {(e) => this.handleChange("EditExpPerjanjian",e)} name = "exp" placeholder = "ExpPerjanjian" disabled/>

                                : 
                                <Input type = "date" value = {dateFormat(this.state.activeExpPerjanjianEdit, "yyyy-mm-dd")} onChange = {(e) => this.handleChange("EditExpPerjanjian",e)} name = "exp" placeholder = "ExpPerjanjian" disabled/>

                            :
                                this.state.value == 1
                                ?
                                    this.state.activePeriodeEdit == '-'
                                    ?
                                    <Input type = "date" value = {dateFormat(this.state.activeExpPerjanjianEdit,"yyyy-mm-dd")} onChange = {(e) => this.handleChange("EditExpPerjanjian",e)} name = "exp" placeholder = "ExpPerjanjian" disabled/>
                                    :
                                    <Input type = "datetime" value = {dateFormat(date.setMonth(date.getMonth()+parseInt(this.state.activePeriodeEdit)),"mm/dd/yyyy")} onChange = {(e) => this.handleChange("EditExpPerjanjian",e)} name = "exp" placeholder = "ExpPerjanjian" disabled/>
                                :
                                <Input type = "datetime" value = {dateFormat(this.state.activeExpPerjanjianEdit, "mm/dd/yyyy")} onChange = {(e) => this.handleChange("EditExpPerjanjian",e)} name = "exp" placeholder = "ExpPerjanjian" disabled/>
                        }
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}> </Col>
                    <Col xs = {2} md = {4}>
                        {
                            this.state.activeItemId == -1
                            ?
                            <Input type = "checkbox" checked = {this.state.isCheckedImport} style={{marginLeft: "5px"}} value = {this.state.activeImportYNEdit} onChange={e => this.updateCheckedValue("Import",e)} name = "Import" placeholder = "Import" />
                            :
                                this.state.value == 1
                                ?
                                <Input type = "checkbox" checked = {this.state.isCheckedImport} style={{marginLeft: "5px"}} value = {this.state.activeImportYNEdit} onChange={e => this.updateCheckedValue("Import",e)} name = "Import" placeholder = "Import" />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedImport} style={{marginLeft: "5px"}} value = {this.state.activeImportYNEdit} onChange={e => this.updateCheckedValue("Import",e)} name = "Import" placeholder = "Import" disabled/>
                        }
                        <Label style={{marginLeft: "20px"}}>Import</Label>
                    </Col>
                </Row>

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}> </Col>
                    <Col xs = {2} md = {4}>
                        {
                            this.state.activeItemId == -1
                            ?
                            <Input type = "checkbox" checked = {this.state.isCheckedUangMuka} style={{marginLeft: "5px"}} value = {this.state.activeUangMukaYNEdit} onChange={e => this.updateCheckedValue("UangMuka",e)} name = "UangMuka" placeholder = "Uang Muka" />
                            :
                                this.state.value == 1
                                ?
                                <Input type = "checkbox" checked = {this.state.isCheckedUangMuka} style={{marginLeft: "5px"}} value = {this.state.activeUangMukaYNEdit} onChange={e => this.updateCheckedValue("UangMuka",e)} name = "UangMuka" placeholder = "Uang Muka" />
                                :
                                <Input type = "checkbox" checked = {this.state.isCheckedUangMuka} style={{marginLeft: "5px"}} value = {this.state.activeUangMukaYNEdit} onChange={e => this.updateCheckedValue("UangMuka",e)} name = "UangMuka" placeholder = "Uang Muka" disabled/>
                        }
                        <Label style={{marginLeft: "20px"}}>Uang Muka</Label>
                    </Col>
                </Row>    

                <div
                        style={{
                            textAlign:"left",
                            justifyContent:"center",
                            marginBottom: "20px"
                        }}> 

                        {
                            this.state.activeItemId == -1
                            ?
                            <Button size = "sm" disabled onClick = {()=>this.openModalWithItemID(this.state.activeItemId)} color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                DISACTIVATE
                            </Button>
                            :
                                this.state.value == 1
                                ?
                                <Button size = "sm" onClick = {()=>this.openModalWithItemID(this.state.activeItemId)} color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                DISACTIVATE
                                </Button>
                                :
                                <Button disabled size = "sm" onClick = {()=>this.openModalWithItemID(this.state.activeItemId)} color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                DISACTIVATE
                                </Button>
                        }

                        {
                            this.state.activeItemId == -1
                            ?
                            <Button disabled size = "sm"  onClick = {()=>this.openModal("group")} color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                GROUP
                            </Button>
                            :
                                this.state.value == 1
                                ?
                                <Button size = "sm"  onClick = {()=>this.openModal("group")} color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                GROUP   
                                </Button>
                                :
                                <Button disabled size = "sm"  onClick = {()=>this.openModal("group")} color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                GROUP
                                </Button>
                        }
                                                                                               
                        
                    </div>
                    
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
                                    onClick = {()=> this.addDataSupplier()}
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
export default Supplier_DataSupplier;
