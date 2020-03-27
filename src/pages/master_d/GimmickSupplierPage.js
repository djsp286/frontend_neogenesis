import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, Nav, Form,
    Navbar,UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup,InputGroup, InputGroupAddon, FormGroup
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdAdd, MdDelete, MdSearch, MdEdit } from 'react-icons/md';

class GimmickSupplierPage extends React.Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state  = {
            result          : [],
            resultSupplier  : [],
            resultPrincipal : [],
            isLoading       : false,
            inputtedName    : '',
            selectedDropdown: "Show All",
            currentPage     : 1,
            todosPerPage    : 5,
            flag            : 0,
            pageCount       : 0,
            displayStatus   : "none",
            displayStatusGim: "inline-flex",
            displayStatusDoctor : "none",
            waitAsync       : true,
            selectedOption  : 'Gimmick',
            selectedSaleType: 52,
            checkedTimbangan: 'N',
            resultSellPack  : [],
            isChecked       : true,
            sellpackNameDisplay : ""
            
        };
        this.radioChange = this.radioChange.bind(this);
    }
    
    connectionOut(message, render){
        console.log("masuk");
        if(render){
            this.setState({
                isLoading           : true,
                modal_backdrop      : false,
                modal_nested_parent : false,
                modal_nested        : false,
                backdrop            : true,
                modal_response      : true,
                modal_edit          : false,
                modal_confirm_edit  : false,
                searchType          : "Show_All",
                responseHeader      : "CONNECTION ERROR",
                responseMessage     : message
            },  () => this.getCountPage())
        }else{
            this.setState({
                isLoading           : true,
                modal_backdrop      : false,
                modal_nested_parent : false,
                modal_nested        : false,
                backdrop            : true,
                modal_response      : true,
                modal_edit          : false,
                modal_confirm_edit  : false,
                responseHeader      : "CONNECTION ERROR",
                responseMessage     : message
            })
        }
    }

    state = {
        modal              : false,
        modal_backdrop     : false,
        modal_nested_parent: false,
        modal_nested       : false,
        modal_response     : false,
        modal_edit         : false,
        modal_confirm_edit  : false,
        backdrop           : true,
        isLoading          : true,
        responseHeader     : "",
        responseMessage    : "",
    };

    componentDidMount() {
        this.setState.isLoading=true;
        this.getCountPage();
    }

    getCountPage(){
        this.getSellPackList()
        this.getSupplierList()
        this.getPrincipalList()
        console.log("todoperpage : "+this.state.todosPerPage);
        if(this.state.keyword!=null && this.state.keyword!=""){
            if (this.state.searchType==="Name"){
                console.log("dfds1" + this.state.todosPerPage)
                var payload = {
                    Name  : this.state.keyword,
                    Code  : "",
                    Limit : parseInt(this.state.todosPerPage),
                }
            }
            else if (this.state.searchType==="Code"){
                console.log("dfds2" + this.state.todosPerPage)
                var payload = {
                    Name  : "",
                    Code  : this.state.keyword,
                    Limit : parseInt(this.state.todosPerPage),
                }
            }
        }else{
            console.log("dfds3" + this.state.todosPerPage)
            var payload = {
                Name  : "",
                Code  : "",
                Limit : parseInt(this.state.todosPerPage),
            }
        }  
        var url     = `https://api.docnet.id/CHCMasterD/MasterGimmickSupplier/HitungDataGimmickSupplier`;

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
                console.log("bramodel : "+JSON.stringify(payload))
                console.log(response)       
                        if(response.Data === 0){
                            this.setState({ 
                                responseHeader  : "Warning",
                                responseMessage : "Data is empty",
                                modal_response  : true,
                                pageCount       : 1
                            });
                            console.log("rmasuk if response count=0");
                        }
                        
                        else{
                            console.log("response count : "+response.Data);
                            this.state.pageCount = response.Data;    
                            console.log("count pagecount: "+this.state.pageCount) 
                            this.getListbyPaging(this.state.currentPage,this.state.todosPerPage, this.state.isLoading = false);
                        }

                        // else{
                        //     this.setState({responseHeader  : "Warning",
                        //     responseMessage : "No Connection",
                        //     modal_response  : true,
                        //     pageCount       : 1})
                        //     console.log("rmasuk if response count=0");
                        // }            
                                          
        }, ()=>  this.connectionOut("Can't reach the server", false), this.state.isLoading = true);
    }


    getListbyPaging(currPage,currLimit)
    {   
        this.state.isLoading = true ; 
        
        if (this.state.searchType==="Name"){
            var url     = `https://api.docnet.id/CHCMasterD/MasterGimmickSupplier/CariNamaGimmickSupplierPage`;
            var payload = {
                Not_SaleName    : this.state.keyword,
                Start           : parseInt(currPage),
                Length          : parseInt(currLimit),
            }
    
            fetch(url, {
                method : "POST",
                body   : JSON.stringify(payload),
                json   : true,
                headers:{
                         "Content-type": "application/json; charset=UTF-8"
                        }
                })
                .then(response => response.json())
                .then(data => {
                    if(data.Data === null)  {
                        console.log("data kosong")             
                        this.setState({ result: [], isLoading: false})
                        this.state.responseHeader  = "Warning";
                        this.state.responseMessage = "Nama tidak ada"; 
                        this.state.modal_response  = true;  
                    }
                    else{
                        console.log("data count : "+data.Data.length)
                        console.log("data tidak kosong")  
                        this.setState({ result: data.Data, isLoading: false})
                    }
                })
        }
        else if(this.state.searchType==="Code"){
            console.log(url);
            var url     = `https://api.docnet.id/CHCMasterD/MasterGimmickSupplier/CariKodeGimmickSupplierPage`;
            var payload = {
                Not_SaleCode    : this.state.keyword,
                Start           : parseInt(currPage),
                Length          : parseInt(currLimit),
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
            .then(data => {
                if(data.Data === null)  {
                    console.log("data kosong")             
                    this.setState({ result: [], isLoading: false})
                    this.state.responseHeader  = "Warning";
                    this.state.responseMessage = "Kode tidak ada"; 
                    this.state.modal_response  = true;  
                }
                else{
                    console.log("data count : "+data.Data.length)
                    console.log("data tidak kosong")  
                    this.setState({ result: data.Data, isLoading: false})
                }
                
            }
        )}
        else{
            var payload = {
            Start   : parseInt(currPage),
            Length  : parseInt(currLimit),
            };
            const option = {
                method  : "POST",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                body: JSON.stringify(payload)
                }
                
                fetch("https://api.docnet.id/CHCMasterD/MasterGimmickSupplier/TampilkanGimmickSupplierPage",option)
                .then(response => response.json())
                .then(data =>{ 
                        console.log("panjang data : "+data.Data.length)
                        if(data.Data === null)  {
                            console.log("data kosong")             
                            this.setState({ result: [], isLoading: false})
                            this.connectionOut("Can't reach the server", false)
                        }
                        else{
                            console.log("data count : "+data.Data.length)
                            console.log("data tidak kosong")  
                            this.setState({ result: data.Data, isLoading: false})
                        }
                    });
            }
    }

    insertMasterGimSupplier = param => () => {
        var successValidation = true;

        if(this.state.inputtedName.length > 15){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama tidak boleh melebihi 15 karakter",
                modal_response  : true})
                successValidation = false;
        }else if(this.state.inputtedName == "")
        {
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }

        if(this.state.selectedOption == "Gimmick"){
            var payload = {
                Not_SaleName      : this.state.inputtedName,
                // Not_SaleUserID    : this.state.activeuserID,
                Not_SaleType      : this.state.selectedSaleType,
                Not_SellPack      : parseInt(this.state.inputtedSellPackCode),
                Not_SellUnit      : parseInt(this.state.inputtedSellUnit),       
                Not_BuyPrice      : null,
                Not_SaleTimbangYN : this.state.checkedTimbangan,
                Not_SaleSuppID    : this.state.inputtedSupplierCode,
                Not_SalePrinID    : this.state.inputtedPrincipalCode
            }
           
            if(isNaN(this.state.inputtedSellUnit)){
                this.setState({
                    responseHeader      : "Warning",
                    responseMessage     : "Sell Unit harus angka",
                    modal_response      : true,
                    modal_confirm_edit  : false})
                    successValidation = false;
            }else if(this.state.inputtedSellPack == null || this.state.inputtedSellPack == ""){
                this.setState({
                    responseHeader      : "Warning",
                    responseMessage     : "Sell Pack tidak boleh kosong",
                    modal_response      : true,
                    modal_confirm_edit  : false})
                    successValidation = false;
            }
        }
        else if(this.state.selectedOption == "Doctor"){

            var payload = {
                Not_SaleName      : this.state.inputtedName,
                // Not_SaleUserID    : this.state.activeuserID,
                Not_SaleType      : this.state.selectedSaleType,
                Not_SellPack      : null,
                Not_SellUnit      : null,       
                Not_BuyPrice      : parseFloat(this.state.inputtedBuyPrice),
                Not_SaleTimbangYN : this.state.checkedTimbangan,
                Not_SaleSuppID    : null,
                Not_SalePrinID    : null
            }
    
            if(isNaN(this.state.inputtedBuyPrice)){
                this.setState({
                    responseHeader      : "Warning",
                    responseMessage     : "Buy Price harus angka",
                    modal_response      : true,
                    modal_confirm_edit  : false})
                    successValidation = false;
            }
        }

        if(successValidation==true){
            var url     = `https://api.docnet.id/CHCMasterD/MasterGimmickSupplier/TambahGimmickSupplier`;
           
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
                console.log("RESPONSE STATUS : "+response.status)
                if (response.ResponseCode = "200") {
                    console.log("jalan true : ")
                    this.state.modal_nested        = false;
                    this.state.modal_nested_parent = false;
                    this.state.inputtedName        ="";
                    this.state.inputtedSellPack    = "";
                    this.state.inputtedSellPackCode="";
                    this.state.inputtedSellUnit    ="";
                    this.state.inputtedBuyPrice    ="";
                    this.state.checkedTimbangan    ='N';
                    this.state.inputtedSupplier    ="";
                    this.state.inputtedSupplierCode="";
                    this.state.inputtedPrincipal   ="";
                    this.state.inputtedPrincipalCode = "";
                    this.state.currentPage = this.state.pageCount;
                    this.componentDidMount();
                    this.state.responseHeader  = "Add Data";
                    this.state.responseMessage = "Data berhasil ditambah"; 
                    this.state.modal_response  = true;              
                }
                else if (response.ResponseCode = "405"){
                    console.log("jalan false : ")
                    this.state.modal_nested        = false;
                    this.state.modal_nested_parent = false; 
                    this.state.inputtedName        ="";
                    this.state.inputtedSellPack    ="";
                    this.state.inputtedSellPackCode="";
                    this.state.inputtedSellUnit    ="";
                    this.state.inputtedBuyPrice    ="";
                    this.state.checkedTimbangan    ='N';
                    this.state.inputtedSupplier    ="";
                    this.state.inputtedSupplierCode= "";
                    this.state.inputtedPrincipal   ="";
                    this.state.inputtedPrincipalCode = "";
                    this.componentDidMount();
                    this.state.responseHeader  = "Add Data";
                    this.state.responseMessage = "Data sudah ada";
                    this.state.modal_response  = true; 
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
        }
    }

    editMasterGimSupplier = param => () => {
        console.log("activesaletypeedit : "+this.state.activeSaleTypeEdit);
        var successValidation = true;

        if(this.state.activeNameEdit.length > 15){
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama tidak boleh melebihi 15 karakter",
                modal_response  : true})
                successValidation = false;
        }else if(this.state.activeNameEdit == "")
        {
            this.setState({
                responseHeader  : "Warning",
                responseMessage : "Nama tidak boleh kosong",
                modal_response  : true})
                successValidation = false;
        }

        if(this.state.selectedOption == "Gimmick"){
            var payload = {
                Not_SaleCode      : this.state.activeIdEdit,
                Not_SaleName      : this.state.activeNameEdit,
                Not_SaleUserID    : this.state.activeuserID,
                Not_SaleType      : this.state.activeSaleTypeEdit,
                Not_SellPack      : parseInt(this.state.activeSellPackCodeEdit),
                Not_SellUnit      : parseInt(this.state.activeSellUnitEdit),       
                Not_BuyPrice      : null,
                Not_SaleTimbangYN : this.state.activeTimbanganEdit,
                Not_SaleSuppID    : this.state.activeSupplierCodeEdit,
                Not_SalePrinID    : this.state.activePrincipalCodeEdit  
            }
           
           if(isNaN(this.state.activeSellUnitEdit)){
                this.setState({
                    responseHeader      : "Warning",
                    responseMessage     : "Sell Unit harus angka",
                    modal_response      : true,
                    modal_confirm_edit  : false})
                    successValidation = false;
            }
        }
        else if(this.state.selectedOption == "Doctor"){
            var payload = {
                Not_SaleCode      : this.state.activeIdEdit,
                Not_SaleName      : this.state.activeNameEdit,
                Not_SaleUserID    : this.state.activeuserID,
                Not_SaleType      : this.state.activeSaleTypeEdit,
                Not_SellPack      : null,
                Not_SellUnit      : null,       
                Not_BuyPrice      : parseFloat(this.state.activeBuyPriceEdit),
                Not_SaleTimbangYN : this.state.activeTimbanganEdit,
                Not_SaleSuppID    : null,
                Not_SalePrinID    : null
            }
    
            if(isNaN(this.state.activeBuyPriceEdit)){
                this.setState({
                    responseHeader      : "Warning",
                    responseMessage     : "Buy Price harus angka",
                    modal_response      : true,
                    modal_confirm_edit  : false})
                    successValidation = false;
            }
        }

        if(successValidation==true){
        console.log("edit masuk");
        var url     = `https://api.docnet.id/CHCMasterD/MasterGimmickSupplier/UbahGimmickSupplier`;
       
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
                console.log("RESPONSE STATUS : "+response.status)
                if (response.ResponseCode = "200") {
                    console.log("jalan true : ")
                    this.state.modal_confirm_edit = false; 
                    this.state.modal_edit         = false;
                    this.componentDidMount();
                    this.state.responseHeader  = "Edit Data";
                    this.state.responseMessage = "Data berhasil diedit"; 
                    this.state.modal_response  = true;              
                }
                else if (response.ResponseCode = "410"){
                    console.log("jalan false : ")
                    this.state.modal_confirm_edit = false; 
                    this.state.modal_edit         = false;
                    this.componentDidMount();
                    this.state.responseHeader  = "Edit Data";
                    this.state.responseMessage = "Tidak ada perubahan data";
                    this.state.modal_response  = true;
                }
            }, ()=>  this.connectionOut("Can't reach the server", false));
        }
    }
    
    
    getSellPackList = () =>{
        var payload = {
            limit   : "0",
            offset  : "0",
            };
            const option = {
                method  : "POST",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8",
                        "Authorization": window.localStorage.getItem('tokenLogin')
                        },
                body: JSON.stringify(payload)
                }
                
                fetch("https://api.docnet.id/CHCMasterB/MasterKemasan",option)
                .then(response => response.json())
                .then(data =>{ 
                        console.log("data sellpack :")
                        console.log(data.result)
                        if(data.result === null)  {
                            console.log("Data SellPack Kosong")             
                            this.setState({ resultSellPack: [], isLoading: false})
                            this.connectionOut("Data Sellpack Kosong", false)
                        }
                        else{
                            // console.log("data sellpack count : "+data.result.length)
                            console.log("data sellpack tidak kosong")  
                            this.setState({ resultSellPack: data.result, isLoading: false})
                        }
                    });
    }

    getSupplierList  = () =>{
            const option = {
                method  : "GET",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                }
                
                fetch("https://api.docnet.id/CHCMasterD/MasterSupplier/TampilkanSupplier",option)
                .then(response => response.json())
                .then(data =>{ 
                        console.log("panjang data : "+data.Data.length)
                        if(data.Data.length===0)  {
                            console.log("Data SellPack Kosong")             
                            this.setState({ resultSupplier: [], isLoading: false})
                            this.connectionOut("Can't reach the server", false)
                        }
                        else{
                            console.log("data supplier list count : "+data.Data.length)
                            console.log("data supplier list tidak kosong")  
                            this.setState({ resultSupplier: data.Data, isLoading: false})
                        }
                    });
    }

    getPrincipalList  = () =>{
        const option = {
            method  : "POST",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }
            
            fetch("https://api.docnet.id/CHCMasterD/MasterPrincipal/TampilkanPrincipal",option)
            .then(response => response.json())
            .then(data =>{ 
                    console.log("panjang data : "+data.Data.length)
                    if(data.Data.length===0)  {
                        console.log("Data Principal List Kosong")             
                        this.setState({ resultPrincipal: [], isLoading: false})
                        this.connectionOut("Can't reach the server", false)
                    }
                    else{
                        console.log("data principal list count : "+data.Data.length)
                        console.log("data principal list tidak kosong")  
                        this.setState({ resultPrincipal: data.Data, isLoading: false})
                    }
                });
}


    //set Current Limit
    handleSelect(event) {
        this.setState({ [event.target.name]: event.target.value },() =>{
                this.state.currentPage = 1;
                this.getCountPage();
        });
    }

      //set Current Page
    handleWrite(event,flag) {
        console.log("karin : "+this.state.currentPage + flag)
        console.log("karin2 : "+Number(event.target.value))

        if((this.state.currentPage + flag) > 0){
            this.setState({
                currentPage: Number(event.target.value) + flag
            });
        }
        console.log("value event: "+ Number(event.target.value)+" "+(Number(event.target.value) + flag));
        
        if((this.state.currentPage + flag) > this.state.pageCount){
            this.setState({
                currentPage: this.state.pageCount
            });
            console.log("masuk sini1")
        }
        else{
            if(this.state.currentPage + flag != 0){
                this.getCountPage();
                console.log("masuk sini")
            }   
            console.log("value event: "+ (this.state.currentPage+flag)+" "+this.state.todosPerPage);
        }
      }

      
    handleFirst(event) {
        this.setState({
            currentPage: 1
        },() => this.getCountPage());
    }

    handleLast(event, page) {
        this.setState({
            currentPage: page
        },() => this.getCountPage());
    }

    toggleChange = () => {
        this.setState({
          isChecked: !this.state.isChecked,
        });
    }

    openModalEditWithItemID(code, name, userid, saletype, sellpack, sellunit, buyprice, timbangan, supplier, principal){
        this.setState({
            modal_edit              : true,
            activeIdEdit            : code,
            activeNameEdit          : name,
            activeSaleTypeEdit      : saletype,
            activeSellPackCodeEdit  : sellpack,
            activeSellUnitEdit      : sellunit,
            activeSupplierCodeEdit  : supplier,
            activePrincipalCodeEdit : principal,
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
        console.log("supplier : "+supplier)
        this.state.resultSupplier.map(supplier1 =>
            {
                if(supplier == supplier1.Sup_Code){
                    this.state.activeSupplierEdit = supplier1.Sup_Name
                }
            }
        )
        console.log("activesellpackeditnow : "+this.state.activeSellPackEdit)                             
        this.state.resultPrincipal.map(principal1 =>
            {
                if(principal == principal1.Pri_Code){
                    this.state.activePrincipalEdit = principal1.Pri_Name
                }
            }
        )
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


    updateSearchValue(evt){
        console.log(evt.target.value);
    
        this.setState({
            keyword: evt.target.value
        });
    }


    enterPressedSearch(event){
        console.log(this.state.currentPage)
        console.log(this.state.todosPerPage)
        var code = event.keyCode || event.which;
        if(code === 13){
            
            this.state.currentPage = 1;
            this.getCountPage();
        }
       
    }

    sendSearchParam = (keyword,currentPage,todosPerPage) => () =>{
        console.log("search : "+this.state.keyword);
        this.getCountPage();
        
    }

    updateSelectionValue(evt){
        this.setState({
            [evt.target.name]: evt.target.value,
            selectedDropdown : evt.target.value
        });

        if(evt.target.value==="Code")
        {
            this.setState({
                searchType:"Code",
                displayStatus: 'inline-flex'
            })   
        }

        else if(evt.target.value==="Name")
        {
            this.setState({
                searchType:"Name",
                displayStatus: 'inline-flex'
            }) 
        }

        else if(evt.target.value === "Show All"){
            document.getElementById('inputSearch').value = "";
        
            this.setState({
                currentPage: 1,
                keyword: "",
                displayStatus: 'none'
            },() => {
            this.componentDidMount();
            });
        }
    }

     updateInputValue (type, event) {
        if (type === "Nama") {
            this.setState({ 
              inputtedName: event.target.value 
            });
          } else if(type === "SellPack"){
            this.setState({
              inputtedSellPack      : event.target.value,
              inputtedSellPackCode  : event.target.id
            });
          } else if(type === "SellUnit"){
              this.setState({
                inputtedSellUnit: event.target.value
              });
          } else if(type === "Supplier"){
              this.setState({
                inputtedSupplier    : event.target.value,
                inputtedSupplierCode: event.target.id   
              });
          } else if(type === "Principal"){
              this.setState({
                inputtedPrincipal     : event.target.value,
                inputtedPrincipalCode : event.target.id
              });
          } else if(type === "BuyPrice"){
            this.setState({
              inputtedBuyPrice: event.target.value
            });
        } 
    };

    updateCheckedValue(e) {
        console.log(e.target.checked)
        this.setState({
            [e.target.name]: e.target.checked,
            isChecked: !this.state.isChecked,
        });

        if(e.target.checked==true){
            this.setState({
                checkedTimbangan : 'Y',
                activeTimbanganEdit : 'Y'
            },()=>console.log("status timbangan : " + this.state.activeTimbanganEdit));
            
        }
        else if(e.target.checked==false){
            this.setState({
                checkedTimbangan : 'N',
                activeTimbanganEdit : 'N'
            },()=>console.log("status timbangan : " + this.state.activeTimbanganEdit));
        }
    }

    handleChange = (type, event) => {
        if (type === "EditSellPack"){
            this.setState({
            activeSellPackEdit : event.target.value,
            activeSellPackCodeEdit : event.target.id
            });
        } else if (type === "EditSellUnit"){
            this.setState({
            activeSellUnitEdit : event.target.value
            }); 
        } else if (type === "EditSupplier"){
            this.setState({
            activeSupplierEdit : event.target.value,
            activeSupplierCodeEdit  : event.target.id
            });
        } else if (type === "EditPrincipal"){
            this.setState({
            activePrincipalEdit : event.target.value,
            activePrincipalCodeEdit : event.target.id
            });
        } else if (type === "EditBuyPrice"){
            this.setState({
            activeBuyPriceEdit : event.target.value
            });
        }
    }
    
    radioChange(e) {
        this.setState({
          selectedOption: e.currentTarget.value
        });
        
        if(e.currentTarget.value === "Gimmick"){
            console.log("target value = " + e.currentTarget.value)
            this.setState({
                displayStatusGim    : 'inline-flex',
                displayStatusDoctor : 'none',
                selectedSaleType : 52,
                activeSaleTypeEdit : 52
            },()=>console.log("salestype = " + this.state.selectedSaleType)); 
        }
        else if(e.currentTarget.value === "Doctor"){
            console.log("salestype = " + e.currentTarget.value)
            this.setState({
                displayStatusGim    : 'none',
                displayStatusDoctor : 'inline-flex',
                selectedSaleType : 129,
                activeSaleTypeEdit : 129
            },()=>console.log("salestype = " + this.state.selectedSaleType));    
        }
    }

    render() {
        const { result, resultSellPack, resultSupplier, resultPrincipal} = this.state;
        console.log(result)

        return (
            <Page
            title       = "Gimmick Supplier"
            breadcrumbs = {[{ name: 'Gimmick Supplier', active: true }]}
            className   = "GimmickSupplierPage">
                
                <Row>
                    <Col>
                    <Card  className = "mb-3">
                        <CardHeader className = "d-flex justify-content-between">
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
                                    <DropdownItem value = "Name" onClick = {evt => this.updateSelectionValue(evt)}>Name</DropdownItem>
                                    <DropdownItem value = "Code" onClick = {evt => this.updateSelectionValue(evt)}>Code</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                            
                            <Input
                                id          = "inputSearch"
                                type        = "search"
                                placeholder = "Search..."
                                onChange   = {evt => this.updateSearchValue(evt)}
                                onKeyPress = {evt => this.enterPressedSearch(evt)}
                                style={{
                                    display: this.state.displayStatus
                                }}
                            />
                            
                            <Button   
                                size = "sm" 
                                onClick = {this.sendSearchParam(this.state.keyword, this.state.currentPage, this.state.todosPerPage)}
                                style = {{
                                    marginRight: "1.5vw",
                                    display: this.state.displayStatus
                                }}>
                                <MdSearch size = "18"></MdSearch>
                            </Button>

                            <Button 
                                size = "sm" 
                                color = "primary" 
                                onClick = {this.toggle('nested_parent')}
                                // onChange = {this.getSellPackList()}
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
                                </MdAdd>ADD
                                        
                            </Button>
                            
                                <Modal
                                isOpen    = {this.state.modal_nested_parent}
                                toggle    = {this.toggle('nested_parent')}
                                className = {this.props.className}>
                                    
                                    <ModalHeader toggle = {this.toggle('nested_parent')}>
                                        Tambah Gimmick Supplier
                                    </ModalHeader>
                                    
                                    <ModalBody>
                                        <form>
                                            <div className = "radio">
                                                <Label>
                                                    <input
                                                        type="radio"
                                                        value="Gimmick"
                                                        checked={this.state.activeSaleTypeEdit===52, this.state.selectedOption === "Gimmick"}
                                                        onClick={e => this.radioChange(e, 52)}
                                                    />
                                                    Gimmick
                                                </Label> 

                                                <Label style =
                                                {{
                                                    marginLeft : "25px"
                                                }}>
                                                    <input
                                                        type="radio"
                                                        value="Doctor"
                                                        checked={this.state.activeSaleTypeEdit===129,this.state.selectedOption === "Doctor"}
                                                        onClick={e => this.radioChange(e, 129)}
                                                    />
                                                    Doctor Procod
                                                </Label>
                                             </div>
                                        </form>
                                   
                                        <Label>Nama</Label>
                                        <Input type = "Nama" value = {this.state.inputtedName} onChange = {(e) => this.updateInputValue("Nama",e)} name = "namagimmicksupplier" placeholder = "Nama" />
                                    
                                        <Label inline style={{display: this.state.displayStatusGim}}>Sell Pack</Label>
                                            <div>
                                             <td style={{width:"90%"}}><Input inline style={{ display: this.state.displayStatusGim}} type = "Sell Pack" value = {this.state.inputtedSellPack}  name = "sellpack" placeholder = "Pilih Salah Satu" /></td>
                                             <td style={{width:"10%"}}><UncontrolledButtonDropdown
                                                         inline style={{ display: this.state.displayStatusGim }}
                                                        >
                                                            <DropdownToggle caret name = "filtermenu" color = "primary">
                                                            . . .
                                                            </DropdownToggle>
                                                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                                            {resultSellPack.map(sellpack =>
                                                                <tr>
                                                                    <DropdownItem value = {sellpack.pack_name}  id = {sellpack.pack_code} onClick = {(e) => this.updateInputValue("SellPack",e)}>{sellpack.pack_name}</DropdownItem>           
                                                                </tr>
                                                            )}                                
                                                               
                                                           </DropdownMenu>
                                                </UncontrolledButtonDropdown></td>
                                            </div>
                                      
                                        <Label inline style={{display: this.state.displayStatusGim}}>Sell Unit</Label>
                                        <Input inline style={{ display: this.state.displayStatusGim }} 
                                            type = "Sell Unit" value = {this.state.inputtedSellUnit} onChange = {(e) => this.updateInputValue("SellUnit",e)} name = "sellunit" placeholder = "Sell Unit" />
                                    
                                        <Label inline style={{display: this.state.displayStatusDoctor}}>Buy Price</Label>
                                        <Input inline style={{ display: this.state.displayStatusDoctor}} 
                                            type = "Buy Price" value = {this.state.inputtedBuyPrice} onChange = {(e) => this.updateInputValue("BuyPrice",e)} name = "buyprice" placeholder = "Buy Price" />
                                    
                
                                        <Label inline style={{display: this.state.displayStatusGim}}>Supplier ID</Label>
                                            <div>
                                             <td style={{width:"90%"}}><Input inline style={{ display: this.state.displayStatusGim}} type = "Supplier" value = {this.state.inputtedSupplier}  name = "supplier" placeholder = "Pilih Salah Satu" /></td>
                                             <td style={{width:"10%"}}><UncontrolledButtonDropdown
                                                         inline style={{ display: this.state.displayStatusGim }}
                                                        >
                                                            <DropdownToggle caret name = "filtermenu" color = "primary">
                                                            . . .
                                                            </DropdownToggle>
                                                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                                            {resultSupplier.map(supplier =>
                                                                <tr>
                                                                    <DropdownItem value = {supplier.Sup_Name}  id = {supplier.Sup_Code} onClick = {(e) => this.updateInputValue("Supplier",e)}>{supplier.Sup_Name}</DropdownItem>           
                                                                </tr>
                                                            )}                                
                                                               
                                                           </DropdownMenu>
                                                </UncontrolledButtonDropdown></td>
                                            </div>


                                            <Label inline style={{display: this.state.displayStatusGim}}>Principal ID</Label>
                                            <div>
                                             <td style={{width:"90%"}}><Input inline style={{ display: this.state.displayStatusGim}} type = "Principal" value = {this.state.inputtedPrincipal}  name = "principal" placeholder = "Pilih Salah Satu" /></td>
                                             <td style={{width:"10%"}}><UncontrolledButtonDropdown
                                                         inline style={{ display: this.state.displayStatusGim }}
                                                        >
                                                            <DropdownToggle caret name = "filtermenu" color = "primary">
                                                            . . .
                                                            </DropdownToggle>
                                                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                                            {resultPrincipal.map(principal =>
                                                                <tr>
                                                                    <DropdownItem value = {principal.Pri_Name}  id = {principal.Pri_Code} onClick = {(e) => this.updateInputValue("Principal",e)}>{principal.Pri_Name}</DropdownItem>           
                                                                </tr>
                                                            )}                                
                                                               
                                                           </DropdownMenu>
                                                </UncontrolledButtonDropdown></td>
                                            </div>

                                        <div>   
                                             <Input type = "checkbox"  style={{marginLeft: "5px"}} value = {this.state.checkedTimbangan} onChange={e => this.updateCheckedValue(e)} name = "timbangan" placeholder = "Timbangan" />
                                             <Label style={{marginLeft: "20px"}} > Timbangan</Label>
                                        </div>
                                    </ModalBody>

                                    <ModalFooter>

                                        <Button color = "primary" onClick = {this.toggle('nested')}>
                                            Simpan
                                        </Button>

                                        <Modal
                                            isOpen = {this.state.modal_nested}
                                            toggle = {this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                            <ModalFooter>
                                                <Button color = "primary" onClick = {
                                                    this.insertMasterGimSupplier(this.state.inputtedName)}>
                                                    Ya
                                                </Button>{' '}
                                                <Button
                                                    color   = "secondary"
                                                    onClick = {this.toggle('nested')}>
                                                    Tidak
                                            </Button>
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color = "secondary" onClick = {this.toggle('nested_parent')}>
                                            Batal
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
                                        <Button color="success" onClick={ () => { this.setState({ modal_response: false, modal_nested: false}) } }>OK</Button>
                                    </ModalFooter>
                                 </Modal>


                               <Modal
                                isOpen    = {this.state.modal_edit}
                                className = {this.props.className}>
                                    <ModalHeader toggle = {this.toggle('edit')}>
                                        Edit Gimmick Supplier
                                    </ModalHeader>
                                    <ModalBody>
                                        <form>
                                            <div className = "radio">
                                                <Label>
                                                    <input
                                                        type="radio"
                                                        value="Gimmick"
                                                        checked={this.state.selectedOption ==="Gimmick"}
                                                        // onChange={e => this.radioChange(e, "52")}
                                                    />
                                                    Gimmick
                                                </Label>                                              
                                                <Label style =
                                                {{
                                                    marginLeft : "25px"
                                                }}>
                                                    <input
                                                        type="radio"
                                                        value="Doctor"
                                                        checked={this.state.selectedOption ==="Doctor"}
                                                        // onClick={e => this.radioChange(e, "129")}
                                                    />
                                                    Doctor Procod
                                                </Label>
                                             </div>
                                        </form>

                                        <Label>Nama</Label>
                                        <Input type = "text" 
                                            value = {this.state.activeNameEdit} 
                                            // onInput={(e) => this.handleChange("EditNama",e)}
                                            name = "gimmicksupplier" disabled 
                                        />

                                        <Label style={{
                                                display: this.state.displayStatusGim
                                            }}>Sell Pack</Label>
                                        
                                        <div>
                                             <td style={{width:"90%"}}><Input inline style={{ display: this.state.displayStatusGim}} type = "Sell Pack" value = {this.state.activeSellPackEdit}  name = "sellpack" placeholder = "Sell Pack" /></td>
                                             <td style={{width:"10%"}}><UncontrolledButtonDropdown
                                                         inline style={{ display: this.state.displayStatusGim }}
                                                        >
                                                            <DropdownToggle caret name = "filtermenu" color = "primary">
                                                            . . .
                                                            </DropdownToggle>
                                                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                                            {resultSellPack.map(sellpack =>
                                                                <tr>
                                                                    <DropdownItem value = {sellpack.pack_name}  id = {sellpack.pack_code} onClick = {(e) => this.handleChange("EditSellPack",e)}>{sellpack.pack_name}</DropdownItem>           
                                                                </tr>
                                                            )}                                
                                                               
                                                           </DropdownMenu>
                                                </UncontrolledButtonDropdown></td>
                                            </div>
                                      

                                        <Label style={{
                                                display: this.state.displayStatusGim
                                            }}>Sell Unit</Label>
                                        <Input type = "text" 
                                            inline style={{ display: this.state.displayStatusGim }} 
                                            value = {this.state.activeSellUnitEdit} 
                                            onInput={(e) => this.handleChange("EditSellUnit",e)}
                                            name = "gimmicksupplier" 
                                            placeholder = "Sell Unit"
                                        />

                                        <Label style={{
                                                display: this.state.displayStatusDoctor
                                            }}>Buy Price</Label>
                                        <Input type = "text" 
                                            inline style={{ display: this.state.displayStatusDoctor }} 
                                            value = {this.state.activeBuyPriceEdit} 
                                            onInput={(e) => this.handleChange("EditBuyPrice",e)}
                                            name = "gimmicksupplier"
                                            placeholder = "Buy Price" 
                                        />


                                        <Label style={{
                                                display: this.state.displayStatusGim
                                            }}> Supplier</Label>
                                        
                                        <div>
                                             <td style={{width:"90%"}}><Input inline style={{ display: this.state.displayStatusGim}} type = "Supplier" value = {this.state.activeSupplierEdit}  name = "supplier" placeholder = "Supplier" /></td>
                                             <td style={{width:"10%"}}><UncontrolledButtonDropdown
                                                         inline style={{ display: this.state.displayStatusGim }}
                                                        >
                                                            <DropdownToggle style={{width :"70px"}} caret name = "filtermenu" color = "primary">
                                                            {this.state.activeSupplierCodeEdit}
                                                            </DropdownToggle>
                                                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                                            {resultSupplier.map(supplier =>
                                                                <tr>
                                                                    <DropdownItem value = {supplier.Sup_Name}  id = {supplier.Sup_Code} onClick = {(e) => this.handleChange("EditSupplier",e)}>{supplier.Sup_Name}</DropdownItem>           
                                                                </tr>
                                                            )}                                
                                                               
                                                           </DropdownMenu>
                                                </UncontrolledButtonDropdown></td>
                                            </div>

                                            <Label style={{
                                                display: this.state.displayStatusGim
                                            }}> Principal</Label>
                                        
                                            <div>
                                             <td style={{width:"90%"}}><Input inline style={{ display: this.state.displayStatusGim}} type = "Principal" value = {this.state.activePrincipalEdit}  name = "principal" placeholder = "Principal" /></td>
                                             <td style={{width:"10%"}}><UncontrolledButtonDropdown
                                                         inline style={{ display: this.state.displayStatusGim }}
                                                        >
                                                            <DropdownToggle style={{width :"70px"}} caret name = "filtermenu" color = "primary">
                                                            {this.state.activePrincipalCodeEdit}
                                                            </DropdownToggle>
                                                            <DropdownMenu style={{height :"165px", overflowY :"scroll"}}>                      
                                                            {resultPrincipal.map(principal =>
                                                                <tr>
                                                                    <DropdownItem value = {principal.Pri_Name}  id = {principal.Pri_Code} onClick = {(e) => this.handleChange("EditPrincipal",e)}>{principal.Pri_Name}</DropdownItem>           
                                                                </tr>
                                                            )}                                
                                                               
                                                           </DropdownMenu>
                                                </UncontrolledButtonDropdown></td>
                                            </div>

                                        <div>   
                                             <Input type = "checkbox" checked = {this.state.isChecked} style={{marginLeft: "5px"}} 
                                             value = {this.state.activeTimbanganEdit} onChange={evt => this.updateCheckedValue(evt)} 
                                             name = "timbangan" placeholder = "Timbangan" disabled
                                            //  onChange={evt => this.updateCheckedValue(evt)} 
                                            />
                                             <Label style={{marginLeft: "20px"}} > Timbangan</Label>
                                        </div>
                                    </ModalBody>
                                    
                                    <ModalFooter>
                                        <Button color = "primary" onClick = {this.toggle('confirm_edit')}>
                                            Simpan
                                        </Button>

                                        <Modal
                                            isOpen = {this.state.modal_confirm_edit}
                                            // toggle = {this.toggle('confirm_edit')}
                                            >
                                            <ModalHeader>Konfirmasi Edit</ModalHeader>
                                            <ModalBody>Apakah Anda yakin ingin edit data ini?</ModalBody>
                                            <ModalFooter>
                                                <Button color = "primary" onClick = {
                                                    this.editMasterGimSupplier(this.state.inputtedName)}>
                                                    Ya
                                                </Button>{' '}
                                                <Button
                                                    color   = "secondary"
                                                    onClick = {this.toggle('confirm_edit')}>
                                                    Tidak
                                            </Button>
                                            </ModalFooter>
                                        </Modal>

                                        {' '}
                                        <Button color = "secondary" onClick = {this.toggle('edit')}>
                                            Batal
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                                
                            </CardHeader>
                            <CardBody>
                                <Table
                                style={{
                                    marginTop: "15px"
                                }} 
                                responsive>
                                    <thead>
                                        <tr width = "100%">
                                        <th>Kode</th>
                                        <th>Nama</th>
                                        <th>Sell Pack</th> 
                                        <th>Sell Unit</th>
                                        <th>Supplier</th>
                                        <th>Principal</th> 
                                        <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.map(gimsupplier =>
                                            <tr>
                                                <th scope = "row">{gimsupplier.Not_SaleCode}
                                                </th>
                                                <td>{gimsupplier.Not_SaleName} </td>
                                                
                                                {gimsupplier.Not_SellPack == null ?
                                                    <td>-</td> : 
                                                    <td>{gimsupplier.Not_SellPack}</td> }
                                                
                                                {gimsupplier.Not_SellUnit == null ?
                                                    <td>-</td> : 
                                                    <td>{gimsupplier.Not_SellUnit}</td> }

                                                {gimsupplier.Not_SaleSuppID == null ?
                                                    <td>-</td> : 
                                                    <td>{gimsupplier.Not_SaleSuppID}</td> }

                                                {gimsupplier.Not_SalePrinID == null ?
                                                    <td>-</td> : 
                                                    <td>{gimsupplier.Not_SalePrinID}</td> }
                                                
                                                    
                                                
                                                    {/* {resultSellPack.map(sellpack =>
                                                        {   
                                                            if(gimsupplier.Not_SellPack == sellpack.pack_code){
                                                                this.state.sellpackNameDisplay = sellpack.pack_name
                                                            }
                                                        }
                                                    )} */}
                                                
                                                {console.log(gimsupplier.Not_SaleActiveYN)}

                                                <td>
                                                    <Button size = "sm" 
                                                    onClick = {()=>this.openModalEditWithItemID(gimsupplier.Not_SaleCode, gimsupplier.Not_SaleName, gimsupplier.NotSaleUserID,
                                                        gimsupplier.Not_SaleType, gimsupplier.Not_SellPack, gimsupplier.Not_SellUnit, gimsupplier.Not_BuyPrice, gimsupplier.Not_SaleTimbangYN,
                                                        gimsupplier.Not_SaleSuppID, gimsupplier.Not_SalePrinID)
                                                    } 
                                                        color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                                        <MdEdit style = {{marginRight: "7px"}}></MdEdit>Edit</Button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </CardBody>

                            <InputGroup
                                style={{
                                    marginLeft:"1.5vw"
                                }}>
                                    <InputGroupAddon>Data per Page</InputGroupAddon>
                                    <select 
                                    name="todosPerPage"
                                    value={this.state.value}
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
                            style={{
                                textAlign:"center",
                                justifyContent:"center",
                                marginBottom: "20px"
                            }}>
                                <Button
                                value = {this.state.currentPage}
                                onClick={(e) => this.handleFirst(e)}>First</Button>
                                <Button 
                                value = {this.state.currentPage}
                                onClick={(e) => this.handleWrite(e,-1)}>Prev</Button>


                                <Button
                                disabled
                                style={{width:'auto'}}
                                color= "primary">
                                {this.state.currentPage+" / "+this.state.pageCount}
                                </Button>

                                <Button
                                value = {this.state.currentPage}
                                onClick={(e) => this.handleWrite(e,1)}>Next</Button>

                                <Button 
                                value = {this.state.currentPage} 
                                onClick={(e) => this.handleLast(e,this.state.pageCount)}>Last</Button>
                             </Form>
                        </Card>
                    </Col>
                </Row>
            </Page>
        );
    }


}
export default GimmickSupplierPage;
