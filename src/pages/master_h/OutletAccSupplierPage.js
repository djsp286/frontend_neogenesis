import Page                             from 'components/Page';
import React                            from 'react';
import Typography                       from 'components/Typography';
import { MdSearch, MdLoyalty, MdDelete} from 'react-icons/md';
import NotificationSystem               from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE }    from 'utils/constants';
import 
{
    Button, 
    Card, 
    CardBody, 
    CardHeader, 
    Col, 
    Row, 
    Table, 
    Modal, 
    ListGroup, 
    ListGroupItem,
    ModalBody, 
    ModalFooter, 
    ModalHeader, 
    Input, 
    Label,
    InputGroup,
    InputGroupAddon,
    Form,
    Alert
} 
from 'reactstrap';

const hostUrl = 'https://api.docnet.id/CHCMasterH/MasterOutlet'

class OutletAccSupplierPage extends React.Component {
    //special method
    constructor(props) 
    {
        super(props);
        this.state = {
            result              : [],
            suppliers           : [],
            searchOutletList    : [],

            isLoading           : false,
            flagisi             : true,
            flagaddbtn          : true,
            flagsavebtn         : true,
            flagcancelbtn       : true,

            inputtedName        : "",
            supplierName        : "",
            supplierAddress1    : "",
            supp_id             : "",
            outletSearchFeedback: ""
        };
        
        this.outletSearchInputRef = React.createRef();
    }

// -----------------------------------------------  SHOW ALL DATA --------------------------------------------------------- 

    enableField=()=>
    {
        if(this.state.flagisi === true)
        {
            var url = hostUrl+`/TampilSupplierFinance`
            fetch(url)
            .then(response => {
                return response.json();
            })
            .then(data => {
                let suppApi = data.map(suppdata => 
                    { return {
                        value   : suppdata.sup_id, 
                        display : "[" + suppdata.sup_id + "] " + suppdata.sup_nama
                    } })
                this.setState({ suppliers: [{value: '', display: '- Pilih Supplier -'}].concat(suppApi)});
            });
        }

        var currFlagisi= this.state.flagisi;
        this.setState({
            flagisi :!currFlagisi,
        })

        var currFlagSave = this.state.flagsavebtn;
        this.setState({
            flagsavebtn : !currFlagSave,
        })

        var currFlagCancel = this.state.flagcancelbtn;
        this.setState({
            flagcancelbtn : !currFlagCancel,
        })

        var currFlagAdd = this.state.flagaddbtn;
        this.setState({
            flagaddbtn : !currFlagAdd,
        })
    }

    enableFieldCondition=()=>
    {
        var url = hostUrl+`/TampilSupplierFinance`
        fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            let suppApi = data.map(suppdata => 
                { return {
                    value   : suppdata.sup_id, 
                    display : "[" + suppdata.sup_id + "] " + suppdata.sup_nama
                } })
            this.setState({ suppliers: [{value: '', display: '- Pilih Supplier -'}].concat(suppApi)});
        });

        var currFlagisi= this.state.flagisi;
        this.setState({
            flagisi                 : !currFlagisi,
            modal_supplierNotFound  : false,
            flagsavebtn             : false,
            flagcancelbtn           : false
        })
    }

    updateInputValueSearchOutlet= (evt) => {
        console.log(evt.target)
        this.setState({
            outletSearch: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase()
        });
    }

    updateInputValueSupplier= (evt) => {    
        this.setState({
            supp_id: evt.target.value
        },this.getSupplierData(evt.target.value));
    }

    getSupplierData = (param) =>{
        var url     = hostUrl+`/TampilDataSupplierFinance/${param}`;
        fetch(url).then(response   => response.json())
        .then(data =>{ 
        this.setState({ supplierName: data.sup_nama, supplierAddress1: data.sup_alamat1, supplierAddress2: data.sup_alamat2});
        });
    }

    cancelButton()
    {
        this.searchInputValue(this.state.inputtedName);
        this.enableField();
        this.setState(
            {
                modal_nested : false,
                supp_id : "",
                supplierName : "",
                supplierAddress1 : "",
                supplierAddress2 : ""
            }
        )
    }

    cancelCariOutlet()
    {
        this.setState(
            {
                outletSearch        : "",
                searchOutletList    : [],
                modal_outletSearch  : false
            }
        )
    }

    refreshPage(){ 
        window.location.reload(); 
    }

