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

class Supplier_History extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            result          : [],
            activeItemId    :this.props.activeItemId,
            activeItemName  :'',
            
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


    getListbyPaging(currPage,currLimit)
    {   
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
                
                fetch("https://api.docnet.id/CHCMasterD/MasterSupplier/TampilkanSupplierPage",option)
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

        // if(this.state.selectedOption == "Gimmick"){
        //     var payload = {
        //         Not_SaleCode      : this.state.activeIdEdit,
        //         Not_SaleName      : this.state.activeNameEdit,
        //         Not_SaleUserID    : this.state.activeuserID,
        //         Not_SaleType      : this.state.activeSaleTypeEdit,
        //         Not_SellPack      : parseInt(this.state.activeSellPackCodeEdit),
        //         Not_SellUnit      : parseInt(this.state.activeSellUnitEdit),       
        //         Not_BuyPrice      : null,
        //         Not_SaleTimbangYN : this.state.activeTimbanganEdit,
        //         Not_SaleSuppID    : this.state.activeSupplierEdit,
        //         Not_SalePrinID    : this.state.activePrincipalEdit  
        //     }
           
        //    if(isNaN(this.state.activeSellUnitEdit)){
        //         this.setState({
        //             responseHeader      : "Warning",
        //             responseMessage     : "Sell Unit harus angka",
        //             modal_response      : true,
        //             modal_confirm_edit  : false})
        //             successValidation = false;
        //     }
        // }
        // else if(this.state.selectedOption == "Doctor"){
        //     var payload = {
        //         Not_SaleCode      : this.state.activeIdEdit,
        //         Not_SaleName      : this.state.activeNameEdit,
        //         Not_SaleUserID    : this.state.activeuserID,
        //         Not_SaleType      : this.state.activeSaleTypeEdit,
        //         Not_SellPack      : null,
        //         Not_SellUnit      : null,       
        //         Not_BuyPrice      : parseFloat(this.state.activeBuyPriceEdit),
        //         Not_SaleTimbangYN : this.state.activeTimbanganEdit,
        //         Not_SaleSuppID    : null,
        //         Not_SalePrinID    : null
        //     }
    
        //     if(isNaN(this.state.activeBuyPriceEdit)){
        //         this.setState({
        //             responseHeader      : "Warning",
        //             responseMessage     : "Buy Price harus angka",
        //             modal_response      : true,
        //             modal_confirm_edit  : false})
        //             successValidation = false;
        //     }
        // }

        // if(successValidation==true){
        // console.log("edit masuk");
        // var url     = `https://api.docnet.id/MasterGimmickSupplier/UbahGimmickSupplier`;
       
        // fetch(url, {
        //     method : "POST",
        //     body   : JSON.stringify(payload),
        //     json   : true,
        //     headers: {
        //         "Content-type": "application/json; charset=UTF-8"
        //     }
        // })
        //     .then(response => response.json())
        //     .then(response => {
        //         console.log("RESPONSE STATUS : "+response.status)
        //         if (response.ResponseCode = "200") {
        //             console.log("jalan true : ")
        //             this.state.modal_confirm_edit = false; 
        //             this.state.modal_edit         = false;
        //             this.componentDidMount();
        //             this.state.responseHeader  = "Edit Data";
        //             this.state.responseMessage = "Data berhasil diedit"; 
        //             this.state.modal_response  = true;              
        //         }
        //         else if (response.ResponseCode = "410"){
        //             console.log("jalan false : ")
        //             this.state.modal_confirm_edit = false; 
        //             this.state.modal_edit         = false;
        //             this.componentDidMount();
        //             this.state.responseHeader  = "Edit Data";
        //             this.state.responseMessage = "Tidak ada perubahan data";
        //             this.state.modal_response  = true;
        //         }
        //     }, ()=>  this.connectionOut("Can't reach the server", false));
        // }
    }
    
    // getSellPackList = () =>{
    //     var payload = {
    //         limit   : "0",
    //         offset  : "0",
    //         };
    //         const option = {
    //             method  : "POST",
    //             json    : true,
    //             headers : {
    //                     "Content-Type": "application/json;charset=UTF-8"
    //                     },
    //             body: JSON.stringify(payload)
    //             }
                
    //             fetch("http://10.0.111.177:8081/MasterKemasan",option)
    //             .then(response => response.json())
    //             .then(data =>{ 
    //                     console.log("panjang data : "+data.result.length)
    //                     if(data.result.length===0)  {
    //                         console.log("Data SellPack Kosong")             
    //                         this.setState({ resultSellPack: [], isLoading: false})
    //                         this.connectionOut("Can't reach the server", false)
    //                     }
    //                     else{
    //                         console.log("data sellpack count : "+data.result.length)
    //                         console.log("data sellpack tidak kosong")  
    //                         this.setState({ resultSellPack: data.result, isLoading: false})
    //                     }
    //                 });
    // }


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

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

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
            title       = "History"
            breadcrumbs = {[{ name: 'Supplier / History', active: true }]}
            className   = "History">
                
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

                <Row className = "show-grid mt-3">
                    <Col xs = {8} md = {3}>
                        <Label>Menyusul</Label>
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
                                                
                        <Button size = "sm" 
                                                        // onClick = {()=>this.openModalEditWithItemID(gimsupplier.Not_SaleCode, gimsupplier.Not_SaleName, gimsupplier.NotSaleUserID,
                                                        //     gimsupplier.Not_SaleType, gimsupplier.Not_SellPack, gimsupplier.Not_SellUnit, gimsupplier.Not_BuyPrice, gimsupplier.Not_SaleTimbangYN,
                                                        //     gimsupplier.Not_SaleSuppID, gimsupplier.Not_SalePrinID)
                                                        // }
                                color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                <MdEdit style = {{marginRight: "7px"}}></MdEdit>Edit
                            </Button>
                                                              
                                            
                            <Button size = "sm" 
                                                        // onClick = {()=>this.openModalEditWithItemID(gimsupplier.Not_SaleCode, gimsupplier.Not_SaleName, gimsupplier.NotSaleUserID,
                                                        //     gimsupplier.Not_SaleType, gimsupplier.Not_SellPack, gimsupplier.Not_SellUnit, gimsupplier.Not_BuyPrice, gimsupplier.Not_SaleTimbangYN,
                                                        //     gimsupplier.Not_SaleSuppID, gimsupplier.Not_SalePrinID)
                                                        // }  
                                color = "primary" style = {{display: "inline-flex", alignItems: "center"}}>
                                <MdSave style = {{marginRight: "7px"}}></MdSave>Save
                            </Button>
                                            
                            <Button size = "sm" 
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
export default Supplier_History;
