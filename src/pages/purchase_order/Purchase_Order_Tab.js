import Page from 'components/Page';
import {
    Col, Row, Label, Input, Button, ButtonGroup, Card, ModalBody, ModalFooter, ModalHeader,
    Modal
} from 'reactstrap';
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import dateFormat from 'dateformat';
import Purchase_Order_Agreement from './Purchase_Order_Agreement';
import Purchase_Order_Detail from './Purchase_Order_Detail';
import Purchase_Order_History from './Purchase_Order_History';
import { MdDateRange } from 'react-icons/md';

const header = {
    supcode     : "asd",
    tipepo      : "asd",
    top         : "asd",
    gudangCode  : "asd",
}


class Purchase_Order_Tab extends React.Component {
    
    constructor(props) {
        super(props);
        this.state  = {
            modal_response     : false,
            responseHeader     : "",
            responseMessage    : "",
            resultPODetail     : [],
            resultPOHeader     : [],
            resultGudang       : [],

            resultPOHeaderFind  : [],
            resultPODetailFind  : [],
            resultMTipePOFind   : [],
            resultPOFind        : [],

            flagInputDisabled   : true,
            
            flagAdding          : false,

            flagSuplierFound    : false,
            flagGudangFound     : false,
            flagButtonEditDetail: false,

            flagPrintPO         : false,
            
            flagBerhasilSave    : 0,

            activeSubTotal      : "",
            activePpnTotalNetto : "",
            activeTotal         : "",

        };
    }

    

    componentDidMount(){
        if(this.state.flagBerhasilSave === 0){
            this.setState({
                modal_chooseGroup : true
            })
        }
        else{
            this.getLastPO()
            this.getDaftarGudang()
        }   
        
    }