// -----------------------------------------------  INSERT --------------------------------------------------------- 
    
    addSupplierOutlet = (out_code,param) => async () =>
    {
        var url     = hostUrl+`/TambahSupplierOutlet/${out_code}`;

        var payload = {
            supout_supplierid   : param,
            supout_userid       : "0"
        };

        console.log(JSON.stringify(payload));
        let data = await fetch(url,{
            method : 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            json: true,
            body: JSON.stringify(payload)
        })

        .then(response => {
            if (response.ok) {
                this.state.jumlahJenisCamera    = "";
                this.isLoading                  = false;
                this.componentDidMount();
                return response.json();
            }
        })

        if(data){
            this.setState(
                {
                    modal_nested : false,
                    supp_id : "",
                    supplierName : "",
                    supplierAddress1 : "",
                    supplierAddress2 : ""
                }
            )
            this.isLoading = true;
            this.showNotification("Data Berhasil Disimpan");
            this.searchInputValue(this.state.inputtedName);
            this.enableField();
        }
        else{
            alert("Data Sudah Pernah Ada");
        }
    }

    //fungsi notification
    showNotification= (currMessage)=>{
        setTimeout(() => {
            if (!this.notificationSystem) {
              return;
            }
            this.notificationSystem.addNotification({
              title: <MdLoyalty/>,
              message:
                currMessage,
              level: 'info',
            });
        }, 100);
    }
    

//fungsi untuk mengambil semua data dimana memanggil current page dan perpage
    componentDidMount() {
       
    }

//state awal pada saat membuka suatu page tsb nanti dicari langsung di render() 
    state = {
        modal                   : false,
        modal_backdrop          : false,
        modal_nested_parent     : false,
        modal_nested            : false,
        modal_delete            : false,
        modal_update            : false,
        modal_outletNotFound    : false,
        modal_supplierNotFound  : false,
        backdrop                : true
    };

//fungsi untuk membuka suatu toggle di page tsb
    toggle = modalType => () => {

        if (!modalType) {
 
            return this.setState({
                modal: !this.state.modal,
                
            });
        }
        
//pembuatan setState disemua function, dimana hanya memanggil nama nya saja ex modal_delete , maka di render hanya panggil delete saja 
        this.setState({
            [`modal_${modalType}`]: !this.state [`modal_${modalType}`]
        });
    };

    addNotNull =()=>
    {
        if(this.state.supp_id === '')
        {   
            alert('Harus Pilih Supplier');
        }
        else{
            this.setState({
                modal_nested:true

            })
        }
    }

// --------------------------------------------------------- SEARCH --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

