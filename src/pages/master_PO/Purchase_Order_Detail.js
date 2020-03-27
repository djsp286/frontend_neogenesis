import Page from 'components/Page';
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

class Purchase_Order_Detail extends React.Component{

    constructor(props) {
        super(props);
        this.state  = {
            resultPODetail                      :   [],
            resultPODetail2                     :   [],
            resultPOHeader                      :   [],
            resultRO                            :   [],
            activeTypePOCode                    : this.props.typePOCode,
            flagActivedProductForInsertDetail   : false
        };
    }

    componentDidMount(){
        this.getLastPO()
        this.getRO()
    }

    getLastPO()
    {   
        
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Authorization" : window.localStorage.getItem('tokenLogin')
                    },
            }

            fetch("http://localhost:8888/po?type=lastinput",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.data[0] === null)  {
                        console.log("Data PO Detail Kosong")             
                        this.setState({ resultPODetail: [], resultPOHeader : [] })
                    }
                    else{
                        
                        if(data.data[0].T_PurchaseOrder.T_PODetail === null){
                            console.log("resultpodetail kosong")
                            this.setState({
                                resultPOHeader : data.data[0].T_PurchaseOrder.T_POHeader,
                                activeTypePOCode: data.data[0].T_PurchaseOrder.T_POHeader.POH_TipePO,
                                resultPODetail : []

                            })
                        }
                        else{
                            console.log("resultpodetail tidak kosong")
                            this.setState({ 
                                resultPOHeader : data.data[0].T_PurchaseOrder.T_POHeader,
                                activeTypePOCode: data.data[0].T_PurchaseOrder.T_POHeader.POH_TipePO,
                                resultPODetail : data.data[0].T_PurchaseOrder.T_PODetail
                            })
                        }
                        
                        console.log(this.state.resultPODetail)   
                        console.log("activeTypePOCode :" +this.state.activeTypePOCode)
                    }
                        
                });
            
    }

    getROTest()
    {   
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }

            fetch("http://localhost:8888/po?type=lastinput",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.data[0] === null)  {
                        console.log("Data Detail Kosong")             
                        this.setState({ resultPODetail2: [] })
                    }
                    else{
                        console.log("Data Detail Tidak Kosong") 
                        this.setState({ 
                            resultPODetail2 : data.data[0].T_PurchaseOrder.T_PODetail
                        })
                    }
                        
                });
            
    }

    getRO(){
        console.log("getRO")
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }

            fetch("http://localhost:8887/ro?kodeProduk="+"0304011",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.data[0] === null)  {
                        console.log("Data RO Kosong")             
                        this.setState({ resultRO: [] })
                    }
                    else{
                        console.log("Data RO Tidak Kosong") 
                        this.setState({ 
                            resultRO : data.data[0]
                        })
                        console.log(this.state.resultRO)   
                    }
                        
                });
    }

    addDetail(){
        var url     = "http://localhost:8888/po?type=buatPO";
        var payload =  [{
            T_POHeader : this.state.resultPOHeader
            ,
            T_PODetail : [{
                POD_Group : 1,
                POD_NoPO : null,
                POD_Procod : this.state.activeDetailProcod,
                POD_Qty : parseInt(this.state.activeDetailQuantity),
                POD_ProdStatus : "N",
                POD_GrossBeli : parseInt(this.state.activeDetailHarga) ,
                POD_SellUnit: 10,
                POD_Disc: parseInt(this.state.activeDetailDisc),
                POD_Disc2: parseInt(this.state.activeDetailDisc2),
                POD_NettoBeli: 9000,
                POD_POStatus: null,
                POD_TglRecorder: "2019-12-13T08:31:00Z",
                POD_BonusYN: "N",
                POD_ConfirmID: "0000001",
                POD_ConfirmDate: "2019-12-13T08:32:00Z",
                POD_AccID: "0000001",
                POD_UpdateID: "0000001",
                POD_UpdateTime: "2019-12-13T08:32:00Z",
                POD_OrderBy: null,
                LastInput: false
            }]
        }]

        console.log(payload)
        console.log("fungsi add detail")
        
        if(this.state.flagActivedProductForInsertDetail === true){
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
                        if(data.data === null)  {
                            console.log("gagal add detail")      
                        }
                        else{
                            console.log("berhasil add detail")
                            this.setState({
                                modal_response   : true,
                                responseHeader   : "Add Detail",
                                responseMessage  : "Data detail berhasil ditambah",
                              
                                modal_add_detail : false,
                            })
    
                            this.getLastPO()
    
                        }
                    });
        }

        else{
            this.setState({
                modal_response   : true,
                responseHeader   : "Add Detail",
                responseMessage  : "Data Product Tidak Ada",
            })
        }
      
      
        
    }

    searchProductMDProduct(code){
        
        console.log("searchProductMDProduct")
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }

            fetch("https://api.docnet.id/CHCMasterProdukSupplier/ProductDetailMargin?kodeProduk="+code,option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.error.status === true)  {
                        console.log("Product Tidak Ada")   
                        this.setState({
                            activeDetailHarga       : "",
                            activeDetailName        : "",
                            activeDetailDisc        : "",
                            activeDetailQuantity    : "",
                            activeDetailDisc2       : "",
                            modal_response          : true,
                            responseHeader          : "Add Detail",
                            responseMessage         : "Procod Tidak Ditemukan",
                            flagActivedProductForInsertDetail : false
                        })      
                    }
                    else{
                        console.log("Product Ada") 
                        this.setState({
                            activeDetailName   : data.data.pro_name,
                            activeDetailHarga  : data.data.detail_supplier_aktif.pro_grossprice,
                            activeDetailDisc   : data.data.detail_supplier_aktif.pro_discount,
                            flagActivedProductForInsertDetail : true
                        })
                        console.log("activeDetailHarga : "+data.data.pro_name)
                    }
                        
                });
    }

    searchProductMDBuyLocal(code){
        console.log("searchProductMDBuyLocal")
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }

            fetch("http://10.0.111.22:8086/CHCMasterE//md_buy_lokal/"+code,option)
            .then(response => response.json())
            .then(data =>{ 
               
                    if(data==null)  {
                        console.log("Product Tidak Ada")   
                        this.setState({
                            activeDetailHarga       : "",
                            activeDetailName        : "",
                            activeDetailDisc        : "",
                            activeDetailQuantity    : "",
                            modal_response          : true,
                            responseHeader          : "Add Detail",
                            responseMessage         : "Procod Tidak Ditemukan",
                        })      
                    }
                    else{
                        console.log("Product Ada") 
                        this.setState({
                            modal_response   : true,
                            responseHeader   : "Add Detail",
                            responseMessage  : "Procod Ditemukan",
                        })
                    }
                    console.log("productcode : "+ data.buylcld_Procod)
                    console.log("searchProductMDBuyLocal : ")
                    console.log(data)
                });
    }

    enterPressedSearch(event){
        var code = event.keyCode || event.which;
        if(code === 13){
            
            if(this.state.activeTypePOCode === 1005){
                this.searchProductMDBuyLocal(event.target.value)
            }
            else{
                this.searchProductMDProduct(event.target.value);
            }
           
        }
       
    }

    openModal(){
        this.setState({
            modal_add_detail                    : true,
            activeDetailHarga                   : "",
            activeDetailName                    : "",
            activeDetailDisc                    : "",
            activeDetailQuantity                : "",
            activeDetailDisc2                   : "",
            activeDetailProcod                  : "",
            flagActivedProductForInsertDetail   : false
        })
    }

    inputValue=(type,event)=>{
        if (type === "InputProcod"){
            this.setState({
                activeDetailProcod : event.target.value
            });
        } else if (type === "InputHarga"){
            this.setState({
                activeDetailHarga : event.target.value
            });
        }else if (type === "InputQuantity"){
            this.setState({
                activeDetailQuantity : event.target.value
            });
        }else if (type === "InputDisc2"){
            this.setState({
                activeDetailDisc2 : event.target.value
            });
        }
    }
  

    render(){
        return(
            <Page
            title       = "Detail"
            className   = "Detail">
                
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
                    isOpen={this.state.modal_add_detail}
                    size="lg"
                    style={{
                        height: "200pw", width: "300pw",
                        }}
                >
                    <ModalHeader>
                        Add Detail
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs={2}>
                                <Label>PROCOD</Label>
                            </Col>
                            <Col xs={2}>
                                <Input value={this.state.activeDetailProcod} onChange={(e) => this.inputValue("InputProcod",e)}  onKeyPress = {e => this.enterPressedSearch(e)} type="text"></Input>
                            </Col>
                            <Col xs={8}>
                                <Input value={this.state.activeDetailName} type="text"></Input>
                            </Col>
                        </Row>
                        <Row className={"mt-3"}>
                            <Col xs={2}>
                                <Label>HARGA</Label>
                            </Col>
                            <Col xs={3}>
                                <Input value={this.state.activeDetailHarga}  type="text"></Input>
                            </Col>
                            <Col xs={0.1}>
                                <Label>DISC</Label>
                            </Col>
                            <Col xs={2}>
                                <Input value={this.state.activeDetailDisc} type="text"></Input>
                            </Col>
                        </Row>
                        <Row className={"mt-3"}>
                            <Col xs={2}>
                                <Label>QUANTITY</Label>
                            </Col>
                            <Col xs={3}>
                                <Input value={this.state.activeDetailQuantity} onChange={(e) => this.inputValue("InputQuantity",e)} type="text"></Input>
                            </Col>
                        </Row>
                        <Row className={"mt-3"}>
                            <Col xs={2}>
                                <Label>DISC 2</Label>
                            </Col>
                            <Col xs={2}>
                                <Input value={this.state.activeDetailDisc2} onChange={(e) => this.inputValue("InputDisc2",e)} type="text"></Input>
                            </Col>

                            <Col className = {"ml-5"} xs={0.1}>
                                <Label>No.Agree Off Faktur :</Label>
                            </Col>

                            <Col xs={2}>
                                <Input type="text"></Input>
                            </Col>
                           
                        </Row>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick ={()=>this.addDetail()} >Insert</Button>
                        <Button color="success" onClick ={()=>this.setState({modal_add_detail : false})} >Close</Button>
                        <Button color="success" >Reset</Button>
                    </ModalFooter>
                </Modal>

                <Table hover
                    style={{
                        marginTop: "15px"
                    }} 
                    responsive>
                        <thead>
                            <tr width = "100%">
                            <th>NO PO</th>
                            <th>TGL DO</th>
                            <th>TIPE PO</th>
                            <th>PROCODE</th> 
                            <th>DESCRIPTION</th> 
                            <th>QTY</th> 
                            <th>STS</th> 
                            <th>FLAG</th> 
                            <th>TGL REORDER</th> 
                            <th>RECV</th>
                            <th>BONUS</th> 
                            <th>DESC BONUS</th> 
                            <th>QTY</th>
                            <th>TGL ORDER</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.resultPODetail.map(detail =>
                                <tr onClick = {()=> this.getROTest()}>                                        
                                    <td>{detail.POD_Procod}</td>
                                    <td>{detail.POD_Name}</td>
                                    <td>ket</td>
                                    <td>{detail.POD_Qty}</td>
                                    <td>{detail.POD_BuyPack}</td>
                                    <td>{detail.POD_SellUnit}</td>
                                    <td>{detail.POD_SellPack}</td>
                                    <td>status</td>
                                    <td>lvl</td>
                                    <td>{detail.POD_GrossBeli}</td>
                                    <td>{detail.POD_Disc}</td>
                                    <td>{detail.POD_Disc2}</td>
                                    <td>{(detail.POD_GrossBeli - (detail.POD_Disc*detail.POD_GrossBeli/100) - (detail.POD_Disc2*detail.POD_GrossBeli/100)) * detail.POD_Qty}</td>
                                </tr>
                            )}
                        </tbody>
                </Table>

                <Row >
                    <ButtonGroup  size="sm" className = {"ml-3"}>
                        <Button onClick={()=>this.openModal()} variant="secondary">Add Detail</Button>
                        <Button variant="secondary">Remove Detail</Button>
                        <Button variant="secondary">Delete Detail</Button>
                        <Button variant="secondary">Set Disc2</Button>
                        <Button variant="secondary">Add Bonus</Button>
                    </ButtonGroup>
                </Row>

                <Table
                    style={{
                        marginTop: "15px"
                    }} 
                    responsive>
                        {/* <thead>
                            <tr width = "100%">
                            <th>CODE</th>
                            <th>NAMA OUTLET</th>
                            <th>NO.REQ</th>
                            <th>QTY</th> 
                            <th>TGL ORDER</th> 
                            <th>REORDER</th> 
                            <th>LVL</th> 
                            <th>Keterangan</th> 
                            </tr>

                        </thead>
                        <tbody>
                            
                        </tbody> */}

                        <thead>
                            <tr width = "100%">
                            <th>PROCODE</th>
                            <th>NAMA PRODUK</th>
                            <th>KET</th>
                            <th>QTY</th> 
                            <th>BUYPACK</th> 
                            <th>UNIT</th> 
                            <th>SELLPACK</th> 
                            <th>STS</th> 
                            <th>LVL</th> 
                            <th>HARGA GROSS</th>
                            <th>DISC</th> 
                            <th>DISC2</th> 
                            <th>TOTAL NETTO BELI</th>

                            </tr>
                        </thead>
                        <tbody>
                            {this.state.resultPODetail2.map(detail =>
                                <tr>                                        
                                    <td>{detail.POD_Procod}</td>
                                    <td>nama produk</td>
                                    <td>ket</td>
                                    <td>{detail.POD_Qty}</td>
                                    <td>buypack</td>
                                    <td>{detail.POD_SellUnit}</td>
                                    <td>sellpack</td>
                                    <td>status</td>
                                    <td>lvl</td>
                                    <td>{detail.POD_GrossBeli}</td>
                                    <td>{detail.POD_Disc}</td>
                                    <td>{detail.POD_Disc2}</td>
                                    <td>{(detail.POD_GrossBeli - detail.POD_Disc - detail.POD_Disc2) * detail.POD_Qty}</td>
                                </tr>
                            )}
                        </tbody>
                </Table>
                <Row >
                    <ButtonGroup  size="sm" className = {"ml-3"}>
                        <Button variant="secondary">Delete Outlet</Button>
                        <Button variant="secondary">Remove Outlet</Button>
                    </ButtonGroup>
                </Row>
                
               

            </Page>  
        );
    }
}
export default Purchase_Order_Detail