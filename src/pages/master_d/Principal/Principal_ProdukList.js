import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, Nav, Form,
    Navbar,UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup,InputGroup, InputGroupAddon, FormGroup, CardFooter
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdAdd, MdDelete, MdSearch, MdEdit, MdPrint } from 'react-icons/md';

class Principal_ProdukList extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            result          : [],
            activeItemId    : this.props.activeItemId,
            activeItemName  : ''
            
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

    }

    componentDidMount() {
        this.setState.isLoading=true;
        this.getCountPage();
    }

    getCountPage(){
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
        var url     = `https://api.docnet.id/MasterGimmickSupplier/HitungDataGimmickSupplier`;

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
        this.getSellPackList()
        if (this.state.searchType==="Name"){
            var url     = `https://api.docnet.id/MasterGimmickSupplier/CariNamaGimmickSupplierPage`;
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
            var url     = `https://api.docnet.id/MasterGimmickSupplier/CariKodeGimmickSupplierPage`;
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
                
                fetch("https://api.docnet.id/MasterGimmickSupplier/TampilkanGimmickSupplierPage",option)
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
                Not_SaleSuppID    : this.state.inputtedSupplier,
                Not_SalePrinID    : this.state.inputtedPrincipal  
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
            var url     = `https://api.docnet.id/MasterGimmickSupplier/TambahGimmickSupplier`;
           
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
                    this.state.inputtedName="";
                    this.state.inputtedSellPack= "";
                    this.state.inputtedSellPackCode="";
                    this.state.inputtedSellUnit="";
                    this.state.inputtedBuyPrice="";
                    this.state.checkedTimbangan='N';
                    this.state.inputtedSupplier="";
                    this.state.inputtedPrincipal="";
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
                    this.state.inputtedName="";
                    this.state.inputtedName="";
                    this.state.inputtedSellPack="";
                    this.state.inputtedSellPackCode="";
                    this.state.inputtedSellUnit="";
                    this.state.inputtedBuyPrice="";
                    this.state.checkedTimbangan='N';
                    this.state.inputtedSupplier="";
                    this.state.inputtedPrincipal="";
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
                Not_SaleSuppID    : this.state.activeSupplierEdit,
                Not_SalePrinID    : this.state.activePrincipalEdit  
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
        var url     = `https://api.docnet.id/MasterGimmickSupplier/UbahGimmickSupplier`;
       
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
                        "Content-Type": "application/json;charset=UTF-8"
                        },
                body: JSON.stringify(payload)
                }
                
                fetch("http://10.0.111.177:8081/MasterKemasan",option)
                .then(response => response.json())
                .then(data =>{ 
                        console.log("panjang data : "+data.result.length)
                        if(data.result.length===0)  {
                            console.log("Data SellPack Kosong")             
                            this.setState({ resultSellPack: [], isLoading: false})
                            this.connectionOut("Can't reach the server", false)
                        }
                        else{
                            console.log("data sellpack count : "+data.result.length)
                            console.log("data sellpack tidak kosong")  
                            this.setState({ resultSellPack: data.result, isLoading: false})
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
            modal_edit          : true,
            activeIdEdit        : code,
            activeNameEdit      : name,
            activeSaleTypeEdit  : saletype,
            activeSellPackCodeEdit  : sellpack,
            activeSellUnitEdit  : sellunit,
            activeSupplierEdit  : supplier,
            activePrincipalEdit : principal,
            activeuserID        : userid,
            activeBuyPriceEdit  : buyprice,
            activeTimbanganEdit : timbangan,
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
                inputtedSupplier: event.target.value
              });
          } else if(type === "Principal"){
              this.setState({
                inputtedPrincipal: event.target.value
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
        if (type === "EditNama"){
            this.setState({
            activeNameEdit : event.target.value
            });
        } else if (type === "EditSaleType"){
            this.setState({
            activeSaleTypeEdit : event.target.value
            });
        } else if (type === "EditSellPack"){
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
            activeSupplierEdit : event.target.value
            });
        } else if (type === "EditPrincipal"){
            this.setState({
            activePrincipalEdit : event.target.value
            });
        } else if (type === "EditBuyPrice"){
            this.setState({
            activeBuyPriceEdit : event.target.value
            });
        } else if (type === "EditTimbangan"){
            this.setState({
            activeTimbanganEdit : event.target.value
            });
        }
    }

    render() {
        const { result, resultSellPack } = this.state;
        console.log(result)

        return (
            <Page
                title       = "Produk List"
                breadcrumbs = {[{ name: 'Produk List', active: true }]}
                className   = "ProdukList">
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

                    </CardBody> 

                    <CardFooter>
                        <div>
                            <Button size = "sm"         
                                color = "primary" style = {{display: "inline-flex", alignItems: "left"}}>
                                <MdPrint style = {{marginRight: "7px"}}></MdPrint> Print
                             </Button> 
                         </div>
                    </CardFooter>

            </Page>
        );
    }


}
export default Principal_ProdukList;