//mengambil parameter yang telah diinput di inputtedName . lalu dilempar ke Backend
searchInputValue = (outcode)  =>{
    
    var url = hostUrl+`/TampilSupplierOutlet/${outcode}`
    fetch(url)
        
    .then(response   => response.json())
    .then(data =>{ 
        this.setState({ result: data, isLoading: false });
        
        // KALAU OUTLETNYA TIDAK ADA
        if(data[0] && data[0].outlet_exists === false ){
            
            this.setState({
                // modal_outletNotFound : true
            });
        }
        
        // KALAU OUTLET ADA, TAPI DATA PAJAK TIDAK ADA
        else if(data[0] && data[0].supplier_exists === false ){
            this.setState({
                modal_supplierNotFound : true,
                flagaddbtn : true
            });
        }

        // KALAU OUTLET ADA DAN DATA PAJAK ADA
        else{
            this.setState({
                flagaddbtn : false
            });
        }  
    })

        this.setState({
            isLoading           : true,
            modal_outletSearch  : false,
            outletSearch        : "",
            searchOutletList    : [],
            inputtedName        : outcode
        });
    }

    getsearchOutletList = (input) => {

        if(input.length === 0) {
            console.log('CariOutletList: ERROR: Must be filled');
            this.setState({
                outletSearchFeedback: 'Tidak Boleh Kosong'
            });
            return;
        }

        this.setState({
            isLoading: true
        })
    
        var url = hostUrl+`/CariDataOutletTanpaKota/${input}`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    outletSearchFeedback    : data.length > 0 ? '' : 'Tidak Ada Outlet Dengan Kode atau Nama Tersebut',
                    searchOutletList        : data,
                    isLoading               : false
                }, () => console.log('searchOutletList: Data: ' + JSON.stringify(data)))
            })
    }

    toggleOutletSearchModal = () => {
        const isOpen = this.state.modal_outletSearch;
        this.setState({
            outletSearch            : '',
            outletSearchFeedback    : '',
            searchOutletList        : [],
            modal_outletSearch      : !isOpen
        }, () => {if(!isOpen) this.outletSearchInputRef.current.focus()});
    }

//function untuk melakukan search pada saat menekan enter
enterPressed = (event) =>{
    var code = event.keyCode || event.which;
    if(code === 13) 
    { 
        event.preventDefault();
        this.getsearchOutletList(this.state.outletSearch);
    } 
}


//ketika melakukan search, state input-an yang masuk harus uppercase dan tidak boleh special character
setSearchInputState = (evt) => {
    this.setState({
        inputtedName: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase()
    })
}


//--------------------------------------------------------- DELETE --------------------------------------------------------- 

// 1.Pelemparan parameter ke Backend dimana data apa saja yang akan di hapus
deleteSupplierOutlet = () => async ()=>{
    var url = hostUrl+`/HapusDataSupplier/${this.state.activeID}`;

    var payload = { 
        user_id : "0"
    };

    let data = await fetch(url,{
        method : 'PUT',
        body   : JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
})

//2.Ketika sudah terespond oleh backend , maka frontend akan melakukan hal ini
        .then(response => {

            if (response.ok) {
                this.state.modal_delete = false;
                this.state.modal_nested = false;
                this.state.backdrop     = false;
                this.componentDidMount();
                return response.json();
            }
        });

        if(data){
            this.setState(
                {
                    modal_delete : false
                }
            )
            this.isLoading = true;
            this.showNotification("Data Berhasil Dihapus");
            this.searchInputValue(this.state.inputtedName);
        }
}

// set awal pada saat membuka delete
    openModalWithItemID(idSupplier){
        this.setState({
            modal_delete    : true,
            activeID        : idSupplier
        })
    }

//--------------------------------------------------------- DESAIN HALAMAN --------------------------------------------------------- 

