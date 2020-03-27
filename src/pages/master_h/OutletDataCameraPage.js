import Page                                     from 'components/Page';
import React                                    from 'react';
import Typography                               from 'components/Typography';
import { MdSearch, MdLoyalty, MdEdit, MdDelete} from 'react-icons/md';
import NotificationSystem                       from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE }            from 'utils/constants';
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

class OutletDataCameraPage extends React.Component {
    //special method
    constructor(props) 
    {
        super(props);
        this.state = {
            result              : [],
            cameras             : [],
            searchOutletList    : [],

            isLoading           : false,
            flagjeniscamera     : true,
            flagipcamera        : true,
            flagnewbtn          : true,
            flagaddbtn          : true,
            flagsavebtn         : true,
            flagsavebtnnew      : true,
            flagcancelbtn       : true,

            outletSearch        : "",
            outletSearchFeedback: "",
            kodeCamera          : "",
            cameraID            : "",
            namaCamera          : "",
            namaCameraEdit      : "",
            ipCamera            : "",
            cameraIP            : "",
            editIPCamera        : ""
        };
        this.outletSearchInputRef = React.createRef();
    }

// ----------------------------------------------- SHOW ALL DATA --------------------------------------------------------- 

    enableField=()=>
    { 
        if(this.state.flagjeniscamera === true && this.state.flagipcamera === true)
        {
            var url = hostUrl+`/TampilSemuaDataKamera`
            fetch(url)
            .then(response => {
                return response.json();
            })
            .then(data => {
                let cameraApi = data.map(camera => 
                    { return {
                        value   : camera.cam_cameracode, 
                        value2  : camera.max_code,
                        display : camera.cam_cameraname
                    } })
                this.setState({ cameras: [{value: '', display: '(Select Camera)'}].concat(cameraApi) , max_kode : data[0].max_code});
            });
        }

        this.setState({
            flagjeniscamera : false,
            flagipcamera    : false
        })

        var currFlagSave = this.state.flagsavebtn;
        this.setState({
            flagsavebtn : !currFlagSave,
        })

        var currFlagAdd = this.state.flagaddbtn;
        this.setState({
            flagaddbtn : !currFlagAdd,
        })

        var currFlagCancel = this.state.flagcancelbtn;
        this.setState({
            flagcancelbtn : !currFlagCancel,
        })
    }

    newCamera=()=>
    {
        if(this.state.flagjeniscamera === true && this.state.flagipcamera === true)
        {
            var url = hostUrl+`/TampilSemuaDataKamera`
            fetch(url)
            .then(response => {
                return response.json();
            })
            .then(data => {
                let cameraApi = data.map(camera => 
                    { return {
                        value   : camera.cam_cameracode, 
                        value2  : camera.max_code,
                        display : camera.cam_cameraname
                    } })
                this.setState({ cameras: [{value: '', display: '(Select Camera)'}].concat(cameraApi) , max_kode : data[0].max_code});
            });
        }

        this.setState({
            modal_newCamera : true,
            flagsavebtnnew  : false
        })
    }