    refreshPage=()=>{
        console.log("berhasil refresh page tab")
        this.componentDidMount()
        this.setState({
            flagInputDisabled : true,
            flagAdding : false,
            flagButtonEditDetail: false,
            flagSuplierFound : false,
            flagGudangFound : false
        })
       
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

            fetch("http://localhost:2222/po?type=lastinput&group="+this.state.activeGroup,option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.data[0] === null)  {
                        console.log("Data PO Detail Kosong")             
                        this.setState({ resultPODetail: [], resultPOHeader : []})
                    }
                    else{

                        console.log("Data PO Detail Tidak Kosong") 
                        this.setState({ 
                            resultPOFind : data.data[0].T_PurchaseOrder,
                            resultPOHeader  : data.data[0].T_PurchaseOrder.T_POHeader,
                            activeNomorPO   : data.data[0].T_PurchaseOrder.T_POHeader.POH_NoPO,
                            activeSuplierTop: data.data[0].T_PurchaseOrder.T_POHeader.POH_TOP,
                            activeTglPo     : data.data[0].T_PurchaseOrder.T_POHeader.POH_TglPO,
                            activeTypePOCode: data.data[0].T_PurchaseOrder.T_POHeader.POH_TipePO,
                            activeSuplierCode : data.data[0].T_PurchaseOrder.T_POHeader.POH_Nosup,
                            activeJmlPrint : data.data[0].T_PurchaseOrder.T_POHeader.POH_JmlPrint,
                            activeSendToWareHouse : data.data[0].T_PurchaseOrder.T_POHeader.POH_SendToWareHouse,
                            activeTypePOName  : data.data[0].M_TipePO.TipePO_Nama,

                            flagGetDataPOFinished : !this.state.flagGetDataPOFinished
                        })

                        if(data.data[0].T_PurchaseOrder.T_PODetail === null){
                            console.log("resultpodetail kosong")
                            this.setState({
                                resultPODetail : []
                            })
                        }
                        else{
                            this.setState({
                                resultPODetail : data.data[0].T_PurchaseOrder.T_PODetail
                            })

                            this.sumTotalNetto()
                        }


                        if(this.state.activeJmlPrint == 0){
                            this.setState({
                                flagButtonDisabled : false
                            })
                        }
                        else{
                            this.setState({
                                flagButtonDisabled : true
                            })
                        }

                        console.log(this.state.resultPODetail) 
                        this.getSupplierName()  
                        this.getSupplierMinValue()
                        this.getGudangName()
                    }
                        
                });
            
    }

    getSupplierName(){
        var payload = {
            Sup_Code : this.state.activeSuplierCode
        }
        const option = {
            method  : "POST",
            json    : true,
            headers : 
                    {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            body: JSON.stringify(payload)
            }

            fetch("https://api.docnet.id/CHCMasterD/MasterSupplier/CariKodeSupplier",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.Data === null)  {
                        console.log("Data Supplier Kosong")
                        this.setState({
                        })
                    }
                    else{
                        console.log("Data Supplier Tidak Kosong") 
                        this.setState({ 
                            activeSuplierName :  data.Data[0].Sup_Name,
                        })
                        console.log(this.state.activeSuplierName)   
                    }
                });
                
    }

    getSupplierNameForSearch(){
        var payload = {
            Sup_Code : this.state.activeSuplierCode
        }
        const option = {
            method  : "POST",
            json    : true,
            headers : 
                    {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            body: JSON.stringify(payload)
            }

            fetch("https://api.docnet.id/CHCMasterD/MasterSupplier/CariKodeSupplier",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.Data === null)  {
                        console.log("Data Supplier Kosong")
                        this.setState({
                            flagSuplierFound : false,
                            modal_response : true,
                            responseHeader : "Suplier",
                            responseMessage: "Suplier Code Tidak Ditemukan",
                            activeSuplierCode : "",
                            activeSuplierName : "",
                            activeSuplierTop  : "",
                            activeSuplierMinValue : "",
                        })
                    }
                    else{
                        console.log("Data Supplier Tidak Kosong") 
                        this.setState({ 
                            activeSuplierName :  data.Data[0].Sup_Name,
                            flagSuplierFound : true
                        },()=>this.setflagButtonEditDetail())
                        console.log(this.state.activeSuplierName)   
                    }
                });

                // if(this.state.flagSuplierFound === false){
                //     this.setState({
                       
                //     })
                // }
    
                
    }

    getSupplierMinValue(){
        var payload = {
            PurSup_SupCode : this.state.activeSuplierCode,
            PurSup_GrpCode : 2
        }
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
                        console.log("Data Supplier Min Value Kosong")
                        this.setState({
                            activeSuplierMinValue : ""
                        })
                    }
                    else{
                        console.log("Data Supplier Min Value Tidak Kosong") 
                        this.setState({ 
                            activeSuplierMinValue :  data.Data[0].PurSup_MinPOVal,
                        })
                        console.log(this.state.activeSuplierMinValue)   
                    }
                        
                });
    }

    getSupplierTop(){
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8" 
                    },
            }

            fetch("https://api.docnet.id/CHCMasterD/MasterSupplier/CobaTranslate?supcode="+this.state.activeSuplierCode+"&supgroup="+this.state.activeGroup,option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.Data === null)  {
                        console.log("Data Supplier Top Kosong")
                        this.setState({ 
                            activeSuplierTop : ""
                        })
                    }
                    else{
                        console.log("Data Supplier Top Tidak Kosong") 
                        this.setState({ 
                            activeSuplierTop :  data.Data.FinSup_TOP,
                        })
                        console.log(this.state.activeSuplierTop)   
                    }
                        
                });
    }

    getSuplierNameTopMinValue(){
        console.log("getSuplierNameTopMinValue")
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8" 
                    },
            }

            fetch("http://10.0.111.34:8087/CHCMasterD/MasterSupplier/CobaTranslate?supcode="+this.state.activeSuplierCode+"&supgroup="+this.state.activeGroup,option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.Data === null)  {
                        console.log("Data Supplier Top Kosong")
                        this.setState({ 
                            flagSuplierFound : false,
                            modal_response : true,
                            responseHeader : "Suplier",
                            responseMessage: "Suplier Code Tidak Ditemukan",
                            activeSuplierCode : "",
                            activeSuplierName : "",
                            activeSuplierTop  : "",
                            activeSuplierMinValue : "",
                        })
                    }
                    else{
                        console.log("Data Supplier Top Tidak Kosong") 
                        this.setState({ 
                            activeSuplierTop :  data.Data.FinSup_TOP,
                            activeSuplierMinValue : data.Data.PurSup_MinPOVal,
                            activeSuplierName   : data.Data.Sup_Name,
                            flagSuplierFound : true
                        })
                    }
                        
                });
    }

    getGudangName(){
        console.log("linkGudang : "+"http://10.0.112.34:8083/MasterOutlet/TampilOutletGudangPO/"+this.state.activeSendToWareHouse)
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }

            fetch("http://10.0.112.34:8083/MasterOutlet/TampilOutletGudangPO/"+this.state.activeSendToWareHouse,option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.data.length === 0 )  {
                        console.log("Data Gudang Nama Kosong")
                        
                    }
                    else{
                        console.log("Data Gudang Nama Tidak Kosong") 
                        this.setState({ 
                            activeGudangCode :  data.data[0].out_code,
                            activeGudangName :  data.data[0].out_name 
                        })
                        
                        console.log(this.state.activeGudangName)   
                    }
                        
                });
    }

    getDaftarGudang(){
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }

            fetch("http://10.0.112.34:8083/MasterOutlet/TampilOutletGudangPO",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.data === null)  {
                        console.log("Data Gudang Kosong")
                    }
                    else{
                        console.log("Data Gudang Tidak Kosong") 
                        this.setState({ 
                            resultGudang: [{ out_code: '', out_name: 'PILIH SALAH SATU'}].concat(
                                data.data)
                        })
                       
                        console.log(this.state.resultGudang)   
                    }
                        
                });
    }

    enterPressedSearch(event){
        var code = event.keyCode || event.which;
        if(code === 13){
            this.getSupplierNameForSearch()
            this.getSupplierMinValue()
            this.getSupplierTop()
            
            // this.getSuplierNameTopMinValue()
        }
    }

    getTypePOName(typePOCode){
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            }

            fetch("http://localhost:2222/po?type=tipeNama&tipe="+typePOCode,option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.data === null)  {
                        console.log("Data TypeNama Kosong")
                    }
                    else{
                        console.log("Data TypeNama Tidak Kosong") 
                        this.setState({ 
                            activeTypePOName : data.data
                        })
                       
                        console.log("typenama : "+data.data)   
                    }
                        
                });
    }
    

    responseAddPO(resp){
        if(resp == "iya"){
            this.setState({
                activeTypePOCode : "5",
                resultPODetail   : [],
            },()=>this.getTypePOName(this.state.activeTypePOCode))
        }
        else{
            this.setState({
                activeTypePOCode : "1",
                resultPODetail   : [],
            },()=>this.getTypePOName(this.state.activeTypePOCode))
        }
        this.setState({
            modal_addPO         : false,
            activeNomorPO       : "",
            activeTop           : "",
            activeTglPo         : "",
            activeSuplierCode   : "",
            activeJmlPrint      : "",
            activeTypePOName    : "",
            activeSuplierName   : "",
            activeSubTotal      : "",
            activePpnTotalNetto : "",
            activeTotal         : "",
            activeSuplierTop    : "",
            activeSuplierMinValue : "",
            activeGudangCode      : "",
            flagInputDisabled     : false,
            flagAddButtonPressed  : !this.state.flagAddButtonPressed,
            flagAdding            : true,
        })
        console.log("typePOCode : "+this.state.typePOCode) 
        console.log("responseAddPO")
    }


    sumTotalNetto(){
        console.log("array total : ")
        //
        var objQtyRecv = this.state.resultPODetail.map(function (detail) {
            return Math.round((detail.POD_GrossBeli - (detail.POD_Disc*detail.POD_GrossBeli/100) - (detail.POD_Disc2*detail.POD_GrossBeli/100)) * detail.POD_Qty);
        });
        // Result: [154, 110, 156]
        
        console.log(objQtyRecv)
        var subTotal = objQtyRecv.reduce(function (acc, score) {
            return acc + score;
        }, 0);

        var ppnSubTotal = subTotal*10/100

        var total = subTotal + ppnSubTotal

        this.setState({
            activeSubTotal      : Math.round(subTotal),
            activePpnTotalNetto : Math.round(ppnSubTotal),
            activeTotal         : Math.round(total)
        })
        
        console.log("subTotal : "+this.state.activeSubTotal)
        console.log("ppnsubtotal : "+this.state.activePpnTotalNetto)
        console.log("total : "+this.state.activeTotal)
    }


    sumTotalNettoFromDetailPage=(props)=>{
        // console.log("sumtotalnettofromdetailpage")
        // console.log(props)
        
        var objQtyRecv = props.map(function (detail) {
            return Math.round((detail.POD_GrossBeli - (detail.POD_Disc*detail.POD_GrossBeli/100) - (detail.POD_Disc2*detail.POD_GrossBeli/100)) * detail.POD_Qty);
        });
        // Result: [154, 110, 156]
        
        console.log(objQtyRecv)
        var subTotal = objQtyRecv.reduce(function (acc, score) {
            return acc + score;
        }, 0);

        var ppnSubTotal = subTotal*10/100

        var total = subTotal + ppnSubTotal

        this.setState({
            activeSubTotal      : Math.round(subTotal),
            activePpnTotalNetto : Math.round(ppnSubTotal),
            activeTotal         : Math.round(total)
        })

        console.log("subTotal : "+this.state.activeSubTotal)
        console.log("ppnsubtotal : "+this.state.activePpnTotalNetto)
        console.log("total : "+this.state.activeTotal)
    }

    setflagButtonEditDetail(){
        console.log("setflagButtonEditDetail")
        if(this.state.flagSuplierFound === true && this.state.flagGudangFound === true){
            this.setState({
                flagButtonEditDetail : true
            },()=>console.log("flagButtonEditDetail : "+this.state.flagButtonEditDetail))
        }
        else{
            this.setState({
                flagButtonEditDetail : false
            },()=>console.log("flagButtonEditDetail : "+this.state.flagButtonEditDetail))
        }   
    }

    setFlagGudangFound(){
        console.log(this.state.activeGudangCode)
        if(this.state.activeGudangCode !== "" && this.state.activeGudangCode !== null && this.state.activeGudangCode !== undefined){
            this.setState({
                flagGudangFound : true
            },()=>this.setflagButtonEditDetail())
        }
    }

    handleEditChange = (type, event) => {
        if(type === "EditGudang"){
            this.setState({
                activeGudangCode    : event.target.value
            },()=>this.setFlagGudangFound())
        }

        if(type === "EditSupCode"){
            this.setState({
                activeSuplierCode : event.target.value
            })
        }

        if(type === "EditInputSearch"){
            this.setState({
                inputSearchModal : event.target.value
            })
        }


    }

    savePO(){
        this.setState({
            flagSaveButtonPress : !this.state.flagSaveButtonPress,
            
            flagBerhasilSave : 1
            
        })

        header["supcode"] = this.state.activeSuplierCode
        header["tipepo"]  = this.state.activeTypePOCode
        header["top"] = this.state.activeSuplierTop
        header["gudangCode"] = this.state.activeGudangCode

        console.log(header)

    }

    findPO(){
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Authorization" : window.localStorage.getItem('tokenLogin')
                    },
            }
            fetch("http://localhost:2222/po?type=noPO&group="+this.state.activeGroup+"&noPO="+this.state.inputSearchModal,option)
            .then(response => response.json())
            .then(data =>{ 
                    console.log("http://localhost:2222/po?type=noPO&group="+this.state.activeGroup+"&noPO="+this.state.inputSearchModal)
               
                    if(data.data[0].T_PurchaseOrder.T_POHeader.POH_NoPO === this.state.inputSearchModal)  {
                        console.log("Data Find Ada")
                        this.setState({
                            validasiFindDitemukan : false,
                            validasiFindTidakDitemukan : true,
                            resultPOHeaderFind : data.data[0].T_PurchaseOrder.T_POHeader,
                            resultPODetailFind : data.data[0].T_PurchaseOrder.T_PODetail,
                            resultMTipePOFind : data.data[0].M_TipePO,
                            resultPOFind    : data.data[0].T_PurchaseOrder
                        })
                        console.log(this.state.resultPOFind)
                        
                    }

                    else{
                        console.log("Data Find Kosong")
                        this.setState({
                            validasiFindDitemukan : true,
                            validasiFindTidakDitemukan : false,
                            resultPOHeaderFind : [],
                            resultPODetailFind : [],
                            resultMTipePOFind  : [],
                            resultPOFind       : []
                        })
                    }
                });
    }

    
    
    tampilkanHasilFind(){
        this.setState({
            resultPOHeader : this.state.resultPOHeaderFind,
            modal_find : false,
            activeNomorPO   : this.state.resultPOHeaderFind.POH_NoPO,
            activeSuplierTop: this.state.resultPOHeaderFind.POH_TOP,
            activeTglPo     : this.state.resultPOHeaderFind.POH_TglPO,
            activeTypePOCode: this.state.resultPOHeaderFind.POH_TipePO,
            activeSuplierCode : this.state.resultPOHeaderFind.POH_Nosup,
            activeJmlPrint : this.state.resultPOHeaderFind.POH_JmlPrint,
            activeSendToWareHouse : this.state.resultPOHeaderFind.POH_SendToWareHouse,
            activeTypePOName : this.state.resultMTipePOFind.TipePO_Nama,
            flagFindButtonPress : !this.state.flagEditButtonPress
        },()=> this.getSupplierNeed())
    }
    getSupplierNeed(){
        this.getSupplierName()
        this.getSupplierMinValue()
        this.getGudangName()
    }

    changeFlagAdding(){
        this.setState({
            flagAdding : false,
        })
    }

    setGroup(group){
        if(group === "group1"){
            this.setState({
                activeGroup : 1,
                modal_chooseGroup : false
            },()=>this.getLastPO())
            this.getDaftarGudang()
            
        }
        else{
            this.setState({
                activeGroup : 2,
                modal_chooseGroup : false
            },()=>this.getLastPO())
            this.getDaftarGudang()
        }
    }

    // exitFunc(){
    //     this.setState({
    //         resultPODetail : [],
    //         resultPOHeader : [],
    //         flagBerhasilSave : 0,
    //         modal_chooseGroup : true
    //     })
    // }

    render(){
        return(
            <Page
            title       = "Purchase Order"
            className   = "Purchase Order">
                
                <Modal
                    isOpen={this.state.modal_chooseGroup}
                >
                    <ModalHeader>
                        Purchase Order
                    </ModalHeader>
                    <ModalBody>
                        Silahkan Memilih Group
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={ () => { this.setGroup("group1") } } >Group 1</Button>
                        <Button color="success" onClick={ () => { this.setGroup("group2") } } >Group 2</Button>
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
                    isOpen={this.state.modal_find}
                >
                    <ModalHeader>
                        Find
                    </ModalHeader>
                    <ModalBody>
                        <Input value={this.state.inputSearchModal} onChange={(e)=>this.handleEditChange("EditInputSearch", e)} type="text" placeholder = "no po"></Input>
                        <Label className={"mt-3"} hidden = {this.state.validasiFindDitemukan}>Data PO Ditemukan</Label>
                        <Label className={"mt-3"} hidden = {this.state.validasiFindTidakDitemukan}>Data PO Tidak Ditemukan</Label>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick = {()=>this.findPO()} >Search</Button>
                        <Button color="success" onClick = {()=>this.tampilkanHasilFind()} >Tampilkan</Button>
                        <Button color="success" onClick = {()=>this.setState({modal_find : false})}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    isOpen={this.state.modal_addPO}
                >
                    <ModalHeader>
                        Add PO
                    </ModalHeader>
                    <ModalBody>
                        Apakah PO lokal atau bukan ?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={()=>this.responseAddPO("iya")}>Iya</Button>
                        <Button color="success" onClick={()=>this.responseAddPO("bukan")}>Bukan</Button>
                        <Button color="success" onClick={()=>this.setState({modal_addPO : false})}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Row className ={"ml-2"}>
                    <Col xs={1}>
                        <Label>NO PO</Label>
                    </Col>
                    <Col xs={2}>
                        <Input disabled type="text" value = {this.state.activeNomorPO}></Input>
                    </Col>

                    <Col xs={0.1}>
                        <Label>TOP</Label>
                    </Col>
                    <Col xs={1}>
                        <Input  disabled type="text" value = {this.state.activeSuplierTop}></Input>
                    </Col>

                    <Col xs={0.1}>
                        <Label>TGL PO</Label>
                    </Col>
                    <Col xs={2}>
                        <Input  disabled type="date" value = {dateFormat(this.state.activeTglPo, "yyyy-mm-dd")}></Input>
                    </Col>

                    <Col xs={0.1}>
                        <Label>TYPE PO</Label>
                    </Col>
                    <Col xs={2} >
                        <Input  disabled type="text" value = {this.state.activeTypePOName}></Input>
                    </Col>
                </Row>

                <Row className ={"ml-2"}>
                    <Col xs={1}>
                        <Label>SUPLIER</Label>
                    </Col>
                    <Col xs={1}>
                        <Input  disabled = {this.state.flagInputDisabled} onKeyPress={e=>this.enterPressedSearch(e)} type="number" value={this.state.activeSuplierCode} onChange = {(e)=>this.handleEditChange("EditSupCode", e)}></Input>
                    </Col>
                    <Col xs={5}>
                        <Input  disabled type="text" value={this.state.activeSuplierName}></Input>
                    </Col>
                    <Col>
                    {
                        this.state.activeJmlPrint == 0
                        ?
                        <Label>NOT PRINT</Label>
                        :
                        <Label>PRINT</Label>
                    }
                    </Col>

                </Row>
                    {   this.state.flagAdding === true 
                        ?
                        <Row className ={"ml-2"}>
                            <Col xs={1}>
                                
                            </Col>
                            <Col>
                                <Label>Tekan enter untuk mencari suplier</Label>
                            </Col>
                        </Row>
                        :
                        undefined
                    }

                <Row className ={"ml-2"}>
                    <Col xs={1}>
                        <Label>MIN VALUE</Label>
                    </Col>
                    <Col xs={2}>
                        <Input  disabled  value={this.state.activeSuplierMinValue} type="text"></Input>
                    </Col>
                    <Col xs={1}>
                        <Label>GD RECEIVE</Label>
                    </Col>
                    <Col xs={3}>
                        <Input
                            type="select"
                            onChange = {(e) => this.handleEditChange("EditGudang",e)}
                            value={this.state.activeGudangCode}
                            id="gudangreceive"
                            disabled = {this.state.flagInputDisabled}
                        >
                            {this.state.resultGudang.map(gudang => (
                            <option key={gudang.out_code} value={gudang.out_code}>
                                {gudang.out_name}
                            </option>
                            ))}
                        </Input>
                    </Col>
                </Row>

                <Col className ={"mt-3"}>    
                    <Tabs
                        selectedIndex={this.state.selectedTabs}
                        style={{
                            display: this.state.displayTabs
                        }}>

                            <TabList tabIndex={0}>
                                <Tab style={{width:300}}>Detail</Tab>
                                <Tab style={{width:300}}>Agreement</Tab>
                                <Tab style={{width:300}}>History</Tab>
                              
                            </TabList>
                                
                            <TabPanel>
                                <Purchase_Order_Detail sumTotalNettoFromDetailPage = {this.sumTotalNettoFromDetailPage}  activeNomorPO = {this.state.activeNomorPO} activeGroup = {this.state.activeGroup} flagGetDataPOFinished = {this.state.flagGetDataPOFinished} flagPrintPO = {this.state.flagPrintPO} flagButtonEditDetail = {this.state.flagButtonEditDetail} flagGudangFound = {this.state.flagGudangFound} activeSuplierCode = {this.state.activeSuplierCode} resultHeaderSend = {header}  flagAdding={this.state.flagAdding} changeFlagAdding= {()=>this.changeFlagAdding()}  resultPOFind = {this.state.resultPOFind}  flagFindButtonPress = {this.state.flagFindButtonPress}  refreshPageFunc = {()=>this.refreshPage()} flagAddButtonPressed={this.state.flagAddButtonPressed} flagEditButtonPress={this.state.flagEditButtonPress} flagSaveButtonPress={this.state.flagSaveButtonPress} typePOCode={this.state.activeTypePOCode}   />
                                
                            </TabPanel>

                            <TabPanel>
                                <Purchase_Order_Agreement/>
                            </TabPanel>
                    
                            <TabPanel>
                                <Purchase_Order_History />
                            </TabPanel>
                    </Tabs>
                               
                </Col>
                
                <Row >
                    <Col className ={"mt-3"}>
                        <Row className ={"justify-content-center"}>
                            <ButtonGroup  size="sm">
                                <Button style={{width : "75px"}} variant="secondary" onClick={()=>this.setState({modal_find : true, validasiFindDitemukan: true, validasiFindTidakDitemukan: true, inputSearchModal : ""})}>Find</Button>
                                <Button style={{width : "75px"}} variant="secondary" onClick={()=>this.setState({modal_addPO : true})} >Add</Button>
                                <Button style={{width : "75px"}} variant="secondary" onClick={()=>this.setState({flagEditButtonPress : true})}>Edit</Button>
                                <Button style={{width : "75px"}} variant="secondary" onClick={()=>this.savePO()} >Save</Button>
                                <Button style={{width : "75px"}} variant="secondary" onClick={()=>this.refreshPage()}>Cancel</Button>
                            </ButtonGroup>
                        </Row>
                        <Row className ={"justify-content-center"}>
                            <ButtonGroup size="sm">
                                <Button style={{width : "75px"}} variant="secondary" onClick={()=>this.setState({flagPrintPO : !this.state.flagPrintPO})} >Print</Button>
                                <Button style={{width : "75px"}} disabled variant="secondary">AutoFax</Button>
                                <Button style={{width : "75px"}} variant="secondary">Delete</Button>
                                <Button style={{width : "75px"}} disabled variant="secondary">Tarik OR</Button>
                                <Button style={{width : "75px"}} variant="secondary" >Exit</Button>
                            </ButtonGroup>
                        </Row>
                    </Col>


                    <Col> 
                        <Row>
                            <Col xs={2}>
                                <Label>Sub Total :</Label>
                            </Col>
                            <Col xs={4}>
                                <Input type="text" value={parseInt(this.state.activeSubTotal).toLocaleString(
                                        'en-US',)}>
                                </Input>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={2}>
                                <Label>PPN :</Label>
                            </Col>
                            <Col xs={4}>
                                <Input type="text" value={parseInt(this.state.activePpnTotalNetto).toLocaleString(
                                        'en-US',)} >
                                </Input>
                            </Col>
                        </Row>
                        <Card></Card>
                        <Row className = {"mt-3"}>
                            <Col xs={2}>
                                <Label>Total : </Label>
                            </Col>
                            <Col xs={4}>
                                <Input type="text" value={parseInt(this.state.activeTotal).toLocaleString(
                                        'en-US',)} >
                                </Input>
                            </Col>
                        </Row>     
                    </Col>

                </Row>
            
            </Page>
        )
    }
}
export default Purchase_Order_Tab;