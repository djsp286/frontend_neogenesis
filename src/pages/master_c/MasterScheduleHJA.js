import Page from 'components/Page';
import React from 'react';
import {
  Button, Card, CardBody, CardHeader, CardFooter, 
  Col, Row, Form, Label, Table, Input, FormGroup,
  ButtonGroup, Modal, ModalBody, ModalHeader, 
  ModalFooter,
} from 'reactstrap';
import {
    MdEdit, MdArrowForward,MdArrowBack, MdSave, 
    MdCancel, MdBackspace, MdDone, MdRefresh,
    MdClose, 
} from 'react-icons/md';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import dateFormat from 'dateformat'
import axios from 'axios'
import { thisExpression } from '@babel/types';

class MasterScheduleHJA extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            resultUnselected: [],
            resultSelected: [],
            resultHJAList:[],
            checkedHJABox:[],
            selectedProduct:[],
            isEmpty:true,
            product: [],
            supplier: [],
            groupId: 1,
            displayTabs: "block",
            displayGroup: "none",
            noDataMessage: "none",
            selectedTabs: 0,
            activeProcode:this.props.activeProcode,

            //Selected
            selectedUserID: '',
            selectedUserName: '',
            selectedProductCode:'',
            selectedProductSupplier:'',
            selectedEffectiveDate:'',

            // Input
            inputUserID:'',
            inputTglEfektif: '',
            inputProductCode: '',
            inputSupplierID: '',
            inputConfirm:'',
            inputNIPConfirm:'',
            inputYes:'',
            inputNo:''
        };
    }

    componentDidMount = () => {
        this.getProductMaster()
        this.getSupplierMaster()
    }

    getPointSelected = () => {
        axios
        .get('https://api.docnet.id/CHCMasterProduk/PointGroup/' + this.state.groupId)
        .then((res) => {
            if(res.data.data !== null){
                this.setState({
                    resultSelected: res.data.data,
                })
            }else
            {
            this.setState({
                resultSelected: []
            }) 
            }
        })
    }

    getProductMaster=()=>{
        axios
        .get('https://api.docnet.id/CHCMasterProduk/Product?page=0&length=0')
        .then((res) => {
            if(res.data.data != null ){
                this.setState({
                    product: res.data.data,
                })
            }else{
                this.setState({
                    noDataMessage: "block"
                })
            }
            this.setState({
                maxPage: res.data.metadata.maxpage
            })
        })
    }

    getSupplierMaster=()=>{
        axios
        .get('https://api.docnet.id/CHCMasterD/MasterSupplier/TampilkanSupplier')
        .then((res) => {
            if(res.data.Data != null ){
                this.setState({
                    supplier: res.data.Data,
                })
            }else{
                this.setState({
                    noDataMessage: "block"
                })
            }
        })
    }

    getScheduleHJAByUser = () =>{
        axios
        .get('https://api.docnet.id/CHCMasterProdukSupplier/ScheduleUpdHJA?NIPUser=190180P')
        .then((res)=>{

            if(res.data.data !== null){
                this.setState({
                    resultHJAList: res.data.data,
                    value: '',
                })
            }else{
                this.setState({
                    resultHJAList: [],
                    value: 3,
                    noDataMessage: "block"
                })
            }
        })
    }

    getScheduleHJAByUserProduk = () =>{
        axios
        .get('https://api.docnet.id/CHCMasterProdukSupplier/ScheduleUpdHJA?NIPUser=190180P&KdProduk=' + this.state.inputProductCode) 
        .then((res)=>{
            if(res.data.data !== null){
                this.setState({
                    resultHJAList: res.data.data,
                    value: '',
                })
            }else{
                this.setState({
                    resultHJAList: [],
                    value: 3,
                    noDataMessage: "block"
                })
            }
        })
    }

    getScheduleHJAByUserSupplier = () =>{
        axios
        .get('https://api.docnet.id/CHCMasterProdukSupplier/ScheduleUpdHJA?NIPUser=190180P&KdSupplier='+this.state.selectedProductSupplier)
        .then((res)=>{
            if(res.data.data !== null){
                this.setState({
                    resultHJAList: res.data.data,
                    value: '',
                })
            }else{
                this.setState({
                    resultHJAList: [],
                    value: 3,
                    noDataMessage: "block"
                })
            }
        })
    }

    getScheduleHJAByUserStsMargin = () =>{
        axios
        .get('https://api.docnet.id/CHCMasterProdukSupplier/ScheduleUpdHJA?NIPUser=190180P&StsConfirm='+this.state.inputConfirm)
        .then((res)=>{
            if(res.data.data !== null){
                this.setState({
                    resultHJAList: res.data.data,
                    value: '',
                })
            }else{
                this.setState({
                    resultHJAList: [],
                    value: 3,
                    noDataMessage: "block"
                })
            }
        })
    }

    confirmScheduleHJA = ()=>{
        var TempJSON = {
            data: this.state.selectedProduct
                    // schaupdhja_procode: this.state.selectedProduct[0].schaupdhja_procode,
                    // schaupdhja_supcode: this.state.selectedProduct[0].schaupdhja_supcode,
                    // schaupdhja_grossprice: this.state.selectedProduct[0].schaupdhja_grossprice,
                    // schaupdhja_discount: this.state.selectedProduct[0].schaupdhja_discount,
                    // schaupdhja_nettoprice: this.state.selectedProduct[0].schaupdhja_nettoprice,
                    // schaupdhja_saleprice: this.state.selectedProduct[0].schaupdhja_saleprice,
                    // schaupdhja_effectivedate: this.state.selectedProduct[0].schaupdhja_effectivedate,
                    // schaupdhja_canceldate: this.state.selectedProduct[0].schaupdhja_canceldate,
                    // schaupdhja_nipconfirm: this.state.selectedProduct[0].schaupdhja_nipconfirm,
                    // schaupdhja_confirmdate: this.state.selectedProduct[0].schaupdhja_confirmdate,
                    // schaupdhja_stsmargin: this.state.selectedProduct[0].schaupdhja_stsmargin,
                    // schaupdhja_userid: this.state.selectedProduct[0].schaupdhja_userid,
                    // schaupdhja_lastupdate: this.state.selectedProduct[0].schaupdhja_lastupdate,
                    // schaupdhja_hetyn: this.state.selectedProduct[0].schaupdhja_hetyn,
                    // schaupdhja_hetprice: this.state.selectedProduct[0].schaupdhja_hetprice,
                    // schaupdhja_hrgspecialyn: this.state.selectedProduct[0].schaupdhja_hrgspecialyn,
                    // schaupdhja_hrgspecial: this.state.selectedProduct[0].schaupdhja_hrgspecial
            
        }
        // console.log(this.state.selectedProduct)
        // console.log("tempJSON: ", JSON.stringify(TempJSON))
        // console.log("inputConfirm: ", this.state.inputConfirm)

        console.log("Temp JSON: ", JSON.stringify(TempJSON))

        axios
        .put('https://api.docnet.id/CHCMasterProdukSupplier/ScheduleUpdHJA?NIPUser=190180P&StsConfirm=' + this.state.inputConfirm, TempJSON)
        // .put('https://api.docnet.id/CHCMasterProdukSupplier/ScheduleUpdHJA?NIPUser=190180P&StsConfirm=' + this.state.inputConfirm, TempJSON)
        .then((res)=>{
            this.componentDidMount();

            if (res.data.responseCode === 200){
                this.setState({
                  responseHeader: "BERHASIL MENGKONFIRMASI DATA"
                })
              } else {
                this.setState({
                  responseHeader: "GAGAL MENGKONFIRMASI DATA"
                })
              }
        });

        this.toggleConfirmConfirmationModalIsOpen()
        this.toggleResponseModalIsOpen()
    }

    cancelScheduleHJA = () =>{
        var TempJSON = {
            data: this.state.selectedProduct
                    // schaupdhja_procode: this.state.selectedProduct[0].schaupdhja_procode,
                    // schaupdhja_supcode: this.state.selectedProduct[0].schaupdhja_supcode,
                    // schaupdhja_grossprice: this.state.selectedProduct[0].schaupdhja_grossprice,
                    // schaupdhja_discount: this.state.selectedProduct[0].schaupdhja_discount,
                    // schaupdhja_nettoprice: this.state.selectedProduct[0].schaupdhja_nettoprice,
                    // schaupdhja_saleprice: this.state.selectedProduct[0].schaupdhja_saleprice,
                    // schaupdhja_effectivedate: this.state.selectedProduct[0].schaupdhja_effectivedate,
                    // schaupdhja_canceldate: this.state.selectedProduct[0].schaupdhja_canceldate,
                    // schaupdhja_nipconfirm: this.state.selectedProduct[0].schaupdhja_nipconfirm,
                    // schaupdhja_confirmdate: this.state.selectedProduct[0].schaupdhja_confirmdate,
                    // schaupdhja_stsmargin: this.state.selectedProduct[0].schaupdhja_stsmargin,
                    // schaupdhja_userid: this.state.selectedProduct[0].schaupdhja_userid,
                    // schaupdhja_lastupdate: this.state.selectedProduct[0].schaupdhja_lastupdate,
                    // schaupdhja_hetyn: this.state.selectedProduct[0].schaupdhja_hetyn,
                    // schaupdhja_hetprice: this.state.selectedProduct[0].schaupdhja_hetprice,
                    // schaupdhja_hrgspecialyn: this.state.selectedProduct[0].schaupdhja_hrgspecialyn,
                    // schaupdhja_hrgspecial: this.state.selectedProduct[0].schaupdhja_hrgspecial
            
        }
        // console.log(this.state.selectedProduct)
        // console.log("tempJSON: ",JSON.stringify(TempJSON))
        // console.log("inputConfirm:",this.state.inputConfirm)

        console.log("Input Confirm: ", this.state.inputConfirm)
        console.log("NIP Confirm: ", this.state.inputNIPConfirm)

        axios
        .put('https://api.docnet.id/CHCMasterProdukSupplier/ScheduleUpdHJA?NIPUser=190180P&StsConfirm=' + this.state.inputConfirm + '&NIPConfirm='+ this.state.inputNIPConfirm, TempJSON)
        // .put('https://api.docnet.id/CHCMasterProdukSupplier/ScheduleUpdHJA?NIPUser=190180P&StsConfirm=' + this.state.inputConfirm + '&NIPConfirm='+ this.state.inputNIPConfirm, TempJSON)
        .then((res)=>{
            this.componentDidMount();

            if (res.data.responseCode === 200){
                this.setState({
                  responseHeader: "BERHASIL MEMBATALKAN DATA"
                })
              } else {
                this.setState({
                  responseHeader: "GAGAL MEMBATALKAN DATA"
                })
              }
        });

        this.toggleCancelConfirmationModalIsOpen()
        this.toggleResponseModalIsOpen()
    }

    handleChange = (type, event) => {

        var selectEfektifDate = document.getElementById("inputTglEfektif");
        var selectProduct = document.getElementById("inputProductCode");
        var selectSupplier = document.getElementById("inputSupplierID");

        if(type === "inputUserID"){
            if(event.target.value === "== PILIH USER =="){
                this.setState({
                    inputUserID: "",
                    isEmpty: true,
                })

            } else{
                this.setState({
                    inputUserID: event.target.value,
                    isEmpty: false,
                })
            }
        }

        else if(type === "inputTglEfektif"){
            if(event.target.value === ""){
                this.setState({
                    inputTglEfektif: "",
                    isEmpty: true
                }, () => {
                    selectEfektifDate.disabled = false
                    selectProduct.disabled = false
                    selectSupplier.disabled = false
                })
            } else{
                this.setState({
                    inputTglEfektif: event.target.value,
                    isEmpty: false
                }, () => {
                    selectEfektifDate.disabled = false
                    selectProduct.disabled = true
                    selectSupplier.disabled = true
                })
            }
        }

        else if(type === "inputProductCode"){

            if(event.target.value === "== PILIH PRODUK =="){
                this.setState({
                    inputProductCode: "",
                    isEmpty: true
                }, () => {
                    selectEfektifDate.disabled = false
                    selectProduct.disabled = false
                    selectSupplier.disabled = false
                })
            } else{
                this.setState({
                    inputProductCode: event.target.value,
                    isEmpty: false
                }, () => {
                    selectEfektifDate.disabled = true
                    selectProduct.disabled = false
                    selectSupplier.disabled = true
                })
            }
        }

        else if(type === "inputSupplierID"){

            if(event.target.value === "== PILIH SUPPLIER =="){
                this.setState({
                    inputSupplierID: "",
                    isEmpty: true
                }, () => {
                    selectEfektifDate.disabled = false
                    selectProduct.disabled = false
                    selectSupplier.disabled = false
                })
            } else{
                this.setState({
                    inputSupplierID: event.target.value,
                    isEmpty: false
                }, () => {
                    selectSupplier.disabled = false
                    selectProduct.disabled = true
                    selectEfektifDate.disabled = true
                })
            }
        }
    
    }

    selectedProductToChange = (data) =>{
        const tempArray = [...this.state.selectedProduct]
        const index = tempArray.indexOf(data);

        if(tempArray.includes(data)){
            tempArray.splice(index, 1)
        }else if(!tempArray.includes(data)){
            tempArray.push(data);
        }

        this.setState( {
            selectedProduct:tempArray
        }, 
            () => this.checkSelectedProductCancelType()
        )

    }

    checkSelectedProductCancelType = () =>{
        if(this.state.selectedProduct.length){
            if(this.state.selectedProduct[0].schaupdhja_nipconfirm === '' && 
                this.state.selectedProduct[0].schaupdhja_confirmdate === ''){
                    this.setState({
                        inputNIPConfirm: 'CONVERT'
                    })
                }else{
                this.setState({
                    inputNIPConfirm: ''
                })
            }
        } else if(!this.state.selectedProduct){
            console.log("TIDAK ADA DATA")
        }
    }

    mappingCheckbox = () =>{
        var resulthjamap = document.querySelectorAll("#tbody tr");
        for(let i = 0; i < resulthjamap.length; i++){
            console.log("rows: ", i)
        }
    }

    searchDataBy = () => {

        // console.log("====================")
        // console.log("User ID: ", this.state.inputUserID)
        // console.log("Effective Date: ", this.state.inputTglEfektif)
        // console.log("Product Code: ", this.state.inputProductCode)
        // console.log("Supplier ID: ", this.state.inputSupplierID)
        // console.log("Confirm: ", this.state.inputConfirm)
        // console.log("====================")

        console.log("Value: ", this.state.value)

        if(this.state.inputUserID !== "" && this.state.inputProductCode === ""  
        && this.state.inputSupplierID === ""){
            console.log("Search By User")
            // console.log("==============")
            // console.log("Input User ID: ", this.state.inputUserID)
            
            this.getScheduleHJAByUser();
        }else if(this.state.inputProductCode !== "" && this.state.inputUserID !== "" 
        && this.state.inputSupplierID === "" ){
            console.log("Search By User Produk")
            // console.log("=====================")
            // console.log("Input User ID: ", this.state.inputUserID)
            // console.log("Input Product Code: ", this.state.inputProductCode)

            this.getScheduleHJAByUserProduk();
        }else if(this.state.inputSupplierID !== "" && this.state.inputProductCode === ""
        && this.state.inputUserID !== ""){
            console.log("Search By User Supplier")
            // console.log("=====================")
            // console.log("Input User ID: ", this.state.inputUserID)
            // console.log("Input Product Code: ", this.state.inputProductCode)
            // console.log("Input Supplier ID: ", this.state.inputSupplierID)

            this.getScheduleHJAByUserSupplier();
        }else if(this.state.inputConfirm !== "" && this.state.inputSupplierID === "" 
        && this.state.inputProductCode === "" && this.state.inputUserID !== ""){
            console.log("Search By User Sts Confirm")
            console.log("=====================")
            // console.log("Input User ID: ", this.state.inputUserID)
            // console.log("Input Product Code: ", this.state.inputProductCode)
            // console.log("Input Supplier ID: ", this.state.inputSupplierID)
            console.log("Input Input Confirm: ", this.state.inputConfirm)

            this.getScheduleHJAByUserStsMargin();
        }
        this.mappingCheckbox();
    }

    checkboxlistener = (result) =>{
        var checkboxYes = document.getElementById("checkboxYes");
        var checkboxNo = document.getElementById("checkboxNo");

        if(checkboxYes.checked){
            // checkboxNo.checked = false
            this.setState({
                inputConfirm:'Y',
                isEmpty:false,
                value: 0,
            })
        }
        
        if(checkboxNo.checked){
            // checkboxYes.checked = false
            this.setState({
                inputConfirm:'N',
                isEmpty:false,
                value: 1,
            })
        }
    }

    addScheduleHJA = (efDate) => {
        var tglEfektifYear = (this.state.selectedEffectiveDate).substring(0, 4);
        var tglEfektifMonth = (this.state.selectedEffectiveDate).substring(5, 7);
        var tglEfektifDate = (this.state.selectedEffectiveDate).substring(8, 10);
        var tglEfektif = tglEfektifYear + "-" + tglEfektifMonth + "-" + tglEfektifDate;

        console.log("User ID: ", this.state.inputUserID)
        console.log("Tgl Efektif: ", this.state.inputTglEfektif)
        console.log("Product Code: ", this.state.inputProductCode)
        console.log("Supplier : ", this.state.inputSupplierID)
        console.log("Confirm: ", this.state.inputConfirm)
    }

    state =  {
        confirmConfirmationModalIsOpen: false,
        cancelConfirmationModalIsOpen: false,
        responseModalIsOpen: false,
    }

    toggleConfirmConfirmationModalIsOpen = () => {
        this.setState({
            confirmConfirmationModalIsOpen: !this.state.confirmConfirmationModalIsOpen,
            cancelConfirmationModalIsOpen: this.state.cancelConfirmationModalIsOpen,
            responseModalIsOpen: this.state.responseModalIsOpen,
        })
    }

    toggleCancelConfirmationModalIsOpen = () => {
        this.setState({
            confirmConfirmationModalIsOpen: this.state.confirmConfirmationModalIsOpen,
            cancelConfirmationModalIsOpen: !this.state.cancelConfirmationModalIsOpen,
            responseModalIsOpen: this.state.responseModalIsOpen,
        })
    }

    toggleResponseModalIsOpen = () => {
        this.setState({
            confirmConfirmationModalIsOpen: this.state.confirmConfirmationModalIsOpen,
            cancelConfirmationModalIsOpen: this.state.cancelConfirmationModalIsOpen,
            responseModalIsOpen: !this.state.responseModalIsOpen,
        })
    }

    refreshPage = () => {
        window.location.reload()
    }

    render = () => {
      const { product, supplier , resultHJAList, value } = this.state || [];

        return (
            <Page
            title="Master Confirm Schedule HJA">
                <Row>
                    <Col>
                    
                    <div>
                        
                        {/* Confirm Confirmation Modal */}
                        <Modal
                        isOpen={this.state.confirmConfirmationModalIsOpen}
                        >
                            <ModalHeader
                            toggle={this.toggleConfirmConfirmationModalIsOpen.bind(this)}
                            >
                                Konfirmasi Data
                            </ModalHeader>

                            <ModalBody>
                                Apakah Anda Yakin Ingin Mengkonfirmasi Data-Data Ini?
                            </ModalBody>

                            <ModalFooter
                            style={{
                            display: "inline-block",
                            textAlign: "center"
                            }}
                            >
                                <Button
                                color="primary"
                                onClick={ ()=>this.confirmScheduleHJA() }
                                >
                                    <MdDone
                                    style={{
                                        marginRight: "5"
                                    }}
                                    />Ya
                                </Button>

                                <Button
                                color="secondary"
                                onClick={ this.toggleConfirmConfirmationModalIsOpen.bind(this) }
                                >
                                    <MdClose
                                    style={{
                                        marginRight: "5"
                                    }}
                                    />Tidak
                                </Button>

                            </ModalFooter>

                        </Modal>
                        {/* Confirm Confirmation Modal */}

                        {/* Cancel Confirmation Modal */}
                        <Modal
                        isOpen={this.state.cancelConfirmationModalIsOpen}
                        >
                            <ModalHeader
                            toggle={this.toggleCancelConfirmationModalIsOpen.bind(this)}
                            >
                                Batal Konfirmasi Data
                            </ModalHeader>

                            <ModalBody>
                                Apakah Anda Yakin Ingin Membatalkan Konfirmasi Data-Data Ini?
                            </ModalBody>

                            <ModalFooter
                            style={{
                            display: "inline-block",
                            textAlign: "center"
                            }}
                            >
                                <Button
                                color="primary"
                                onClick={ ()=>this.cancelScheduleHJA() }
                                >
                                    <MdDone
                                    style={{
                                        marginRight: "5"
                                    }}
                                    />Ya
                                </Button>

                                <Button
                                color="secondary"
                                onClick={ this.toggleCancelConfirmationModalIsOpen.bind(this) }
                                >
                                    <MdClose
                                    style={{
                                        marginRight: "5"
                                    }}
                                    />Tidak
                                </Button>

                            </ModalFooter>

                        </Modal>
                        {/* Cancel Confirmation Modal */}

                        {/* Response Modal */}
                        <Modal
                        isOpen={this.state.responseModalIsOpen}>
                            
                            <ModalHeader
                            toggle={ () => this.toggleResponseModalIsOpen.bind(this) }
                            >
                                {this.state.responseHeader}
                            </ModalHeader>
                        
                            <ModalBody>
                                {this.state.responseHeader}
                            </ModalBody>
                            
                            <ModalFooter>
                                <Button
                                color="primary"
                                onClick={ () => this.refreshPage() }
                                >
                                    OK
                                </Button>
                            </ModalFooter>

                        </Modal>
                        {/* Response Modal */}
                        
                        <Card className="mb-3">
                            
                            <CardBody>

                                <Form>
                                    <fieldset
                                    id="fs2Add"
                                    >
                                        <div className="d-flex justify-content-between text-nowrap">
                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "left",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                width: "18.75%",
                                                marginBottom:"1%"
                                            }}
                                            >
                                                User
                                            </Label>

                                            <select
                                            id="inputUserID"
                                            className = "custom-select"
                                            style={{
                                                display:"inline-flex",
                                            }}
                                            onChange={(e) => this.handleChange("inputUserID", e)}
                                            value={this.state.inputUserID}
                                            >
                                                <option selected>== PILIH USER ==</option>
                                                {product.map(
                                                    prod =>
                                                    <option value={prod.pro_code}>{prod.pro_code} - {prod.pro_name}</option>
                                                )} 
                                            </select>
                                        </div>

                                        <div className="d-flex justify-content-between text-nowrap">
                                            <FormGroup
                                            inline
                                            check
                                            style={{
                                                marginRight: "2vw",
                                            }}
                                            >
                                                <Label
                                                check
                                                className="text-nowrap"
                                                style={{
                                                    // display: "inline-flex",
                                                    // justifyContent: "left",
                                                    // textAlign: "center",
                                                    // verticalAlign: "center",
                                                    // width: "18.5%",
                                                    margin: "auto",
                                                }}
                                                >
                                                    Tgl. Efektif
                                                </Label>

                                                <Input
                                                id = "inputTglEfektif"
                                                type="date"
                                                style = {{
                                                    width: "100%",
                                                    marginLeft: "7.5vw",
                                                }}
                                                value={this.state.inputTglEfektif}
                                                onInput={(e) => this.handleChange("inputTglEfektif", e)}
                                                />

                                            </FormGroup>
                                        </div>

                                        <div className="d-flex justify-content-between text-nowrap">
                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "left",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                width: "18.5%",
                                            }}
                                            >
                                                Product Code
                                            </Label>
                                            
                                            <select
                                            id="inputProductCode"
                                            className = "custom-select"
                                            style={{
                                                display:"inline-flex",
                                            }}
                                            onChange={(e) => this.handleChange("inputProductCode", e)}
                                            value={this.state.inputProductCode}
                                            >
                                                <option selected>== PILIH PRODUK ==</option>
                                                {product.map(
                                                    prod =>
                                                    <option value={prod.pro_code}>{prod.pro_code} - {prod.pro_name}</option>
                                                )} 
                                            </select>
                                            
                                    
                                        </div>

                                        <div className="d-flex justify-content-between text-nowrap">
                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "left",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                width: "18.5%",
                                            }}
                                            >
                                                Supplier
                                            </Label>
                                            
                                            <select
                                            id="inputSupplierID"
                                            placeholder="Supplier ID"
                                            className = "custom-select"
                                            style={{
                                                display:"inline-flex",
                                            }}
                                            value={this.state.inputSupplierID}
                                            onChange={(e) => this.handleChange("inputSupplierID", e)}
                                            >
                                                <option selected>== PILIH SUPPLIER ==</option>
                                                {supplier.map(
                                                    supp =>
                                                
                                                    <option value={supp.Sup_Code}>{supp.Sup_Code} - {supp.Sup_Name}</option>
                                                )} 
                                            </select>
                                    
                                        </div>
                                            
                                        <div className="justify-content-between mt-3">
                                            <Label
                                            style={{
                                                display: "inline-flex",
                                                justifyContent: "left",
                                                textAlign: "center",
                                                verticalAlign: "center",
                                                margin: "auto",
                                                width: "19.75%",
                                            }}
                                            >
                                                Confirm
                                            </Label>

                                            <Label
                                            check
                                            className="text-nowrap"
                                            style={{
                                                margin: "auto",
                                                marginRight: "5vw"
                                            }}
                                            >
                                                <Input
                                                id="checkboxYes"
                                                type="radio"
                                                name="confirm"
                                                onChange = {()=>this.checkboxlistener()}
                                                />Yes
                                            </Label>

                                            <Label
                                            check
                                            className="text-nowrap"
                                            style={{
                                                margin: "auto",
                                            }}
                                            >
                                                <Input
                                                id="checkboxNo"
                                                type="radio"
                                                name="confirm"
                                                onChange = {()=>this.checkboxlistener()}
                                                />No
                                            </Label>

                                            <Button
                                            id="btnRefresh"
                                            disabled={this.state.isEmpty}
                                            inline
                                            style={{
                                                float: "right",
                                                width: "15%"
                                            }}
                                            onClick={()=>this.searchDataBy()}
                                            >
                                                <MdRefresh
                                                style={{
                                                    marginRight: "5%"
                                                }}
                                                />Refresh
                                            </Button>
                                    
                                        </div>

                                    </fieldset>
                                </Form>

                                <hr/>

                                <Form>
                                    <fieldset
                                    id="fs3Add"
                                    >
                                        
                                        <Table
                                        bordered
                                        responsive
                                        >
                                            <thead>
                                                <tr>
                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>ProCode</th>
                                                    
                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>Prodes</th>

                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>Supplier</th>
                                                    
                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>Gross Price</th>

                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>Sale Price</th>
                                                    
                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>Tgl. Efektif</th>

                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>Tgl. Cancel</th>
                                                    
                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>Disc.</th>
                                                    
                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>Area</th>

                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>Tgl. Confirm</th>
                                                    
                                                    <th
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center"
                                                    }}>Confirm</th>

                                                    <td
                                                    style={{
                                                        verticalAlign:"middle",
                                                        textAlign: "center",
                                                        marginBottom:"0.1%"
                                                    }}
                                                    >
                                                        <input
                                                        type="checkbox"
                                                        id="checkboxAll"
                                                        style={{
                                                            verticalAlign: "middle",
                                                            textAlign: "center",
                                                            marginLeft:"0.1%",
                                                        }}
                                                        onClick={()=>this.checkboxlistener(resultHJAList)}
                                                        >
                                                        </input>
                                                    </td>
                                                </tr>
                                                
                                            </thead>

                                            <tbody
                                            id="resulthjamap">
                                            {resultHJAList.map((conf)=>
                                            <tr>
                                                <td
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}>
                                                    {conf.schaupdhja_procode}
                                                </td>
                                                
                                                <td
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}>
                                                    {conf.pro_name}
                                                </td>
                                                
                                                <td
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}>
                                                    {conf.sup_name}
                                                </td>

                                                <td
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}>
                                                    {conf.schaupdhja_grossprice}
                                                </td>
                                                
                                                <td
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}>
                                                    {conf.schaupdhja_saleprice}
                                                </td>
                                                
                                                <td
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}>
                                                    {conf.schaupdhja_effectivedate}
                                                </td>
                                                
                                                <td
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}>
                                                    {conf.schaupdhja_canceldate}
                                                </td>
                                                
                                                <td
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}>
                                                    {conf.schaupdhja_discount}
                                                </td>

                                                <td
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}>
                                                    {conf.schaupdhja_supcode}
                                                </td>
                                                
                                                <td
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}>
                                                    {conf.schaupdhja_confirmdate}
                                                </td>
                                                
                                                <td
                                                style={{
                                                    verticalAlign: "middle",
                                                    textAlign: "center"
                                                }}>
                                                    {conf.schaupdhja_nipconfirm}
                                                </td>

                                                <td
                                                >
                                                    <Input
                                                    type="checkbox"
                                                    value={conf}
                                                    style={{
                                                        verticalAlign: "middle",
                                                        textAlign: "center",
                                                        marginLeft:"0.1%",
                                                        marginTop: "1.5vw",
                                                    }}
                                                    onClick={()=>this.selectedProductToChange(conf)}>
                                                    </Input>
                                                </td>
                                            </tr>
                                            )}
                                            </tbody>                                            
                                        </Table>

                                        {
                                            value === 3
                                            &&
                                            <Form
                                            style={{
                                                verticalAlign: "middle",
                                                textAlign: "center",
                                            }}
                                            >
                                                <p>Tidak Ada Data</p>
                                            </Form>
                                        }
                                    
                                    </fieldset>
                                </Form>
                                
                            </CardBody>

                            <CardFooter>
                                <Form
                                inline
                                className="cr-search-form"
                                style={{
                                    textAlign: "center",
                                    justifyContent: "center",
                                    float: "right"
                                }}
                                >
                                    {
                                        value === 0
                                        &&
                                        <Button
                                        color={"success"}
                                        style={{
                                            marginLeft: "5px",
                                            marginRight: "5px",
                                        }}
                                        onClick={ () => this.toggleConfirmConfirmationModalIsOpen() }
                                        >
                                            <MdDone
                                            style={{
                                                marginRight: "5px"
                                            }}
                                            />Confirm
                                        </Button>
                                    }

                                    {
                                        value === 1
                                        &&
                                        <Button
                                        color={"danger"}
                                        style={{
                                            marginRight: "5px",
                                            marginLeft: "5px",
                                        }}
                                        onClick={ () => this.toggleCancelConfirmationModalIsOpen() }
                                        >
                                            <MdCancel
                                            style={{
                                                marginRight: "5px"
                                            }}
                                            />Batal
                                        </Button>
                                    }
                                    
                                    <Button
                                    color={"primary"}
                                    style={{
                                        marginLeft: "5px"
                                    }}
                                    onClick={ () => this.refreshPage() }
                                    >
                                        <MdArrowBack
                                        style={{
                                            marginRight: "5px"
                                        }}
                                        />Exit
                                    </Button>
                                </Form>
                            </CardFooter>
                            
                        </Card>
                    
                    </div>
                    
                    </Col>
                </Row>
            </Page>
        )
    }
}

export default MasterScheduleHJA;