    enableFieldCondition=()=>
    {
        var url = hostUrl+`/TampilSemuaDataKamera`
        fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            let cameraApi = data.map(camera => 
                { return {
                    value   : camera.cam_cameracode, 
                    value2  : camera.max_code,
                    display : camera.cam_cameraname
                } })
            this.setState({ cameras: [{value: '', display: '(Select Camera)'}].concat(cameraApi) , max_kode : data[0].max_code});
        });

        this.setState({
            modal_cameraNotFound    : false,
            flagaddbtn              : true,
            flagsavebtn             : false,
            flagcancelbtn           : false,
            flagjeniscamera         : false,
            flagipcamera            : false
        })
    }

    updateInputValueSearchOutlet= (evt) => {
        console.log(evt.target)
        this.setState({
            outletSearch: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase()
        });
    }

    updateInputValueKodeCamera= (evt) => {
        console.log(evt.target)
        this.setState({
            kodeCamera: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase()
        }); 
    }

    updateInputValueIPCamera= (evt) => {
        console.log(evt.target)
        this.setState({
            ipCamera: evt.target.value
        });
    }

    updateInputValueNamaCamera= (evt) => {
        console.log(evt.target)  
        this.setState({
            namaCamera: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase()
        });
    }

    updateInputValueEditNamaCamera= (evt) => {
        console.log(evt.target)  
        this.setState({
            namaCameraEdit: evt.target.value.replace(/[^\w\s]/gi, "").toUpperCase()
        });
    }

    updateInputValueEditIPCamera= (evt) => {
        console.log(evt.target)
        this.setState({
            editIPCamera: evt.target.value
        });
    }

    cancelButton()
    {
        this.searchInputValue(this.state.inputtedName);
        this.enableField();

        this.setState(
            {
                flagjeniscamera : true,
                flagipcamera    : true,
                kodeCamera      : "",
                ipCamera        : ""
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

    handleClose= ()=>{
        this.setState({
            namaCamera : ""
        });
    }

 // --------------------------------------------------------- INSERT ---------------------------------------------------------

    addCameraOutlet = (out_code, param, param2) => async () =>
    {
        var url     = hostUrl+`/TambahDataKameraOutlet/${out_code}`;

        var payload = {
            camout_cameracode   : param,
            camout_cameraip     : param2,
            cam_userid          : "0"
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
                this.isLoading                  = false;
                this.componentDidMount();
                return response.json();
            }
        })

        if(data){
            this.setState(
                {
                    modal_addCameraOutlet : false,
                    ipCamera : "",
                    namaCamera : "",
                    kodeCamera : "",
                    flagjeniscamera : true,
                    flagipcamera    : true,
                    flagsavebtn     : true,
                    flagcancelbtn   : true
                }
            )
            this.isLoading = true;
            this.showNotification("Data Berhasil Disimpan");
            this.searchInputValue(this.state.inputtedName);
        }
        else{
            alert("Data Sudah Pernah Ada");
        }
    }

    addNewCamera = param => async () =>
    {
        var url     = hostUrl+`/TambahDataKamera`;

        var payload = {
            cam_cameraname  : param,
            cam_userid      : "0"
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
                    modal_addNewCamera  : false,
                    modal_newCamera     : false,
                    namaCamera          : ""
                }
            )
            this.isLoading = true;
            this.showNotification("Data Berhasil Disimpan");
            this.searchInputValue(this.state.inputtedName);
            // this.enableField();
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
        modal_addCameraOutlet   : false,
        modal_addNewCamera      : false,
        modal_delete            : false,
        modal_update            : false,
        backdrop                : true,
        modal_outletNotFound    : false,
        modal_cameraNotFound : false
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

    
    ValidateIPaddress(inputText)
    {
        var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if(inputText.match(ipformat))
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    editNotNull =()=>
    {
        if(this.state.editIPCamera === ''){
            alert('Harus Isi IP Camera');
        }
        else if(this.ValidateIPaddress(this.state.editIPCamera))
        {
            alert("Format IP yang di Input Salah!");
        }
        else{
            this.setState({
                modal_nested:true
            })
        }
    }

    addCameraOutletNotNull=()=>
    {
        if(this.state.kodeCamera === ''){
            alert('Harus Pilih Camera');
        }
        else if(this.state.ipCamera === ''){
            alert('Harus Isi IP Camera');
        }
        else if(this.ValidateIPaddress(this.state.ipCamera))
        {
            alert("Format IP yang di Input Salah!");
        }
        else{
            this.setState({
                modal_addCameraOutlet:true
            })
        }
    }

    addNewCameraOutletNotNull=()=>
    {
        if(this.state.namaCamera === '')
        {   
            alert('Harus Isi Nama Camera');
        }
        else{
            this.setState({
                modal_addNewCamera:true
            })
        }
    }

// --------------------------------------------------------- UPDATE --------------------------------------------------------- 

//pada saat melakukan edit yang akan di lempar ke backend adalah first_param = nama yang telah di edit, second_param adalah yang didapatkan 
editCameraOutlet = (param) => async () => 
    {
        this.setState({isLoading : true});
        var url = hostUrl+`/UbahDataKamera/${this.state.activeID}`;
      
        var payload = {
            camout_outcode      : this.state.outCode,
            camout_cameracode   : this.state.cameraID,
            camout_cameraip     : this.state.editIPCamera,
            camout_cameraqty    : param,
            schout_userid       : "0"
        };
        console.log(payload)
        let data = await fetch(url,{
            method : 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            json: true,
            body: JSON.stringify(payload)
        })

        //2.Ketika sudah terespond oleh backend , maka kita akan melakukan hal ini
            .then(response =>{
                if(response.ok){
                    this.isLoading = false;
                    //state ini diawal dibuat false 
                    this.state.modal_nested             = false;
                    this.state.modal_nested_parent      = false;
                    this.state.modal_addCameraOutlet    = false;
                    this.state.modal_addNewCamera       = false;
                    this.componentDidMount();
                    return response.json();
                }
            })

             if(data){
                this.setState(
                    {
                        modal_update    : false,
                        editIPCamera    : ""
                    }
                )
                this.isLoading = true;
                this.showNotification("Data Berhasil Diubah");
                this.searchInputValue(this.state.inputtedName);
            }
            else{
                alert("Data Sudah Pernah Ada");
            }
    }
    boolean = false;

//ketika melakukan update, input an yang masuk harus uppercase dan tidak boleh special character
    updateInputValue= (evt) => {
        this.setState({
        });
}

// set awal pada saat membuka update 
updateModalWithItemID(idUpdateCamera, outcode, cameraid, cameraip, cameraname){
    this.setState({
        modal_update    : true,
        activeID        : idUpdateCamera,
        outCode         : outcode,
        cameraID        : cameraid,
        editIPCamera    : cameraip,
        namaCameraEdit  : cameraname
    })
}  

openModalNewCamera(){
    this.setState({
        modal_newCamera    : true
    })
}

// --------------------------------------------------------- SEARCH --------------------------------------------------------- 

//mengambil parameter yang telah diinput di InputtedName . lalu dilempar ke Backend
searchInputValue = (outcode)  =>{
    
    var url = hostUrl+`/TampilDataKameraOutlet/${outcode}`
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

        // KALAU OUTLET ADA, TAPI DATA CAMERA TIDAK ADA
        else if(data[0] && data[0].kamera_exists === false ){
            this.setState({
                modal_cameraNotFound : true,
                flagaddbtn           : true,
                flagnewbtn           : false
            });
        }

        // KALAU OUTLET ADA DAN DATA CAMERA ADA
        else{
            this.setState({
                flagaddbtn      : false,
                flagnewbtn      : false
            });
        }
    })

        this.state.hidePagination = 'd-none';
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
deleteCameraOutlet = () => async ()=>{
    var url = hostUrl+`/HapusDataKamera/${this.state.activeID}`;

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
                this.state.modal_delete             = false;
                this.state.modal_nested             = false;
                this.state.modal_addNewCamera       = false;
                this.state.modal_addCameraOutlet    = false;
                this.state.backdrop                 = false;
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
    openModalWithItemID(idCamera){
        this.setState({
            modal_delete    : true,
            activeID        : idCamera
        })
    }

// ------------------------------------------------------------------ DESAIN HALAMAN ----------------------------------------------- 

//render biasa nya di-isi untuk desain HTML
    render() {
        const { result, isLoading } = this.state;
       
        return (
            
            
            <Page
                title       = "Data Camera"
                breadcrumbs = {[{ name: 'DataCamera', active: true }]}
                className   = "Data Camera Page"

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

{/* ---------------------------------------- MODAL DATA CAMERA NOT FOUND --------------------------------------------- */}

                    <Modal
                        isOpen      = {this.state.modal_cameraNotFound}
                        toggle      = {this.toggle('cameraNotFound')}
                        className   = {this.props.className}
                        backdrop="static"
                        keyboard="false">
                          <ModalHeader>
                                    <Label>
                                        Outlet Tidak Mempunyai Data Camera !
                                     </Label>
                          </ModalHeader>
                                    <ModalBody> 
                                    <Label>
                                    Ingin Membuat Data Camera ?
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

{/* // -------------------------------------------------- MODAL ADD CAMERA OUTLET ------------------------------------------- // */}
                    
                    {/* <Modal
                        isOpen      = {this.state.modal_newCamera}
                        toggle      = {this.toggle('newCamera')}
                        className   = {this.props.className}>
                                <ModalHeader toggle = {this.toggle('newCamera')}> Add New Camera</ModalHeader>
                                    <ModalBody>
                                        <Row>
                                            <Col md = {4}>
                                                <Label>Kode Camera</Label>
                                                    <Input 
                                                        onChange    = {evt => this.updateInputValue(evt)}
                                                        value       = {this.state.max_kode}
                                                        id          = 'kodeCamera'
                                                        disabled
                                                    >
                                                    </Input>
                                            </Col>

                                            <Col>
                                                <Label>Nama Camera</Label>
                                                    <Input 
                                                        id          = 'namaCamera'
                                                        placeholder = "Nama Camera"
                                                        onChange    = {this.updateInputValueNamaCamera}
                                                        value       = {this.state.namaCamera}
                                                        maxLength   = "100"
                                                    >
                                                    </Input>
                                            </Col>
                                        </Row>
                                    </ModalBody>
                                <ModalFooter>
                                    <Button
                                        id          = "saveNewCamera"
                                        onClick     = {()=>this.addNewCameraOutletNotNull()}
                                        disabled    = {this.state.flagsavebtnnew}
                                        color       = "primary"
                                    >SAVE
                                    </Button>
                                        
                                        <Modal
                                            isOpen = {this.state.modal_addNewCamera}
                                            toggle = {this.toggle('addNewCamera')}>
                                                <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                                    <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                                        <ModalFooter>
                                                            <Button 
                                                                color       = "primary"
                                                                onClick     = {this.addNewCamera(this.state.namaCamera)}>
                                                                {!isLoading && <i className = "fa fa-refresh fa-spin"></i>}
                                                                Ya
                                                            </Button>
                                                                        
                                                            <Button 
                                                                color       = "primary" 
                                                                onClick     = {this.toggle('addNewCamera')}>
                                                                Tidak 
                                                            </Button>
                                                        </ModalFooter>
                                        </Modal>
                                                        
                                    <Button 
                                        color   = "primary" 
                                        onClick = {this.toggle('newCamera')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                    </Modal> */}

{/* // -------------------------------------------------- MODAL ADD NEW CAMERA ------------------------------------------- // */}
                    
                    <Modal
                        isOpen      = {this.state.modal_newCamera}
                        toggle      = {this.toggle('newCamera')}
                        className   = {this.props.className}
                        onExit      = {this.handleClose}>
                                <ModalHeader toggle = {this.toggle('newCamera')}> Add New Camera</ModalHeader>
                                    <ModalBody>
                                        <Row>
                                            <Col md = {4}>
                                                <Label>Kode Camera</Label>
                                                    <Input 
                                                        onChange    = {evt => this.updateInputValue(evt)}
                                                        value       = {this.state.max_kode}
                                                        id          = 'kodeCamera'
                                                        disabled
                                                    >
                                                    </Input>
                                            </Col>

                                            <Col>
                                                <Label>Nama Camera</Label>
                                                    <Input 
                                                        id          = 'namaCamera'
                                                        placeholder = "Nama Camera"
                                                        onChange    = {this.updateInputValueNamaCamera}
                                                        value       = {this.state.namaCamera}
                                                        maxLength   = "100"
                                                    >
                                                    </Input>
                                            </Col>
                                        </Row>
                                    </ModalBody>
                                <ModalFooter>
                                    <Button
                                        id          = "saveNewCamera"
                                        onClick     = {()=>this.addNewCameraOutletNotNull()}
                                        disabled    = {this.state.flagsavebtnnew}
                                        color       = "primary"
                                    >SAVE
                                    </Button>
                                        
                                        <Modal
                                            isOpen  = {this.state.modal_addNewCamera}
                                            toggle  = {this.toggle('addNewCamera')}
                                            onExit  = {this.handleClose}>
                                                <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                                    <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                                        <ModalFooter>
                                                            <Button 
                                                                color       = "primary"
                                                                onClick     = {this.addNewCamera(this.state.namaCamera)}>
                                                                {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                                                                Ya
                                                            </Button>
                                                                        
                                                            <Button 
                                                                color       = "primary" 
                                                                onClick     = {this.toggle('addNewCamera')}>
                                                                Tidak 
                                                            </Button>
                                                        </ModalFooter>
                                        </Modal>
                                                        
                                    <Button 
                                        color   = "primary" 
                                        onClick = {this.toggle('newCamera')}>
                                        Batal
                                    </Button>
                                </ModalFooter>
                    </Modal>

{/* // -------------------------------------------------- MODAL UPDATE DATA CAMERA ------------------------------------------- // */}
                    
                    <Modal
                        isOpen      = {this.state.modal_update}
                        toggle      = {this.toggle('update')}
                        className   = {this.props.className}>
                                <ModalHeader toggle = {this.toggle('update')}> Edit Data Camera</ModalHeader>
                                    <ModalBody>
                                        <Label>Nama Camera</Label>
                                            <Input  type        = "text" 
                                                    name        = "namaCamera" 
                                                    value       = {this.state.namaCameraEdit}
                                                    onChange    = {evt => this.updateInputValueEditNamaCamera(evt)}
                                                    placeholder = "Nama Camera"
                                                    disabled>
                                            </Input>

                                        <Label>IP Camera</Label>
                                            <Input  type    = "text" 
                                                    name        = "ipCamera" 
                                                    value       = {this.state.editIPCamera} 
                                                    onChange    = {evt => this.updateInputValueEditIPCamera(evt)}
                                                    placeholder = "IP Camera"
                                            />
                                    </ModalBody>
                                <ModalFooter>
                                    <Button 
                                        id          = "buttonSimpan" 
                                        color       = "primary" 
                                        onClick     = {()=>this.editNotNull()}
                                        >
                                        Simpan
                                    </Button>
                                        
                                        <Modal
                                            isOpen = {this.state.modal_nested}
                                            toggle = {this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                                <ModalBody>Apakah Anda yakin ingin mengubah data ini?</ModalBody>
                                                    <ModalFooter>
                                                        <Button 
                                                            color = "primary"
                                                            onClick = {this.editCameraOutlet(this.state.jumlahJenisCameraEdit)}>
                                                            {!isLoading && <i className = "fa fa-refresh fa-spin"></i>}
                                                            Ya
                                                        </Button>
                                                        
                                                        <Button 
                                                            color   = "primary" 
                                                            onClick = {this.toggle('nested')}>
                                                            Tidak 
                                                        </Button>
                                                    </ModalFooter>
                                        </Modal>
                                                        <Button 
                                                            color   = "primary" 
                                                            onClick = {this.toggle('update')}>
                                                            Batal
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
                                        onClick = {this.deleteCameraOutlet()}>
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
                            id= "selectedCamera">   
                                <Form>
                                    <Row className = "mt-3">
                                        <Label sm={3} md = {2} style={{fontWeight:"bold"}}>
                                        Outlet
                                        </Label>
                                            
                                            <Col xs = {4} md = {2}>
                                                <Input 
                                                    id      = "viewinsertOutletID"
                                                    value   = {this.state.result[0] && this.state.result[0].camout_outcode}
                                                    disabled
                                                >
                                                </Input>
                                            </Col>   

                                            <Col xs = {10} md = {5}>
                                                <Input 
                                                    value   = {this.state.result[0] && this.state.result[0].nama_outlet}
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

{/* // -------------------------------------------------- TAMPILAN DATA CAMERA ------------------------------------------- // */}

                                            <Row className = "mt-3">
                                                <Label sm={3} style={{fontWeight:"bold"}}>
                                                    Data Camera Outlet
                                                </Label>
                                            </Row>

                                            <Table bordered = "3">
                                                <thead>
                                                    <tr align ="center">
                                                        <th className = "th-sm">Nama Camera</th>
                                                        <th  class="th-sm" >IP Camera</th>
                                                        <th  class="th-sm" ></th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {result.map(kam =>
                                                    <tr>
                                                        <td align = "center">{kam.nama_kamera}</td>
                                                        <td align = "center">{kam.camout_cameraip}</td>
                                                        <td align = "center">
                                                            <div>
                                                                <Button 
                                                                    style={{background: '#00ff00', borderStyle: 'none', 
                                                                    justifyContent:'center',alignItems:'center'}}
                                                                    size    = "sm"
                                                                    onClick = {()=> this.updateModalWithItemID(kam.camout_runningid, kam.camout_outcode, kam.camout_cameracode, kam.camout_cameraip, kam.nama_kamera)}
                                                                    ><MdEdit></MdEdit>
                                                                </Button>   
                                                                                                                              
                                                                <Button 
                                                                    style={{background: '#FF0000', borderStyle: 'none', 
                                                                    justifyContent:'center',alignItems:'center'}}
                                                                    size    = "sm" 
                                                                    onClick = {()=>this.openModalWithItemID(kam.camout_runningid)}
                                                                    ><MdDelete></MdDelete>
                                                                </Button>
                                                            </div> 
                                                        </td>
                                                    </tr>
                                                    )}
                                                </tbody>
                                            </Table>

                                            <Row>    
                                                <Col md = {10}>
                                                    <Button
                                                        id          = "addCameraOutlet" 
                                                        onClick     = {this.enableField}
                                                        disabled    = {this.state.flagaddbtn}
                                                    >ADD CAMERA OUTLET
                                                    </Button>
                                                </Col> 

                                                <Col md = {2}>
                                                    <Button
                                                        id          = "addNewCamera" 
                                                        onClick     = {this.newCamera}
                                                        disabled    = {this.state.flagnewbtn}
                                                    >NEW CAMERA
                                                    </Button>
                                                </Col> 
                                            </Row>
                                              
                                            <Row className = "mt-3">
                                                <Label sm={3} style={{fontWeight:"bold"}}>
                                                    Add Camera Outlet
                                                </Label>
                                            </Row>

                                            <Row>
                                                <Col xs = {5} md = {4}>
                                                    <Input 
                                                        type        = "select"
                                                        id          = 'namaJenisCamera'
                                                        disabled    = {this.state.flagjeniscamera}
                                                        onChange    = {this.updateInputValueKodeCamera}
                                                        value       = {this.state.kodeCamera}
                                                    >
                                                        {this.state.cameras.map((camera) => <option key={camera.value} value={camera.value}>{camera.display}</option>)}
                                                    </Input>
                                                </Col>

                                                <Col xs = {5} md = {3}>
                                                    <Input 
                                                        id          = 'ipCamera'
                                                        placeholder = "IP Camera"
                                                        onChange    = {this.updateInputValueIPCamera}
                                                        value       = {this.state.ipCamera}
                                                        disabled    = {this.state.flagipcamera}
                                                    >
                                                    </Input>
                                                </Col>    
                                            </Row>
                    
                                            <Row>    
                                                <Col md = {1}>
                                                    <Button
                                                        id          = "saveCameraOutlet"
                                                        onClick     = {()=>this.addCameraOutletNotNull()}
                                                        disabled    = {this.state.flagsavebtn}
                                                    >SAVE
                                                    </Button>

                                                    <Modal
                                                        isOpen = {this.state.modal_addCameraOutlet}
                                                        toggle = {this.toggle('addCameraOutlet')}>
                                                        <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                                            <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                                                <ModalFooter>
                                                                    <Button 
                                                                        color       = "primary"
                                                                        onClick     = {this.addCameraOutlet(this.state.inputtedName, this.state.kodeCamera, this.state.ipCamera)}>
                                                                        {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                                                                        Ya
                                                                    </Button>
                                                                    
                                                                    <Button color = "primary" onClick = {this.toggle('addCameraOutlet')}>
                                                                        Tidak 
                                                                    </Button>
                                                                </ModalFooter>
                                                    </Modal>
                                                </Col> 

                                                <Col md = {1}>
                                                    <Button
                                                        id          = "cancelCameraOutlet" 
                                                        onClick     = {()=>this.cancelButton()}
                                                        disabled    = {this.state.flagcancelbtn}
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
export default OutletDataCameraPage; 