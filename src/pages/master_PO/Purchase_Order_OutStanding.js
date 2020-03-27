import Page from 'components/Page';
import {
    Col, Row, Table,Label, Input, Button, ButtonGroup, Card, Modal, ModalHeader, ModalBody, ModalFooter,
    UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import dateFormat from 'dateformat';
import Purchase_Order_Detail from './Purchase_Order_Detail';
import { MdDateRange } from 'react-icons/md';
var ArraylistPO = [];
class Purchase_Order_OutStanding extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            modal_response          : false,
            responseHeader          : "", 
            responseMessage         : "",
            selectedOption          : "List",
            disablecheckbox         : true,
            disableSelectAll        : true,
            disableTarikPOButton    : true,
            disableFindButton       : false,
            disablePrintButton      : true,
            disableNewPOButton      : true,
            disableModifyButton     : true,
            disableCancelButton     : true,
            disableExitButton       : true,
            disableConvertButton    : true,
            disablePerpanjangButton : true,
            resultPOHeader          : [],
            resultPODetail          : [],
            resultPODetailTarik     : [],
            resultPOHeaderTarik     : [],
            detailContact           : [],
            resultAlasanPO          : [], 
            checkedPO               : [],
            listPO                  : [],
            ArraylistPO             : [],
            sup_code:'',
            searchSupplierbyNo:'',

        };
    }

    componentDidMount(){
    
    }

    getSupplier(){

        var payload = {
            supcode :[this.state.searchSupplierbyNo] 
        }
        console.log(JSON.stringify(payload) + ' payload')
        const option = {
            method  : "POST",
            json    : true,
            headers : 
                    {
                    "Content-Type": "application/json;charset=UTF-8"
                    },
            body: JSON.stringify(payload)
            }

            fetch("https://api.docnet.id/CHCMasterD/MasterSupplier/CariBanyakDataSupplierDgnKode",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.Data === null)  {
                        console.log("Data Supplier Kosong")
                    }
                    else{
                        console.log("Data Supplier Tidak Kosong") 
                        this.setState({ 
                            resultPOHeader :  data.Data,
                        },()=>console.log(this.state.resultPOHeader))
                      
                        
                    }
                        
                });
    }

    getPOOutstanding()
    {   
        const option = {
            method  : "GET",
            json    : true,
            headers : {
                    "Content-Type": "application/json;charset=UTF-8",        
                    },
            }
            fetch("http://10.0.111.34:2222/po?type=pooutstanding",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.data === null)  {
                        console.log("Data PO Kosong")             
                        this.setState({
                            resultPOHeader : [],
                            resultPODetail : [] 
                        })
                    }
                    else{
                        console.log("Data PO Header Tidak Kosong") 
                        this.setState({ 
                            resultPOHeader  : data.data,
                            resultTglPO     : data.data[0].T_POHeader.POH_TglPO,
                            resultTipePO    : data.data[0].T_POHeader.POH_TipePO, 
                            resultRecv      : data.data[0].T_POHeader.POH_SendToWareHouse
                        });          
                       }                             
                });
    }
  
        getContact(POH_Group,sup_code){
        var payload = {
            ConSup_SupCode : sup_code,
            ConSup_GrpCode : POH_Group
        }
        console.log(payload)
        const option = {
            method  : "POST",
            json    : true,
            headers : 
                    {
                        "Content-Type": "application/json;charset=UTF-8"
                    },
            body: JSON.stringify(payload)
            }
            fetch("https://api.docnet.id/CHCMasterD/MasterSupplierContact/TampilkanSupplierContactbyCode",option)
            .then(response => response.json())
            .then(data =>{ 
                    if(data.Data === null)  {
                        console.log("Data contact Kosong")
                    }
                    else{
                        console.log("Data contact Tidak Kosong") 
                        this.setState({ 
                            detailContact : data.Data,
                        })
                        console.log(this.state.activeSuplierName)   
                    }
                        
                });
    }

    getTarikPO(sup_code){
 
        {
            const option = {
                method  : "GET",
                json    : true,
                headers : {
                        "Content-Type" : "application/json;charset=UTF-8",
                        "Authorization":"Token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIyMDIwMDEzMDAyMzMwOCIsInVpZCI6MSwidW5tIjoiYWRtaW4ifQ.ILPmI4Q1U7U-3syIv_sjDdJmeIXn-kSnpn2J5tfYMzwPiAl--vCRV_qdCmBf49L3QrBFAcq3hmZaMWZOr-4rHQ"
                        },
                
                }
                fetch(`http://10.0.111.34:2222/po?type=searchPObySup&sup=${sup_code}`,option)
                .then(response => response.json())
                .then(data =>{ 
                        if(data.data === null)  {
                            console.log("Data PO Detail Kosong")             
                            this.setState({
                                resultPOHeaderTarik : [],
                                resultPODetailTarik : []
                            })
                        }
                        else{
                            this.setState({     
                                resultPODetailTarik  : data.data[0].PO[0].T_PODetail,
                                resultStatusPO       : data.data[0].PO[0].T_PODetail.POD_POStatus,
                                sup_code            : sup_code,
                            },() =>console.log('resultStatusPO ' + this.state.resultStatusPO))     
                        }            
                    });
        }
    }


    // getStatusPO(){
    //     const option = {
    //         method  : "GET",
    //         json    : true,
    //         headers : {
    //                 "Content-Type": "application/json;charset=UTF-8",        
    //                 },
    //         }
    //         fetch(`http://10.0.111.34:2222/po?type=searchFlagbyStatus&status=${}`,option)
    //         .then(response => response.json())
    //         .then(data =>{ 
    //                 if(data.data === null)  {
    //                     console.log("Data PO Kosong")             
    //                     this.setState({
    //                         resultPOHeader : [],
    //                         resultPODetail : [] 
    //                     })
    //                 }
    //                 else{
    //                     console.log("Data PO Header Tidak Kosong") 
    //                     this.setState({ 
    //                         resultPOHeader  : data.data,
    //                         resultTglPO     : data.data[0].T_POHeader.POH_TglPO,
    //                         resultTipePO    : data.data[0].T_POHeader.POH_TipePO, 
    //                         resultRecv      : data.data[0].T_POHeader.POH_SendToWareHouse
    //                     });          
    //                    }                             
    //             });
        
    // }

    getAlasanPO(){
        {
            const option = {
                method  : "GET",
                json    : true,
                headers : {
                        "Content-Type": "application/json;charset=UTF-8",
                        },
                
                }
                fetch(`http://10.0.111.34:2222/po?type=statuspo`,option)
                .then(response => response.json())
                .then(data =>{ 
                        if(data.data === null)  {
                            console.log("Data Alasan PO Kosong")             
                            this.setState({
                                resultAlasanPO : []
                            })
                        }
                        else{
                            console.log("Data Alasan PO Tidak Kosong") 
                            this.setState({ 
                                resultAlasanPO  : data.data,
                            },()=> console.log(this.state.resultAlasanPO + ' resultAlasanPO'))                  
                        }            
                    });
        }
    }

    updateTanggalPO =  (sup_code) => {
        console.log(sup_code + ' sup_code update tanggal PO :)' )
        console.log('OK when updateTanggal PO ')
        console.log(this.state.perpanjangPO + ' this.state.perpanjangPO')
        console.log(JSON.stringify(this.state.listPO) + ' this.state.listPO')
        var url = `http://10.0.111.34:2222/po?type=updatetglPO`;
      console.log(JSON.stringify(ArraylistPO) + ' arrayListPO')
        var updateTanggalPO = [];
        this.state.listPO.map(po => {
            const PO = {
                POD_Group     : po.POD_Group,
                POD_NoPO      : (po.POD_NoPO).substr(1,9),
                POD_Procod    : po.POD_Procod,
                POD_POStatus  : this.state.alasanstatusperpanjangPO,
                POD_TglReorder: this.state.perpanjangPO
            }
            updateTanggalPO.push(PO);
        })
       console.log(JSON.stringify(updateTanggalPO) + ' updateTanggalPO')
         fetch(url, {
            method: 'PUT',
            body: JSON.stringify(updateTanggalPO),
            json: true,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            }
          })
    
          .then(response => {
            if (response.ok) {
              this.setState({
                alasanperpanjangPO  : '',
                isLoading           : false,
                modal_perpanjangPO  : false
              },()=> this.getTarikPO(sup_code));
              return response.json();
            }
          });
     
    
    }

    updateSelectionSearch(evt){
        this.setState({
            [evt.target.name]      : evt.target.value,
            selectedDropdownSearch : evt.target.value
        });

        if(evt.target.value==="NoSup")
        {
            this.setState({
                searchType:"Code"
            })   
        }

        else if(evt.target.value==="NamaSup")
        {
            this.setState({
                searchType:"Name"
            }) 
        }
    }

    clickFind(){
        // this.getPOOutstanding();
        this.setState({
            modal_find:true,
            searchSupplierbyNo:''
        });
    }

    
    clickPerpanjangPO(){
        console.log(this.state.perpanjangPO)
        var sup_code = this.state.sup_code
        this.setState({
            modal_perpanjangPO  : true,
            sup_code           : sup_code
        },()=> console.log(sup_code + ' sup_code'));
    }


    changeDatePerpanjangPO(evt){
        console.log('changeDatePerpanjang ' + this.state.resultTipePO)
            maxTanggalPO.setDate(maxTanggalPO.getDate() + 30);
            var maxTanggalPO       = new Date(this.state.resultTglPO);
            const datePerpanjangPO = new Date(evt.target.value);
              
            const datePO                 = new Date(this.state.resultTglPO);
            var datePerpanjangPO_sesudah = datePerpanjangPO.toISOString().substr(0, 10);
            var dateTanggalPO_sebelum    = datePO.toISOString().substr(0, 10);
         
            var maxTanggalPO_30hari = maxTanggalPO.toISOString().substr(0, 10);
            var tipePO = this.state.resultTipePO
            console.log('sebelum '+ this.state.datePerpanjangPO_sesudah)
            console.log('sesudah '+ this.state.dateTanggalPO_sebelum)
        try {
      
            if(dateTanggalPO_sebelum < datePerpanjangPO_sesudah){
                this.setState({
                    perpanjangPO:datePerpanjangPO_sesudah,
                    dateperpanjangPO_invalid:false,
                    datePerpanjangPO_valid:true,
                    datePerpanjangPO_disabled_OK_button:false
                })
            }
            else{
                this.setState({
                    perpanjangPO:datePerpanjangPO_sesudah,
                    dateperpanjangPO_invalid:true,
                    datePerpanjangPO_disabled_OK_button :true
            })

            if(tipePO === 5){
                if(datePerpanjangPO_sesudah < maxTanggalPO_30hari ){
                    this.setState({
                        perpanjangPO:datePerpanjangPO_sesudah,
                        dateperpanjangPO_invalid:false,
                        datePerpanjangPO_valid:true,
                        datePerpanjangPO_disabled_OK_button :false
                    })
            }
                else{
                    this.setState({
                        perpanjangPO:datePerpanjangPO_sesudah,
                        dateperpanjangPO_invalid:true,
                        datePerpanjangPO_disabled_OK_button :true,
                    })
                }
            }
            }
        } catch (error) {
            this.setState({
                perpanjangPO:datePerpanjangPO_sesudah,
                dateperpanjangPO_invalid:true,
                datePerpanjangPO_disabled_OK_button :true
            })
        }
    }


    changeInputSupplier(evt){
     this.setState({
        searchSupplierbyNo:evt.target.value
     })
    }
    handleCheckboxClick(event, noPO, index,resultTglPO) {

        const checked = event.target.checked;
        var checkedPO = this.state.checkedPO;
        if (checked === true) {
            console.log(resultTglPO + ' resultTglPO')
            console.log(JSON.stringify(noPO) + ' brand')
          ArraylistPO.push(noPO);
          checkedPO[index] = true;
          this.setState({
            checkedPO: checkedPO,
            isLoadingFind: false,
          });

        } else {
            ArraylistPO.splice(ArraylistPO.indexOf(noPO), 1);
          checkedPO[index] = false;
          this.setState({
            checkedPO: checkedPO,
            isLoadingFind: false,
          });
        }
      }

    checkedSelectAll() {
        var checkedPO = this.state.checkedPO;
        ArraylistPO   = [];
        this.state.resultPODetailTarik.map((noPO, index) => {
            ArraylistPO.push(noPO);
            checkedPO[index] = true;
        });
        this.setState(
          {
            checkedPO    : checkedPO,
            isLoadingFind: false,
          });
      }


    checkedUnselectAll() {
        var checkedPO = this.state.checkedPO;
        ArraylistPO   = [];
        this.state.resultPODetailTarik.map((noPO, index) => {
            checkedPO[index]  = false;
        });
        this.setState(
          {
            checkedPO    : checkedPO,
          });
      }
      
    clickSupplier(sup_code,POH_Group,sup_name){
        this.setState({
            disableTarikPOButton    : false,
            disableCancelButton     : false,
            disableFindButton       : true,
            POH_Group               : POH_Group,
            sup_code               : sup_code,
            modal_find              : false,
            sup_name                : sup_name,
        },()=> this.getContact(POH_Group,sup_code));
    }

    clickTarikPO(sup_code){
        console.log(sup_code + ' sup_code TARIK PO')
        console.log(this.state.resultTipePO + ' sup_code TARIK PO')
        console.log(this.state.resultTglPO + ' sup_code TARIK PO')
        this.setState({
            resultTglPO             : this.state.resultTglPO,
            resultTipePO            : this.state.resultTipePO,
            disableModifyButton     : false,
            sup_code               : sup_code
        },()=> this.getTarikPO(sup_code));
    }

    clickHoldPO(){
        this.setState({



        })
    }

    clickModify(){
        this.setState({
            disablecheckbox : false,
            disableSelectAll: false,
            disablePerpanjangButton : false,
        })
    }

    clickCancel(){
        window.location.reload()
        this.setState({
            disableTarikPOButton    : true,
            disableFindButton       : false,
            disablePrintButton      : true,
            disableNewPOButton      : true,
            disableModifyButton     : true,
            disableCancelButton     : true,
            disableExitButton       : true,
            disableConvertButton    : true,
            disablePerpanjangButton : true,
        })
    }

    clickPerpanjangPO = async () => {
        var currListProduct = this.state.listPO;
        var resultTglPOCheckbox = this.state.resultTglPO;
        console.log(this.state.resultTglPO  +' this.state.resultTglPO')
        
        this.setState({
            listPO      : currListProduct.concat(ArraylistPO),
            modal_alasan:true
      },()=>this.getAlasanPO())
    }
    
    clickSearchSupplier = async () => {
        var searchSupplierbyNo = this.state.searchSupplierbyNo
        this.setState({
            searchSupplierbyNo:searchSupplierbyNo
      },()=>this.getSupplier())
    }
    
    handlePerpanjangPO = (event) => {
        this.setState({
            alasanperpanjangPO          : event.target.value,
            alasanstatusperpanjangPO    : event.target.id
        },()=>console.log(this.state.alasanstatusperpanjangPO))
    }


    // updatePOD_POStatus = (evt, type) => {
    //     if(type === "inputPOD_POStatus"){
    //         this.setState({
    //             inputtedPOD_POStatus : evt.target.value            
    //         })
    //     }
    //     if(type === "inputPOD_tglreorder"){
    //         this.setState({
    //             inputtedPOD_tglreorder : evt.target.value
    //         })
    //     }
    // }

    updateEditValue=(evt, type)=>{
        this.setState({
          ['edit'+type] : evt.target.value
        })
      }
    
      editUser(){
        var url     = "http://10.0.112.9:8888/updateUser?Update=sql&NIP=";
        var payload = {
            user_id : 1,
            POD_POStatus : this.state.editPOStatus, 
            POD_TglReorder : this.state.editTglreorder
        }
    
        console.log(payload)
    
        fetch(url, {
            method : "PUT",
            body   : JSON.stringify(payload),
            json   : true,
            headers:{
                     "Content-type": "application/json; charset=UTF-8"
                    }
            })
            .then(response => response.json())
            .then(result => {
              if(result.error.status === false)  {
                console.log("data berhasil diedit")
                  this.setState({
                    // modalEdit : true
                    modalUpdate : false
                  })
                  this.getUsers()
              }
              else{  
                  console.log("data gagal diedit") 
              }
            });
          }
    

    render(){
        const arraylistFlagStatus = ['','','','R','H','','C','','','','C']
        return(
            <Page
            title       = "Outstanding"
            className   = "Outstanding">
             
             <Modal
                isOpen={this.state.modal_alasan}
                size = "lg">
                    <ModalHeader>
                        ALASAN
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Input style= {{width:"720px"}}value={this.state.alasanperpanjangPO}></Input>
                            <UncontrolledButtonDropdown
                                style={{
                                    marginRight: "1.5vw"
                                }}>
                                <DropdownToggle caret name = "filtermenu" variant = "secondary"></DropdownToggle>    
                                <DropdownMenu
                        
                        
                         className ="ml-3 "
                                    style={{width :"650px"}}
                                    >
                                        {this.state.resultAlasanPO.map(alasan =>
                                        <tr>
                                            <td>
                                                <DropdownItem value = {alasan.StsPO_Keterangan} id ={alasan.StsPO_Status} onClick = {(e) => this.handlePerpanjangPO(e)}>{alasan.StsPO_Keterangan}</DropdownItem>
                                            </td>
                                         </tr>
                                        )}
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="secondary"
                            onClick = {
                                this.state.alasanstatusperpanjangPO  == "C"?
                                ()=>this.setState({
                                modal_alasan       : false,
                                })
                                :
                                ()=>this.setState({
                                modal_alasan       : false,
                                modal_perpanjangPO : true
                                })}>
                                OK
                        </Button>
                        <Button variant="secondary"
                            onClick = {()=>this.setState({modal_alasan : false})}>
                                Cancel
                        </Button>
                    </ModalFooter>
             </Modal>

             <Modal
                isOpen={this.state.modal_perpanjangPO}
                size = "lg">
                    <ModalHeader>
                        Perpanjang PO
                    </ModalHeader>
                    <ModalBody>
                        <Input 
                        onChange   = {evt => this.changeDatePerpanjangPO(evt)}
                        valid = {this.state.datePerpanjangPO_valid}
                        invalid = {this.state.dateperpanjangPO_invalid}
                        value = {this.state.perpanjangPO}
                        type="date"></Input>
                    </ModalBody>
                    <ModalFooter>
                    <Button variant="secondary"
                    disabled = {this.state.datePerpanjangPO_disabled_OK_button}
                            onClick = {()=>this.updateTanggalPO(this.state.sup_code)}>
                                OK
                        </Button>
                        <Button variant="secondary"
                            onClick = {()=>this.setState({modal_perpanjangPO : false})}>
                                Cancel
                        </Button>
                    </ModalFooter>
             </Modal>

             <Modal
                    isOpen={this.state.modal_find}
                    size = "lg"
                >
                    <ModalHeader>
                        SUPPLIER
                    </ModalHeader>
                    <ModalBody>
                        <form>
                                <Row>
                                    <Col>
                                        <Label>
                                                Find in List
                                        </Label> 
                                    </Col>
                                        
                                    <Col>
                                        <UncontrolledButtonDropdown
                                            style={{
                                                 marginRight: "1.5vw"
                                            }}
                                            >
                                        <DropdownToggle caret name = "filtermenu" variant = "secondary">
                                            {this.state.selectedDropdownSearch}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem value = "NoSup" onClick = {evt => this.updateSelectionSearch(evt)}>No Supplier</DropdownItem>
                                             <DropdownItem value = "NamaSup" onClick = {evt => this.updateSelectionSearch(evt)}>Nama Supplier</DropdownItem>
                                        </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                    </Col>
                                    <Col>
                                        <Input
                                            id          = "inputSearch"
                                            type        = "search"
                                            placeholder = "Search..."
                                            value       = {this.state.searchSupplierbyNo}
                                            onChange    = {evt => this.changeInputSupplier(evt)}
                                            style={{
                                                display: this.state.displayStatus
                                            }}/>    
                                     </Col>
                                     <Col>
                                        <Button variant="secondary"
                                        onClick ={()=> this.clickSearchSupplier()}
                                        >Search</Button>
                                    </Col>
                                </Row>

                            <Row>
                                <Table responsive
                                hover
                                >
                                    <thead>
                                        <th>NOSUP</th>
                                        <th>NAMA SUPPLIER</th>
                                        <th>KOTA</th>
                                    </thead>

                                    <tbody>
                                    {this.state.resultPOHeader.map(header =>
                                         <tr
                                         onClick = {()=> this.clickSupplier(
                                             header.sup_code,
                                             header.POH_Group,
                                             header.sup_name,
                                             )}
                                         >
                                            <td>{header.sup_code}</td>
                                            <td>{header.sup_name}</td>
                                            <td>{header.sup_citycode}</td>
                                         </tr>
                                    )}
                                       
                                    </tbody>
                                </Table>
                            </Row>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="secondary"
                        onClick = {()=>this.setState({modal_find : false})}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Row className ={"ml-2"}>
                    <Col xs={1}>
                        <Label>SUPPLIER</Label>
                    </Col>
                    <Col xs={1}>
                        <Input type="   text" value={this.state.sup_code} disabled></Input>
                    </Col>
                    <Col xs={5}>
                        <Input type="text" value={this.state.sup_name} disabled></Input>
                    </Col>
                </Row>


                <Row className ={"ml-2"}>
                    <Col xs={1}>
                        <Label>CONTACT</Label>
                    </Col>
                    <Col xs={6}>
                        <Card outline color = 'primary' >

                            <Table responsive>
                            <thead>
                                <th>TYPE</th>
                                <th>AREA</th>
                                <th>NO CONTACT</th>
                                <th>CONTACT PERSON</th>

                            </thead>
                            <tbody>

                            {this.state.detailContact.map(contact =>
                                <tr>
                                 <td>{contact.ConSup_Type}</td>
                                 <td>{contact.ConSup_AreaCode}</td>
                                 <td>{contact.ConSup_Number}</td>
                                 <td>{contact.ConSup_Name}</td>
                                </tr>
                                )}
                            </tbody>
                            </Table>
                        </Card>
                    </Col>
                   
                </Row>

                <Col className ={"mt-3"}>    
                    <Table
                    hover
                    style={{
                        marginTop: "15px"
                    }} 
                    responsive
                    >

                        <thead>
                            <tr width = "100%">
                            <th>NO PO</th>
                            <th>TGL PO</th>
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
                            <ButtonGroup>
                            <Button
                        disabled = {this.state.disableSelectAll} 
                        size="sm" onClick={() => this.checkedSelectAll()}>
                            Select All
                        </Button>
                        <Button
                         disabled = {this.state.disableSelectAll} 
                         size="sm" onClick={() => this.checkedUnselectAll()}>
                             Unselect All
                        
                        </Button>

                            </ButtonGroup>
                       
                            {this.state.resultPODetailTarik.map((detailtarik,index) => 
                            <tr>
                                <td>
                                    <Col>
                                        <Input 
                                          disabled = {this.state.disablecheckbox} 
                                          checked={this.state.checkedPO[index]}
                                          value={this.state.checkedBrand}
                                          onClick={event =>
                                            this.handleCheckboxClick(event, detailtarik, index,this.state.resultTglPO)
                                          }
                                        type = "checkbox">
                                        </Input>

                                    </Col>
                                    <Col className = 'ml-1'>
                                    {detailtarik.POD_NoPO}
                                    </Col>

                                </td>
                                <td>{this.state.resultTglPO}</td>
                                <td>{this.state.resultTipePO}</td>
                                <td>{detailtarik.POD_Procod}</td>
                                <td>{detailtarik.POD_Name}</td>
                                <td>{detailtarik.POD_Qty}</td>
                                <td>{detailtarik.POD_POStatus}</td>
                                <td>{arraylistFlagStatus[detailtarik.POD_POStatus]}</td>
                                <td>{detailtarik.POD_TglReorder}</td>
                                <td>{this.state.resultRecv}</td>
                                <td>Bonus</td>
                                <td>Desc Bonus</td>
                                <td>Qty</td>
                                <td>Tgl Order</td>
                            </tr>
                            )}
                        </tbody>

                    </Table>
                               
                </Col>
                
                <Row >
                    <Col className ={"mt-3"}>
                        <Row className ={"justify-content-center"}>
                            <ButtonGroup  size="sm">
                                <Button 
                                disabled = {this.state.disableTarikPOButton}
                                style={{width : "75px"}} variant="secondary"
                                   onClick = {()=>this.clickTarikPO(this.state.sup_code)}
                                    >Tarik PO</Button>
                                <Button
                                disabled = {this.state.disableFindButton} 
                                style={{width : "75px"}} variant="secondary"
                                   onClick= {()=>this.clickFind()}>
                                    Find
                                </Button>
                                <Button 
                                disabled = {this.state.disablePrintButton}
                                style={{width : "75px"}} variant="secondary">Print</Button>
                                <Button 
                                disabled = {this.state.disableNewPOButton}
                                style={{width : "75px"}} variant="secondary">New PO</Button>
                            </ButtonGroup>
                        </Row>
                        <Row className ={"justify-content-center"}>
                            <ButtonGroup size="sm">
                                <Button 
                                disabled = {this.state.disableModifyButton}
                                style={{width : "75px"}} variant="secondary"
                                onClick = {()=> this.clickModify()}>
                                    Modify</Button>
                                <Button 
                                disabled = {this.state.disableCancelButton}
                                onClick = {()=>this.clickCancel()}
                                style={{width : "75px"}} variant="secondary">Cancel</Button>
                                <Button 
                                disabled = {this.state.disableExitButton}
                                style={{width : "75px"}} variant="secondary">Exit</Button>
                            </ButtonGroup>
                        </Row>
                        
                    </Col>
                </Row>

                <Row >
                    <Col>
                        <Row className ={"justify-content-center"}>
                            <ButtonGroup size="sm">
                                <Button 
                                    disabled = {this.state.disableConvertButton}
                                    size = "sm" 
                                    variant="secondary" style = {{display: "inline-flex", alignItems: "center"}}>
                                    Convert to Excel
                                </Button> 
                                <Button 
                                    disabled = {this.state.disablePerpanjangButton}
                                    size = "sm" 
                                    variant="secondary" style = {{display: "inline-flex", alignItems: "center"}}
                                    onClick = {()=>this.clickPerpanjangPO()}>
                                    Perpanjang PO
                                </Button> 
                            </ButtonGroup>
                        </Row>
                    </Col>
                </Row>
            </Page>
        )
    }
}
export default Purchase_Order_OutStanding;