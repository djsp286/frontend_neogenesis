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

class OutletSchedulePage extends React.Component {
    //special method
    constructor(props) 
    {
        super(props);
        this.state = {
            result              : [],
            shifts              : [],
            searchOutletList    : [],

            inputtedName        : "",
            startShift          : "",
            endShift            : "",
            startShiftEdit      : "",
            endShiftEdit        : "",
            activeID            : "",
            outCode             : "",
            shiftID             : "",
            shift_name          : "",
            timeclose           : "",
            jamAcuan            : "12:00",
            outletSearchFeedback: "",

            isLoading           : false,
            flagisi             : true,
            flagaddbtn          : true,
            flagsavebtn         : true,
            flagcancelbtn       : true,
            flagsimpanbtn       : true,

            startTimeError      : false,
            startTimeErrorEdit  : false,
            endTimeError        : false,
            endTimeErrorEdit    : false,
            shiftError          : false
        };

        this.outletSearchInputRef = React.createRef();
    }

// -----------------------------------------------  SHOW ALL DATA --------------------------------------------------------- 

    enableField=()=>
    {
        var url = `https://api.docnet.id/CHCMasterH/MasterShiftOutlet/TampilSemuaDataShiftOutlet`

        if(this.state.flagisi === true)
        {
            fetch(url)
            .then(response => {
                return response.json();
            })
            .then(data => {
                let shiftApi = data.map(shiftdata => 
                    { return {
                        value   : shiftdata.shift_code, 
                        display : shiftdata.shift_name
                    } })
                this.setState({ shifts: [{value: '', display: '(Select Shift)'}].concat(shiftApi)});
            });
        }

        var currFlagisi= this.state.flagisi;
        this.setState({
            flagisi : !currFlagisi,
        })

        var currFlagSave= this.state.flagsavebtn;
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
        var url = `http://10.0.111.143:8083/MasterShiftOutlet/TampilSemuaDataShiftOutlet`
        fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            let shiftApi = data.map(shiftdata => 
                { return {
                    value   : shiftdata.shift_code, 
                    display : shiftdata.shift_name
                } })
            this.setState({ shifts: [{value: '', display: '(Select Shift)'}].concat(shiftApi)});
        });

        var currFlagisi= this.state.flagisi;
        this.setState({
            flagisi : !currFlagisi,
            modal_scheduleNotFound : false,
            flagaddbtn          : true,
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

    updateInputValueJenisShift= (evt) => {
        console.log(evt.target)
        this.setState({
            jenisShift   : evt.target.value
        });
    }

    updateInputValueStartShift= (evt) => {
            console.log(evt.target)
            if(evt.target.value > this.state.timeclose){
                this.setState({
                    startShift: this.state.timeclose,
                    endShift : ''
                });  
            }
            else if((evt.target.value + this.state.jamAcuan - this.state.endShift) > this.state.jamAcuan)
            {
                this.setState({
                    startTimeError : true,
                });  
            }
            else{
                this.setState({
                startShift: evt.target.value,
                endShift : ''
            });
        }
    }

    updateInputValueEndShift= (evt) => {
            console.log(evt.target)
            console.log(this.state.jamAcuan)
            console.log(this.state.startShift)
            console.log(evt.target.value)
            if(evt.target.value.substr(0,5) > this.state.timeclose.substr(0,5)  && (evt.target.value.substr(0,5) - this.state.startShift.substr(0,5)) > this.state.jamAcuan){
                this.setState({
                    endShift    : this.state.timeclose,
                    endTimeError: true,
                    flagsavebtn : true   
                });  
            }
            else if((evt.target.value.substr(0,5) - this.state.startShift.substr(0,5)) > this.state.jamAcuan){
                    this.setState({
                        endShift    : evt.target.value,
                        endTimeError: true,
                        flagsavebtn : true   
                    });    
            }
            else if(evt.target.value < this.state.startShift){
                this.setState({
                    endShift    : evt.target.value,
                    endTimeError: true,
                    flagsavebtn : true   
                });  
            }
            else if(evt.target.value === this.state.startShift){
                this.setState({
                    endShift    : evt.target.value,
                    endTimeError: true,
                    flagsavebtn : true   
                });  
            }
            else{
            this.setState({
                endShift: evt.target.value,
                endTimeError: false,
                flagsavebtn : false 
            });
        }
    }

    updateInputValueStartShiftEdit= (evt) => {
        console.log(evt.target)
        if(evt.target.value > this.state.timeclose){
            this.setState({
                startShiftEdit: this.state.timeclose,
                endShiftEdit : ''
            });  
        } 
        else if((evt.target.value + this.state.jamAcuan - this.state.endShift) > this.state.jamAcuan)
        {
            this.setState({
                startTimeErrorEdit : true,
            });  
        }
        else{
            this.setState({
            startShiftEdit: evt.target.value,
            endShiftEdit : ''
        });
    }
}

    updateInputValueEndShiftEdit= (evt) => {
        console.log(evt.target)
        if(evt.target.value > this.state.timeclose && (evt.target.value.substr(0,2) - this.state.startShiftEdit.substr(0,2)) > this.state.jamAcuan){
            this.setState({
                endShiftEdit    : this.state.timeclose,
                endTimeErrorEdit: true,
                flagsimpanbtn   : true   
            });  
        }
        else if((evt.target.value.substr(0,2) - this.state.startShiftEdit.substr(0,2)) > this.state.jamAcuan){
                this.setState({
                    endShiftEdit        : evt.target.value,
                    endTimeErrorEdit    : true,
                    flagsimpanbtn       : true
                });    
        }
        else if(evt.target.value < this.state.startShiftEdit){
            this.setState({
                endShiftEdit    : evt.target.value,
                endTimeErrorEdit: true,
                flagsimpanbtn   : true   
            });  
        }
        else if(evt.target.value === this.state.startShiftEdit){
            this.setState({
                endShiftEdit    : evt.target.value,
                endTimeErrorEdit: true,
                flagsimpanbtn   : true   
            });  
        }
        else{
        this.setState({
            endShiftEdit        : evt.target.value,
            endTimeErrorEdit    : false,
            flagsimpanbtn       : false
        });
    }
}

    //fungsi untuk mengambil semua data dimana memanggil current page dan perpage
    componentDidMount() {
    }

    cancelButton()
    {
        this.enableField();
        this.setState(
            {
                jenisShift      : "",
                startShift      : "",
                endShift        : "",
                endTimeError    : false,
                startTimeError  : false
            }
        )
    }

    handleClose= ()=>{
        this.setState({
            startShiftEdit      : "",
            endShiftEdit        : "",
            endTimeErrorEdit    : false,
            startTimeErrorEdit  : false
        });
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

    // --------------------------------------------------------- INSERT ---------------------------------------------------------

    addScheduleOutlet = (out_code,param,param2,param3) => async () =>
    {
        var url     = hostUrl+`/TambahSchedule/${out_code}`;

        var payload = {
            schout_shift        : param,
            schout_starttime    : param2,
            schout_endtime      : param3,
            schout_userid       : "0"
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
                this.isLoading  = false;
                this.componentDidMount();
                return response.json();
            }
        })

        if(data){
            this.setState(
                {
                    modal_newShift : false,
                    jenisShift : "",
                    startShift : "",
                    endShift : ""
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

//state awal pada saat membuka suatu page tsb nanti dicari langsung di render() 
    state = {
        modal              : false,
        modal_backdrop     : false,
        modal_nested_parent: false,
        modal_nested       : false,
        modal_newShift     : false,
        modal_delete       : false,
        modal_update       : false,
        backdrop           : true,
        modal_outletNotFound:false,
        modal_scheduleNotFound :false
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

// VALIDASI JAM
tConvert = (time) =>{ 
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
       time[3] = '' 
    //   time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join ('') // return adjusted time or original string
  }    

addScheduleOutletNotNull=()=>
    {
        if(this.state.jenisShift === ''){
            alert('Harus Pilih Shift');
        }
        else if(this.state.startShift === '')
        {   
            alert('Harus Isi Jam Buka');
        }
        else if(this.state.endShift === ''){
            alert('Harus Isi Jam Tutup');
        }
        else{
            this.setState({
                modal_newShift:true
            })
        }
    } 
// --------------------------------------------------------- UPDATE --------------------------------------------------------- 

//pada saat melakukan edit yang akan di lempar ke backend adalah first_param = nama yang telah di edit, second_param adalah yang didapatkan 
editScheduleOutlet = (param,param2) => async () => 
    {
        this.setState({isLoading : true});
        var url = hostUrl+`/UbahSchedule/${this.state.activeID}`;
      
        var payload = {
            schout_outcode      : this.state.outCode,
            schout_shift        : this.state.shiftID,
            schout_starttime    : param,
            schout_endtime      : param2,
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
                    this.state.modal_update     = false;
                    this.state.modal_nested     = false;
                    this.state.backdrop         = false;
                    this.componentDidMount();
                    return response.json();
                }
            })
            
            if(data){
                this.setState(
                    {
                        modal_update : false
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
updateModalWithItemID(idUpdateShift, outcode, shiftid, nameshift, startshift, endshift){
    this.setState({
        modal_update    : true,
        activeID        : idUpdateShift,
        outCode         : outcode,
        shiftID         : shiftid,
        shift_name      : nameshift,
        startShiftEdit  : startshift,
        endShiftEdit    : endshift
    })
}  

// --------------------------------------------------------- SEARCH --------------------------------------------------------- 

//mengambil parameter yang telah diinput di InputtedName . lalu dilempar ke Backend
searchInputValue = (outcode)  =>{

    var url = hostUrl+`/TampilDataSchedule/${outcode}`
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

        // KALAU OUTLET ADA, TAPI DATA SCHEDULE TIDAK ADA
        else if(data[0] && data[0].schedule_exists === false ){
            this.setState({
                modal_scheduleNotFound : true,
                timeclose :  this.tConvert(data[0].out_timeclose)
            });
            console.log(this.state.timeclose)
        }

        // KALAU OUTLET ADA DAN DATA SCHEDULE ADA
        else{
            this.setState({
            flagaddbtn      : false,
            timeclose       : this.tConvert(data[0].out_timeclose),
            });
            console.log(this.state.timeclose)
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
deleteScheduleOutlet = () => async ()=>{
    var url = hostUrl+`/HapusDataSchedule/${this.state.activeID}`;
    
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
    openModalWithItemID(idShift){
        this.setState({
            modal_delete    : true,
            activeID        : idShift
        })
    }

// ------------------------------------------------------------------ DESAIN HALAMAN ----------------------------------------------- 

//render biasa nya di-isi untuk desain HTML
    render() {
        const { result, isLoading } = this.state;
       
        return (
            
            
            <Page
                title       = "Outlet Schedule"
                breadcrumbs = {[{ name: 'OutletSchedule', active: true }]}
                className   = "Outlet Schedule"

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

{/* ---------------------------------------- MODAL DATA SCHEDULE NOT FOUND --------------------------------------------- */}

                    <Modal
                        isOpen      = {this.state.modal_scheduleNotFound}
                        toggle      = {this.toggle('scheduleNotFound')}
                        className   = {this.props.className}
                        backdrop    = "static"
                        keyboard    = "false">
                          <ModalHeader>
                                    <Label>
                                        Outlet Tidak Mempunyai Data Schedule !
                                     </Label>
                          </ModalHeader>
                                    <ModalBody> 
                                    <Label>
                                    Ingin Membuat Data Schedule ?
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

{/* // -------------------------------------------------- MODAL UPDATE JADWAL SHIFT ------------------------------------------- // */}
                    <Modal
                        isOpen      = {this.state.modal_update}
                        toggle      = {this.toggle('update')}
                        className   = {this.props.className}
                        onExit      = {this.handleClose}>
                                <ModalHeader toggle = {this.toggle('update')}> Edit Jadwal Shift</ModalHeader>
                                    <ModalBody>
                                        <Label>Shift</Label>
                                            <Input  type    = "text" 
                                                    name    = "namaShift" 
                                                    value   = {this.state.shift_name}
                                                    disabled
                                            />

                                        <Label>Jam Tutup Outlet</Label>
                                            <Input  type    = "text" 
                                                    name    = "outletClosed" 
                                                    value   = {this.state.timeclose}
                                                    disabled
                                            />

                                        <Label>Start Time</Label>
                                            <Input  type        = "time" 
                                                    name        = "startTime" 
                                                    value       = {this.state.startShiftEdit} 
                                                    invalid     = {this.state.startTimeErrorEdit}
                                                    onChange    = {evt => this.updateInputValueStartShiftEdit(evt)}
                                            />

                                        <Label>End Time</Label>
                                            <Input  type        = "time" 
                                                    name        = "endTime" 
                                                    value       = {this.state.endShiftEdit} 
                                                    invalid     = {this.state.endTimeErrorEdit}
                                                    onChange    = {evt => this.updateInputValueEndShiftEdit(evt)}
                                            />
                                    </ModalBody>
                                <ModalFooter>
                                    <Button 
                                        id          = "buttonSimpan" 
                                        color       = "primary" 
                                        disabled    = {this.state.flagsimpanbtn}
                                        onClick     = {this.toggle('nested')}>
                                        Simpan
                                    </Button>
                                        
                                        <Modal
                                            isOpen = {this.state.modal_nested}
                                            toggle = {this.toggle('nested')}
                                            onExit = {this.handleClose}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                                <ModalBody>Apakah Anda yakin ingin mengubah data ini?</ModalBody>
                                                    <ModalFooter>
                                                        <Button 
                                                            color   = "primary"
                                                            onClick = {this.editScheduleOutlet(this.state.startShiftEdit, this.state.endShiftEdit)}>
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

{/* // -------------------------------------------------- MODAL DELETE JADWAL SHIFT ------------------------------------------- // */}
                    
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
                                        onClick = {this.deleteScheduleOutlet()}>
                                        {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                                        Ya
                                    </Button>{''}
                                    
                                    <Button 
                                        color   = "primary" 
                                        onClick = {this.toggle('delete')}>
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
                            id  = "selectedSchedule">   
                                <Form>
                                    <Row className = "mt-3">
                                        <Label sm={3} md = {2} style={{fontWeight:"bold"}}>
                                        Outlet
                                        </Label>
                                            
                                            <Col xs = {4} md = {2}>
                                                <Input 
                                                    id      = "viewinsertOutletID"
                                                    value   = {this.state.result[0] && this.state.result[0].schout_outcode}
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

{/* // -------------------------------------------------- TAMPILAN DATA SCHEDULE ------------------------------------------- // */}

                                            <Row className = "mt-3">
                                                <Label sm={3} style={{fontWeight:"bold"}}>
                                                    Jadwal Shift
                                                </Label>
                                            </Row>

                                            <Table bordered = "3">
                                                <thead>
                                                    <tr align ="center">
                                                        <th className = "th-sm">Shift</th>
                                                        <th  class="th-sm" >Start Time</th>
                                                        <th  class="th-sm" >End Time</th>
                                                        <th  class="th-sm" ></th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {result.map(sft =>
                                                    <tr>
                                                        <td align = "center">{sft.schout_shift}</td>
                                                        <td align = "center">{sft.schout_starttime}</td>
                                                        <td align = "center">{sft.schout_endtime}</td>
                                                        <td align = "center">
                                                            <div>
                                                                <Button 
                                                                    style   ={{background: '#00ff00', borderStyle: 'none', 
                                                                    justifyContent:'center',alignItems:'center'}}
                                                                    size    = "sm"
                                                                    onClick = {()=> this.updateModalWithItemID(sft.schout_runningid, sft.schout_outcode, sft.schout_shiftcode, sft.schout_shift, sft.schout_starttime, sft.schout_endtime)}
                                                                    ><MdEdit></MdEdit>
                                                                </Button>   
                                                                                                                              
                                                                <Button 
                                                                    style   = {{background: '#FF0000', borderStyle: 'none', 
                                                                    justifyContent:'center',alignItems:'center'}}
                                                                    size    = "sm" 
                                                                    onClick = {()=>this.openModalWithItemID(sft.schout_runningid)}
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
                                                        id          = "addShift" 
                                                        onClick     = {this.enableField}
                                                        disabled    = {this.state.flagaddbtn}
                                                    >ADD</Button>
                                                </Col> 
                                            </Row>

                                                
                                                <Row className = "mt-3">
                                                <Label sm={3} style={{fontWeight:"bold"}}>
                                                    Input Shift dan Jam
                                                </Label>
                                            </Row>
                                            
                                            <Row>
                                                <Col xs = {4} md = {2}>
                                                        <Label>
                                                            Jam Tutup Outlet
                                                        </Label>
                                                </Col>   

                                                <Col xs = {5} md = {2}>
                                                    <Input 
                                                        type        = "text"
                                                        id          = 'jamTutupOutlet'
                                                        value       = {this.state.timeclose}
                                                        disabled   
                                                    >
                                                    </Input>
                                                </Col>   
                                            </Row>

                                            <Row>
                                                <Col xs = {4} md = {2}>
                                                        <Label>
                                                            Shift
                                                        </Label>
                                                </Col>   

                                                <Col xs = {5} md = {5}>
                                                    <Input 
                                                        type        = "select"
                                                        id          = 'namaJenisShift'
                                                        onChange    = {this.updateInputValueJenisShift}
                                                        invalid     = {this.state.shiftError}
                                                        value       = {this.state.jenisShift}
                                                        disabled    = {this.state.flagisi}
                                                    >
                                                            {this.state.shifts.map((shiftdata) => <option key={shiftdata.value} value={shiftdata.value}>{shiftdata.display}</option>)}
                                                    </Input>
                                                </Col>   
                                            </Row>

                                            <Row>
                                                <Col xs = {4} md = {2}>
                                                        <Label>
                                                            Jam
                                                        </Label>
                                                </Col>   

                                                <Col xs = {5} md = {2}>
                                                    <Input 
                                                        type        = "time"
                                                        id          = 'jamMulai'
                                                        invalid     = {this.state.startTimeError}
                                                        onChange    = {this.updateInputValueStartShift}
                                                        value       = {this.state.startShift}
                                                        disabled={this.state.flagisi}
                                                    >
                                                    </Input>
                                                </Col>  

                                                <Label>
                                                    s/d
                                                </Label>
                                               
                                                <Col xs = {5} md = {2}>
                                                    <Input 
                                                        type        = "time"
                                                        id          = 'jamAkhir'
                                                        invalid     = {this.state.endTimeError}
                                                        onChange    = {this.updateInputValueEndShift}
                                                        value       = {this.state.endShift}
                                                        disabled    = {this.state.flagisi}
                                                    >
                                                    </Input>
                                                </Col>  
                                            </Row>
                    
                                            <Row>    
                                                <Col md = {1}>
                                                    <Button
                                                        id          = "saveNewSchedule"
                                                        disabled    = {this.state.flagsavebtn}
                                                        onClick     = {()=>this.addScheduleOutletNotNull()}
                                                    >SAVE
                                                    </Button>

                                                    <Modal
                                                        isOpen = {this.state.modal_newShift}
                                                        toggle = {this.toggle('newShift')}>
                                                        <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                                            <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                                                <ModalFooter>
                                                                    <Button 
                                                                        color   = "primary"
                                                                        onClick = {this.addScheduleOutlet(this.state.inputtedName,this.state.jenisShift,this.state.startShift,this.state.endShift)}>
                                                                        {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                                                                        Ya
                                                                    </Button>
                                                                    
                                                                    <Button 
                                                                        color   = "primary" 
                                                                        onClick = {this.toggle('newShift')}>
                                                                        Tidak 
                                                                    </Button>
                                                                </ModalFooter>
                                                    </Modal>
                                                </Col> 

                                                <Col md = {1}>
                                                    <Button
                                                        id          = "cancelNewSchedule"
                                                        disabled    = {this.state.flagcancelbtn}
                                                        onClick     = {()=>this.cancelButton()}
                                                    >
                                                    CANCEL
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
export default OutletSchedulePage; 