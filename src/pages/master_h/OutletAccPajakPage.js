import Page                             from 'components/Page';
import React                            from 'react';
import Typography                       from 'components/Typography';
import { MdSearch, MdLoyalty}           from 'react-icons/md';
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

class OutletAccPajakPage extends React.Component {
    //special method
    constructor(props) 
    {
        super(props);
        this.state = {
            result              : [],
            pph23               : [],
            searchOutletList    : [],

            isLoading           : false,
            flagisi             : true,
            flageditbtn         : true,
            flagsavebtn         : true,
            flagcancelbtn       : true,

            inputtedName        : "",
            namaWajibPajak      : "",
            alamatWajibPajak    : "",
            alamatWajibPajakPPH : "",
            kpp                 : "",
            lokasiPajak         : "",
            outletID            : "",
            namaOutlet          : "",
            outletSearchFeedback: ""
        };

        this.outletSearchInputRef = React.createRef();
    }

// ----------------------------------------------- SHOW ALL DATA --------------------------------------------------------- 

    getDataPPH23()
    {
        var url = hostUrl+`/TampilSemuaDataPPH23`
        this.isLoading = true;
        fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => this.setState({ pph23: data})
        );
    }

    enableField=()=>
    {
        var currFlagisi= this.state.flagisi;
        this.setState({
            flagisi : !currFlagisi,
        })

        var currFlagSave = this.state.flagsavebtn;
        this.setState({
            flagsavebtn : !currFlagSave,
        })

        var currFlagCancel = this.state.flagcancelbtn;
        this.setState({
            flagcancelbtn : !currFlagCancel,
        })

        var currFlagEdit = this.state.flageditbtn;
        this.setState({
            flageditbtn : !currFlagEdit,
        })
    }

    enableFieldCondition=()=>
    {
        var currFlagisi= this.state.flagisi;
        this.setState({
            flagisi : !currFlagisi,
            modal_pajakNotFound : false,
            flageditbtn         : true,
            flagsavebtn         : false,
            flagcancelbtn       : false
        })
    }

    updateInputValueSearchOutlet= (evt) => {
        console.log(evt.target)
        this.setState({
            outletSearch: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase()
        });
    }

    updateInputValueNamaWajibPajak= (evt) => {
        console.log(evt.target)
        this.setState({
        namaWajibPajak: evt.target.value.toUpperCase()
    });
}

    updateInputValueAlamatWajibPajak= (evt) => {
        console.log(evt.target)
        this.setState({
        alamatWajibPajak: evt.target.value.toUpperCase()
    });
}

    updateInputValueAlamatWajibPajakPPH= (evt) => {
        console.log(evt.target)
        this.setState({
        alamatWajibPajakPPH: evt.target.value.toUpperCase()
    });
}

    updateInputValueKPP= (evt) => {
        console.log(evt.target)
        this.setState({
        kpp: evt.target.value
    });
}

    updateInputValueLokasiPajak= (evt) => {
        console.log(evt.target)
        this.setState({
        lokasiPajak: evt.target.value.toUpperCase()
    });
}
   
//fungsi untuk mengambil semua data dimana memanggil current page dan perpage
    componentDidMount() {
        this.getDataPPH23();
    }