//render biasa nya di-isi untuk desain HTML
    render() {
        const { result, isLoading } = this.state;
       
        return (
            
            
            <Page
                title       = "Outlet Data Supplier"
                breadcrumbs = {[{ name: 'DataSupplier', active: true }]}
                className   = "Data Supplier Page"

            >
           


                    <Modal
                        isOpen      = {this.state.modal_outletNotFound}
                        toggle      = {this.toggle('outletNotFound')}
                        className   = {this.props.className}
                       >
                         
                        <Row>
                        <Col>
                          <Card>
                            <CardHeader >
                            <Alert color="success">
                                <Typography 
                                type="h4"
                                className="alert-heading">
                                Outlet Tidak Ditemukan !
                                </Typography>
                                
                              </Alert>
                            </CardHeader>

                            <CardBody>
                             <Label 
                             >
                             Ingin Membuat Outlet ?
                             </Label>
                              
                            </CardBody>
                           
                          </Card>
                          
                        </Col>
                      </Row>

                      <ModalFooter>
                      
                      <Button 
                      color = "primary" 
                      href = {'./Outlet'} 
                     
                      >
                     {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                         Ya
                     </Button>{' '}

                                    <Button color = "secondary" onClick = {this.toggle('outletNotFound')} >
                                    Batal
                                </Button>
                      </ModalFooter>
                    </Modal>

{/* ---------------------------------------- MODAL CARI OUTLET --------------------------------------------- */}
                    
                    <Modal
                        isOpen      = {this.state.modal_outletSearch}
                        toggle      = {this.toggle('outletSearch')}
                        className   = 'modal-dialog-scrollable modal-dialog-centered'
                        size        = 'lg'
                        backdrop    = 'static'>
                            <ModalHeader>Search Outlet</ModalHeader>
                                <ModalBody>
                                    <InputGroup>
                                        <Input 
                                            innerRef    = {this.outletSearchInputRef}
                                            name        = 'outletSearchInput'
                                            placeholder = 'Cari OutletID atau OutletName'
                                            value       = {this.state.outletSearch}
                                            disabled    = {this.state.isLoading}
                                            onKeyPress  = {event => this.enterPressed(event)}
                                            onChange    = {this.updateInputValueSearchOutlet}/>
                                            {!isLoading && <i className = "fa fa-refresh fa-spin"></i>}

                                        <InputGroupAddon addonType  = 'append'>
                                            <Button 
                                                disabled    = {this.state.buttonAddDisabled || this.state.isLoading} 
                                                onClick     = {() => this.getsearchOutletList(this.state.outletSearch)}>
                                                {!isLoading && <i className = "fa fa-refresh fa-spin"></i>}
                                            <MdSearch/>
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>

                                    <Label 
                                        style       = {{ color: 'red' }} 
                                        className   = 'px-2 py-1'>
                                        {this.state.outletSearchFeedback}
                                    </Label>

                                        <ListGroup className    = 'mt-3'>
                                            <ListGroupItem 
                                                className   = {(this.state.searchOutletList.length > 0 ? '' : 'd-none')}
                                            >
                                            <p class='text-center font-weight-bold'>Pilih Salah Satu</p>
                                            </ListGroupItem>
                                            {this.state.searchOutletList.map((outlist) =>
                                            
                                            <ListGroupItem
                                                tag     ='button'
                                                action
                                                name    = {outlist.out_code}
                                                value   = {outlist.out_name}
                                                onClick = {() => this.searchInputValue(outlist.out_code)}
                                            >
                                                {outlist.out_code + ' - ' + outlist.out_name}
                                            </ListGroupItem>
                                            )}
                                        </ListGroup>
                                </ModalBody>

                                <ModalFooter>
                                    <Button 
                                        style       = {{background: '#FF0000', borderStyle: 'none', justifyContent:'center',alignItems:'center'}}
                                        disabled    = {this.state.isLoading} 
                                        onClick     = {()=>this.cancelCariOutlet()}
                                        >
                                        Cancel
                                    </Button>
                                </ModalFooter>
                    </Modal>

{/* ---------------------------------------- MODAL DATA SUPPLIER NOT FOUND --------------------------------------------- */}

                    <Modal
                        isOpen      = {this.state.modal_supplierNotFound}
                        toggle      = {this.toggle('supplierNotFound')}
                        className   = {this.props.className}
                        backdrop    = "static"
                        keyboard    = "false">
                          <ModalHeader>
                                    <Label>
                                        Outlet Tidak Mempunyai Data Supplier !
                                     </Label>
                          </ModalHeader>
                                    <ModalBody> 
                                    <Label>
                                    Ingin Membuat Data Supplier ?
                                     </Label>
                                    </ModalBody>
                                <ModalFooter>
                                <Button 
                                    color   = "primary" 
                                    onClick = {this.enableFieldCondition}>
                                    Ya 
                                </Button>

                                <Button 
                                    color   = "primary" 
                                    onClick = {()=>this.refreshPage()}>
                                    Tidak 
                                </Button>     
                                </ModalFooter>
                    </Modal>

{/* // -------------------------------------------------- MODAL DELETE DATA CAMERA ------------------------------------------- // */}
                     <Modal
                        isOpen      = {this.state.modal_delete}
                        toggle      = {this.toggle('delete')}
                        className   = {this.props.className}>
                                <ModalHeader toggle = {this.toggle('delete')}>Konfirmasi Penonaktifan</ModalHeader>
                                    <ModalBody>
                                        Apakah Anda yakin ingin menonaktifkan data ini?
                                    </ModalBody>

                                <ModalFooter>
                                    <Button 
                                        color = "primary"
                                        onClick = {this.deleteSupplierOutlet()}>
                                    {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                                        Ya
                                    </Button>{''}
                                    
                                    <Button color = "primary" onClick = {this.toggle('delete')}>
                                        Tidak
                                    </Button>
                                </ModalFooter>
                    </Modal>

{/* // -------------------------------------------------- TAMPILAN DATA ------------------------------------------- // */}

    <Card className = "mb-3">
        <NotificationSystem
            dismissible = {false}
            ref         = {notificationSystem => (this.notificationSystem = notificationSystem)}
            style       = {NOTIFICATION_SYSTEM_STYLE}
        />
                        <CardBody
                            id  = "selectedAccSupplier">   
                                <Form>
                                    <Row className = "mt-3">
                                        <Label sm={3} md = {2} style={{fontWeight:"bold"}}>
                                        Outlet
                                        </Label>

                                            <Col xs = {4} md = {2}> 
                                                <Input 
                                                    id      = "viewinsertOutletID"
                                                    value   = {this.state.result[0] && this.state.result[0].out_code}
                                                    disabled
                                                >
                                                </Input>
                                            </Col>   

                                            <Col xs = {10} md = {5}>
                                                <Input 
                                                    value   = {this.state.result[0] && this.state.result[0].out_name}
                                                    disabled
                                                >
                                                </Input>
                                            </Col>  

                                            <Col>
                                                <Button 
                                                    id          = "onClickSearch"
                                                    onSubmit    = {e => e.preventDefault()}  
                                                    onClick     = {() => this.toggleOutletSearchModal()}
                                                >
                                                {!isLoading && <i className = "fa fa-refresh fa-spin"></i>}
                                                <MdSearch></MdSearch> 
                                                </Button>
                                            </Col>            
                                    </Row>
                                            
{/* // -------------------------------------------------- TAMPILAN DATA SUPPLIER ------------------------------------------- // */}

                                            <Row className = "mt-3">
                                                <Label sm={3} style={{fontWeight:"bold"}}>
                                                    List Data Supplier
                                                </Label>
                                            </Row>  

                                            <Table bordered = "3">
                                                <thead>
                                                    <tr align ="center">
                                                        <th className = "th-sm">Kode</th>
                                                        <th  class="th-sm" >Nama Supplier</th>
                                                        <th  class="th-sm" >Alamat Supplier 1</th>
                                                        <th  class="th-sm" >Alamat Supplier 2</th>
                                                        <th  class="th-sm" ></th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {result.map(suppl =>
                                                    <tr>
                                                        <td align = "center">{suppl.sup_id}</td>
                                                        <td align = "center">{suppl.sup_nama}</td>
                                                        <td align = "center">{suppl.sup_alamat1}</td>
                                                        <td align = "center">{suppl.sup_alamat2}</td>
                                                        <td align = "center">
                                                            <div>                                                                 
                                                                <Button 
                                                                    style={{background: '#FF0000', borderStyle: 'none', 
                                                                    justifyContent:'center',alignItems:'center'}}
                                                                    size    = "sm" 
                                                                    onClick = {()=>this.openModalWithItemID(suppl.supout_runningid)}
                                                                    ><MdDelete></MdDelete>
                                                                </Button>
                                                            </div> 
                                                        </td>
                                                    </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                            
                                            <Row>    
                                                <Col md = {2}>
                                                    <Button
                                                        id          = "addSupplier" 
                                                        onClick     = {this.enableField}
                                                        disabled    = {this.state.flagaddbtn}
                                                    >ADD</Button>
                                                </Col> 
                                            </Row>

                                            <Row className = "mt-3">
                                                <Label sm={3} style={{fontWeight:"bold"}}>
                                                    Add Supplier
                                                </Label>
                                            </Row>

                                            <Row>
                                                <Col xs = {4} md = {2}>
                                                        <Label>
                                                            Kode Supplier
                                                        </Label>
                                                </Col>   
                                                
                                                <Col xs = {4} md = {3.5}>
                                                      <Input 
                                                            type        = "select"
                                                            id          = 'kodeSupplier'
                                                            disabled    = {this.state.flagisi}
                                                            value       = {this.state.supp_id}
                                                            onChange    = {this.updateInputValueSupplier}
                                                                    >
                                                                        {this.state.suppliers.map((suppdata) => <option key={suppdata.value} value={suppdata.value}>{suppdata.display}</option>)}
                                                      </Input>
                                                </Col>  
                                            </Row>
                                           
                                            <Row>
                                                <Col   xs = {4} md = {2}>
                                                        <Label>
                                                            Nama Supplier
                                                        </Label>
                                                </Col>   
                                                
                                                <Col   xs = {10} md = {8}>
                                                      <Input 
                                                            value = {this.state.supplierName}
                                                            id = 'jenisStocktake'
                                                            disabled
                                                            maxLength   = "4"
                                                                    >
                                                      </Input>
                                                </Col>   
                                            </Row>
                                            
                                            <Row>
                                                <Col   xs = {4} md = {2}>
                                                        <Label>
                                                            Alamat Supplier
                                                        </Label>
                                                </Col>   
                                                
                                                <Col   xs = {10} md = {8}>
                                                    <Input 
                                                        type    = "textarea"
                                                        value   = {this.state.supplierAddress1}
                                                        id      = 'supplierAddress1'
                                                        disabled
                                                        >
                                                    </Input>
                                                </Col>
                                                </Row>

                                                <Row>
                                                    <Col   xs = {4} md = {2}>

                                                    </Col> 

                                                    <Col   xs = {10} md = {8}>
                                                        <Input 
                                                            type    = "text"
                                                            value   = {this.state.supplierAddress2}
                                                            id      = 'supplierAddress2'
                                                            disabled
                                                        >
                                                        </Input>
                                                    </Col>      
                                                </Row>

                                            <Row>    
                                                <Col md = {1}>
                                                    <Button
                                                        id          = "saveSupplier"
                                                        onClick     = {()=>this.addNotNull()}
                                                        disabled    = {this.state.flagsavebtn}
                                                    >SAVE
                                                    </Button>

                                                    <Modal
                                                        isOpen = {this.state.modal_nested}
                                                        toggle = {this.toggle('nested')}>
                                                        <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                                            <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                                                <ModalFooter>
                                                                    <Button 
                                                                        color       = "primary"
                                                                        onClick     = {this.addSupplierOutlet(this.state.inputtedName,this.state.supp_id)}>
                                                                        {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                                                                        Ya
                                                                    </Button>
                                                                    
                                                                    <Button color = "primary" onClick = {this.toggle('nested')}>
                                                                        Tidak 
                                                                    </Button>
                                                                </ModalFooter>
                                                    </Modal>
                                                </Col> 

                                                <Col md = {1}>
                                                    <Button
                                                        id          = "cancelSupplier"
                                                        disabled    = {this.state.flagcancelbtn}
                                                        onClick     = {()=>this.cancelButton()}
                                                    >CANCEL
                                                    </Button>
                                                </Col>
                                            </Row>
                            </Form>
                    </CardBody>                  
                </Card>                        
            </Page>
        );
    }
}
export default OutletAccSupplierPage; 