//state awal pada saat membuka suatu page tsb nanti dicari langsung di render() 
    state = {
        modal                   : false,
        modal_backdrop          : false,
        modal_nested_parent     : false,
        modal_nested            : false,
        modal_delete            : false,
        modal_update            : false,
        backdrop                : true,
        modal_outletNotFound    : false,
        modal_pajakNotFound     : false,
        flagsavebtn             : false,
        flagcancelbtn           : false,
        flageditbtn             : false
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
 
    editaddPajakOutletNotNull=()=>
    {
        if(this.state.namaWajibPajak === ''){
            alert('Harus Isi Nama Wajib Pajak');
        }
        else if(this.state.alamatWajibPajak === '')
        {   
            alert('Harus Isi Alamat Wajib Pajak');
        }
        else if(this.state.alamatWajibPajakPPH === ''){
            alert('Harus Isi Alamat Wajib Pajak PPH');
        }
        else if(this.state.kpp === ''){
            alert('Harus Pilih Kantor Pelayanan Pajak');
        }
        else if(this.state.lokasiPajak === ''){
            alert('Harus Isi Lokasi Pajak');
        }
        else{
            this.setState({
                modal_nested:true
            })
        }
    }

    cancelButton()
    {
        this.searchInputValue(this.state.inputtedName);
        this.enableField();
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
    
// --------------------------------------------------------- INSERT / UPDATE --------------------------------------------------------- 

    addupdatePajak = (out_code,param,param2,param3,param4,param5) => async () =>
    {
        var url     = hostUrl+`/TambahUbahPajak/${out_code}`;

        var payload = {
            out_nama_pajak      : param,
            out_alamat_pajak    : param2,
            out_alamatpajakpph  : param3,
            out_kpp             : param4,
            out_lokasipajak     : param5,
            out_userid          : "0"
        };

        console.log(JSON.stringify(payload));
        let data = await fetch(url,{
            method : 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            json: true,
            body: JSON.stringify(payload)
        })

        .then(response => {
            if (response.ok) {
                this.isLoading      = false;
                this.componentDidMount();
                return response.json();
            }
        })

        if(data){
            this.setState(
                {
                    modal_nested : false
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

// --------------------------------------------------------- SEARCH --------------------------------------------------------- 

//mengambil parameter yang telah diinput di inputtedName . lalu dilempar ke Backend
searchInputValue = (outcode)  =>{
    
    var url = hostUrl+`/TampilPajak/${outcode}`
    fetch(url)
        
    .then(response   => response.json())
    .then(data =>{ 
        this.setState({ result: data, isLoading: false});

        // KALAU OUTLETNYA TIDAK ADA
        if(data[0] && data[0].outlet_exists === false ){
            this.setState({
                // modal_outletNotFound : true
            });
        }

        // KALAU OUTLET ADA, TAPI DATA PAJAK TIDAK ADA
        else if(data[0] && data[0].pajak_exists === false ){
            this.setState({
                modal_pajakNotFound : true,
                outletID            : data[0].out_code,
                namaOutlet          : data[0].out_name,
                namaWajibPajak      : '',
                alamatWajibPajak    : '',
                alamatWajibPajakPPH : '',
                kpp                 : '',
                lokasiPajak         : ''
            });
        }

        // KALAU OUTLET ADA DAN DATA PAJAK ADA
        else{
            this.setState({
                outletID            : data[0].out_code,
                namaOutlet          : data[0].out_name,
                namaWajibPajak      : data[0].out_nama_pajak,
                alamatWajibPajak    : data[0].out_alamat_pajak,
                alamatWajibPajakPPH : data[0].out_alamatpajakpph,
                kpp                 : data[0].kode_cabang,
                lokasiPajak         : data[0].out_lokasipajak,
                flageditbtn         : false
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


// ----------------------------------------------------- DESAIN HALAMAN ----------------------------------------------

//render biasa nya di-isi untuk desain HTML
    render() {
        const { result, isLoading } = this.state;
       
        return (
            <Page
                title       = "Outlet Data Pajak"
                breadcrumbs = {[{ name: 'DataPajak', active: true }]}
                className   = "Data Pajak Page">
           


                    <Modal
                        isOpen      = {this.state.modal_outletNotFound}
                        toggle      = {this.toggle('outletNotFound')}
                        className   = {this.props.className}>
                         
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

{/* ---------------------------------------- MODAL DATA PAJAK NOT FOUND --------------------------------------------- */}
                    
                    <Modal
                        isOpen      = {this.state.modal_pajakNotFound}
                        toggle      = {this.toggle('pajakNotFound')}
                        className   = {this.props.className}
                        backdrop    = "static"
                        keyboard    = "false">
                          <ModalHeader>
                                    <Label>
                                        Outlet Tidak Mempunyai Data Pajak !
                                     </Label>
                          </ModalHeader>
                                    <ModalBody> 
                                    <Label>
                                    Ingin Membuat Data Pajak ?
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

{/* // -------------------------------------------------- TAMPILAN DATA ------------------------------------------- // */}

    <Card className = "mb-3">
        <NotificationSystem
            dismissible = {false}
            ref         = {notificationSystem => (this.notificationSystem = notificationSystem)}
            style       = {NOTIFICATION_SYSTEM_STYLE}
        />     
                        <CardBody
                            id  = "selectedAccPajak">   
                                <Form>
                                    <Row className = "mt-3">
                                        <Label sm={3} md = {2} style={{fontWeight:"bold"}}>
                                        Outlet
                                        </Label>
                                                
                                            <Col   xs = {4} md = {2}>   
                                                <Input 
                                                    id      = "outletID"
                                                    value   = {this.state.outletID}
                                                    disabled
                                                >
                                                </Input>
                                            </Col>   

                                            <Col xs = {10} md = {5}>
                                                <Input 
                                                    value   = {this.state.namaOutlet}
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
                                            
{/* // -------------------------------------------------- TAMPILAN DATA PAJAK ------------------------------------------- // */}
                                            
                                            <Row className = "mt-3">
                                                <Col md = {8}>
                                                    <Label  style={{fontWeight:"bold"}}>
                                                        Data Pajak Outlet
                                                    </Label>
                                                </Col>

                                                <Col md = {1}>
                                                    <Button
                                                        id          = "editDataPajak" 
                                                        onClick     = {this.enableField}
                                                        disabled    = {this.state.flageditbtn}
                                                    >
                                                    EDIT
                                                    </Button>
                                                </Col>

                                                <Col md = {1}>
                                                    <Button
                                                        id          = "saveDataPajak" 
                                                        disabled    = {this.state.flagsavebtn}
                                                        onClick     = {()=>this.editaddPajakOutletNotNull()}
                                                    >
                                                    SAVE
                                                    </Button>

                                                    <Modal
                                                        isOpen = {this.state.modal_nested}
                                                        toggle = {this.toggle('nested')}>
                                                        <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                                            <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                                                <ModalFooter>
                                                                    <Button 
                                                                        color       = "primary"
                                                                        onClick     = 
                                                                        {
                                                                            this.addupdatePajak(
                                                                                this.state.inputtedName,
                                                                                this.state.namaWajibPajak,
                                                                                this.state.alamatWajibPajak,
                                                                                this.state.alamatWajibPajakPPH,
                                                                                this.state.kpp,
                                                                                this.state.lokasiPajak
                                                                                )
                                                                        }>
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
                                                        id          = "cancelDataPajak" 
                                                        disabled    = {this.state.flagcancelbtn}
                                                        onClick     = {()=>this.cancelButton()}
                                                    >
                                                    CANCEL
                                                    </Button>
                                                </Col>
                                            </Row>  

                                            <Row>
                                                <Col xs = {4} md = {2}>
                                                        <Label>
                                                            Nama Wajib Pajak
                                                        </Label>
                                                </Col>   
                                                
                                                <Col xs = {10} md = {8}>
                                                      <Input 
                                                            id          = 'namaWajibPajak'
                                                            value       = {this.state.namaWajibPajak}
                                                            onChange    = {this.updateInputValueNamaWajibPajak}
                                                            disabled    = {this.state.flagisi}
                                                            maxLength   = "100">
                                                      </Input>
                                                </Col>  
                                            </Row>
                                           
                                            <Row>
                                                <Col   xs = {4} md = {2}>
                                                        <Label>
                                                            Alamat Wajib Pajak PPN
                                                        </Label>
                                                </Col>   
                                                
                                                <Col   xs = {10} md = {8}>
                                                      <Input 
                                                            id          = 'alamatWajibPajak'
                                                            type        = "textarea"
                                                            onChange    = {this.updateInputValueAlamatWajibPajak}
                                                            value       = {this.state.alamatWajibPajak}
                                                            disabled    = {this.state.flagisi}
                                                            maxLength   = "155">
                                                      </Input>
                                                </Col>   
                                            </Row>

                                            <Row>
                                                <Col   xs = {4} md = {2}>
                                                        <Label>
                                                            Alamat Wajib Pajak PPH
                                                        </Label>
                                                </Col>   
                                                
                                                <Col   xs = {10} md = {8}>
                                                      <Input 
                                                            id          = 'alamatWajibPajakPPH'
                                                            type        = "textarea"
                                                            onChange    = {this.updateInputValueAlamatWajibPajakPPH}
                                                            value       = {this.state.alamatWajibPajakPPH}
                                                            disabled    = {this.state.flagisi}
                                                            maxLength   = "155">
                                                      </Input>
                                                </Col>   
                                            </Row>

                                            <Row>
                                                <Col   xs = {4} md = {2}>
                                                        <Label>
                                                            Kantor Pelayanan Pajak
                                                        </Label>
                                                </Col>   
                                                
                                                <Col   xs = {10} md = {8}>
                                                      <Input
                                                            id          = 'kantorPelayananPajak' 
                                                            type        = "select"
                                                            onChange    = {this.updateInputValueKPP}
                                                            value       = {this.state.kpp}
                                                            disabled    = {this.state.flagisi}>
                                                                            <option value = ''>- Pilih Kantor Pelayanan Pajak -</option>
                                                                        {this.state.pph23.map((pph23) => 
                                                                            <option key={pph23.kdcabang} value={pph23.kdcabang}>{pph23.kdcabang + " - " + pph23.nmcabang}</option>)}
                                                      </Input>
                                                </Col>   
                                            </Row>

                                            <Row>
                                                <Col   xs = {4} md = {2}>
                                                        <Label>
                                                            Lokasi Pajak
                                                        </Label>
                                                </Col>   
                                                
                                                <Col   xs = {10} md = {8}>
                                                      <Input
                                                            id          = 'lokasiPajak' 
                                                            onChange    = {this.updateInputValueLokasiPajak}
                                                            value       = {this.state.lokasiPajak}
                                                            disabled    = {this.state.flagisi}
                                                            maxLength   = "100">
                                                      </Input>
                                                </Col>   
                                            </Row>                          
                            </Form>    
                    </CardBody>                  
                </Card>                        
            </Page>
        );
    }
}
export default OutletAccPajakPage; 